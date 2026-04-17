import { useState } from "react";
const meta = {
  incineroar: {
    respuesta: "👉 Fake Out + Intimidate, controla el ritmo"
  },
  charizard: {
    respuesta: "👉 Cuidado con sol, usa Tyranitar para counter"
  },
  sneasler: {
    respuesta: "👉 Muy rápido, presión inmediata o Fake Out"
  },
  sinistcha: {
    respuesta: "👉 Difícil de bajar, juega posicionamiento"
  },
  gengar: {
    respuesta: "👉 Muy ofensivo, cuidado con KO rápido"
  },
  floette: {
    respuesta: "👉 Mucho daño especial, usa resistencia"
  },
  tyranitar: {
    respuesta: "👉 Cambia clima y aguanta mucho"
  },
  pelipper: {
    respuesta: "👉 Activa lluvia, cuidado con boosts"
  },
  garchomp: {
    respuesta: "👉 Spread damage, cuidado con terremoto"
  }
};
export default function Home() {
  const [rival, setRival] = useState("");
  const [resultado, setResultado] = useState("");

 function analizar() {
  const r = rival.toLowerCase().replace(/\s/g, "");

  for (let poke in meta) {
    if (r.includes(poke)) {
      setResultado(meta[poke].respuesta);
      return;
    }
  }

  setResultado("👉 No reconocido: juega estándar y controla velocidad");
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
