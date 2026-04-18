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
  const [resultado, setResultado] = useState("");
  const [turno, setTurno] = useState(0);
  const [equipo, setEquipo] = useState([]);

  function detectarEquipo() {
    const palabras = rival.toLowerCase().trim().split(/\s+/);
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

  function iniciarCombate() {
    const eq = detectarEquipo();
    setEquipo(eq);
    setTurno(1);

    if (eq.includes("charizard") && eq.includes("whimsicott")) {
      setResultado(
        "🔥 Turno 1\n👉 Lead: Tyranitar + Rotom\n👉 Fake Out a Whimsicott + Electroweb"
      );
      return;
    }

    setResultado("🔥 Turno 1\n👉 Lead estándar: Incineroar + Rotom");
  }

  function siguienteTurno() {
    if (turno === 1) {
      setTurno(2);

      setResultado(
        "🔥 Turno 2\n👉 Si Tailwind activo: protege + reposiciona\n👉 Si no: presión ofensiva"
      );
      return;
    }

    if (turno === 2) {
      setTurno(3);

      setResultado(
        "🔥 Turno 3\n👉 Empieza a cerrar partida\n👉 Busca KO clave"
      );
      return;
    }

    setResultado("👉 Sigue presionando y adapta según el rival");
  }

  function reset() {
    setTurno(0);
    setEquipo([]);
    setResultado("");
    setRival("");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🔥 VGC Coach IA PRO</h1>

      <input
        placeholder="Equipo rival"
        value={rival}
        onChange={(e) => setRival(e.target.value)}
      />

      <br /><br />

      <button onClick={iniciarCombate}>Iniciar combate</button>
      <button onClick={siguienteTurno}>Siguiente turno</button>
      <button onClick={reset}>Reset</button>

      <p>{resultado}</p>
    </div>
  );
}
