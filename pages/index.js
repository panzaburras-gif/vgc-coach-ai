"use client";

import { useState } from "react";

// 🎨 ESTILOS
const styles = {
  app: {
    fontFamily: "system-ui",
    background: "#0f172a",
    color: "white",
    minHeight: "100vh",
    maxWidth: 420,
    margin: "0 auto"
  },
  header: {
    padding: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    background: "#1e293b"
  },
  section: {
    padding: 15,
    borderBottom: "1px solid #334155"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10
  },
  poke: {
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
    cursor: "pointer",
    background: "#334155"
  },
  selected: {
    background: "#22c55e"
  },
  button: {
    width: "100%",
    padding: 14,
    marginTop: 10,
    borderRadius: 10,
    border: "none",
    fontWeight: "bold"
  },
  blue: { background: "#3b82f6", color: "white" },
  green: { background: "#22c55e", color: "white" },
  yellow: { background: "#f59e0b", color: "black" },
  card: {
    background: "#1e293b",
    padding: 10,
    borderRadius: 10,
    marginTop: 10
  }
};

// 🔥 TU EQUIPO
const TEAM = [
  "Incineroar",
  "Rotom",
  "Aegislash",
  "Tyranitar",
  "Kommo-o",
  "Floette"
];

// 🔥 META SIMPLE
const META = {
  Sneasler: { attack: 0.6, protect: 0.3, setup: 0.1 },
  Whimsicott: { setup: 0.7, attack: 0.2, protect: 0.1 }
};

// 🧠 APRENDER RIVAL
const learnOpponent = (history) => {
  let stats = { attack: 0, protect: 0, setup: 0 };

  history.forEach((t) => {
    stats[t.enemy] = (stats[t.enemy] || 0) + 1;
  });

  const total = history.length || 1;

  return {
    attack: (stats.attack || 0) / total,
    protect: (stats.protect || 0) / total,
    setup: (stats.setup || 0) / total
  };
};

// 🧠 PERFIL
const getProfile = (s) => {
  if (s.protect > 0.4) return "🛡️ Defensivo";
  if (s.attack > 0.6) return "⚔️ Agresivo";
  if (s.setup > 0.3) return "📈 Setup";
  return "⚖️ Balanceado";
};

// 🎯 DECISIÓN
const decide = (p) => {
  if (p.setup > 0.5) return "🔥 Castiga setup";
  if (p.protect > 0.4) return "🧠 Bait / setup";
  return "⚔️ Presión";
};

export default function Home() {
  const [screen, setScreen] = useState("home");
  const [enemyTeam, setEnemyTeam] = useState("");
  const [selected, setSelected] = useState([]);
  const [history, setHistory] = useState([]);
  const [advice, setAdvice] = useState("");
  const [turn, setTurn] = useState(1);
  const [stats, setStats] = useState({ games: 0, wins: 0 });

  // 🎮 SELECCIÓN
  const toggle = (p) => {
    if (selected.includes(p)) {
      setSelected(selected.filter(x => x !== p));
    } else if (selected.length < 4) {
      setSelected([...selected, p]);
    }
  };

  // 🧠 COACH
  const runCoach = () => {
    const learned = learnOpponent(history);
    const profile = getProfile(learned);

    const main = enemyTeam.includes("Sneasler")
      ? "Sneasler"
      : "Whimsicott";

    const pred = META[main] || { attack: 0.4, protect: 0.3, setup: 0.3 };

    const decision = decide(pred);

    setAdvice(
      `Turno ${turn}\n${profile}\n\n👉 ${decision}`
    );
  };

  // 💾 GUARDAR TURNO
  const saveTurn = (enemyAction) => {
    setHistory([...history, { enemy: enemyAction }]);
    setTurn(turn + 1);
  };

  // 🏁 FINAL
  const finish = () => {
    const win = Math.random() > 0.5;

    setStats({
      games: stats.games + 1,
      wins: stats.wins + (win ? 1 : 0)
    });

    setScreen("result");
  };

  // 🏠 HOME
  if (screen === "home") {
    return (
      <div style={styles.app}>
        <div style={styles.header}>🔥 VGC Coach PRO</div>

        <div style={styles.section}>
          <p>Partidas: {stats.games}</p>
          <p>
            Winrate:{" "}
            {stats.games
              ? Math.round((stats.wins / stats.games) * 100)
              : 0}
            %
          </p>

          <button
            style={{ ...styles.button, ...styles.blue }}
            onClick={() => setScreen("preview")}
          >
            🎮 Nueva partida
          </button>
        </div>
      </div>
    );
  }

  // 🧩 PREVIEW
  if (screen === "preview") {
    return (
      <div style={styles.app}>
        <div style={styles.header}>Team Preview</div>

        <div style={styles.section}>
          <input
            placeholder="Equipo rival"
            value={enemyTeam}
            onChange={(e) => setEnemyTeam(e.target.value)}
            style={{ width: "100%", padding: 10 }}
          />

          <h4>Elige 4</h4>

          <div style={styles.grid}>
            {TEAM.map((p) => (
              <div
                key={p}
                style={{
                  ...styles.poke,
                  ...(selected.includes(p) ? styles.selected : {})
                }}
                onClick={() => toggle(p)}
              >
                {p}
              </div>
            ))}
          </div>

          <button
            style={{ ...styles.button, ...styles.blue }}
            onClick={() => setScreen("battle")}
          >
            Empezar
          </button>
        </div>
      </div>
    );
  }

  // 🎮 BATTLE
  if (screen === "battle") {
    return (
      <div style={styles.app}>
        <div style={styles.header}>Turno {turn}</div>

        <div style={styles.section}>
          <p>Equipo: {selected.join(", ")}</p>

          <button
            style={{ ...styles.button, ...styles.blue }}
            onClick={runCoach}
          >
            🧠 Qué hago
          </button>

          {advice && <div style={styles.card}>{advice}</div>}

          <h4>Acción rival</h4>

          <button
            style={{ ...styles.button, ...styles.green }}
            onClick={() => saveTurn("attack")}
          >
            ⚔️ Attack
          </button>

          <button
            style={{ ...styles.button, ...styles.yellow }}
            onClick={() => saveTurn("protect")}
          >
            🛡️ Protect
          </button>

          <button
            style={{ ...styles.button, ...styles.blue }}
            onClick={() => saveTurn("setup")}
          >
            📈 Setup
          </button>

          <button
            style={{ ...styles.button, ...styles.green }}
            onClick={finish}
          >
            🏁 Finalizar
          </button>
        </div>
      </div>
    );
  }

  // 📊 RESULT
  return (
    <div style={styles.app}>
      <div style={styles.header}>Resultado</div>

      <div style={styles.section}>
        <p>Partidas: {stats.games}</p>
        <p>
          Winrate:{" "}
          {Math.round((stats.wins / stats.games) * 100)}%
        </p>

        <button
          style={{ ...styles.button, ...styles.blue }}
          onClick={() => setScreen("home")}
        >
          🔄 Volver
        </button>
      </div>
    </div>
  );
}
