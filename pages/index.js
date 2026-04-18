import { useState } from "react";

export default function Home() {
  const [rival, setRival] = useState("");
  const [turno, setTurno] = useState(1);
  const [miVida, setMiVida] = useState(100);
  const [rivalVida, setRivalVida] = useState(100);
  const [resultado, setResultado] = useState("");

  function evaluarContexto() {
    if (miVida > rivalVida + 20) return "VENTAJA";
    if (rivalVida > miVida + 20) return "DESVENTAJA";
    return "NEUTRAL";
  }

  function detectarRival(r) {
    r = r.toLowerCase();

    if (r.includes("whim")) return "tailwind";
    if (r.includes("snea")) return "hyper";
    if (r.includes("char")) return "sun";
    if (r.includes("peli")) return "rain";

    return "standard";
  }

  function decidirTurno(tipo, contexto) {
    // 🔥 TURNOS REALES
    if (tipo === "tailwind") {
      if (turno === 1) return "👉 Incineroar: Fake Out a Whimsicott + Rotom: Electroweb";
      if (turno === 2) return "👉 Cambia a Tyranitar + presión";
      return "👉 KO a sweeper rival";
    }

    if (tipo === "hyper") {
      if (turno === 1) return "👉 Fake Out al más rápido";
      if (turno === 2) return "👉 Posicionamiento defensivo";
      return "👉 Doble target al objetivo clave";
    }

    if (tipo === "sun") {
      if (turno === 1) return "👉 Cambia a Tyranitar";
      return "👉 Presión roca + control velocidad";
    }

    if (tipo === "rain") {
      if (turno === 1) return "👉 Rotom Electroweb";
      if (turno === 2) return "👉 Tyranitar in";
      return "👉 Presión eléctrica";
    }

    // DEFAULT
    if (contexto === "VENTAJA") return "👉 Asegurar KO y jugar safe";
    if (contexto === "DESVENTAJA") return "👉 Doble target agresivo";

    return "👉 Fake Out + control de tempo";
  }

  function analizar() {
    const tipo = detectarRival(rival);
    const contexto = evaluarContexto();
    const jugada = decidirTurno(tipo, contexto);

    const texto = `
🎮 TURNO ${turno}

🧠 Rival: ${tipo.toUpperCase()}
⚖️ Estado: ${contexto}

🎯 JUGADA ÓPTIMA:
${jugada}

📌 Plan:
Sigue el control de velocidad + posicionamiento
`;

    setResultado(texto);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-purple-500/20">
        
        <h1 className="text-3xl font-extrabold text-center mb-4">⚡ VGC MASTER COACH</h1>

        <div className="space-y-3">
          <input
            className="w-full p-3 rounded-xl bg-black border border-gray-700 focus:border-purple-500 outline-none"
            placeholder="Rival (ej: whim snea)"
            value={rival}
            onChange={(e) => setRival(e.target.value)}
          />

          <div className="flex gap-2">
            <input
              className="w-1/2 p-3 rounded-xl bg-black border border-gray-700"
              placeholder="Mi vida"
              onChange={(e) => setMiVida(Number(e.target.value))}
            />

            <input
              className="w-1/2 p-3 rounded-xl bg-black border border-gray-700"
              placeholder="Rival vida"
              onChange={(e) => setRivalVida(Number(e.target.value))}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setTurno(turno + 1)}
              className="w-1/2 bg-gray-800 p-2 rounded-xl"
            >
              ➕ Turno
            </button>

            <button
              onClick={() => setTurno(1)}
              className="w-1/2 bg-gray-800 p-2 rounded-xl"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        <button
          onClick={analizar}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-500 transition p-3 rounded-xl font-bold text-lg"
        >
          ⚡ Calcular jugada
        </button>

        <div className="mt-5 bg-black/60 rounded-xl p-4 border border-gray-700 min-h-[150px]">
          <pre className="whitespace-pre-wrap text-sm">{resultado}</pre>
        </div>

      </div>
    </div>
  );
}
