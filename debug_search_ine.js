// Native fetch
async function check() {
  try {
    const response = await fetch("http://localhost:3000/api/municipios");
    const data = await response.json();

    if (data.success) {
      // Logic inside Search.jsx
      // const id = m.id || "";
      // return id.includes(query)

      const query = "30037"; // Torre Pacheco INE code
      const results = data.datos.filter((m) => m.id.includes(query));

      console.log(`Searching for INE code '${query}':`);
      console.log(JSON.stringify(results, null, 2));

      const postalQuery = "30700"; // Postal code
      const postalResults = data.datos.filter((m) =>
        m.id.includes(postalQuery),
      );
      console.log(`Searching for Postal code '${postalQuery}':`);
      console.log(JSON.stringify(postalResults, null, 2));
    }
  } catch (e) {
    console.error(e);
  }
}
check();
