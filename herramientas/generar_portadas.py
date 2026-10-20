"""Genera las portadas tipo póster de cada capítulo de Telaraña Mutante.

Usa el mismo método que creación de contenido: importa artes.a11_agy (Antigravity,
modelo de imagen de Google) y, si falla, artes.a12_codex (GPT Image). No copia esos
módulos: los importa.

Referencias que recibe la IA en cada portada: la ficha del villano, las fichas de los
héroes que aparecen y la carta de la ubicación principal (todas sacadas de los PDF de
las cajas de Jorge). La escena describe dónde están y qué pasa en el capítulo.

Regla del proyecto: una imagen generada NUNCA se sobrescribe. El original va a
`marvel united/portadas-originales/<capítulo>-<agente>-vN.png` con el siguiente número
libre, y la versión para la app a `assets/covers/<capítulo>.jpg` solo si todavía no existe
(o si se pasa --usar con el archivo elegido).

Uso:
  python herramientas/generar_portadas.py I1            # una portada
  python herramientas/generar_portadas.py todos          # las que falten
  python herramientas/generar_portadas.py I1 --solo-codex
  python herramientas/generar_portadas.py I1 --usar ../portadas-originales/I1-agy-v2.png
"""
from __future__ import annotations

import sys
import time
from pathlib import Path

from PIL import Image

APP = Path(__file__).resolve().parents[1]
ORIGINALES = APP.parent / "portadas-originales"
CONTENIDO = Path(__file__).resolve().parents[4] / "creacion-de-contenido"
sys.path.insert(0, str(CONTENIDO))
from artes import a11_agy, a12_codex  # noqa: E402

ESTILO = (
    "A vertical 9:16 comic book cover poster for one chapter of a Marvel United board game campaign. "
    "Art style: the same chunky chibi Marvel United style as the reference figures (big heads, compact bodies, "
    "bold black ink outlines, saturated colors), but staged as a dramatic, cinematic comic cover: strong "
    "perspective, depth, motion lines, glowing light, debris and atmosphere, dramatic low-angle composition, "
    "rim lighting and rich painted shading (not flat), so it feels epic like a movie poster. "
    "Reproduce every character EXACTLY as in its reference image: same costume, colors, mask, hair, "
    "skin color and silhouette. Use only the character artwork of each reference and ignore its card frame "
    "and name strip. Do not add any other Marvel character. From the location reference use only the place "
    "and its architecture; ignore the card frame, icons, slots and text. "
    "Absolutely no text, letters, numbers, logos, titles, speech balloons or watermarks anywhere in the image. "
    "Keep the top 12% and the bottom 25% of the image darker and calmer (sky, shadows, smoke) so a title can be "
    "placed over it later."
)

# villano, héroes que aparecen, ubicación principal y la escena del capítulo.
PORTADAS = {
    "I1": ("rhino", ["spider-man", "miles-morales", "black-cat"], "oscorp-tower",
           "Night. Inside the underground high-security vault of Oscorp Tower, Rhino smashes through a reinforced "
           "steel wall carrying a glowing cryogenic canister; inside the glass a black alien goo moves on its own. "
           "Spider-Man and Miles Morales swing in through shattered glass, webs flying. Black Cat crouches on a "
           "ventilation duct above, claws out. Red alarm lights, sparks and flying concrete."),
    "I2A": ("venom", ["spider-man", "spider-woman"], "daily-bugle",
            "Day. Venom has taken over the Daily Bugle newsroom: black tendrils wrap printing presses and desks, "
            "dozens of TV screens show his toothy grin, frightened reporters hold cameras with flashes going off. "
            "Spider-Man and Spider-Woman crash in through a big window, glass exploding around them."),
    "I2B": ("sabretooth", ["black-cat", "spider-man", "spider-woman"], "queens",
            "Night under a full moon in a quiet Queens suburb. Sabretooth prowls across the rooftops toward a small "
            "family house, claw marks on the garden door. Black Cat leaps between roofs looking back at him, with "
            "Spider-Man and Spider-Woman landing to protect her. Street lamps, wind, tension."),
    "I3AA": ("juggernaut", ["miles-morales", "ghost-spider", "spider-ham"], "osborn-labs",
             "Underground laboratory. A gigantic glowing particle collider tears multicolored dimensional rifts in "
             "the air. Juggernaut stands guard in front of it, smashing the floor. Miles Morales leaps toward him "
             "with electric sparks; Ghost-Spider and Spider-Ham fall out of a rainbow rift in the sky."),
    "I3AB": ("sabretooth", ["spider-woman", "ghost-spider", "spider-man-2099", "venom"], "brooklyn-bridge",
             "Night, in the dark sewers under the Brooklyn Bridge, the bridge visible through a grate above. "
             "Sabretooth hunts with a steel net; Venom is cornered and wounded in the shadows. Spider-Woman, "
             "Ghost-Spider and Spider-Man 2099 burst in from a glowing dimensional rift to stop the hunter."),
    "I3BA": ("venom", ["black-cat", "spider-man", "ghost-spider"], "osborn-labs",
             "Inside Osborn Laboratories a particle collider overloads in a blinding explosion. A black alien "
             "symbiote engulfs a man holding a camera and he transforms into Venom, roaring. Black Cat, "
             "Spider-Man and Ghost-Spider brace against the blast, debris and electricity everywhere."),
    "I3BB": ("juggernaut", ["spider-man-2099", "spider-ham", "miles-morales"], "midtown-high",
             "Night street in front of Midtown High School, a construction site with a big cement mixer. "
             "Juggernaut charges down the street unstoppable. Spider-Man 2099 and Miles Morales dodge, while "
             "Spider-Ham swings a giant cartoon mallet. The sky above Manhattan is cracked with glowing "
             "dimensional rifts."),
    "II1": ("mystique", ["cyclops", "jean-grey", "spider-man-2099"], "midtown-high",
            "A packed school auditorium with flags and a podium. A middle-aged senator in a grey suit speaks at "
            "the podium. Among the press, Mystique (blue skin, white dress, red hair) raises a pistol, half of her "
            "face still morphing from a reporter's face. Cyclops fires a red optic blast, Jean Grey shields the "
            "senator with a pink telekinetic field and Spider-Man 2099 leaps over the crowd."),
    "II2A": ("sabretooth", ["wolverine", "storm", "spider-woman"], "weapon-x",
             "Blizzard night in the Canadian wilderness at the abandoned Weapon X facility. Sabretooth and "
             "Wolverine clash claws-first in the snow. Storm floats above summoning lightning, Spider-Woman fires "
             "a green venom blast. Boxes of secret files scattered in the snow."),
    "II2B": ("juggernaut", ["storm", "beast", "spider-ham"], "xavier-institute",
             "Juggernaut smashes through the stone wall and gates of the Xavier mansion, trees falling. Storm "
             "hurls lightning from a stormy sky, Beast leaps acrobatically at him, Spider-Ham plants himself in "
             "his path with a giant mallet. Students evacuate in the background."),
    "II3AA": ("magneto", ["beast", "jean-grey", "ghost-spider"], "xavier-institute",
              "Magneto floats above the Xavier mansion, raining twisted metal beams from the sky; the asteroid "
              "fortress Asteroid M hangs in the clouds behind him. Jean Grey, eyes glowing pink, and Beast defend "
              "the mansion; Ghost-Spider swings between the falling metal."),
    "II3AB": ("juggernaut", ["cyclops", "wolverine", "spider-man-2099"], "xavier-institute",
              "A high-tech underground corridor below the Xavier mansion leading to a giant glowing sphere "
              "(the Cerebro chamber). Juggernaut bursts through a blast door. Cyclops fires an optic blast, "
              "Wolverine leaps with claws out, Spider-Man 2099 slashes from the ceiling."),
    "II3BA": ("magneto", ["jean-grey", "beast", "spider-man"], "sentinel-station",
              "Earth orbit. Magneto, surrounded by a magnetic aura, drags a huge space station full of giant "
              "dormant Sentinel robots toward the Earth below. Jean Grey, Beast and Spider-Man fly toward him "
              "from a sleek black jet. Stars, glowing atmosphere, dramatic scale."),
    "II3BB": ("sabretooth", ["wolverine", "cyclops"], "genosha",
              "Dusk on the ruined island city of Genosha, mutant refugees hiding among the ruins. Sabretooth "
              "leaps at Wolverine, both with claws out; Cyclops fires a red optic blast protecting the "
              "refugees. Fire and smoke against an orange sky."),
    "III1M": ("green-goblin", ["magneto-hero", "storm", "spider-man"], "genosha",
              "The Green Goblin rides his glider over the island of Genosha throwing glowing pumpkin bombs at "
              "mutant refugees. Magneto (as a hero) raises twisted metal to block the bombs, Storm summons a "
              "hurricane and Spider-Man swings toward the glider. Explosions, sea spray, dramatic sky."),
    "III1X": ("green-goblin", ["spider-man", "black-cat", "mystique-hero"], "daily-bugle",
              "The Green Goblin rides his glider around the Daily Bugle skyscraper, throwing pumpkin bombs that "
              "explode against the newsroom windows, flames and paper flying. On a neighboring rooftop, "
              "Spider-Man, Black Cat and Mystique get ready to jump at him."),
    "III2A": ("rhino", ["wolverine", "spider-woman"], "brooklyn-bridge",
              "Dawn. Rhino, his armor covered in writhing crimson symbiote tendrils, charges across the Brooklyn "
              "Bridge snapping steel cables. Wolverine and Spider-Woman stand in his way. Red light, cars "
              "abandoned on the bridge."),
    "III2B": ("venom", ["miles-morales", "ghost-spider", "spider-man-2099"], "oscorp-tower",
              "Night at the top of Oscorp Tower. Venom wears a glowing sonic collar around his neck and prowls "
              "like a guard dog, in pain. Miles Morales, Ghost-Spider and Spider-Man 2099 land on the rooftop "
              "to free him. Green city lights below."),
    "III3AA": ("green-goblin", ["spider-man", "mystique-hero", "jean-grey"], "oscorp-tower",
               "The Green Goblin from the reference, now fused with a crimson alien symbiote: red tendrils and "
               "claws grow from his body and a long red tail whips behind him. He stands triumphant on top of "
               "Oscorp Tower in front of giant screens. Spider-Man, Mystique and Jean Grey jump at him under a "
               "blood-red sky."),
    "III3AB": ("juggernaut", ["storm", "wolverine"], "xavier-institute",
               "Juggernaut, with glowing crimson cracks spreading over his helmet and red symbiote tendrils on "
               "his shoulders, marches toward the Xavier mansion. Storm strikes him with a huge lightning bolt "
               "and Wolverine runs at him with claws out. Students' silhouettes in the windows."),
    "III3BA": ("green-goblin", ["spider-man", "black-cat", "mystique-hero"], "osborn-labs",
               "A dark laboratory full of glass tanks, each holding a writhing red symbiote copy. The Green Goblin, "
               "fused with a crimson symbiote (red tendrils, claws, a tail), holds a detonator. Spider-Man, Black "
               "Cat and Mystique attack from the shadows between the tanks."),
    "III3BB": ("rhino", ["spider-woman", "beast", "spider-ham", "venom"], "brooklyn-bridge",
               "Rhino covered in the black symbiote of the Venom reference (white spider emblem, teeth, tongue) "
               "with a glowing sonic collar, charging across the Brooklyn Bridge at night. Spider-Woman, Beast "
               "and Spider-Ham, who swings a gigantic cartoon mallet, block his path."),
    "F": ("carnage", ["spider-man", "venom-hero", "storm"], "midtown-high",
          "Final battle at night. Carnage stands on the roof of Midtown High School, red tendrils covering the "
          "whole building and reaching into a blood-red sky. Spider-Man, Venom and Storm launch the final charge "
          "together, Storm's lightning illuminating everything. Epic, climactic, heroic."),
}


def referencias(nodo: str) -> list[Path]:
    villano, heroes, lugar = PORTADAS[nodo][:3]
    rutas = [APP / "assets" / "char" / f"{villano}.jpg"]
    rutas += [APP / "assets" / "char" / f"{h}.jpg" for h in heroes]
    rutas.append(APP / "assets" / "loc" / f"{lugar}.jpg")
    for r in rutas:
        if not r.is_file():
            raise FileNotFoundError(r)
    return rutas


def prompt(nodo: str) -> str:
    villano, heroes, lugar, escena = PORTADAS[nodo]
    n = 1
    guia = [f"Reference image {n}: the villain ({villano.replace('-', ' ')})."]
    for h in heroes:
        n += 1
        guia.append(f"Reference image {n}: {h.replace('-', ' ').replace('hero', '').strip()}.")
    guia.append(f"Reference image {n + 1}: the location ({lugar.replace('-', ' ')}) for the scenery.")
    return f"{ESTILO}\n\n{' '.join(guia)}\n\nScene: {escena}"


def siguiente(nodo: str, agente: str) -> Path:
    ORIGINALES.mkdir(parents=True, exist_ok=True)
    v = 1
    while (ORIGINALES / f"{nodo}-{agente}-v{v}.png").exists():
        v += 1
    return ORIGINALES / f"{nodo}-{agente}-v{v}.png"


def a_portada(original: Path, nodo: str) -> Path:
    """Recorta al centro en 9:16 y guarda la versión liviana para la app (nunca pisa)."""
    destino = APP / "assets" / "covers" / f"{nodo}.jpg"
    if destino.exists():
        print(f"   {destino.name} ya existe en la app; el original queda en {original}", flush=True)
        return destino
    destino.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(original).convert("RGB")
    w, h = im.size
    if w / h > 9 / 16:
        nw = int(h * 9 / 16); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    elif w / h < 9 / 16:
        nh = int(w * 16 / 9); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im = im.resize((720, 1280), Image.LANCZOS)
    im.save(destino, "JPEG", quality=82, optimize=True, progressive=True)
    return destino


def generar(nodo: str, solo_codex: bool = False) -> Path:
    refs, texto = referencias(nodo), prompt(nodo)
    if not solo_codex:
        destino = siguiente(nodo, "agy")
        try:
            a11_agy.generar_imagen(texto, destino, referencias=refs, timeout=360)
            return destino
        except Exception as e:  # cuota u otro fallo: Codex de respaldo
            print(f"   agy falló ({str(e)[:160]}); voy por Codex", flush=True)
    destino = siguiente(nodo, "codex")
    a12_codex.generar_imagen(texto, destino, referencias=refs, timeout=600)
    return destino


def main(args: list[str]) -> None:
    solo_codex = "--solo-codex" in args
    if "--usar" in args:
        i = args.index("--usar"); nodo, archivo = args[0], Path(args[i + 1]).resolve()
        destino = APP / "assets" / "covers" / f"{nodo}.jpg"
        if destino.exists():
            raise SystemExit(f"{destino} ya existe: bórralo a mano si de verdad quieres cambiarlo.")
        print(a_portada(archivo, nodo)); return
    nodos = [a for a in args if not a.startswith("--")]
    if nodos == ["todos"]:
        nodos = [n for n in PORTADAS if not (APP / "assets" / "covers" / f"{n}.jpg").exists()]
    for nodo in nodos:
        t = time.time()
        print(f"-> {nodo}", flush=True)
        try:
            original = generar(nodo, solo_codex)
            print(f"   ok {original.name} ({time.time() - t:.0f}s) -> {a_portada(original, nodo).name}", flush=True)
        except Exception as e:
            print(f"   FALLÓ {nodo}: {e}", flush=True)


if __name__ == "__main__":
    main(sys.argv[1:])
