import { useState } from "react";

const POKEMON = [
  "incineroar","rotom","tyranitar","aegislash","kommoo","floette",
  "whimsicott","sneasler","charizard","pelipper"
];

const getSprite = (name) =>
  `https://img.pokemondb.net/sprites/home/normal/${name}.png`;

export default function Home() {
  const [miSeleccion, setMiSeleccion] = useState([]);
  const [rivalSeleccion, setRivalSeleccion] = useState([]);
  const [turno, setTurno] = useState(1);
  const [jugadaUsuario, setJugadaUsuario] = useState("");
  const [resultado, setResultado] = useState("");

  function toggleSeleccion(nombre, lado) {
    if (lado === "mio") {
      setMiSeleccion(prev =>
        prev.includes(nombre)
          ? prev.filter(p => p !== nombre)
          : [...prev, nombre].slice(0, 4)
      );
    } else {
      setRivalSeleccion(prev =>
        prev.includes(nombre)
          ? prev.filter(p => p !== nombre)
          : [...prev, nombre].slice(0, 4)
      );
    }
  }

  function detectarCore(equipo) {
    if (equipo.includes("whimsicott") && equipo.includes("charizard")) return "tailwind_sun";
    if (equipo.includes("pelipper")) return "rain";
    if (equipo.includes("sneasler")) return "hyper";
    return "standard";
  }

  function elegirLeads(core) {
    if (core === "tailwind_sun") return ["incineroar", "rotom"];
    if (core === "rain") return ["rotom", "tyranitar"];
    if (core === "hyper") return ["incineroar", "aegislash"];
    return ["incineroar", "rotom"];
  }

  function decidir(core, turno) {

    if (core === "tailwind_sun") {
      if (turno === 1) return "Fake Out Whimsicott + Electroweb";
      if (turno === 2) return "Switch a Tyranitar";
      return "KO Charizard";
    }

    if (core === "hyper") {
      if (turno === 1) return "Fake Out Sneasler";
      if (turno === 2) return "Posicionamiento defensivo";
      return "Doble target";
    }

    if (core === "rain") {
      if (turno === 1) return "Electroweb";
      if (turno === 2) return "Tyranitar in";
      return "Presión eléctrica";
    }

    if (turno === 1) return "Fake Out + control";
    if (turno === 2) return "Posicionamiento";
    return "Presión ofensiva";
  }

  function predecirRival(core, turno) {

    if (core === "tailwind_sun") {
      if (turno === 1) return "Tailwind + posible Protect Charizard";
      if (turno === 2) return "Ataque bajo sol";
      return "Ofensiva total";
    }

    if (core === "hyper") {
      if (turno === 1) return "Ataque rápido de Sneasler";
      return "Presión continua";
    }

    if (core === "rain") {
      if (turno === 1) return "Activar lluvia + ataque agua";
      return "Spam agua";
    }

    return "Juego estándar";
  }

  function alertaError(core, turno, jugada) {
    const j = jugada.toLowerCase();

    if (core === "tailwind_sun" && turno === 1 && !j.includes("fake")) {
      return "🚨 ERROR: debes frenar Tailwind";
    }

    if (core === "hyper" && turno === 1 && !j.includes("fake")) {
      return "🚨 ERROR: Sneasler te puede destrozar";
    }

    if (core === "rain" && turno === 2 && !j.includes("tyranitar")) {
      return "🚨 ERROR: no quitaste lluvia";
    }

    return "✅ Bien jugado";
  }

  function analizar() {
    const core = detectarCore(rivalSeleccion);
    const leads = elegirLeads(core);
    const jugada = decidir(core, turno);
    const pred = predecirRival(core, turno);
    const error = alertaError(core, turno, jugadaUsuario);

    setResultado(`
🎯 LEADS:
${leads[0]} + ${leads[1]}

🎮 TURNO ${turno}

🧠 Rival:
${pred}

🎯 Tu jugada:
${jugada}

📊 Evaluación:
${error}
`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-black text-white p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-purple-500/20">

        <h1 className="text-2xl font-bold text-center mb-4">
          ⚡ VGC Coach PRO
        </h1>

        <h2 className="mb-2 text-sm opacity-70">🧍 Tu equipo</h2>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {POKEMON.map(p => (
            <img
              key={p}
              src={getSprite(p)}
              onClick={() => toggleSeleccion(p, "mio")}
              className={`cursor-pointer rounded-xl p-1 transition ${
                miSeleccion.includes(p)
                  ? "bg-green-500 scale-110"
                  : "bg-gray-800 hover:scale-105"
              }`}
            />
          ))}
        </div>

        <h2 className="mb-2 text-sm opacity-70">👁️ Rival</h2>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {POKEMON.map(p => (
            <img
              key={p}
              src={getSprite(p)}
              onClick={() => toggleSeleccion(p, "rival")}
              className={`cursor-pointer rounded-xl p-1 transition ${
                rivalSeleccion.includes(p)
                  ? "bg-red-500 scale-110"
                  : "bg-gray-800 hover:scale-105"
              }`}
            />
          ))}
        </div>

        <input
          placeholder="Qué vas a hacer (ej: fake out whim)"
          onChange={(e) => setJugadaUsuario(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-black border border-gray-700"
        />

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTurno(t => t + 1)}
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

        <button
          onClick={analizar}
          className="w-full bg-purple-600 p-3 rounded-xl font-bold mb-4 hover:bg-purple-500 transition"
        >
          ⚡ Calcular jugada
        </button>

        <div className="bg-black/60 p-4 rounded-xl min-h-[160px] border border-gray-700">
          <pre className="text-sm whitespace-pre-wrap">{resultado}</pre>
        </div>

      </div>
    </div>
  );
}
