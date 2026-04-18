import { useState } from "react";

const meta = {
  incineroar: { keys: ["inci", "incin", "incineroar"] },
  charizard: { keys: ["char", "chari", "zard", "charizard"] },
  sneasler: { keys: ["snea", "sneas", "sneasler"] },
  tyranitar: { keys: ["tyra", "tyran", "ttar", "tyranitar"] },
  pelipper: { keys: ["peli", "pelip", "pelipper"] },
  garchomp: { keys: ["garch", "chomp", "garchomp"] },
  whimsicott: { keys: ["whim", "cotti", "whimsicott"] }
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
  const [info, setInfo] = useState("");
  const [resultado, setResultado] = useState("");
  const [turno, setTurno] = useState(0);
  const [equipo, setEquipo] = useState([]);

  function detectarEquipo() {
    const palabras = rival.toLowerCase().split(" ");
    let detectados = [];

    for (let palabra of palabras) {
      let mejorMatch = null;
      let mejorScore = 0;

      for (let poke in meta) {
        const data = meta[poke];

        for (let key of data.keys) {
          if (palabra.includes(key)) {
            mejorMatch = poke;
            mejorScore = 1;
          }
        }

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

    return detectados.slice(0, 4);
  }

  function iniciar() {
    const eq = detectarEquipo();
    setEquipo(eq);
    setTurno(1);

    setResultado(
      "🔥 Turno 1\n👉 Lead: Incineroar + Rotom\n👉 Fake Out + control de velocidad"
    );
  }

  function adaptar() {
    const i = info.toLowerCase();

    if (i.includes("protect")) {
      setResultado(
        "🧠 Detectado Protect\n👉 Dobla target turno siguiente\n👉 Gana momentum"
      );
      return;
    }

    if (i.includes("murio") || i.includes("muerto")) {
      setResultado(
        "💀 Has perdido un Pokémon\n👉 Reposiciona\n👉 Busca control de velocidad"
      );
      return;
    }

    if (i.includes("tailwind")) {
      setResultado(
        "💨 Tailwind activo\n👉 Protege y stall\n👉 No intercambies KOs"
      );
      return;
    }

    if (i.includes("fake out")) {
      setResultado(
        "👊 Fake Out detectado\n👉 Ahora tienes turno libre\n👉 Presión máxima"
      );
      return;
    }

    setResultado(
      "🤔 No claro\n👉 Juega seguro\n👉 Prioriza posicionamiento"
    );
  }

  function siguienteTurno() {
    setTurno(turno + 1);

    setResultado(
      "➡️ Turno " + (turno + 1) + "\n👉 Evalúa estado y aplica presión"
    );
  }

  function reset() {
    setTurno(0);
    setEquipo([]);
    setResultado("");
    setRival("");
    setInfo("");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🔥 VGC Coach IA REAL</h1>

      <input
        placeholder="Equipo rival"
        value={rival}
        onChange={(e) => setRival(e.target.value)}
      />

      <br /><br />

      <button onClick={iniciar}>Iniciar combate</button>
      <button onClick={siguienteTurno}>Siguiente turno</button>
      <button onClick={reset}>Reset</button>

      <br /><br />

      <input
        placeholder="Qué ha pasado (ej: protect, murió rotom...)"
        value={info}
        onChange={(e) => setInfo(e.target.value)}
      />

      <button onClick={adaptar}>Adaptar IA</button>

      <p>{resultado}</p>
    </div>
  );
}
