# Second Cerveau — template Catapulte

Un second cerveau personnel dans un vault Obsidian local, piloté par un agent (Claude Code). Capture ta matière, structure-la, et lance des skills qui produisent de vrais livrables (synthèse de veille, revues, notes permanentes).

Base : template second cerveau d'[Eliott Meunier](https://github.com/EliottMeunierFluid/templatesecondcerveau) (MIT), généralisé et outillé par Studio Catapulte.

## Ce qu'il y a dedans

```
<racine du repo>/        # <- c'est ÇA que tu ouvres comme vault Obsidian
├── .obsidian/           # config Obsidian (plugins, daily notes, templates)
├── .claude/skills       # -> Second Cerveau/4 TOOLS/skills (les skills vus par Claude Code)
└── Second Cerveau/      # ta matière
    ├── 0 INBOX/         # capture rapide
    ├── 1 PROJETS/       # projets actifs
    ├── 2 CASQUETTES/    # responsabilités continues (vie, business, santé...)
    ├── 3 RESSOURCES/    # références, inspirations
    ├── 4 TOOLS/         # templates, process, et skills/ (les commandes de l'agent)
    └── 5 ARCHIVE/       # terminé
```

Les skills sont dans `Second Cerveau/4 TOOLS/skills/` (visibles dans Obsidian) et exposés à Claude Code via le symlink `.claude/skills`.

**Important : le vault Obsidian, c'est la racine du repo, pas le dossier `Second Cerveau/`.** Les skills écrivent leurs chemins préfixés par `Second Cerveau/` : ils supposent donc que le répertoire de travail est la racine. C'est aussi ce qui fait qu'un terminal intégré à Obsidian (plugin Lean Terminal) démarre au bon endroit pour lancer Claude Code.

## Skills fournis

- **`/initialisation`** — configure le vault avec toi au démarrage (ton nom, ton contexte).
- **`/create-skill`** — construire TES propres skills. Un bon premier exercice : ton skill de veille (mapper ton process de veille, puis le figer en commande réutilisable).
- **`/daily-review`, `/weekly-review`, `/new-life-phase`** — journaling et revues.
- **`/inbox-processor`, `/import`, `/notes-permanentes`, `/map-process`** — traitement et structuration.
- **`/create-skill`, `/new-automation`, `/connect-mcp`** — étendre l'agent (créer tes propres skills, brancher des outils/MCP, automatiser).
- **`/done`, `/thinking-partner`, `/research-assistant`, `/de-ai-ify`** — clôture de session, réflexion, recherche, nettoyage de style.

## Démarrage

1. **Clone** ce repo en local. Sous **Windows**, l'option `core.symlinks` est obligatoire, sinon le lien `.claude/skills` est déposé comme simple fichier texte et Claude Code ne voit aucun skill :
   ```
   git clone -c core.symlinks=true <url du repo> "Second Cerveau"
   ```
   Vérifie ensuite que `dir .claude\skills` (Windows) ou `ls .claude/skills` (Mac/Linux) liste bien des dossiers. Si ce n'est pas le cas, sous Windows :
   ```
   cmd /c mklink /J ".claude\skills" "Second Cerveau\4 TOOLS\skills"
   ```
2. Ouvre **la racine du repo** comme vault dans **Obsidian** (pas le sous-dossier `Second Cerveau/`).
3. Active les plugins communautaires (désactive le mode restreint), puis installe **Lean Terminal** et **Excalidraw**. Calendar et le patch Lean Terminal Escape Fix sont déjà fournis.
4. Ouvre un terminal (Lean Terminal dans Obsidian, ou ton terminal habituel à la racine du repo) et lance **`claude`**.
5. Lance **`/initialisation`** : l'agent te pose quelques questions et personnalise le vault.
6. Dépose ta matière (veille, notes, docs de rôle) dans `Second Cerveau/0 INBOX/`, puis lance **`/inbox-processor`**.

Le repo est un **template** : après le clone, c'est ton vault. Tu n'as pas besoin de compte GitHub pour t'en servir (git local suffit).

## Prérequis outils

- **Claude Code** (abonnement Claude Pro ou Max).
- **Obsidian**, avec les plugins **Lean Terminal** (terminal intégré) et **Excalidraw** (schémas).
- **Firecrawl** (MCP, plan gratuit) pour scraper le web (utile quand tu construiras ta veille), voir `/connect-mcp`.
- **yt-dlp** (optionnel) pour les transcripts YouTube.

> Le plugin **Lean Terminal - Escape Fix** est fourni dans `.obsidian/plugins/`. Sans lui, Obsidian intercepte la touche Échap et tu ne peux pas interrompre Claude Code depuis le terminal intégré.
