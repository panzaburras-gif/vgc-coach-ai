import { useState } from "react";

export default function Home() {
  const [rival, setRival] = useState("");
  const [miVida, setMiVida] = useState(100);
  const [rivalVida, setRivalVida] = useState(100);
  const [jugadaUsuario, setJugadaUsuario] = useState("");
  const [resultado, setResultado] = useState("");

  function evaluarContexto() {
    if (miVida > rivalVida + 20) return "ventaja";
    if (rivalVida > miVida + 20) return "desventaja";
    return "neutral";
  }

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

    return 1 - dp[a.length][b.length] / Math.max(a.length, b.length);
  }

  function detectarEquipo(input) {
    const palabras = input.toLowerCase().split(/\s+/);
    const conocidos = ["whimsicott","sneasler","charizard","pelipper","garchomp","gengar","sinistcha","tyranitar"];

    let detectados = [];

    for (let palabra of palabras) {
      let mejor = null;
      let scoreMax = 0;

      for (let poke of conocidos) {
        const score = similitud(palabra, poke);
        if (score > scoreMax) {
          scoreMax = score;
          mejor = poke;
        }
      }

      if (mejor && scoreMax > 0.4 && !detectados.includes(mejor)) {
        detectados.push(mejor);
      }
    }

    return detectados;
  }

  function detectarCore(equipo) {
    if (equipo.includes("whimsicott") && equipo.includes("charizard")) return "tailwind_sun";
    if (equipo.includes("pelipper")) return "rain";
    if (equipo.includes("sneasler")) return "hyper_offense";
    return "standard";
  }

  function elegirLead(core) {
    if (core === "tailwind_sun") return "🔥 Incineroar + Rotom";
    if (core === "rain") return "🌧️ Rotom + Tyranitar";
    if (core === "hyper_offense") return "⚡ Incineroar + Aegislash";
    return "🧠 Incineroar + Rotom";
  }

  function plan3Turnos(core, contexto) {
    if (core === "tailwind_sun") return "T1: Fake Out Whimsicott\nT2: Tyranitar in\nT3: KO Charizard";
    if (core === "rain") return "T1: Electroweb\nT2: Tyranitar in\nT3: Presión eléctrica";
    if (core === "hyper_offense") return "T1: Fake Out\nT2: Posicionamiento\nT3: KO objetivo";
    if (contexto === "ventaja") return "T1: Asegurar KO\nT2: Protect\nT3: Win";
    if (contexto === "desventaja") return "T1: Doble target\nT2: All-in\nT3: Comeback";
    return "T1: Control\nT2: Posición\nT3: Presión";
  }

  function detectarErrores(core, jugada) {
    if (core === "tailwind_sun" && !jugada.includes("fake")) return "❌ No frenaste Tailwind";
    if (core === "hyper_offense" && !jugada.includes("fake")) return "❌ No paraste presión";
    if (core === "rain" && !jugada.includes("tyranitar")) return "❌ No cambiaste clima";
    return "✅ Buena decisión";
  }

  function analizar() {
    const equipo = detectarEquipo(rival);
    const core = detectarCore(equipo);
    const contexto = evaluarContexto();
    const lead = elegirLead(core);
    const plan = plan3Turnos(core, contexto);
    const error = detectarErrores(core, jugadaUsuario.toLowerCase());

    setResultado(`🧠 Rival: ${equipo.join(" / ")}\n🔥 Core: ${core}\n\n🎯 Lead: ${lead}\n⚖️ Estado: ${contexto}\n\n📋 Plan:\n${plan}\n\n📊 Evaluación:\n${error}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">⚡ VGC Coach PRO</h1>

        <input className="w-full p-2 mb-2 rounded text-black" placeholder="Rival (ej: whim snea)" value={rival} onChange={(e)=>setRival(e.target.value)} />
        <input className="w-full p-2 mb-2 rounded text-black" placeholder="Tu vida %" onChange={(e)=>setMiVida(Number(e.target.value))} />
        <input className="w-full p-2 mb-2 rounded text-black" placeholder="Vida rival %" onChange={(e)=>setRivalVida(Number(e.target.value))} />
        <input className="w-full p-2 mb-4 rounded text-black" placeholder="Qué hiciste" onChange={(e)=>setJugadaUsuario(e.target.value)} />

        <button onClick={analizar} className="w-full bg-red-600 p-3 rounded-xl font-bold hover:bg-red-500 transition">⚡ Analizar</button>

        <pre className="mt-4 bg-black p-4 rounded-lg text-sm whitespace-pre-wrap">{resultado}</pre>
      </div>
    </div>
  );
}
