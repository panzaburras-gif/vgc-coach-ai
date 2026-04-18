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
  const [resultado, setResultado] = useState("");

  function toggleSeleccion(nombre, lado) {
    if (lado === "mio") {
      setMiSeleccion((prev) =>
        prev.includes(nombre)
          ? prev.filter((p) => p !== nombre)
          : [...prev, nombre].slice(0, 4)
      );
    } else {
      setRivalSeleccion((prev) =>
        prev.includes(nombre)
          ? prev.filter((p) => p !== nombre)
          : [...prev, nombre].slice(0, 4)
      );
    }
  }

  function detectarCore(equipo) {
    if (equipo.includes("whimsicott") && equipo.includes("charizard")) return "tailwind";
    if (equipo.includes("pelipper")) return "rain";
    if (equipo.includes("sneasler")) return "hyper";
    return "standard";
  }

  function decidir(core) {
    if (core === "tailwind") {
      if (turno === 1) return "Fake Out Whimsicott + Electroweb";
      if (turno === 2) return "Tyranitar in";
      return "KO Charizard";
    }

    if (core === "hyper") {
      if (turno === 1) return "Fake Out amenaza";
      return "Doble target";
    }

    if (core === "rain") {
      if (turno === 1) return "Electroweb";
      return "Tyranitar in";
    }

    return "Juego estándar seguro";
  }

  function analizar() {
    const core = detectarCore(rivalSeleccion);
    const jugada = decidir(core);

    setResultado(`\n🎮 Turno ${turno}\n🔥 Rival: ${core}\n\n🎯 ${jugada}`);
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4">
      <h1 className="text-3xl text-center font-bold mb-4">⚡ VGC Coach Visual</h1>

      {/* MI EQUIPO */}
      <div className="mb-4">
        <h2 className="mb-2">🧍 Tu equipo</h2>
        <div className="grid grid-cols-5 gap-2">
          {POKEMON.map((p) => (
            <img
              key={p}
              src={getSprite(p)}
              onClick={() => toggleSeleccion(p, "mio")}
              className={`cursor-pointer rounded-lg p-1 ${miSeleccion.includes(p) ? "bg-green-500" : "bg-gray-800"}`}
            />
          ))}
        </div>
      </div>

      {/* RIVAL */}
      <div className="mb-4">
        <h2 className="mb-2">👁️ Rival</h2>
        <div className="grid grid-cols-5 gap-2">
          {POKEMON.map((p) => (
            <img
              key={p}
              src={getSprite(p)}
              onClick={() => toggleSeleccion(p, "rival")}
              className={`cursor-pointer rounded-lg p-1 ${rivalSeleccion.includes(p) ? "bg-red-500" : "bg-gray-800"}`}
            />
          ))}
        </div>
      </div>

      {/* CONTROLES */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTurno(turno + 1)} className="bg-gray-700 px-4 py-2 rounded">➕ Turno</button>
        <button onClick={() => setTurno(1)} className="bg-gray-700 px-4 py-2 rounded">🔄 Reset</button>
      </div>

      <button onClick={analizar} className="w-full bg-purple-600 p-3 rounded-xl font-bold mb-4">
        ⚡ Analizar
      </button>

      <div className="bg-black/60 p-4 rounded-xl min-h-[120px]">
        <pre>{resultado}</pre>
      </div>
    </div>
  );
}
