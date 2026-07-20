# Second Cerveau — template Catapulte

Un second cerveau personnel dans un vault Obsidian local, piloté par un agent (Claude Code). Capture ta matière, structure-la, et lance des skills qui produisent de vrais livrables (synthèse de veille, revues, notes de projet).

Base : template second cerveau d'[Eliott Meunier](https://github.com/EliottMeunierFluid/templatesecondcerveau) (MIT), généralisé et outillé par Studio Catapulte.

## Ce qu'il y a dedans

Un seul dossier : c'est à la fois ton vault Obsidian et le répertoire depuis lequel l'agent travaille.

```
<ton second cerveau>/
├── .claude/skills/      # les skills : les commandes de l'agent
├── .obsidian/           # config Obsidian (plugins, daily notes, templates)
├── 0 INBOX/             # capture rapide
├── 1 PROJETS/           # projets actifs
├── 2 CASQUETTES/        # responsabilités continues (vie, business, santé...)
├── 3 RESSOURCES/        # références, inspirations (brut)
├── 4 TOOLS/             # templates et process documentés
├── 5 ARCHIVE/           # terminé
├── _Import/             # notes à reclasser
└── CLAUDE.md            # les instructions de l'agent
```

Tu ouvres ce dossier dans Obsidian, et tu lances `claude` depuis ce même dossier. Pas de niveau intermédiaire, pas de sous-dossier à ne pas confondre.

Les skills vivent dans `.claude/skills/`. C'est un dossier caché, donc invisible par défaut dans l'explorateur Obsidian : le plugin **Hidden Folders Access** (dans la liste ci-dessous) te permet de les voir et de les éditer comme n'importe quelle note.

## Skills fournis

- **`/initialisation`** — configure le vault avec toi au démarrage (ton nom, ton contexte).
- **`/create-skill`** — construire TES propres skills. Un bon premier exercice : ton skill de veille (mapper ton process de veille, puis le figer en commande réutilisable).
- **`/daily-review`, `/weekly-review`, `/new-life-phase`** — journaling et revues.
- **`/inbox-processor`, `/import`, `/map-process`** — traitement et structuration.
- **`/new-automation`, `/connect-mcp`** — étendre l'agent (brancher des outils/MCP, automatiser).
- **`/done`, `/thinking-partner`, `/research-assistant`, `/de-ai-ify`** — clôture de session, réflexion, recherche, nettoyage de style.

## Démarrage

1. **Clone** ce repo en local :
   ```
   git clone <url du repo> "Second Cerveau"
   cd "Second Cerveau"
   ```
2. Ouvre **ce dossier** comme vault dans **Obsidian**.
3. Active les plugins communautaires (désactive le mode restreint), puis installe **Lean Terminal**, **Excalidraw** et **Hidden Folders Access**. Calendar et le patch Lean Terminal Escape Fix sont déjà fournis.
4. Ouvre un terminal (Lean Terminal dans Obsidian, ou ton terminal habituel dans ce dossier) et lance **`claude`**.
5. Lance **`/initialisation`** : l'agent te pose quelques questions et personnalise le vault.
6. Dépose ta matière (veille, notes, docs de rôle) dans `0 INBOX/`, puis lance **`/inbox-processor`**.

Le repo est un **template** : après le clone, c'est ton vault. Tu n'as pas besoin de compte GitHub pour t'en servir (git local suffit).

## Prérequis outils

- **Claude Code** (abonnement Claude Pro ou Max).
- **Obsidian**, avec **Lean Terminal** (terminal intégré), **Excalidraw** (schémas) et **Hidden Folders Access** (voir `.claude/skills/`).
- **Firecrawl** (MCP, plan gratuit) pour scraper le web (utile quand tu construiras ta veille), voir `/connect-mcp`.
- **Node.js** (LTS), requis par les MCP qui tournent via `npx` — dont Firecrawl.

> Le plugin **Lean Terminal - Escape Fix** est fourni dans `.obsidian/plugins/`. Sans lui, Obsidian intercepte la touche Échap et tu ne peux pas interrompre Claude Code depuis le terminal intégré.

## Notes

- Structure **à plat** assumée : le vault et le répertoire de travail de l'agent sont le même dossier. La variante imbriquée (un WORKSPACE parent pouvant héberger d'autres projets à côté du vault) est conservée sur la branche `structure-imbriquee`.
- Les instructions de l'agent sont dans un **unique `CLAUDE.md`** à la racine.
- `.claude/settings.json` pré-autorise les opérations courantes de l'agent (lire et écrire des notes, `ls`, `find`, `mkdir`, `git commit`) pour éviter une demande de confirmation à chaque geste. `rm` et `git push` restent bloqués. À ajuster si tu veux un cadre plus strict ou plus large.
