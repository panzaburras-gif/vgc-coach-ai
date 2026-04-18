import React, { useState } from "react";

// 🔥 TU EQUIPO
const YOUR_TEAM = [
  "Incineroar",
  "Rotom",
  "Aegislash",
  "Tyranitar",
  "Kommo-o",
  "Floette"
];

// 🔥 META BEHAVIOR
const META = {
  Whimsicott: { setup: 0.7, protect: 0.1, attack: 0.2, switch: 0 },
  Sneasler: { attack: 0.6, protect: 0.3, setup: 0.1, switch: 0 },
  Charizard: { attack: 0.7, protect: 0.2, setup: 0.1, switch: 0 }
};

// 🧠 DETECTAR AMENAZAS
const detectThreats = (team) => {
  let t = [];
  if (team.includes("Sneasler")) t.push("Sneasler");
  if (team.includes("Whimsicott")) t.push("Whimsicott");
  if (team.includes("Charizard")) t.push("Sun");
  return t;
};

// 🧠 LEADS
const chooseLeads = (threats) => {
  if (threats.includes("Sneasler") && threats.includes("Whimsicott"))
    return ["Incineroar", "Aegislash"];
  if (threats.includes("Sun")) return ["Tyranitar", "Rotom"];
  return ["Incineroar", "Rotom"];
};

// 🧠 PLAN
const buildPlan = (threats) => {
  if (threats.includes("Sneasler") && threats.includes("Whimsicott")) {
    return {
      t1: "Fake Out + Escudo Real",
      t2: "Cambio a Tyranitar",
      t3: "Prioridad + presión",
      note: "Evita Tailwind"
    };
  }
  if (threats.includes("Sun")) {
    return {
      t1: "Arena + Volt Switch",
      t2: "Avalancha",
      t3: "Control clima",
      note: "Cortar sol"
    };
  }
  return {
    t1: "Fake Out + Electrotela",
    t2: "Pivot",
    t3: "Presión",
    note: "Juego estándar"
  };
};

// 🧠 PREDICCIÓN
const predict = (pokemon, context) => {
  let p = META[pokemon] || {
    attack: 0.4,
    protect: 0.3,
    switch: 0.2,
    setup: 0.1
  };

  let res = { ...p };

  if (context.tailwind) res.attack += 0.15;
  if (context.protectLast) res.protect -= 0.2;

  return res;
};

// 🎯 DECISIÓN
const decide = (p) => {
  if (p.setup > 0.5) return "🔥 Castiga setup YA";
  if (p.protect > 0.4) return "🧠 Haz setup o cambia";
  if (p.switch > 0.4) return "🔄 Movimiento seguro";
  return "⚔️ Juega defensivo / trade";
};

// 🧠 ANALIZAR PARTIDA
const analyzeGame = (history) => {
  let score = 100;
  let mistakes = [];

  history.forEach((t, i) => {
    if (t.player === "Fake Out" && t.enemy === "protect") {
      score -= 15;
      mistakes.push(`Turno ${i + 1}: Fake Out mal usado`);
    }
    if (t.tailwind && t.player === "attack") {
      score -= 10;
      mistakes.push(`Turno ${i + 1}: Speed war mala`);
    }
    if (t.enemy === "setup" && t.player !== "pressure") {
      score -= 12;
      mistakes.push(`Turno ${i + 1}: No castigaste setup`);
    }
  });

  let level =
    score > 85
      ? "🔥 Alto nivel"
      : score > 70
      ? "👍 Buen jugador"
      : score > 50
      ? "⚠️ Mejorable"
      : "❌ Errores graves";

  return { score, mistakes, level };
};

export default function App() {
  const [enemyTeam, setEnemyTeam] = useState("");
  const [result, setResult] = useState(null);

  const [turn, setTurn] = useState(1);
  const [tailwind, setTailwind] = useState(false);
  const [protectLast, setProtectLast] = useState(false);

  const [history, setHistory] = useState([]);
  const [playerMove, setPlayerMove] = useState("");
  const [enemyAction, setEnemyAction] = useState("");

  const [liveAdvice, setLiveAdvice] = useState("");
  const [finalResult, setFinalResult] = useState(null);

  // 🔥 ANALIZAR MATCHUP
  const runCoach = () => {
    const threats = detectThreats(enemyTeam);
    const leads = chooseLeads(threats);
    const plan = buildPlan(threats);
    setResult({ threats, leads, plan });
  };

  // 🧠 DECISIÓN EN VIVO
  const liveDecision = () => {
    const main = enemyTeam.includes("Sneasler")
      ? "Sneasler"
      : "Whimsicott";

    const pred = predict(main, { tailwind, protectLast });
    const action = decide(pred);

    let txt = `Turno ${turn}\n`;
    txt += "Predicción:\n" + JSON.stringify(pred, null, 2);
    txt += "\n\n👉 " + action;

    setLiveAdvice(txt);
  };

  // 💾 GUARDAR TURNO
  const saveTurn = () => {
    setHistory([
      ...history,
      { player: playerMove, enemy: enemyAction, tailwind }
    ]);
    setTurn(turn + 1);
    setPlayerMove("");
    setEnemyAction("");
    setProtectLast(enemyAction === "protect");
  };

  // 🏁 FINAL
  const finishGame = () => {
    setFinalResult(analyzeGame(history));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🔥 VGC Coach GOD MODE</h1>

      <h3>Equipo rival</h3>
      <input
        value={enemyTeam}
        onChange={(e) => setEnemyTeam(e.target.value)}
        placeholder="Sneasler, Whimsicott..."
      />

      <button onClick={runCoach}>Analizar</button>

      {result && (
        <div>
          <h3>Leads: {result.leads.join(" + ")}</h3>
          <p>Turno 1: {result.plan.t1}</p>
          <p>Turno 2: {result.plan.t2}</p>
          <p>Turno 3: {result.plan.t3}</p>
        </div>
      )}

      <hr />

      <h2>🎮 Turno {turn}</h2>

      <button onClick={() => setTailwind(!tailwind)}>
        Tailwind: {tailwind ? "ON" : "OFF"}
      </button>

      <button onClick={liveDecision}>🧠 Qué hago ahora</button>

      <pre>{liveAdvice}</pre>

      <h3>Tu jugada</h3>
      <input
        value={playerMove}
        onChange={(e) => setPlayerMove(e.target.value)}
      />

      <h3>Rival</h3>
      <input
        value={enemyAction}
        onChange={(e) => setEnemyAction(e.target.value)}
      />

      <button onClick={saveTurn}>Guardar turno</button>

      <button onClick={finishGame}>Finalizar partida</button>

      {finalResult && (
        <div>
          <h2>📊 Resultado</h2>
          <p>Puntuación: {finalResult.score}</p>
          <p>{finalResult.level}</p>
          <ul>
            {finalResult.mistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
