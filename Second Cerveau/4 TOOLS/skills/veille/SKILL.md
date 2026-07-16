---
name: veille
description: Pipeline de veille autonome. Scrape tes sources (YouTube, Substacks, blogs, sites sectoriels, benchmarks), croise, élimine les redites vs les jours passés, et produit un digest dense à lire dans `3 RESSOURCES/Veille/Digests/YYYY-MM-DD.md`. Différentiel incrémental via un fichier d'état, anti-redite via topics déjà couverts. Sources 100% configurables ci-dessous.
---

# /veille — Pipeline de veille autonome

> Skill agrégateur : zéro interaction une fois lancé, l'agent va chercher dans tes sources, croise, dédoublonne, et pond un digest. Adapte le bloc **Sources** à TES sujets (c'est là tout le travail de personnalisation).

## Objectif

Produire un **digest dense (~15-20 min de lecture)** dans `3 RESSOURCES/Veille/Digests/YYYY-MM-DD.md`, avec :
- Seulement le **nouveau** depuis le dernier run (différentiel)
- **Anti-redite** : jamais un sujet déjà traité dans un digest précédent
- Des insights et connexions, pas une liste plate
- Les sources brutes archivées dans `3 RESSOURCES/Veille/Sources/YYYY-MM-DD/`

## Scope & chemins (STRICT)

Tout se passe dans `3 RESSOURCES/Veille/` (chemins relatifs à la racine du vault).

```
3 RESSOURCES/Veille/
├── Sources/
│   ├── .state.json                   # état (last_run, urls vues, topics couverts)
│   └── YYYY-MM-DD/                    # sources brutes du run
│       ├── youtube/<channel>/<id>.md
│       ├── web/<source>/<slug>.md
│       └── benchmarks/<source>-<date>.md
└── Digests/
    └── YYYY-MM-DD.md                  # le digest à lire (output principal)
```

## Sources configurées — À PERSONNALISER

> C'est LE bloc à adapter à tes sujets. Ajoute, retire, priorise. Les entrées ci-dessous sont un point de départ générique + des exemples sectoriels : remplace-les par tes vraies sources (veille métier, concurrentielle, réglementaire, techno...).

### YouTube (chaînes)
- `@<chaine-1>` (ex. une chaîne de ton secteur)
- `@<chaine-2>`

### Sites & blogs (pages à surveiller)
- `<Nom source 1>` — `https://...`  (ex. blog métier, site d'un éditeur, media sectoriel)
- `<Nom source 2>` — `https://...`
- `<Nom source 3>` — `https://...`

### Newsletters / archives (pages archive à parcourir)
- `<Newsletter 1>` — `https://.../archive`
- `<Newsletter 2>` — `https://.../archive`

### Benchmarks / classements (optionnel)
- `<Source de classement>` — `https://...`  (comparer au snapshot précédent)

> Exemples de sujets pour t'inspirer : veille IA (labs Anthropic/OpenAI/Mistral, créateurs), veille RH/data (éditeurs SIRH, études sectorielles), veille transport/ferroviaire, veille réglementaire (RGPD, textes officiels), veille concurrentielle (sites concurrents, LinkedIn de dirigeants).

## Flow d'exécution

### Étape 1 — Charger l'état
Lire `3 RESSOURCES/Veille/Sources/.state.json`. Si absent, initialiser :
```json
{ "last_run": null, "seen_urls": [], "seen_video_ids": [], "covered_topics": [] }
```
`covered_topics` = clé de l'anti-redite : liste `{"slug": "...", "date": "YYYY-MM-DD", "summary_1line": "..."}`. `last_run` définit le cutoff : ne traiter que ce qui est postérieur.

### Étape 2 — Scrape par catégorie (en parallèle)

**YouTube** — pour chaque chaîne, lister les vidéos postérieures à `last_run` :
```bash
yt-dlp --flat-playlist --dateafter "$LAST_RUN_YYYYMMDD" \
  --print "%(id)s|%(title)s|%(upload_date)s" "https://www.youtube.com/@<channel>/videos"
```
Puis récupérer les transcripts : `yt-dlp --skip-download --write-auto-subs --sub-langs fr,en --sub-format vtt`, nettoyer le VTT (dédup lignes, retirer les tags `<c>`, paragraphes tous les ~6 lignes).

**Sites, blogs, newsletters** — via Firecrawl :
```
mcp__firecrawl-mcp__firecrawl_scrape(url, formats=["markdown"], onlyMainContent=true)
```
Pour une page archive : extraire les liens d'articles postérieurs à `last_run`, puis scraper chacun.

**Benchmarks** — snapshot markdown, comparer au snapshot précédent pour repérer les changements.

### Étape 3 — Dédupe & filtrage
- Rejeter toute URL déjà dans `seen_urls`.
- Pour chaque item restant, générer un `topic_slug` (ex. `nouvelle-reglementation-x`).
- Rejeter si le slug matche approximativement un `covered_topics` existant (similarité sémantique élevée).

### Étape 4 — Archive brute
Écrire chaque source dans `3 RESSOURCES/Veille/Sources/YYYY-MM-DD/<category>/<slug>.md` avec frontmatter :
```yaml
---
type: veille-source
category: youtube|web|benchmarks
source: "<nom source>"
url: "<url originale>"
scraped_at: "YYYY-MM-DD HH:MM"
topic_slug: "<slug>"
---
```

### Étape 5 — Génération du digest (cœur du skill)
Créer `3 RESSOURCES/Veille/Digests/YYYY-MM-DD.md`.

**Contraintes rédactionnelles :**
1. Dense, ~15-20 min de lecture. Zéro remplissage, pas d'intro généraliste.
2. **Anti-redite absolue** : si un topic est dans `covered_topics`, ne pas le re-couvrir. Si c'est une évolution réelle, introduire par « Suite de [topic du DATE] : ce qui est nouveau... ».
3. **Insights, pas listing** : « X a sorti Y » → non. « X a sorti Y, ce qui casse l'hypothèse Z, parce que... » → oui.
4. **Connexions** : cross-référencer les notes existantes du vault via `[[wikilink]]`.

**Structure :**
```markdown
---
type: veille-digest
date: YYYY-MM-DD
period_covered: "YYYY-MM-DD -> YYYY-MM-DD"
sources_count: N
items_new: N
---

# Veille — <Date en FR>

## TL;DR — Les signaux qui comptent
1. **[Signal]** — l'insight en 1-2 phrases, pas la news
...

## Le fond (analyses)
### [Titre signal]
Contexte (2-3 phrases). Pourquoi c'est non-obvious. Ce que ça change.
**Source :** [lien] · **Insight :** ce que ça implique · **-> Connexion :** [[Note]]

## Deep-dives (articles longs)
### [Titre] — [Auteur, source]
Thèse en 1 phrase. Les 3 arguments structurants. Les angles morts. [Lien]

## Angles potentiels (contenu / action)
3-5 angles qui émergent, scorés vite (résonance / originalité / timing).

## Connexions avec le vault
Notes qui résonnent, suggestions de notes permanentes à créer.

## Topics couverts (anti-redite — ne pas éditer)
- topic-slug-1
```

### Étape 6 — Update state
Après génération réussie : `last_run` = maintenant ; ajouter les nouveaux `seen_urls` / `seen_video_ids` ; ajouter chaque `topic_slug` du digest à `covered_topics` (avec date + résumé 1 ligne) ; écrire `.state.json`.

## Prérequis
- **Firecrawl** (MCP) pour le web. Voir le skill `connect-mcp` si pas encore branché.
- **yt-dlp** (CLI) pour les transcripts YouTube — optionnel (si absent, le skill skippe YouTube et le note dans le digest).

## Exécution
Quand l'utilisateur lance `/veille` :
1. **Annoncer** le scope à scraper + la date du dernier run.
2. **Demander confirmation** avant de lancer.
3. Exécuter en parallélisant par catégorie.
4. À la fin, afficher : chemin du digest, nb d'items nouveaux par catégorie, topics ajoutés, sources skippées (avec raison).

## Recovery & edge cases
- Firecrawl timeout sur une source → skip + noter dans « Sources indisponibles » du digest.
- yt-dlp échoue (sous-titres off) → skip la vidéo + noter.
- Aucun nouveau contenu depuis `last_run` → digest minimaliste « Rien de majeur depuis [date] ».
- > 50 items nouveaux (1er run ou longue pause) → grouper par thème, capper à ~6000 mots en priorisant le signal.

## Fréquence
Manuel : `/veille` quand tu veux. Automatique (plus tard) : cron quotidien (voir skill `new-automation` pour un workflow n8n qui te l'envoie par mail chaque matin).

---
*Skill dérivé du `/veille-ia` d'Eliott Meunier (agrégateur autonome), généralisé pour des sources configurables.*
