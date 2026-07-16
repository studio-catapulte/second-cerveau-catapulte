# Second Cerveau — template Catapulte

Un second cerveau personnel dans un vault Obsidian local, piloté par un agent (Claude Code). Capture ta matière, structure-la, et lance des skills qui produisent de vrais livrables (synthèse de veille, revues, notes permanentes).

Base : template second cerveau d'[Eliott Meunier](https://github.com/EliottMeunierFluid/templatesecondcerveau) (MIT), généralisé et outillé par Studio Catapulte.

## Ce qu'il y a dedans

```
Second Cerveau/          # ton vault Obsidian
├── 0 INBOX/             # capture rapide
├── 1 PROJETS/           # projets actifs
├── 2 CASQUETTES/        # responsabilités continues (vie, business, santé...)
├── 3 RESSOURCES/        # références, inspirations
├── 4 TOOLS/             # templates, process, et skills/ (les commandes de l'agent)
└── 5 ARCHIVE/           # terminé

.claude/skills -> Second Cerveau/4 TOOLS/skills   # les skills, vus par Claude Code
```

Les skills sont dans `4 TOOLS/skills/` (visibles dans Obsidian) et exposés à Claude Code via le symlink `.claude/skills`.

## Skills fournis

- **`/initialisation`** — configure le vault avec toi au démarrage (ton nom, ton contexte).
- **`/create-skill`** — construire TES propres skills. Un bon premier exercice : ton skill de veille (mapper ton process de veille, puis le figer en commande réutilisable).
- **`/daily-review`, `/weekly-review`, `/new-life-phase`** — journaling et revues.
- **`/inbox-processor`, `/import`, `/notes-permanentes`, `/map-process`** — traitement et structuration.
- **`/create-skill`, `/new-automation`, `/connect-mcp`** — étendre l'agent (créer tes propres skills, brancher des outils/MCP, automatiser).
- **`/done`, `/thinking-partner`, `/research-assistant`, `/de-ai-ify`** — clôture de session, réflexion, recherche, nettoyage de style.

## Démarrage

1. **Clone** ce repo en local (`git clone ...`).
2. Ouvre le dossier `Second Cerveau/` comme vault dans **Obsidian**.
3. Ouvre la racine du repo dans **Claude Code** (`claude`).
4. Lance **`/initialisation`** : l'agent te pose quelques questions et personnalise le vault.
5. Dépose ta matière (veille, notes, docs de rôle) dans `0 INBOX/`, puis lance **`/inbox-processor`**.

Le repo est un **template** : après le clone, c'est ton vault. Tu n'as pas besoin de compte GitHub pour t'en servir (git local suffit).

## Prérequis outils

- **Claude Code** (abonnement Claude Pro ou Max).
- **Firecrawl** (MCP, plan gratuit) pour scraper le web (utile quand tu construiras ta veille) — voir `/connect-mcp`.
- **yt-dlp** (optionnel) pour les transcripts YouTube.
