import { useState } from "react";

const meta = {
  incineroar: {
    keys: ["inci", "incin", "incineroar"]
  },
  charizard: {
    keys: ["char", "chari", "zard", "charizard"]
  },
  sneasler: {
    keys: ["snea", "sneas", "sneasler"]
  },
  sinistcha: {
    keys: ["sini", "sinis", "sinistcha"]
  },
  gengar: {
    keys: ["geng", "genga", "gengar"]
  },
  floette: {
    keys: ["floe", "floet", "floette"]
  },
  tyranitar: {
    keys: ["tyra", "tyran", "ttar", "tyranitar"]
  },
  pelipper: {
    keys: ["peli", "pelip", "pelipper"]
  },
  garchomp: {
    keys: ["garch", "chomp", "garchomp"]
  },
  whimsicott: {
    keys: ["whim", "cotti", "whimsicott"]
  }
};

// 🔥 IA de similitud PRO
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
        const data = meta[poke];

        // 🔥 keys (rápido)
        for (let key of data.keys) {
          if (palabra.includes(key)) {
            mejorMatch = poke;
            mejorScore = 1;
          }
        }

        // 🔥 similitud (por si escribes mal)
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

    // 🔥 máximo 4 Pokémon
    detectados = detectados.slice(0, 4);

    const equipo = detectados;

    // 🔥 CHARIZARD CORE
    if (equipo.includes("charizard") && equipo.includes("whimsicott")) {
      setResultado(
        "🔥 Charizard + Whimsicott\n👉 Lead: Tyranitar + Rotom\n👉 Fake Out + Electroweb\n👉 Evita Tailwind y sol"
      );
      return;
    }

    // 🔥 LLUVIA
    if (equipo.includes("pelipper")) {
      setResultado(
        "🔥 Lluvia\n👉 Rotom + Tyranitar\n👉 Cambia clima\n👉 Controla velocidad"
      );
      return;
    }

    // 🔥 SNEASLER
    if (equipo.includes("sneasler")) {
      setResultado(
        "🔥 Sneasler\n👉 Incineroar\n👉 Fake Out turno 1\n👉 Evita snowball"
      );
      return;
    }

    // 🔥 DEFAULT
    setResultado(
      "👉 Incineroar + Rotom\n👉 Fake Out + posicionamiento\n👉 Juego estándar"
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
