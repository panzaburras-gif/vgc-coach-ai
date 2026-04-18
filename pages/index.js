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

    if (mejorScore > 0.4 && !detectados.includes(mejorMatch)) {
      detectados.push(mejorMatch);
    }
  }

  const p1 = detectados[0];
  const p2 = detectados[1];

  // 🔥 LÓGICA REAL

  if (
    (p1 === "charizard" && p2 === "whimsicott") ||
    (p2 === "charizard" && p1 === "whimsicott")
  ) {
    setResultado(
      "🔥 Charizard + Whimsicott\n👉 Lead: Tyranitar + Rotom\n👉 Fake Out + Electroweb\n👉 Evita Tailwind"
    );
    return;
  }

  if (p1 === "sneasler" || p2 === "sneasler") {
    setResultado(
      "🔥 Sneasler\n👉 Incineroar lead\n👉 Fake Out turno 1"
    );
    return;
  }

  if (p1 === "pelipper" || p2 === "pelipper") {
    setResultado(
      "🔥 Lluvia\n👉 Rotom + Tyranitar\n👉 Cambia clima"
    );
    return;
  }

  setResultado("👉 Incineroar + Rotom | juego estándar");
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
