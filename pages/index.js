import { useState } from "react";
const meta = {
  incineroar: {
    respuesta: "👉 Fake Out + Intimidate, controla el ritmo"
  },
 charizard: {
  keys: ["char", "zard", "chari", "charizard"],
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
function similitud(a, b) {
  let distancia = 0;
  const max = Math.max(a.length, b.length);

  for (let i = 0; i < max; i++) {
    if (a[i] !== b[i]) distancia++;
  }

  return 1 - distancia / max;
}
export default function Home() {
  const [rival, setRival] = useState("");
  const [resultado, setResultado] = useState("");

function analizar() {
  const r = rival.toLowerCase().replace(/\s/g, "");

  let mejorMatch = null;
  let mejorScore = 0;

  for (let poke in meta) {
    const score = similitud(r, poke);

    if (score > mejorScore) {
      mejorScore = score;
      mejorMatch = poke;
    }
  }

  if (mejorScore > 0.5) {
    setResultado(meta[mejorMatch].respuesta);
  } else {
    setResultado("👉 No reconocido: juega estándar y controla velocidad");
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
