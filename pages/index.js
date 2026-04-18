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
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  const distancia = dp[a.length][b.length];
  const maxLen = Math.max(a.length, b.length);

  return 1 - distancia / maxLen;
}
export default function Home() {
  const [rival, setRival] = useState("");
  const [resultado, setResultado] = useState("");

function analizar() {
  const palabras = rival.toLowerCase().trim().split(/\s+/);

  let detectados = [];

  for (let palabra of palabras) {
    let mejorMatch = null;
    let mejorScore = 0;

    for (let poke in meta) {
      const score = similitud(palabra, poke);

      if (score > mejorScore) {
        mejorScore = score;
        mejorMatch = poke;
      }
    }

   if (mejorMatch && !detectados.includes(mejorMatch)) {
  detectados.push(mejorMatch);
}
   detectados = detectados.slice(0, 4);
  }

 const equipo = detectados;

// 🔥 LECTURA DE EQUIPO

// CHARIZARD CORE
if (equipo.includes("charizard") && equipo.includes("whimsicott")) {
  setResultado(
    "🔥 Core detectado: Charizard + Whimsicott\n" +
    "👉 Lead recomendado: Tyranitar + Rotom\n" +
    "👉 Turno 1:\n- Fake Out a Whimsicott\n- Electroweb\n" +
    "👉 Plan: evitar Tailwind y quitar sol\n" +
    "👉 Win condition: controlar velocidad"
  );
  return;
}

// LLUVIA
if (equipo.includes("pelipper")) {
  setResultado(
    "🔥 Equipo de lluvia\n" +
    "👉 Lead: Rotom + Tyranitar\n" +
    "👉 Turno 1:\n- Cambiar clima\n- Presión eléctrica\n" +
    "👉 Plan: cortar lluvia y controlar tempo"
  );
  return;
}

// SNEASLER CORE
if (equipo.includes("sneasler")) {
  setResultado(
    "🔥 Sneasler detectado\n" +
    "👉 Lead: Incineroar\n" +
    "👉 Turno 1:\n- Fake Out a Sneasler\n" +
    "👉 Plan: evitar snowball y controlar early game"
  );
  return;
}

// DEFAULT META
setResultado(
  "👉 Equipo no identificado\n" +
  "👉 Lead: Incineroar + Rotom\n" +
  "👉 Turno 1:\n- Fake Out + posicionamiento\n" +
  "👉 Plan: jugar sólido y adaptar midgame"
);
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
