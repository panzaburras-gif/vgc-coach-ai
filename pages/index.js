import { useState } from "react";

export default function Home() {
  const [rival, setRival] = useState("");
  const [resultado, setResultado] = useState("");

  function analizar() {
    if (rival.toLowerCase().includes("whimsicott")) {
      setResultado("👉 Haz focus a Whimsicott para evitar Tailwind");
    } else if (rival.toLowerCase().includes("sneasler")) {
      setResultado("👉 Cuidado con Sneasler, puede hacer snowball rápido");
    } else {
      setResultado("👉 Juega estándar: posicionamiento y control de velocidad");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>VGC Coach IA</h1>

      <input
        placeholder="Escribe Pokémon rival"
        value={rival}
        onChange={(e) => setRival(e.target.value)}
      />

      <br /><br />

      <button onClick={analizar}>Analizar turno</button>

      <p>{resultado}</p>
    </div>
  );
}
