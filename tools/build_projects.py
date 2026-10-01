"""Generate the project cards on index.html and one page per project in projects/.

The site has no build step: the generated HTML is committed. Edit the PROJECTS data
below, then run from the repository root:

    python tools/build_projects.py

It rewrites projects/<slug>.html and the block between the projects markers in index.html.
"""
from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://darrenhuai.github.io/darrenhuai-Portfolio/"
NEW_TAB = ' target="_blank" rel="noopener"'


def ext(href: str, text: str, hidden: str = "") -> str:
    """External link that opens in a new tab, with the new-tab hint for screen readers."""
    return f'<a href="{href}"{NEW_TAB}>{text}<span class="visually-hidden">{hidden} (opens in a new tab)</span></a>'


def val(text: str) -> str:
    return f'<span class="val">{text}</span>'


def num(text: str) -> str:
    return f'<span class="num">{text}</span>'


# ---------------------------------------------------------------------------------------------
# Project data. Every claim here is checked against the project's repository, store page or
# the resume; keep it that way.
# ---------------------------------------------------------------------------------------------
PROJECTS = [
    {
        "slug": "chesstan",
        "title": "ChessTan",
        "card": {
            "span": 7,
            "cover": "board",
            "lead": "A hex-strategy game on Steam: a settle-and-trade economy with chess-style movement and capture.",
            "stack": "Godot 4.7, GDScript, WebSocket relay, Steam",
        },
        "lead": "A hex-grid strategy game: a settle-and-trade economy with chess-style movement and capture, for 2 to 4 players, hot-seat, against the AI, or online.",
        "description": "ChessTan, a hex-grid strategy game by Darren Huai: a settle-and-trade economy with chess-style combat, on Steam, in the browser and as a Discord Activity.",
        "facts": [
            ("Role", "Solo developer. Design, rules engine, AI opponent, netcode, the relay server, and the Steam launch."),
            ("Stack", val("Godot 4.7, GDScript, WebSocket relay (Godot, Docker on Render.com), Steamworks, Discord Activity")),
            ("Released", "Free on Steam since September 19, 2026."),
            ("Links", " ".join([
                ext("https://store.steampowered.com/app/5099860/ChessTan/", "Steam"),
                ext("https://darrenhuai.github.io/chesstan-web/", "Play in browser"),
                ext("https://github.com/darrenhuai/chesstan-relay", "Relay source"),
            ])),
        ],
        "media": {
            "kind": "image",
            "src": "chesstan-board.webp",
            "src800": "chesstan-board-800.webp",
            "w": 1600, "h": 827,
            "alt": "ChessTan mid-game: blue and red chess pieces on a hex board of yellow, blue, sand and brown tiles, with both players' resource panels at the left.",
        },
        "sections": [
            ("The problem", [
                "Two systems that usually live in different games share one board, so a good economy can still lose to a bad position.",
                "Online, the hard part is a player whose connection drops mid-turn: two clients that disagree about the board end the game, and a dropped connection ends the match unless the player can rejoin.",
            ]),
            ("How a match plays", [
                "Players settle their starting positions, then roll dice each round to collect resources from the tiles around their settlements. Resources buy houses, roads and fortresses, and units that move and capture like chess pieces: pawns, rooks, knights and queens, plus a colossus that unlocks after three kills. Players can trade with each other or the bank. A king takes three hits to fall, a checkmated player is out, and the last player with a king standing wins.",
            ]),
            ("What I built", [
                "The rules engine and the AI run headless, with no scene tree, so the same code drives the game, the test suites, and full AI-versus-AI simulations.",
                "Online play is host-authoritative: one client owns the game state and the others send it actions. A small WebSocket relay pairs up to four players by a five-character room code (no 0, O, 1, I or L, so it can be read out on a call) and forwards messages without knowing the rules. A player who drops has a grace period to rejoin with a token and resyncs from the host. Steam players can also connect peer to peer through Steamworks, without the relay.",
                "One codebase ships as the Steam release, a browser build, and a Discord Activity.",
            ]),
            ("Testing", [
                "Headless Godot suites cover the rules, the AI, network actions, reconnects, the relay server, save and load, and map selection. UI harnesses drive real clicks through the menus and the tutorial.",
            ]),
        ],
        "gallery": [
            {"src": "chesstan-capture.webp", "src800": "chesstan-capture-800.webp", "w": 1600, "h": 900,
             "alt": "A capture in progress: a highlighted blue rook beside red pieces on yellow tiles.",
             "caption": "Move phase: a rook lines up a capture."},
            {"src": "chesstan-lobby.webp", "src800": "chesstan-lobby-800.webp", "w": 960, "h": 540,
             "alt": "The multiplayer lobby: relay server address, a room code to share, seats for 2 to 4 players, and a bigger-board option for 3 or 4 players.",
             "caption": "The online lobby, with a room code to share."},
            {"src": "chesstan-victory.webp", "src800": "chesstan-victory-800.webp", "w": 1120, "h": 630,
             "alt": "The victory screen: Player 1 (Blue) wins by capturing the enemy king, with army strength and kills for both players.",
             "caption": "The end of a match."},
        ],
        "gallery_cols": 3,
    },
    {
        "slug": "watchglass",
        "title": "watchglass",
        "card": {
            "span": 5,
            "cover": "image",
            "src": "watchglass-demo-still.webp", "w": 960, "h": 640, "position": "50% 50%",
            "alt": "",
            "lead": "Point a camera at any screen and get a notification when what it shows changes.",
            "stack": "Go, Docker, Tesseract OCR, MQTT",
        },
        "lead": "Get a notification when a screen changes, even one with no API.",
        "description": "watchglass by Darren Huai: a self-hosted Go service that reads a region of any screen through a camera and sends a notification when it changes.",
        "facts": [
            ("Role", "Solo developer and maintainer."),
            ("Stack", val("Go, single binary, Docker image (amd64, arm64, armv7), Tesseract OCR, ffmpeg, MQTT")),
            ("Released", f"{num('v0.1.8')}, September 29, 2026."),
            ("Links", " ".join([
                ext("https://github.com/darrenhuai/watchglass", "Source", " for watchglass"),
                ext("https://github.com/darrenhuai/watchglass/releases/latest", "Releases", " for watchglass"),
            ])),
        ],
        "media": {
            "kind": "video",
            "src": "watchglass-demo.mp4", "poster": "watchglass-demo-still.webp", "w": 960, "h": 640,
            "label": "watchglass region editor: a camera view of a printer status panel with the read region outlined and the decoded text PRINT COMPLETE beside it.",
            "caption": "Demo recording, 14 seconds: a watch is set up on a printer screen and fires when it reads PRINT COMPLETE.",
        },
        "sections": [
            ("The problem", [
                "Heat pump panels, 3D printers and bench scales show their state on a screen and nowhere else. The number is right there, and nothing on the network can read it.",
            ]),
            ("What it does", {"features": [
                ("Draw, test, save.", "Drag a box over the live frame and see what it reads before saving. No YAML."),
                ("Three readers.", "Text through Tesseract, seven-segment digits through a built-in decoder, or plain pixel change."),
                ("No flapping.", "A reading has to hold for a few polls before it counts, and a cooldown stops repeat pings."),
                ("Notifications.", "ntfy with the cropped region attached, Discord, Telegram, Slack, Pushover, email and webhooks."),
                ("Home Assistant.", "Each watch appears over MQTT as a device, and a number becomes a sensor it can graph."),
                ("Camera health.", "One alert when a camera goes down and one when it comes back."),
                ("Small.", f"Snapshot URLs, MJPEG, RTSP, webcams or your own screen, in about {num('55 MB')} of RAM with no GPU."),
            ]}),
            ("Try it", {
                "paras": ["The demo needs no camera. Two demo watches fire about 20 seconds after it starts, at http://127.0.0.1:8080."],
                "code": "docker run --rm -p 127.0.0.1:8080:8080 -e WATCHGLASS_DEMO=1 ghcr.io/darrenhuai/watchglass",
            }),
        ],
        "gallery": [
            {"src": "watchglass-dashboard.webp", "w": 1160, "h": 587, "wide": True,
             "alt": "The watch list: three watches on the built-in demo cameras with their last readings and when each last fired.",
             "caption": "The watch list, with each watch's last reading and when it last fired."},
            {"src": "watchglass-region-editor.webp", "w": 1160, "h": 900,
             "alt": "A watch's detail page: a box drawn over PRINT COMPLETE on a printer screen, and a test result that reads PRINT COMPLETE at 96% confidence.",
             "caption": "Testing a region before saving it."},
            {"src": "watchglass-sevenseg.webp", "w": 1160, "h": 900,
             "alt": "The built-in seven-segment reader on an LED scale display: the test reads 25.3, above the threshold of 25.",
             "caption": "The built-in seven-segment reader on a scale display."},
        ],
        "gallery_cols": 2,
    },
    {
        "slug": "prediction-market-bot",
        "title": "Prediction Market Bot",
        "card": {
            "span": 5,
            "cover": "image",
            "src": "kalshi-opportunities.webp", "w": 964, "h": 900, "position": "50% 0", "light": True,
            "alt": "",
            "lead": "A scanner for live Kalshi markets, with a local web app, email alerts and a paper-trading mode.",
            "stack": "Python, Kalshi API, pytest",
        },
        "lead": "A scanner that reads every open Kalshi market every five minutes and emails me when one is worth a look.",
        "description": "Prediction Market Bot by Darren Huai: a Python scanner and local web app for Kalshi prediction markets, with email alerts.",
        "facts": [
            ("Role", "Built on Jonathan Becker's open-source prediction-market-analysis framework, which provides the data indexers and analyses. I added the Kalshi scanner, the alerts, the web app and the tests."),
            ("Stack", val("Python, Kalshi REST API, RSA key auth, pytest, ruff, GitHub Actions")),
            ("Links", ext("https://github.com/darrenhuai/Prediction-market-bot", "Source", " for Prediction Market Bot")),
        ],
        "media": {
            "kind": "pair",
            "items": [
                {"src": "kalshi-opportunities.webp", "w": 964, "h": 900,
                 "alt": "The Opportunities tab: picks with an edge, an arbitrage group marked Locked in, and the balance and market count in the header.",
                 "caption": "Opportunities: picks with an edge, and arbitrage."},
                {"src": "kalshi-markets.webp", "w": 980, "h": 900,
                 "alt": "The Markets tab: a searchable list of open markets with the implied chance, the YES and NO prices, and the volume traded in the last day.",
                 "caption": "Markets: every open market, searchable."},
            ],
            "note": f"The local web app on demo data ({val('--demo')}).",
        },
        "sections": [
            ("The problem", [
                "Kalshi prices move every few minutes across thousands of markets. I wanted to know when one was worth a look without watching them all.",
            ]),
            ("Why it asks for your own estimate", [
                "The first version compared a market's fair price, worked out from its own bids, with the same market's asks. That number is always zero or negative, so it could never find anything: a market cannot tell you it is mispriced.",
                "The scanner now needs an outside view: either your own probability for an outcome, or a guaranteed-payout comparison across outcomes where only one can happen.",
            ]),
            ("What it shows", {"features": [
                ("Picks with an edge.", "Markets where the price beats the chance you gave them, after Kalshi's fees."),
                ("Arbitrage.", "Groups of outcomes where only one can happen, priced so buying NO on every one costs less than the set is sure to pay back. They cannot lose at the listed prices, but they are rare."),
                ("Unusual activity.", "Very one-sided buying or very large trades in the busiest markets."),
                ("Markets.", "Search every open market, enter your own chance, and see the expected profit for YES or NO with a suggested stake."),
                ("Alerts.", "A headless scanner runs the same scan on a timer, logs what it finds, and sends email."),
                ("Trading, off by default.", "Paper mode records what it would have bought at real prices. Live mode also needs an explicit setting in the environment file, and risks 1% of the balance per trade under a daily cap."),
            ]}),
            ("Try it", {
                "paras": ["Demo mode uses made-up data, so it needs no internet connection or Kalshi account. Tests and lint run in CI on every push."],
                "code": "uv sync\nuv run app.py --demo --open",
            }),
        ],
        "gallery": [],
    },
    {
        "slug": "kinetic-analyzer",
        "title": "Kinetic Analyzer",
        "card": {
            "span": 7,
            "cover": "phones",
            "srcs": ["kinetic-results-phone.webp", "kinetic-analyse-phone.webp"],
            "lead": "Film a punch or a kick and see when each joint fires, in milliseconds.",
            "stack": "Expo, React Native, TypeScript, Supabase, MediaPipe",
        },
        "lead": "Film a punch or a kick and see when each joint fires, in milliseconds, from the hip out to the fist or the foot.",
        "description": "Kinetic Analyzer by Darren Huai: a React Native app and Python pose service that break down a striking video into kinetic-chain timing.",
        "facts": [
            ("Role", "Solo developer. App, pose service, and backend."),
            ("Stack", val("Expo, React Native, TypeScript, Supabase (Postgres), Python pose service (FastAPI, MediaPipe Pose, OpenCV) in Docker")),
            ("Status", "The iOS build is in TestFlight testing."),
            ("Source", "The repository is private. The screenshots are from the app's web build."),
        ],
        "media": {
            "kind": "phones",
            "items": [
                {"src": "kinetic-results-phone.webp", "w": 390, "h": 844,
                 "alt": "Results screen: the wrist's path through a strike drawn over a dark trace and colored by speed, with joint toggles and a speed build list for hip, shoulder and elbow."},
                {"src": "kinetic-analyse-phone.webp", "w": 390, "h": 844,
                 "alt": "New analysis screen: sport, strike and stance selectors above a footage picker."},
            ],
            "caption": "Results and setup screens.",
        },
        "sections": [
            ("The problem", [
                "Coaches talk about the kinetic chain, but a phone clip of a strike only shows the result. To know whether the hip fired before the shoulder you need the timing of each joint, not a slow-motion replay.",
            ]),
            ("How it works", [
                "The app uploads a clip to a Python service that finds the strike, runs MediaPipe Pose on it, and returns body landmarks frame by frame. A TypeScript engine in the app turns those landmarks into the kinetic chain: how fast each joint moves relative to the others, the order and timing in which they fire, rep-by-rep consistency, and balance through the strike. Supabase stores sessions and progress.",
            ]),
            ("What a breakdown shows", {"features": [
                ("Joint speed.", "Which links in the chain drive the strike and which lag, scored against your own fastest joint."),
                ("Chain timing.", "Whether the joints fire in the right order, with the gaps between them in milliseconds. A timing row jumps the video to that frame."),
                ("Rep consistency.", "Several reps in one clip get rep-by-rep timing, and a read on whether speed held or faded."),
                ("Balance and cues.", "How stable the base stays, and plain-language faults ranked by priority, each with a drill."),
                ("Rounds and comparisons.", "Up to five clips reviewed together, and sessions or left and right sides compared."),
            ]}),
            ("An honest note", [
                "It gives relative feedback from one camera, not lab measurements of speed or force, and it says so when something cannot be measured cleanly.",
            ]),
        ],
        "gallery": [],
    },
    {
        "slug": "petrarchan-gpt",
        "title": "Petrarchan GPT",
        "card": {
            "span": 6,
            "cover": None,
            "lead": "A small character-level GPT in PyTorch, trained on Petrarch's sonnets.",
            "stack": "Python, PyTorch",
        },
        "lead": "A small character-level GPT in PyTorch, trained on a scanned bilingual edition of Petrarch's sonnets as a way to learn how a transformer works end to end.",
        "description": "Petrarchan GPT by Darren Huai: a small character-level GPT language model in PyTorch, trained on Petrarch's sonnets.",
        "facts": [
            ("Role", "Personal learning project."),
            ("Stack", val("Python, PyTorch, CUDA on an RTX 4070")),
            ("Links", ext("https://github.com/darrenhuai/darrenhuai-GPT", "Source", " for Petrarchan GPT")),
        ],
        "media": {
            "kind": "specs",
            "title": "Model settings",
            "items": [
                ("Tokenizer", "Characters"),
                ("Context", "256 characters"),
                ("Blocks", "6"),
                ("Attention heads", "6 per block"),
                ("Embedding", "384 dimensions"),
                ("Dropout", "0.2"),
                ("Optimizer", "AdamW, learning rate 3e-4"),
                ("Training", "5,000 steps, batches of 64"),
            ],
        },
        "sections": [
            ("What is in it", [
                "A character tokenizer, token and position embeddings, six transformer blocks of multi-head causal self-attention and feed-forward layers with layer norm, and a language-model head, in about 200 lines.",
                "The training loop samples random 256-character windows, reports training and validation loss every 500 steps, and generates new sonnet-style text at the end. The architecture and settings follow Andrej Karpathy's Let's build GPT lecture; the corpus is a scanned edition of Petrarch's sonnets in Italian and English.",
            ]),
        ],
        "gallery": [],
    },
    {
        "slug": "greetbot",
        "title": "GreetBot",
        "card": {
            "span": 6,
            "cover": None,
            "lead": "A face-recognizing greeting robot, built with a 14-person UCLA engineering club team.",
            "stack": "Python, OpenCV, Arduino",
        },
        "lead": "A robot that recognizes a face and offers a handshake, built by a 14-person team in a UCLA engineering club.",
        "description": "GreetBot: a face-recognizing greeting robot built by a 14-person UCLA engineering club team, including Darren Huai.",
        "facts": [
            ("Role", "One of 14 team members."),
            ("Stack", val("Python, OpenCV, face_recognition (dlib), Arduino over Firmata")),
            ("Links", ext("https://github.com/darrenhuai/darrenhuai-GreetBot", "Source", " for GreetBot") + ' <span class="facts-note">My fork of the team repository.</span>'),
        ],
        "media": None,
        "sections": [
            ("How it works", [
                "A camera feeds frames to a face-recognition module. It checks whether a frame contains a face, finds the largest one, and compares its encoding with encodings generated ahead of time from a folder of known faces. A runner script ties the recognition to the Arduino hardware that performs the greeting.",
            ]),
            ("The face module", {
                "paras": ["The recognition code was pulled out into a module with three functions, so other projects can reuse it."],
                "code": "from detector import has_face, find_face, generate_encodings\n\nencodings, names = generate_encodings(directory)\nif has_face(image):\n    image, encoding, location = find_face(image)",
            }),
        ],
        "gallery": [],
    },
]

NAV = [("experience", "Experience"), ("projects", "Projects"), ("open-source", "Open source"),
       ("skills", "Skills"), ("about", "About"), ("contact", "Contact")]


# ---------------------------------------------------------------------------------------------
# Cards on index.html
# ---------------------------------------------------------------------------------------------
def card_cover(p: dict) -> str:
    c = p["card"]
    if c["cover"] == "board":
        return (
            '<div class="card-cover cover-board" id="board-canvas-box">\n'
            '              <picture>\n'
            '                <source media="(prefers-color-scheme: dark)" type="image/webp" srcset="img/hero-board-dark.webp 1600w, img/hero-board-dark-800.webp 800w" sizes="(min-width: 1024px) 640px, (min-width: 700px) 50vw, 100vw">\n'
            '                <img src="img/hero-board-light.webp" srcset="img/hero-board-light-800.webp 800w, img/hero-board-light.webp 1600w" sizes="(min-width: 1024px) 640px, (min-width: 700px) 50vw, 100vw" width="1600" height="1200" loading="lazy" decoding="async" alt="">\n'
            '              </picture>\n'
            '            </div>'
        )
    if c["cover"] == "image":
        light = " cover-light" if c.get("light") else ""
        return (
            f'<div class="card-cover{light}"><img src="img/work/{c["src"]}" width="{c["w"]}" height="{c["h"]}" '
            f'style="object-position: {c["position"]}" loading="lazy" decoding="async" alt="{c["alt"]}"></div>'
        )
    if c["cover"] == "phones":
        imgs = "".join(f'<img src="img/work/{s}" width="390" height="844" loading="lazy" decoding="async" alt="">' for s in c["srcs"])
        return f'<div class="card-cover cover-phones">{imgs}</div>'
    return ""


def cards_html() -> str:
    out = ['<div class="project-grid">']
    for p in PROJECTS:
        c = p["card"]
        compact = " card-compact" if not c["cover"] else ""
        cover = card_cover(p)
        out.append(f'          <article class="project-card card-span-{c["span"]}{compact}" data-reveal="rise">')
        if cover:
            out.append(f"            {cover}")
        out.append('            <div class="card-text">')
        out.append(f'              <h3 class="card-title"><a class="card-link" href="projects/{p["slug"]}.html">{p["title"]}</a></h3>')
        out.append(f'              <p class="card-lead">{c["lead"]}</p>')
        out.append(f'              <p class="card-stack val">{c["stack"]}</p>')
        out.append('              <span class="card-cue" aria-hidden="true">View project</span>')
        out.append("            </div>")
        out.append("          </article>")
    out.append("        </div>")
    return "\n".join(out)


# ---------------------------------------------------------------------------------------------
# Project pages
# ---------------------------------------------------------------------------------------------
def media_html(p: dict) -> str:
    m = p["media"]
    if not m:
        return ""
    img = "../img/work/"
    if m["kind"] == "image":
        return (
            '<figure class="project-media">\n'
            f'          <div class="plate" style="aspect-ratio: {m["w"]} / {m["h"]}">'
            f'<img src="{img}{m["src"]}" srcset="{img}{m["src800"]} 800w, {img}{m["src"]} {m["w"]}w" sizes="(min-width: 1280px) 1120px, 100vw" '
            f'width="{m["w"]}" height="{m["h"]}" fetchpriority="high" decoding="async" alt="{m["alt"]}"></div>\n'
            "        </figure>"
        )
    if m["kind"] == "video":
        return (
            '<figure class="project-media">\n'
            f'          <div class="plate" style="aspect-ratio: {m["w"]} / {m["h"]}">'
            f'<video class="demo-video" controls muted playsinline preload="metadata" poster="{img}{m["poster"]}" width="{m["w"]}" height="{m["h"]}" aria-label="{m["label"]}">'
            f'<source src="{img}{m["src"]}" type="video/mp4"></video></div>\n'
            '          <figcaption class="plate-meta">\n'
            f'            <span class="caption">{m["caption"]}</span>\n'
            '            <button type="button" class="replay" data-replay>Play demo</button>\n'
            "          </figcaption>\n"
            "        </figure>"
        )
    if m["kind"] == "pair":
        figs = []
        for it in m["items"]:
            figs.append(
                f'<figure><div class="plate" style="aspect-ratio: {it["w"]} / {it["h"]}"><img src="{img}{it["src"]}" width="{it["w"]}" height="{it["h"]}" '
                f'decoding="async" alt="{it["alt"]}"></div><figcaption class="caption">{it["caption"]}</figcaption></figure>'
            )
        return (
            '<div class="project-media media-pair cover-light-group" data-reveal="stagger">\n          '
            + "\n          ".join(figs)
            + f'\n          <p class="caption media-note">{m["note"]}</p>\n        </div>'
        )
    if m["kind"] == "phones":
        imgs = "".join(
            f'<img src="{img}{it["src"]}" width="{it["w"]}" height="{it["h"]}" decoding="async" alt="{it["alt"]}">' for it in m["items"]
        )
        return (
            '<figure class="project-media media-phones">\n'
            f'          <div class="phone-panel">{imgs}</div>\n'
            f'          <figcaption class="caption">{m["caption"]}</figcaption>\n'
            "        </figure>"
        )
    if m["kind"] == "specs":
        rows = "".join(f"<div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in m["items"])
        return (
            f'<section class="project-media specs" aria-label="{m["title"]}">\n'
            f'          <h2 class="specs-title">{m["title"]}</h2>\n'
            f'          <dl class="specs-grid">{rows}</dl>\n'
            "        </section>"
        )
    raise ValueError(m["kind"])


def section_html(heading: str, body) -> str:
    parts = [f'        <section class="project-section" data-reveal="rise">', f"          <h2>{heading}</h2>", '          <div class="section-body">']
    if isinstance(body, list):
        body = {"paras": body}
    for para in body.get("paras", []):
        parts.append(f"            <p>{para}</p>")
    if body.get("features"):
        parts.append('            <ul class="feature-list">')
        for name, text in body["features"]:
            parts.append(f'              <li><span class="feature-name">{name}</span> {text}</li>')
        parts.append("            </ul>")
    if body.get("code"):
        code = body["code"].replace("&", "&amp;").replace("<", "&lt;")
        parts.append(f'            <pre class="code"><code>{code}</code></pre>')
    parts.append("          </div>")
    parts.append("        </section>")
    return "\n".join(parts)


def gallery_html(p: dict) -> str:
    if not p["gallery"]:
        return ""
    figs = []
    for g in p["gallery"]:
        cols = p.get("gallery_cols", 2)
        sizes = "(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw" if cols == 3 else "(min-width: 1280px) 548px, (min-width: 768px) 50vw, 100vw"
        srcset = f' srcset="../img/work/{g["src800"]} 800w, ../img/work/{g["src"]} {g["w"]}w" sizes="{sizes}"' if g.get("src800") else ""
        wide = " gallery-wide" if g.get("wide") else ""
        figs.append(
            f'          <figure class="gallery-item{wide}"><div class="plate" style="aspect-ratio: {g["w"]} / {g["h"]}">'
            f'<img src="../img/work/{g["src"]}"{srcset} width="{g["w"]}" height="{g["h"]}" loading="lazy" decoding="async" alt="{g["alt"]}"></div>'
            f'<figcaption class="caption">{g["caption"]}</figcaption></figure>'
        )
    cols = p.get("gallery_cols", 2)
    return (
        f'      <section class="sheet gallery" aria-labelledby="gallery-title">\n'
        f'        <h2 id="gallery-title">Screenshots</h2>\n'
        f'        <div class="gallery-grid gallery-cols-{cols}" data-reveal="stagger">\n' + "\n".join(figs) + "\n        </div>\n      </section>"
    )


def pager_html(i: int) -> str:
    links = []
    if i > 0:
        prev = PROJECTS[i - 1]
        links.append(f'<a class="pager-link pager-prev" href="{prev["slug"]}.html"><span class="pager-label">Previous project</span><span class="pager-title">{prev["title"]}</span></a>')
    else:
        links.append('<span class="pager-spacer"></span>')
    if i < len(PROJECTS) - 1:
        nxt = PROJECTS[i + 1]
        links.append(f'<a class="pager-link pager-next" href="{nxt["slug"]}.html"><span class="pager-label">Next project</span><span class="pager-title">{nxt["title"]}</span></a>')
    return '      <nav class="sheet pager" aria-label="More projects">\n        ' + "\n        ".join(links) + "\n      </nav>"


def page_html(i: int) -> str:
    p = PROJECTS[i]
    nav = "\n".join(
        f'        <a href="../index.html#{anchor}"{" aria-current=\"true\"" if anchor == "projects" else ""}>{label}</a>' for anchor, label in NAV
    )
    facts = "".join(f"<div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in p["facts"])
    sections = "\n".join(section_html(h, b) for h, b in p["sections"])
    media = media_html(p)
    title_text = re.sub(r"<[^>]+>", "", p["title"])
    description = p["description"]
    url = f"{SITE}projects/{p['slug']}.html"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title_text}, a project by Darren Huai</title>
  <meta name="description" content="{description}">
  <meta name="color-scheme" content="light dark">
  <link rel="canonical" href="{url}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{title_text}, a project by Darren Huai">
  <meta property="og:description" content="{description}">
  <meta property="og:image" content="{SITE}img/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../img/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="../fonts/archivo-var.woff2" as="font" type="font/woff2" crossorigin>
  <script>document.documentElement.classList.add("js")</script>
  <link rel="stylesheet" href="../styles.css">
  <script type="module" src="../js/main.js"></script>
</head>
<body class="page-project">
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="nav">
    <div class="sheet nav-inner">
      <a class="wordmark" href="../index.html">Darren Huai</a>
      <button type="button" class="menu-button" aria-expanded="false" aria-controls="primary-nav">Menu</button>
      <nav id="primary-nav" class="nav-links" aria-label="Primary">
{nav}
        {ext("https://github.com/darrenhuai", "GitHub")}
      </nav>
    </div>
  </header>

  <main id="main">
    <article class="project" aria-labelledby="project-title">
      <div class="sheet">
        <p class="back"><a href="../index.html#projects">All projects</a></p>
        <header class="project-head">
          <div class="project-intro">
            <h1 id="project-title">{p["title"]}</h1>
            <p class="project-lead">{p["lead"]}</p>
          </div>
          <dl class="facts">{facts}</dl>
        </header>
        {media}
      </div>
      <div class="sheet project-body">
{sections}
      </div>
{gallery_html(p)}
{pager_html(i)}
    </article>
  </main>

  <footer class="footer">
    <div class="sheet">
      <p>Darren Huai, Los Angeles. HTML, CSS, JavaScript and three.js, no build step. {ext("https://github.com/darrenhuai/darrenhuai-Portfolio", "Source on GitHub")}.</p>
    </div>
  </footer>
</body>
</html>
"""


def main() -> int:
    out_dir = ROOT / "projects"
    out_dir.mkdir(exist_ok=True)
    for i, p in enumerate(PROJECTS):
        (out_dir / f"{p['slug']}.html").write_text(page_html(i), encoding="utf-8", newline="\n")

    index = ROOT / "index.html"
    html = index.read_text(encoding="utf-8")
    start, end = "<!-- projects:start -->", "<!-- projects:end -->"
    if start not in html or end not in html:
        print("index.html is missing the projects markers", file=sys.stderr)
        return 1
    before, rest = html.split(start, 1)
    _, after = rest.split(end, 1)
    html = before + start + "\n        " + cards_html() + "\n        " + end + after
    index.write_text(html, encoding="utf-8", newline="\n")

    bad = [c for c in ("–", "—", "·") if any(c in (out_dir / f"{p['slug']}.html").read_text(encoding="utf-8") for p in PROJECTS)]
    if bad:
        print(f"forbidden characters in generated pages: {bad}", file=sys.stderr)
        return 1
    print(f"wrote {len(PROJECTS)} project pages and the index cards")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
