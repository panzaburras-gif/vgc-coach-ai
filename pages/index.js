import { useState } from "react";

const POKEMON = [
  "incineroar","rotom","tyranitar","aegislash","kommo-o","floette",
  "whimsicott","tornadus","charizard","pelipper","sneasler","chien-pao",
  "flutter-mane","iron-hands","garchomp","dragonite","kingambit",
  "ursaluna","amoonguss","cresselia","heatran","landorus-therian",
  "urshifu-rapid-strike","urshifu-single-strike"
];

const getSprite = (name) =>
  `https://img.pokemondb.net/sprites/home/normal/${name}.png`;

// 🔥 TU EQUIPO REAL
const MIS_SETS = {
  incineroar: ["fake out", "parting shot", "flare blitz"],
  rotom: ["electroweb", "hydro pump", "volt switch"],
  tyranitar: ["rock slide", "knock off"],
  aegislash: ["shadow sneak", "iron head", "king's shield"],
  "kommo-o": ["clangorous soul", "aura sphere"],
  floette: ["moonblast"]
};

function obtenerMovimientos(p) {
  return MIS_SETS[p] || ["attack"];
}

// 🧠 LECTURA RIVAL
function analizarEquipoRival(equipo) {
  if (equipo.includes("whimsicott") || equipo.includes("tornadus")) return "speed_control";
  if (equipo.includes("charizard")) return "sun";
  if (equipo.includes("pelipper")) return "rain";
  if (equipo.includes("sneasler") || equipo.includes("chien-pao")) return "hyper";
  return "standard";
}

// 🎯 WIN CONDITION
function detectarWinCondition(equipo) {
  if (equipo.includes("charizard")) return { objetivo: "charizard" };
  if (equipo.includes("sneasler")) return { objetivo: "sneasler" };
  if (equipo.includes("pelipper")) return { objetivo: "pelipper" };
  return { objetivo: equipo[0] };
}

// 🎯 LEADS
function elegirLeads(mi) {
  return mi.slice(0, 2);
}

// 💥 KO CHECK
function calcularKO(miEquipo, target) {
  const mapa = {
    rotom: ["charizard","pelipper"],
    tyranitar: ["charizard"],
    aegislash: ["flutter-mane","sneasler"],
    floette: ["garchomp"]
  };

  let puede = false;
  miEquipo.forEach(p => {
    if (mapa[p]?.includes(target)) puede = true;
  });

  return puede;
}

// 🎮 JUGADA EXACTA
function jugadaExacta(leads, target, turno) {
  return leads.map(p => {
    const moves = obtenerMovimientos(p);

    if (moves.includes("fake out") && turno === 1)
      return `${p}: fake out → ${target}`;

    if (moves.includes("electroweb"))
      return `${p}: electroweb`;

    return `${p}: ${moves[0]} → ${target}`;
  });
}

// 📊 ESTADO COMBATE
function evaluarEstado(vidasMias, vidasRival) {
  if (vidasMias > vidasRival) return "ventaja";
  if (vidasMias < vidasRival) return "desventaja";
  return "igualado";
}

// 🎯 LÍNEAS
function generarLineas(puedeKO, target) {
  return [
    { tipo: "segura", accion: `presionar ${target}`, win: "70%" },
    { tipo: "agresiva", accion: `doble target ${target}`, win: puedeKO ? "85%" : "50%" },
    { tipo: "defensiva", accion: "reposicionar", win: "60%" }
  ];
}

export default function Home() {

  const [miSeleccion, setMi] = useState([]);
  const [rivalSeleccion, setRival] = useState([]);
  const [turno, setTurno] = useState(1);
  const [resultado, setResultado] = useState("");
  const [evento, setEvento] = useState("");
  const [vidasMias, setVidasMias] = useState(4);
  const [vidasRival, setVidasRival] = useState(4);

  function toggle(p, lado) {
    if (lado === "mio") {
      setMi(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev,p].slice(0,4));
    } else {
      setRival(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev,p].slice(0,4));
    }
  }

  function analizar() {

    const estilo = analizarEquipoRival(rivalSeleccion);
    const leads = elegirLeads(miSeleccion);
    const win = detectarWinCondition(rivalSeleccion);
    const puedeKO = calcularKO(miSeleccion, win.objetivo);
    const jugada = jugadaExacta(leads, win.objetivo, turno);
    const estado = evaluarEstado(vidasMias, vidasRival);
    const lineas = generarLineas(puedeKO, win.objetivo);

    setResultado(`
🧠 Rival: ${estilo}

🎯 Target: ${win.objetivo}

💥 KO: ${puedeKO ? "posible" : "no"}

📊 Estado: ${estado}

🎮 Jugada:
${jugada.map(j=>`👉 ${j}`).join("\n")}

📊 Opciones:
${lineas.map(l=>`${l.tipo}: ${l.accion} (${l.win})`).join("\n")}
`);
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4">

      <h1 className="text-3xl text-center mb-4">⚡ VGC Coach PRO</h1>

      <h2>Tu equipo</h2>
      <div className="grid grid-cols-6 gap-2">
        {POKEMON.map(p => (
          <img key={p} src={getSprite(p)}
            onClick={()=>toggle(p,"mio")}
            className={`cursor-pointer p-1 ${miSeleccion.includes(p)?"bg-green-500":"bg-gray-800"}`}
          />
        ))}
      </div>

      <h2>Rival</h2>
      <div className="grid grid-cols-6 gap-2">
        {POKEMON.map(p => (
          <img key={p} src={getSprite(p)}
            onClick={()=>toggle(p,"rival")}
            className={`cursor-pointer p-1 ${rivalSeleccion.includes(p)?"bg-red-500":"bg-gray-800"}`}
          />
        ))}
      </div>

      <input placeholder="Evento turno"
        onChange={e=>setEvento(e.target.value)}
        className="w-full p-2 mt-3 bg-black"/>

      <div className="flex gap-2 mt-2">
        <button onClick={()=>setTurno(turno+1)}>Turno+</button>
        <button onClick={analizar}>Analizar</button>
      </div>

      <pre className="mt-4 bg-black p-4">{resultado}</pre>

    </div>
  );
}
