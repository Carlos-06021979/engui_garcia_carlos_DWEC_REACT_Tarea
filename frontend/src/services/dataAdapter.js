/*
 Transforma los datos crudos de la API de AEMET para el componente HourlyForecast.
 dayData - Datos de un día específico de la predicción de AEMET.
 @returns Array de objetos planos con la información por hora.
 */
export const extractHourlyData = (dayData) => {


  // Si no hay datos, devolvemos un array vacío
  if (!dayData) return [];

  /*
  Estructura de datos de la API de AEMET:
  La API devuelve una lista de días. Cada 'día' contiene arrays para:
  - 'estadoCielo': condiciones del cielo (despejado, nuboso, lluvia, etc.)
  - 'precipitacion': probabilidad de lluvia
  - 'temperatura': valores numéricos
  - 'viento': dirección y velocidad

  Cada uno de estos arrays tiene una propiedad 'periodo' que indica la hora ("00", "01"..."23").
  Aquí aplanaremos estos datos para crear una línea de tiempo continua y fácil de consumir por el renderizado.
  */

  // EstadoCielo es la referencia para las horas, usualmente.
  return (
    dayData.estadoCielo
      .map((sky, index) => {
        return {
          period: sky.periodo, // Hora
          description: sky.descripcion, // Descripción del estado del cielo
          temp: dayData.temperatura[index]?.value, // Temperatura
          rain: dayData.precipitacion[index]?.value, // Precipitación
          /*
           El viento suele tener una estructura algo distinta, pero vamos a intentar el 
           acceso directo por índice.
          */
          wind:
            // Si hay datos de viento, obtenemos la velocidad, si no, 0
            dayData.vientoAndRachaMax && dayData.vientoAndRachaMax[index]
              ? dayData.vientoAndRachaMax[index].velocidad
              : 0,
        };
      })
      // Revisa cada elemento h y mira si tiene periodo, si no lo tiene, lo descarta
      .filter((h) => h.period)
      // Ordena los elementos por periodo
      .sort((a, b) => parseInt(a.period) - parseInt(b.period))
  );
};
