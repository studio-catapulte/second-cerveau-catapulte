---
name: create-skill
description: Capturer en profondeur la méthode personnelle de l'utilisateur sur un process et en produire un skill exécutable (+ optionnellement une fiche process lisible). Extraction guidée input → étapes avec méthode → exemples bons/mauvais → références. Peut enrichir avec de la recherche externe (Firecrawl) quand une méthode publique est citée. Usage : documenter une façon de faire personnelle pour que l'IA puisse la reproduire fidèlement.
---

# Create Skill : Capturer une méthode et l'ingraîner

Tu captures la méthode EXACTE de l'utilisateur pour un process donné, puis tu en produis un skill IA-exécutable (et optionnellement une fiche process lisible). L'objectif : que le skill reflète **authentiquement** la façon de faire de l'utilisateur, pas une méthode générique trouvée sur internet.

## Principe fondateur

Ce qui rend un skill utile, c'est la **méthode embarquée**. Un skill qui dit « écris un bon article » est inutile. Un skill qui dit :

> « Écris un article en 3 actes AIDA, avec un hook empirique dans les 2 premières phrases, jamais plus de 2 paragraphes par section, et voici 3 exemples de bons hooks que j'ai écrits »

…est puissant.

Donc le cœur de ce skill, c'est l'extraction de la méthode :
- **Input** : ce qu'on reçoit en entrée
- **Étapes** : une par une, avec **la méthode sur chaque étape** (comment faire, avec quels critères)
- **Conseils** : les tips, les pièges, les règles
- **Exemples** : 1-3 bons exemples + 1-3 mauvais + **pourquoi**
- **Références** : liens vers les méthodes publiques (frameworks) qui ont inspiré + liens vers d'autres fiches du vault

Un skill sans exemples concrets et sans méthode explicite = skill à jeter.

## Processus

### Étape 1 : Scope du process

```
On va capturer ta méthode pour un process. Dis-moi :

1. **Nom** : ex : « Écrire un post LinkedIn », « Briefer un prestataire », « Faire mon inbox zero »
2. **Déclencheur** : quand tu le fais ? (quotidien / à la demande / manuel / sur trigger)
3. **Input** : qu'est-ce que tu as en entrée ?
4. **Output** : qu'est-ce que tu produis en sortie ?
5. **Temps actuel** : combien ça te prend aujourd'hui ?
6. **Douleur principale** : qu'est-ce qui te casse les pieds dedans ?
7. **Casquette(s) / projet(s) concerné(s)** : pour lier via wikilinks
```

### Étape 2 : Étapes détaillées (le cœur du skill)

Pour **chaque étape**, pose ces questions précises et attends la réponse avant de passer à la suivante :

```
Étape [N] : [Nom donné par l'utilisateur]

- **Quoi** : qu'est-ce que tu fais concrètement ?
- **Méthode** : comment tu le fais BIEN ? Quels critères, quels principes ? (c'est le cœur : creuse)
- **Outils** : avec quoi ? (logiciel, template, doc de référence)
- **Piège** : qu'est-ce qui peut mal tourner ici ?
- **Temps** : combien de temps ça prend ?
```

Boucle tant que le process n'est pas complètement décrit. Nombre idéal : **3 à 7 étapes**. Si plus, propose de regrouper. Si moins de 3, creuse davantage (il y a probablement des implicites à faire surgir).

**Règle d'or** : si l'utilisateur répond vaguement sur la méthode (ex : « je fais de mon mieux »), reformule avec un exemple : « Imagine que tu formes quelqu'un ce soir. Qu'est-ce que tu lui dirais de faire là, concrètement ? »

### Étape 3 : Exemples concrets (indispensable)

```
Donne-moi des exemples précis de ton travail :

- **1 à 3 bons exemples** : une sortie que tu trouves excellente. Pour chacun : pourquoi c'est bon ?
- **1 à 2 mauvais exemples** : une sortie médiocre ou ratée. Pour chacun : pourquoi c'est raté ?

Si tu n'as pas d'exemples sous la main : on cherche dans tes notes existantes, ou tu m'en montres la prochaine fois et on enrichit le skill.
```

**Stocker ces exemples VERBATIM** dans le skill (copie exacte du texte, pas de reformulation). C'est ce qui permet à l'IA d'apprendre le goût de l'utilisateur.

### Étape 4 : Références externes (optionnel, avec Firecrawl si disponible)

```
Tu t'inspires d'une méthode connue ? (AIDA, GTD, 5 Whys, un copywriter, un livre, un framework…)

- Si oui → je fais une recherche rapide pour extraire les points clés et les embarquer dans ta fiche, avec la source.
- Si non → on skip, ta méthode à toi suffit.
```

Si l'utilisateur cite une méthode et que Firecrawl (`mcp__firecrawl-mcp__firecrawl_search` + `mcp__firecrawl-mcp__firecrawl_scrape`) est disponible :

1. Recherche la méthode (3-5 résultats)
2. Scrape les 1-2 sources les plus autoritaires
3. Extrais 3-5 points clés à embarquer dans le skill
4. **Cite la source** (URL)

Si Firecrawl indisponible : demande à l'utilisateur s'il veut coller un résumé de la méthode.

### Étape 5 : Décider des artefacts

```
On a collecté ta méthode. Qu'est-ce qu'on produit ?

- **Skill seul** : fichier `Second Cerveau/4 TOOLS/skills/[nom]/SKILL.md`. L'IA peut l'exécuter avec /[nom]
- **Fiche seule** : `Second Cerveau/4 TOOLS/Process/Process - [Nom].md`. Référence humaine lisible, pas d'exécution IA

Lequel ?
```

**Guide de décision :**
- Si le process implique du jugement reproductible par l'IA via tes exemples : **skill**
- Si c'est purement humain (présence physique, conversation 1-1, jugement non-textuel) : **fiche seule**

### Étape 6 : Validation du nom skill

Valide le nom contre la regex OpenCode + Claude Code : `^[a-z0-9]+(-[a-z0-9]+)*$`, 1-64 caractères, pas de `--` consécutifs, pas de `-` au début ou à la fin.

Si le nom proposé est invalide, propose une version corrigée (ex : « Post LinkedIn » → `post-linkedin`).

### Étape 7 : Génération

#### Si skill

Crée `Second Cerveau/4 TOOLS/skills/[nom]/SKILL.md` avec ce squelette (adapté à la méthode capturée) :

```markdown
---
name: [nom]
description: [1-1024 chars. Spécifique, pour que l'agent sache QUAND déclencher. Inclus input attendu + output produit + cas d'usage typique.]
---

# [Titre lisible]

[1 phrase : ce que fait le skill et dans quel contexte l'utiliser.]

## Input
[Ce que l'agent reçoit ou doit demander : arguments, fichiers, contexte]

## Output
[Ce que l'agent produit]

## Processus

### Étape 1 : [Nom donné par l'utilisateur]

**Méthode :** [Comment faire bien : critères, principes de l'utilisateur, verbatim si possible]
**Outils :** [...]
**Piège :** [Qu'éviter, en particulier]

[Instructions d'exécution précises : quoi faire, dans quel ordre, avec quelles validations intermédiaires]

### Étape 2 : ...

## Exemples

### Bons exemples
1. **[Titre]** : [Exemple intégralement cité, verbatim]
   > Pourquoi c'est bon : [...]

2. ...

### Mauvais exemples
1. **[Titre]** : [Exemple verbatim]
   > Pourquoi c'est raté : [...]

## Références
- [[Process - Nom]] : fiche process associée dans `Second Cerveau/4 TOOLS/Process/`
- [Méthode publique X] : [URL]. Points clés : [...]

## Règles
- [Règle explicite 1]
- [Règle 2]

## Ce que tu ne fais PAS
- [Anti-pattern 1]
- [Anti-pattern 2]
```

#### Si fiche

Crée `Second Cerveau/4 TOOLS/Process/Process - [Nom].md` :

```markdown
# Process : [Nom]

**Fréquence :** [Daily/Weekly/Monthly/Trigger/Manuel]
**Déclencheur :** [...]
**Temps actuel :** [...]
**Casquettes / projets :** [[Casquette A]], [[Projet B]]
**Skill lié :** [[SKILL - nom]] (si applicable)

---

## Input
[...]

## Étapes

### Étape 1 : [Nom]
- **Quoi :** [...]
- **Méthode :** [...]
- **Outils :** [...]
- **Piège :** [...]

### Étape 2 : ...

## Output
[...]

## Exemples

### Bons exemples
1. [Exemple verbatim] : Pourquoi c'est bon : [...]

### Mauvais exemples
1. [Exemple verbatim] : Pourquoi c'est raté : [...]

## Références
- [Méthode publique] : [URL + points clés]
- [[Autre process lié]]

## Douleur principale
[...]

## Intégration IA

| Étape | Levier | Solution | Statut |
|-------|--------|----------|--------|
| 1 | Auto / Agent / Humain | [skill `/xxx` ou workflow n8n] | 🟢🟡🔴 |
| 2 | ... | ... | ... |

**Prochaine action :** [skill à créer, automatisation à construire, rien]
```

#### Si les deux

Génère les deux. Ajoute les wikilinks croisés :
- Dans le skill : section « Références » → `[[Process - Nom]]`
- Dans la fiche : champ `Skill lié:` → `[[SKILL - nom]]`

### Étape 8 : Mise à jour de la cartographie

Si `Second Cerveau/4 TOOLS/Process/Cartographie des process.md` existe, ajoute le nouveau process dans la bonne section (Daily / Weekly / Monthly / Trigger / Manuel).

Si la cartographie n'existe pas, propose à l'utilisateur de la créer via `/map-process`.

### Étape 9 : Test immédiat

Si un skill a été créé :

```
Skill `/[nom]` créé.

On le teste maintenant sur un cas réel ?
```

Si l'utilisateur accepte, lance une exécution test avec un input qu'il te donne, puis demande s'il faut ajuster le skill (ajouter un exemple, préciser une étape, enlever une règle trop rigide).

## Règles

- **Méthode avant tout** : un skill sans méthode embarquée explicite (Étape 2) est à refuser. Ne JAMAIS générer de skill générique.
- **Exemples verbatim** : reproduis les exemples donnés par l'utilisateur mot pour mot (pas de reformulation, même si c'est imparfait). Ils encapsulent son goût.
- **Firecrawl pour enrichir, pas remplacer** : les méthodes publiques complètent la méthode de l'utilisateur, elles ne la substituent jamais.
- **Valide le nom skill** avec la regex avant toute création.
- **Frontmatter skill** : uniquement `name`, `description` (requis), + `license`, `compatibility`, `metadata` (optionnels). Pas `allowed-tools`, pas d'autres champs.
- **Toujours demander validation** avant de créer des fichiers.
- **Toujours lier fiche ↔ skill** quand les deux existent, via wikilinks croisés.

## Ce que tu ne fais PAS

- Créer un skill sans exemples concrets (Étape 3 obligatoire)
- Générer un skill « bonnes pratiques internet » sans la méthode de l'utilisateur
- Créer dans `.opencode/commands/` ou `.claude/commands/` (formats obsolètes)
- Oublier les wikilinks croisés fiche ↔ skill
- Lancer Firecrawl de toi-même : seulement si l'utilisateur cite explicitement une méthode externe
- Écrire la frontmatter avec `allowed-tools` (non reconnu pour les skills, sera ignoré)
- Sauter l'Étape 2 (capture méthode) même si l'utilisateur est pressé : sans méthode, le skill est inutile
