// Native fetch in Node 24
async function check() {
  try {
    const response = await fetch("http://localhost:3000/api/municipios");
    const data = await response.json();

    if (data.success) {
      console.log("Total municipalities:", data.datos.length);

      const target = data.datos.filter((m) =>
        m.nombre?.toLowerCase().includes("pacheco"),
      );
      console.log("Matches for pacheco:", JSON.stringify(target, null, 2));

      // Check first item to see structure
      console.log("Sample item:", data.datos[0]);
    } else {
      console.log("API returned error:", data);
    }
  } catch (e) {
    console.error("Fetch error:", e);
  }
}

check();
