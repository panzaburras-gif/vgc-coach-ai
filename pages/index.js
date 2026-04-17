import { useState } from "react";

export default function Home() {
  const [rival, setRival] = useState("");
  const [resultado, setResultado] = useState("");

  function analizar() {
    const r = rival.toLowerCase();

    if (r.includes("whimsicott")) {
      setResultado("👉 Prioridad: eliminar Whimsicott para evitar Tailwind");
    } else if (r.includes("sneasler")) {
      setResultado("👉 Sneasler amenaza: usa Intimidate o presión inmediata");
    } else if (r.includes("flutter mane")) {
      setResultado("👉 Flutter Mane: cuidado con speed, usa prioridad o bulk");
    } else {
      setResultado("👉 Juega estándar: controla velocidad y posicionamiento");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🔥 VGC Coach IA</h1>

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
