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

// 🔥 BASE DE DATOS META (simplificada pero realista)
const META_BEHAVIOR = {
  Whimsicott: {
    turn1: { setup: 0.7, protect: 0.1, attack: 0.2, switch: 0 },
  },
  Sneasler: {
    turn1: { attack: 0.6, protect: 0.3, setup: 0.1, switch: 0 },
  },
  Charizard: {
    turn1: { attack: 0.7, protect: 0.2, setup: 0.1, switch: 0 },
  },
  Incineroar: {
    turn1: { attack: 0.3, protect: 0.2, setup: 0, switch: 0.5 },
  }
};

// 🧠 PREDICCIÓN DE ACCIONES
const predictEnemyAction = (pokemon, context) => {
  let base = META_BEHAVIOR[pokemon]?.turn1;

  if (!base) {
    return { attack: 0.4, protect: 0.3, switch: 0.2, setup: 0.1 };
  }

  let prediction = { ...base };

  // Ajustes inteligentes
  if (context.lowHP) {
    prediction.protect += 0.25;
    prediction.attack -= 0.15;
  }

  if (context.usedProtectLastTurn) {
    prediction.protect -= 0.2;
    prediction.attack += 0.1;
  }

  if (context.hasSpeedAdvantage) {
    prediction.attack += 0.15;
  }

  if (context.badMatchup) {
    prediction.switch += 0.25;
  }

  return prediction;
};

// 🎯 DECISIÓN ÓPTIMA
const getBestMove = (prediction) => {
  if (prediction.setup > 0.5) {
    return "🔥 Castiga setup: Fake Out / presión inmediata";
  }

  if (prediction.protect > 0.4) {
    return "🛡️ Rival probablemente protege → haz switch o setup gratis";
  }

  if (prediction.switch > 0.4) {
    return "🔄 Rival probablemente cambie → usa movimiento seguro";
  }

  return "⚔️ Rival probablemente ataca → juega defensivo o trade favorable";
};

export default function App() {
  const [enemyTeam, setEnemyTeam] = useState("");
  const [gameState, setGameState] = useState({
    turn: 1,
    tailwind: false,
    enemyProtected: false,
    enemyBoosted: false,
    lastAdvice: "",
    prediction: null
  });

  // 🔍 DETECTAR ARQUETIPO
  const detectArchetype = () => {
    if (
      enemyTeam.includes("Sneasler") &&
      enemyTeam.includes("Whimsicott")
    ) {
      return "hyperOffense";
    }
    if (enemyTeam.includes("Charizard")) {
      return "sun";
    }
    return "balanced";
  };

  // 🧠 COACH PRINCIPAL
  const getCoachDecision = () => {
    const archetype = detectArchetype();
    let advice = "";

    let mainThreat = "Whimsicott";
    if (enemyTeam.includes("Sneasler")) mainThreat = "Sneasler";

    const prediction = predictEnemyAction(mainThreat, {
      lowHP: false,
      usedProtectLastTurn: gameState.enemyProtected,
      hasSpeedAdvantage: gameState.tailwind,
      badMatchup: false
    });

    const decision = getBestMove(prediction);

    // 🔥 PLAN BASE SEGÚN META
    if (archetype === "hyperOffense") {
      if (gameState.turn === 1) {
        advice =
          "Lead Incineroar + Aegislash. Fake Out a Whimsicott + Escudo Real.";
      } else {
        advice =
          "Controla velocidad y fuerza intercambios favorables.";
      }
    }

    else if (archetype === "sun") {
      advice =
        "Activa arena con Tyranitar y presiona con Avalancha.";
    }

    else {
      advice =
        "Juego estándar: Fake Out + Electrotela, luego pivot.";
    }

    advice += "\n\n🧠 Predicción rival:\n";
    advice += JSON.stringify(prediction, null, 2);

    advice += "\n\n👉 Decisión óptima:\n" + decision;

    setGameState({
      ...gameState,
      lastAdvice: advice,
      prediction: prediction
    });
  };

  const nextTurn = () => {
    setGameState({
      ...gameState,
      turn: gameState.turn + 1,
      enemyProtected: false,
      enemyBoosted: false
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🔥 VGC Coach PRO</h1>

      <h3>Tu equipo</h3>
      <p>{YOUR_TEAM.join(", ")}</p>

      <h3>Equipo rival</h3>
      <input
        type="text"
        placeholder="Ej: Sneasler, Whimsicott..."
        value={enemyTeam}
        onChange={(e) => setEnemyTeam(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />

      <h3>Turno: {gameState.turn}</h3>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => setGameState({ ...gameState, tailwind: true })}>
          Activaron Tailwind
        </button>

        <button onClick={() => setGameState({ ...gameState, enemyProtected: true })}>
          Rival protegió
        </button>

        <button onClick={() => setGameState({ ...gameState, enemyBoosted: true })}>
          Rival boosteado
        </button>
      </div>

      <button onClick={getCoachDecision} style={{ marginTop: 15 }}>
        🧠 Pedir decisión
      </button>

      <button onClick={nextTurn} style={{ marginLeft: 10 }}>
        ➡️ Siguiente turno
      </button>

      {gameState.lastAdvice && (
        <div style={{ marginTop: 20 }}>
          <h2>📢 Coach dice:</h2>
          <pre>{gameState.lastAdvice}</pre>
        </div>
      )}
    </div>
  );
}
