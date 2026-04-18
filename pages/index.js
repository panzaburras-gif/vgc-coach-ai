import { useState } from "react";
const meta = {
  incineroar: {
    keys: ["inci", "incin", "incineroar"],
    respuesta: "👉 Fake Out + Intimidate, controla el ritmo"
  },
  charizard: {
    keys: ["char", "chari", "zard", "charizard"],
    respuesta: "👉 Cuidado con sol, usa Tyranitar para counter"
  },
  sneasler: {
    keys: ["snea", "sneas", "sneasler"],
    respuesta: "👉 Muy rápido, presión inmediata o Fake Out"
  },
  sinistcha: {
    keys: ["sini", "sinis", "sinistcha"],
    respuesta: "👉 Difícil de bajar, juega posicionamiento"
  },
  gengar: {
    keys: ["geng", "genga", "gengar"],
    respuesta: "👉 Muy ofensivo, cuidado con KO rápido"
  },
  floette: {
    keys: ["floe", "floet", "floette"],
    respuesta: "👉 Mucho daño especial, usa resistencia"
  },
  tyranitar: {
    keys: ["tyra", "tyran", "ttar", "tyranitar"],
    respuesta: "👉 Cambia clima y aguanta mucho"
  },
  pelipper: {
    keys: ["peli", "pelip", "pelipper"],
    respuesta: "👉 Activa lluvia, cuidado con boosts"
  },
  garchomp: {
    keys: ["garch", "chomp", "garchomp"],
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
  const palabras = rival.toLowerCase().split(" ");

  let detectados = [];

  for (let palabra of palabras) {
    let mejorMatch = null;
    let mejorScore = 0;

    for (let poke in meta) {
      const data = meta[poke];

      // keys rápidas
      for (let key of data.keys || []) {
        if (palabra.includes(key)) {
          mejorMatch = poke;
          mejorScore = 1;
        }
      }

      // similitud
      const score = similitud(palabra, poke);
      if (score > mejorScore) {
        mejorScore = score;
        mejorMatch = poke;
      }
    }

    if (mejorMatch && !detectados.includes(mejorMatch)) {
      detectados.push(mejorMatch);
    }
  }

  const p1 = detectados[0];
  const p2 = detectados[1];

  // 🔥 CHARIZARD + WHIMSICOTT
  if (
    (p1 === "charizard" && p2 === "whimsicott") ||
    (p2 === "charizard" && p1 === "whimsicott")
  ) {
    setResultado(
      "🔥 Charizard + Whimsicott\n👉 Lead: Tyranitar + Rotom\n👉 Turno 1:\n- Fake Out a Whimsicott\n- Electroweb con Rotom\n👉 Objetivo: evitar Tailwind y quitar sol"
    );
    return;
  }

  // 🔥 SNEASLER
  if (p1 === "sneasler" || p2 === "sneasler") {
    setResultado(
      "🔥 Sneasler detectado\n👉 Lead: Incineroar\n👉 Turno 1:\n- Fake Out al Sneasler\n👉 Objetivo: evitar snowball"
    );
    return;
  }

  // 🔥 LLUVIA
  if (p1 === "pelipper" || p2 === "pelipper") {
    setResultado(
      "🔥 Lluvia detectada\n👉 Lead: Rotom + Tyranitar\n👉 Turno 1:\n- Cambiar clima\n- Presión eléctrica\n👉 Objetivo: cortar lluvia"
    );
    return;
  }

  // 🔥 DEFAULT
  setResultado(
    "👉 Lead: Incineroar + Rotom\n👉 Turno 1:\n- Fake Out + posicionamiento\n👉 Juego estándar"
  );
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
