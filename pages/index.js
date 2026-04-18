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

// 🔥 BASE META
const META_BEHAVIOR = {
  Whimsicott: {
    turn1: { setup: 0.7, protect: 0.1, attack: 0.2, switch: 0 },
  },
  Sneasler: {
    turn1: { attack: 0.6, protect: 0.3, setup: 0.1, switch: 0 },
  }
};

// 🧠 PREDICCIÓN
const predictEnemyAction = (pokemon) => {
  return META_BEHAVIOR[pokemon]?.turn1 || {
    attack: 0.4,
    protect: 0.3,
    switch: 0.2,
    setup: 0.1
  };
};

// 🎯 DECISIÓN ÓPTIMA
const getBestMove = (prediction) => {
  if (prediction.setup > 0.5) return "pressure";
  if (prediction.protect > 0.4) return "setup";
  if (prediction.switch > 0.4) return "safe";
  return "defensive";
};

// 🧠 ANALIZADOR DE PARTIDA
const analyzeGame = (history) => {
  let score = 100;
  let mistakes = [];
  let goodPlays = [];

  history.forEach((turn, i) => {
    // ❌ ERRORES
    if (turn.playerMove === "Fake Out" && turn.enemyAction === "protect") {
      score -= 15;
      mistakes.push(`Turno ${i + 1}: Fake Out en Protect`);
    }

    if (turn.tailwind && turn.playerMove === "attack") {
      score -= 10;
      mistakes.push(`Turno ${i + 1}: Peleaste speed bajo Tailwind`);
    }

    if (turn.enemyAction === "setup" && turn.playerMove !== "pressure") {
      score -= 12;
      mistakes.push(`Turno ${i + 1}: No castigaste setup`);
    }

    // ✅ BUENAS JUGADAS
    if (turn.enemyAction === "setup" && turn.playerMove === "pressure") {
      score += 8;
      goodPlays.push(`Turno ${i + 1}: Castigaste setup`);
    }

    if (turn.enemyAction === "protect" && turn.playerMove === "setup") {
      score += 6;
      goodPlays.push(`Turno ${i + 1}: Aprovechaste protect rival`);
    }

    if (!turn.tailwind && turn.playerMove === "safe") {
      score += 5;
      goodPlays.push(`Turno ${i + 1}: Juego seguro correcto`);
    }
  });

  // Clamp score
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  // 🧠 NIVEL
  let level = "";
  if (score > 85) level = "🔥 Nivel competitivo alto";
  else if (score > 70) level = "👍 Buen jugador";
  else if (score > 50) level = "⚠️ Nivel medio, mejorar decisiones";
  else level = "❌ Muchos errores críticos";

  return { score, mistakes, goodPlays, level };
};

export default function App() {
  const [enemyTeam, setEnemyTeam] = useState("");
  const [history, setHistory] = useState([]);
  const [playerMove, setPlayerMove] = useState("");
  const [enemyAction, setEnemyAction] = useState("");
  const [tailwind, setTailwind] = useState(false);
  const [result, setResult] = useState(null);

  const saveTurn = () => {
    const newTurn = {
      playerMove,
      enemyAction,
      tailwind
    };

    setHistory([...history, newTurn]);
    setPlayerMove("");
    setEnemyAction("");
  };

  const finishGame = () => {
    const analysis = analyzeGame(history);
    setResult(analysis);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🔥 VGC Coach PRO++</h1>

      <h3>Equipo rival</h3>
      <input
        value={enemyTeam}
        onChange={(e) => setEnemyTeam(e.target.value)}
        placeholder="Sneasler, Whimsicott..."
      />

      <h3>Tu jugada</h3>
      <input
        value={playerMove}
        onChange={(e) => setPlayerMove(e.target.value)}
        placeholder="Fake Out / attack / pressure / safe"
      />

      <h3>Acción rival</h3>
      <input
        value={enemyAction}
        onChange={(e) => setEnemyAction(e.target.value)}
        placeholder="attack / protect / setup / switch"
      />

      <div>
        <button onClick={() => setTailwind(!tailwind)}>
          Tailwind ({tailwind ? "ON" : "OFF"})
        </button>
      </div>

      <button onClick={saveTurn}>💾 Guardar turno</button>

      <button onClick={finishGame} style={{ marginLeft: 10 }}>
        🏁 Terminar partida
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>📊 Resultado</h2>
          <p><strong>Puntuación:</strong> {result.score}/100</p>
          <p><strong>Nivel:</strong> {result.level}</p>

          <h3>✅ Buenas jugadas</h3>
          <ul>
            {result.goodPlays.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>

          <h3>❌ Errores</h3>
          <ul>
            {result.mistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
