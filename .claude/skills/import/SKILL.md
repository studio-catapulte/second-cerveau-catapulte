---
name: import
description: Import intelligent par passes intentionnelles : alignement profond, scan LS par l'agent principal, délégation à des sous-agents briefés, plan mode puis build mode, feedback à la fin
---

# Import Intelligent

## Le principe : importer par petites passes intentionnelles

Avant toute chose, rappelle cette règle à l'utilisateur dès le début :

```
Concrètement, ce qu'on te recommande, c'est d'importer par petites passes
thématiques, pas tout d'un coup.

Exemple de séquencement sain :
- Passe 1 : tes conversations ChatGPT
- Passe 2 : tes conversations Claude
- Passe 3 : tes notes Apple Notes
- Passe 4 : quelques PDFs importants
- Passe 5 : tes notes Notion sur un projet précis

Pourquoi ? Si tu balances des milliers de notes en une seule fois,
mon contexte se dilue, je perds en finesse, et tu valides à la fatigue
un plan auquel tu n'as pas eu le temps de réfléchir.

Une passe = une source ou un thème, ~100 items max. Sois intentionnel.
Cette commande est faite pour être relancée à chaque passe : tu vides
`_Import/`, tu mets la source suivante, tu relances `/import`.
```

Si l'utilisateur a déjà balancé un gros volume mélangé dans `_Import/`, propose de découper en plusieurs passes avant même de commencer.

---

## Étape 1 : Conversation d'alignement profond

Avant d'ouvrir le moindre fichier, capte le contexte humain. Pose ces questions, dans cet ordre :

```
Avant de toucher quoi que ce soit, raconte-moi avec tes mots :

1. Qu'est-ce qu'il y a dans `_Import/` pour cette passe ?
   Sois aussi précis que possible. Exemples de réponse riche :
   - "Mes notes Apple Notes depuis 2015. Ça concerne surtout
      les projets X et Y, plus pas mal de bordel perso."
   - "Mes 800 conversations ChatGPT exportées. Beaucoup de
      brainstormings sur mon offre actuelle et sur l'écriture
      de mon livre."
   - "Des PDFs : un audit comptable 2024, deux briefs clients,
      et des notes de lecture sur Atomic Habits."

2. Quel est ton objectif pour cette passe ?
   a) Ranger note par note dans projets / casquettes / ressources
   b) Surtout extraire l'info utile vers ton contexte (Moi.md,
      contexte de projet, casquette) et archiver le reste
   c) Faire le tri : ce qui sert vs ce qui ne sert plus (Bruce Lee)
   d) Un mélange (précise lequel)

3. Y a-t-il des choses que tu sais déjà devoir archiver direct ?
   (un projet terminé en 2020, une boîte que tu as quittée,
    un sujet sur lequel tu ne reviens jamais)

4. Quel projet ou casquette est central pour cette passe ?
   (ça me dit où regarder en priorité)

5. As-tu un budget tokens limité ? Si oui, je peux router le scan
   via une clé OpenRouter DeepSeek V4 Flash (~10x moins cher).
```

**Reformule** ce que tu as compris en 4 lignes max, et fais valider avant de continuer. Ce résumé est crucial : il va briefer chaque sous-agent à l'étape 5.

---

## Étape 2 : Préparation automatique de `_Import/`

Tout en arrière-plan, sans questionner l'utilisateur (sauf install ou erreur).

### 2.1 Conversion des formats lourds via MarkItDown

Détecte les formats à convertir :

```bash
find "_Import/" -type f \( -iname "*.pdf" -o -iname "*.docx" -o -iname "*.pptx" -o -iname "*.xlsx" \) 2>/dev/null
```

Si tu trouves des fichiers :

1. **Vérifie que markitdown est installé** : `command -v markitdown`
2. **Si non installé**, **installe-le toi-même** :
   - Détecte l'OS (`uname -s`) et ce qui est dispo (`python3`, `pip`, `uv`, `brew`).
   - Source officielle : `https://github.com/microsoft/markitdown` (consulte-la si tu hésites sur la méthode à jour).
   - Méthodes par ordre de préférence :
     - `uvx markitdown` (si `uv` dispo, le plus propre)
     - `pip install 'markitdown[all]'`
     - `pipx install 'markitdown[all]'`
   - **Demande confirmation avant** : « J'ai trouvé [N] PDF/Word/PPT à convertir. Je vais installer markitdown via [méthode]. OK ? »
   - Exécute, vérifie avec `markitdown --help`.
3. **Convertis chaque fichier** en `.md` à côté :
   ```bash
   markitdown "fichier.docx" > "fichier.md"
   ```
4. **Déplace les originaux** dans `_Import/_originaux/`.

### 2.2 Parsing des exports Claude / ChatGPT (cas spécial discret)

Détecte les JSON d'export :

```bash
find "_Import/" -maxdepth 2 -type f -name "*.json" 2>/dev/null
```

Pour chaque JSON :

1. **Détecte le format** en regardant la structure :
   - **Claude** : array d'objets avec `uuid`, `name`, `created_at`, `chat_messages[]`
   - **ChatGPT** : array d'objets avec `id`, `title`, `create_time`, `mapping{}`
2. **Pour les conversations**, garde en tête ces règles spécifiques :
   - Le titre d'une conversation Claude/ChatGPT est souvent généré automatiquement et peu parlant. Réécris-le à partir du contenu.
   - Le contenu utile est souvent **diffus dans le dialogue** : une conversation de 2h peut ne contenir que 3 idées qui méritent EXTRACT_CONTEXT. Ne route presque jamais une conversation entière en KEEP_NOTE sans la résumer ou en extraire.
   - Les conversations courtes (< 5 échanges) ne valent presque jamais d'être gardées : ARCHIVE par défaut.
3. **Parse et découpe** : crée **un fichier `.md` par conversation** dans `_Import/_chats/` :
   - Nom : `YYYY-MM-DD - [Titre court reformulé].md`
   - Contenu : frontmatter (`provider: claude|chatgpt`, `original_title:`, `date:`, `nb_messages:`), puis la conversation en `### Moi` / `### Claude` (ou `### ChatGPT`) alternés, contenu brut nettoyé.
4. **Déplace les JSON originaux** dans `_Import/_originaux/`.

À partir d'ici, les conversations sont des `.md` comme les autres : elles passent dans le même scan (étape 5) avec les mêmes 4 verdicts.

### 2.3 Rapport de préparation

Annonce :

```
Préparation terminée :
- [X] fichiers Markdown / texte / notes
- [Y] documents Office convertis (PDF, Word, PPT, Excel)
- [Z] conversations Claude / ChatGPT découpées en notes individuelles

Total à traiter dans cette passe : [X+Y+Z] items.
```

Si le total dépasse **150**, avertis :

```
Attention : [N] items, c'est beaucoup pour une seule passe.
Je te conseille de découper. Tu veux :
a) Continuer quand même
b) Que je te propose un découpage en plusieurs passes
   (par source, par projet, par date)
```

---

## Étape 3 : Scan initial par l'agent principal (LS de découverte)

Avant de déléguer aux sous-agents, **toi (agent principal) tu vas voir** ce qu'il y a réellement. Pas en détail, juste assez pour piloter.

1. **Liste complète** :
   ```bash
   ls -laR "_Import/" | head -200
   ```
   (exclus `_originaux/` et `_chats/` si déjà parcourus implicitement, garde-les pour le scan)

2. **Échantillonne** : lis le contenu de ~5 items représentatifs (1 note random, 1 conversation Claude, 1 conversation ChatGPT, 1 PDF converti, 1 export Notion) pour comprendre le **style** du corpus.

3. **Produis un mapping interne** :
   ```
   Découverte du corpus :
   - Types de fichiers : [liste]
   - Volume par type : [chiffres]
   - Style général : [ex : "beaucoup de brainstormings courts", "notes structurées avec h1/h2", "long-form essay drafts"]
   - Sujets dominants apparents : [tags récurrents]
   - Lien avec ce que l'utilisateur a annoncé en Étape 1 : [match / écart]
   ```

4. **Décide du découpage en lots** pour les sous-agents :
   - Notes courtes : ~50 items par lot
   - Conversations Claude/ChatGPT : ~10 items par lot
   - PDFs longs convertis : ~15 items par lot

---

## Étape 4 : Table de routage du vault

Pour pouvoir briefer les sous-agents, tu dois maîtriser le vault.

1. **Contexte perso :** `2 CASQUETTES/Sur ma vie/Moi.md`
2. **Phase active :**
   ```bash
   ls -d "2 CASQUETTES/Sur ma vie/Life Phases/"*/ | sort -V | tail -1
   ```
   Lis son `[N] Intention.md`.
3. **Projets actifs :** liste `1 PROJETS/`, lis chaque note de contexte (`[X]/[X].md`).
4. **Casquettes :** liste `2 CASQUETTES/`, lis chaque note de contexte.

**Produis un résumé compact** (interne) :

```
Contexte utilisateur :
- Prénom : [Prénom]
- Phase active : [Nom]. Focus : [résumé 1 ligne]

Projets actifs ([X]) :
- [Projet 1] : [1 ligne + état + mots-clés associés]
- ...

Casquettes ([Y]) :
- [Casquette 1] : [1 ligne + mots-clés associés]
- ...
```

Note bien les **mots-clés** : ce sont eux qui aident les sous-agents à matcher une note à un projet/casquette.

---

## Étape 5 : Délégation à des sous-agents briefés

Pour chaque lot défini en étape 3, lance **un sous-agent** via `Agent` (en parallèle : un seul message avec plusieurs appels).

### Brief complet à passer à chaque sous-agent

```
Tu reçois un batch d'items à classer pour un import dans un vault
Obsidian IPCRA.

CONTEXTE DU VAULT (où classer)
[Colle ici le résumé de l'Étape 4 : phase, projets avec mots-clés,
casquettes avec mots-clés]

INTENTION DE L'UTILISATEUR (capté à l'Étape 1)
[Colle ici le résumé reformulé et validé à l'Étape 1]

DÉCOUVERTE DU CORPUS (style général)
[Colle ici le mapping interne de l'Étape 3]

TON JOB
Pour chaque item du lot, produis un objet JSON avec :

- `source` : chemin relatif depuis la racine du vault
- `title` : titre (réécris si peu parlant)
- `summary` : 1-2 phrases sur ce que contient l'item
- `created_hint` : date probable ou « inconnu »
- `verdict` : un de
  - `KEEP_NOTE` : garder tel quel comme note dans projet / casquette / ressources
  - `EXTRACT_CONTEXT` : extraire l'info utile vers Moi.md / contexte de projet / casquette, archiver l'original
  - `SUMMARIZE` : à regrouper dans une note de synthèse avec d'autres items du même groupe
  - `ARCHIVE` : obsolète, Bruce Lee discard
- `verdict_reason` : 1 ligne pour justifier
- `destination` :
  - `1 PROJETS/[Projet]/`
  - `2 CASQUETTES/[Casquette]/`
  - `3 RESSOURCES/`
  - `5 ARCHIVE/`
  - `0 INBOX/` (uniquement si vraiment impossible à router, < 5%)
- `context_patch` : si verdict = `EXTRACT_CONTEXT`, le patch texte à ajouter
- `summarize_group` : si verdict = `SUMMARIZE`, un slug commun pour regrouper
- `rename_suggestion` : nom de fichier propre (ou null)
- `confidence` : high / medium / low
- `notes` : doublon, sensible, à fusionner, etc.

RÈGLES DE ROUTAGE
- Préfère rattacher à un projet/casquette existant plutôt que créer un nouveau dossier.
- Si une note semble vouloir une nouvelle casquette : note-le dans `notes` et route en `0 INBOX/`.
- `0 INBOX/` est une exception (< 5%).
- Quand l'info d'une note est plus utile dans le contexte d'un projet que comme note autonome → `EXTRACT_CONTEXT`.
- Pour les conversations Claude/ChatGPT : `EXTRACT_CONTEXT` ou `SUMMARIZE` sont presque toujours mieux que `KEEP_NOTE`. La valeur est dans les idées, pas dans le verbatim.

ITEMS À ANALYSER
[Liste des chemins du lot]

Retourne un tableau JSON strict.
```

> Si l'utilisateur a fourni une clé OpenRouter (Étape 1), route ces sous-agents vers DeepSeek V4 Flash via OpenRouter. Annonce-le.

### Récupération

Chaque sous-agent rend un **rapport JSON**. Agrège tous les rapports en une seule liste pour l'étape 6.

---

## Étape 6 : Agent principal expose le plan complet (PLAN MODE)

À ce stade : **aucune écriture, juste un plan**. Format détaillé groupé par verdict puis par destination.

```
## Plan de routing : [X] items analysés (passe : [thème de la passe])

### Vue d'ensemble
- KEEP_NOTE       : [X]
- EXTRACT_CONTEXT : [Y]
- SUMMARIZE       : [Z]  (en [N] groupes)
- ARCHIVE         : [W]

---

### KEEP_NOTE → 1 PROJETS/[Projet 1] ([N])
| Source | → Destination | Confidence | Raison |
|---|---|---|---|

### KEEP_NOTE → 2 CASQUETTES/[Casquette] ([N])
[idem]

### KEEP_NOTE → 3 RESSOURCES/ ([N])
[idem]

### EXTRACT_CONTEXT ([N])
| Source | → Note cible enrichie | Patch (extrait) |
|---|---|---|
| `xxx.md` | `2 CASQUETTES/Sur ma vie/Moi.md` | "+ J'ai lancé X en 2019..." |

### SUMMARIZE ([N] items dans [G] groupes)
- Groupe "chats-projet-X" : [N] items → 1 note de synthèse dans `1 PROJETS/Projet X/`

### ARCHIVE ([N])
> Bruce Lee : ne servent plus.
| Source | Raison |

### → 0 INBOX/ ([N]) : décisions humaines
| Source | Pourquoi je n'ai pas tranché |

### Alertes
- Doublons potentiels :
- Candidats nouvelle casquette :
- Écarts entre le corpus et l'intention initiale :

---

Tu veux :
a) Exécuter tel quel (passer en BUILD MODE)
b) Ajuster certains verdicts ou routages
c) Voir le contenu d'une ou plusieurs notes avant de décider
```

---

## Étape 7 : Ajustements

- **Option b** : l'utilisateur dit « change le verdict de X » ou « route Y vers Z ». Modifie la liste en mémoire.
- **Option c** : affiche le contenu brut, repropose ajusté.

Boucle jusqu'à validation (option a).

---

## Étape 8 : Exécution (BUILD MODE)

Annonce : « Passage en BUILD MODE. J'exécute par lots de 15. »

Pour chaque lot :

1. **KEEP_NOTE** : déplace (renomme si `rename_suggestion`) vers la destination.
2. **EXTRACT_CONTEXT** : applique le `context_patch` à la note cible en append sous `## Import du YYYY-MM-DD`. Déplace l'original vers `5 ARCHIVE/_extraits/`.
3. **SUMMARIZE** : pour chaque `summarize_group`, crée une note de synthèse (8-15 lignes denses) à la destination. Déplace les sources vers `5 ARCHIVE/_resumes-sources/`.
4. **ARCHIVE** : déplace vers `5 ARCHIVE/_import-YYYY-MM-DD/`.

Demande confirmation avant de créer un nouveau dossier projet/casquette.

Après chaque lot :

```
Lot [N]/[Total] traité : [X] KEEP_NOTE, [Y] EXTRACT_CONTEXT, [Z] SUMMARIZE, [W] ARCHIVE.
On continue ? (oui / pause / stop)
```

Nettoie les dossiers vides dans `_Import/` à la fin (sauf `_originaux/` que tu laisses en place pour traçabilité).

---

## Étape 9 : Récap final + feedback loop

```
Import terminé pour cette passe.

Résumé :
- KEEP_NOTE       : [X]  → projets / casquettes / ressources
- EXTRACT_CONTEXT : [Y]  → Moi.md, projets, casquettes enrichis
- SUMMARIZE       : [Z]  → [G] notes de synthèse créées
- ARCHIVE         : [W]  → 5 ARCHIVE/

Coût estimé : [X] tokens (~[Y] €).

Avant de fermer, deux questions :

1. Est-ce que ce qui s'est passé t'a convenu ?
2. Qu'est-ce que j'aurais pu faire mieux ?
   (poser plus / moins de questions au départ, mieux deviner les verdicts,
    regrouper différemment, mieux briefer les sous-agents...)

Si tu vois un axe d'amélioration concret, je peux éditer mon propre
SKILL.md. Je te montre le diff avant.
```

Si feedback exploitable :

1. Reformule l'amélioration en 1 phrase.
2. Propose le diff précis (avant / après) du SKILL.md.
3. Applique seulement si validé.

Lance ensuite `/done` pour logger la session dans la daily note.

Rappelle :

```
`_Import/` est vide (sauf `_originaux/`). Pour la prochaine passe,
redépose une nouvelle source et relance `/import`. Une passe = une
source ou un thème, ~100 items max. Sois intentionnel.
```

---

## Principes

**1. Passes intentionnelles, pas tout en bloc.** Une source ou un thème à la fois, ~100 items max. Tu rappelles ce principe au début et à la fin.

**2. Alignement profond avant action.** L'Étape 1 capte le contexte humain. Sans ça, le scan est aveugle.

**3. 4 verdicts, pas 1.** `KEEP_NOTE` / `EXTRACT_CONTEXT` / `SUMMARIZE` / `ARCHIVE`.

**4. Préparation auto, pas demande manuelle.** Markitdown installé par toi si manquant. Chats Claude/ChatGPT parsés en notes individuelles avec règles spécifiques (Étape 2.2).

**5. L'agent principal voit, puis délègue avec brief.** Étape 3 = LS et échantillonnage par toi. Étape 4 = table de routage. Étape 5 = sous-agents briefés avec contexte + intention + corpus + mots-clés des projets/casquettes.

**6. Plan mode → Build mode, clairement séparés.** Aucune écriture avant validation.

**7. Parallélisation systématique.** Plus de 50 items courts = sous-agents en parallèle. 10/lot pour conversations longues.

**8. La commande apprend.** Étape 9 = feedback loop avec edit possible de ce fichier.

**9. Optimisation coût.** Pour les gros volumes, proposer OpenRouter DeepSeek V4 Flash pour les sous-agents. Le routing ne demande pas un gros modèle.

**10. `0 INBOX/` est une exception.** Si un sous-agent y route > 10%, c'est qu'il manque de contexte : affiner la table de routage et le brief.
