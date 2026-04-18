import { useState } from "react";

const sprites = {
  incineroar: "https://img.pokemondb.net/sprites/home/normal/incineroar.png",
  rotom: "https://img.pokemondb.net/sprites/home/normal/rotom.png",
  tyranitar: "https://img.pokemondb.net/sprites/home/normal/tyranitar.png",
  sneasler: "https://img.pokemondb.net/sprites/home/normal/sneasler.png",
  whimsicott: "https://img.pokemondb.net/sprites/home/normal/whimsicott.png",
  charizard: "https://img.pokemondb.net/sprites/home/normal/charizard.png",
  pelipper: "https://img.pokemondb.net/sprites/home/normal/pelipper.png"
};

export default function BattleUI() {
  const [rival, setRival] = useState([
    { name: "sneasler", hp: 100 },
    { name: "whimsicott", hp: 100 }
  ]);

  const [player, setPlayer] = useState([
    { name: "incineroar", hp: 100 },
    { name: "rotom", hp: 100 }
  ]);

  const [target, setTarget] = useState(0);
  const [log, setLog] = useState([]);

  function damage(amount) {
    setRival(prev => {
      const updated = [...prev];
      updated[target].hp = Math.max(0, updated[target].hp - amount);
      return updated;
    });
  }

  function action(text) {
    setLog(prev => [text, ...prev]);
  }

  function fakeOut() {
    damage(30);
    action(`Incineroar usa Fake Out → ${rival[target].name}`);
  }

  function electroweb() {
    damage(25);
    action(`Rotom usa Electroweb → ${rival[target].name}`);
  }

  function rockslide() {
    setRival(prev =>
      prev.map(p => ({ ...p, hp: Math.max(0, p.hp - 20) }))
    );
    action("Tyranitar usa Rock Slide (daño en área)");
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🎮 Combate VGC Real</h1>

      {/* RIVAL */}
      <div className="mb-6">
        <h2 className="font-semibold">Rival (elige objetivo)</h2>
        <div className="flex gap-6">
          {rival.map((p, i) => (
            <div
              key={i}
              onClick={() => setTarget(i)}
              className={`cursor-pointer p-2 rounded-xl ${
                target === i ? "bg-yellow-200" : ""
              }`}
            >
              <img src={sprites[p.name]} className="w-24" />
              <p className="text-center">❤️ {p.hp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PLAYER */}
      <div className="mb-6">
        <h2 className="font-semibold">Tu equipo</h2>
        <div className="flex gap-6">
          {player.map((p, i) => (
            <div key={i}>
              <img src={sprites[p.name]} className="w-24" />
              <p className="text-center">❤️ {p.hp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BOTONES */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={fakeOut}
          className="bg-red-500 text-white p-3 rounded-2xl"
        >
          Fake Out
        </button>

        <button
          onClick={electroweb}
          className="bg-blue-500 text-white p-3 rounded-2xl"
        >
          Electroweb
        </button>

        <button
          onClick={rockslide}
          className="bg-gray-700 text-white p-3 rounded-2xl"
        >
          Rock Slide
        </button>

        <button
          onClick={() => action("Protect usado")}
          className="bg-green-500 text-white p-3 rounded-2xl"
        >
          Protect
        </button>
      </div>

      {/* LOG */}
      <div>
        <h2 className="font-semibold">Historial</h2>
        {log.map((l, i) => (
          <div key={i}>• {l}</div>
        ))}
      </div>
    </div>
  );
}
