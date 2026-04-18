import React, { useState } from "react";
import ReactDOM from "react-dom/client";

// 🎨 ESTILO PRO
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
  Sneasler: "⚔️ Presiona fuerte turno 1",
  Whimsicott: "🧠 Evita Tailwind o castígalo"
};

function App() {
  const [screen, setScreen] = useState("home");
  const [enemyTeam, setEnemyTeam] = useState("");
  const [selected, setSelected] = useState([]);
  const [advice, setAdvice] = useState("");
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
    let text = "⚖️ Juego estándar";

    if (enemyTeam.includes("Sneasler")) {
      text = META.Sneasler;
    } else if (enemyTeam.includes("Whimsicott")) {
      text = META.Whimsicott;
    }

    setAdvice(text);
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
          <p>Winrate: {stats.games ? Math.round((stats.wins / stats.games) * 100) : 0}%</p>

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

  // 🧩 PREVIEW VISUAL
  if (screen === "preview") {
    return (
      <div style={styles.app}>
        <div style={styles.header}>Team Preview</div>

        <div style={styles.section}>
          <input
            placeholder="Equipo rival"
            value={enemyTeam}
            onChange={(e) => setEnemyTeam(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 8 }}
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

  // 🎮 PARTIDA
  if (screen === "battle") {
    return (
      <div style={styles.app}>
        <div style={styles.header}>Partida</div>

        <div style={styles.section}>
          <p>Equipo: {selected.join(", ")}</p>

          <button
            style={{ ...styles.button, ...styles.blue }}
            onClick={runCoach}
          >
            🧠 Qué hago
          </button>

          {advice && <div style={styles.card}>{advice}</div>}

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

  // 📊 RESULTADO
  if (screen === "result") {
    return (
      <div style={styles.app}>
        <div style={styles.header}>Resultado</div>

        <div style={styles.section}>
          <p>Partidas: {stats.games}</p>
          <p>Winrate: {Math.round((stats.wins / stats.games) * 100)}%</p>

          <button
            style={{ ...styles.button, ...styles.blue }}
            onClick={() => setScreen("home")}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }
}

// 🔥 RENDER
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
