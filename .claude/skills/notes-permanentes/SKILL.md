---
name: notes-permanentes
description: Transformer des sources (highlights, podcasts, livres) en notes atomiques permanentes (Zettelkasten), reformulées et connectées au vault.
---

# Session Notes Permanentes

Tu guides l'utilisateur dans une session de création de notes permanentes (Zettelkasten) à partir de ses sources : highlights Readwise, podcasts déconstruits, livres, articles, ou toute autre note du vault.

Une note permanente = un concept autonome, reformulé dans les mots de l'utilisateur, connecté au reste du vault.

Toutes les notes permanentes vivent dans le **Garden** : `6 GARDEN/Notes/`. Les MOCs (cartes de contenu) aussi.

## Avant de commencer

1. Lis le contexte de l'utilisateur (`2 CASQUETTES/Sur ma vie/Moi.md`)
2. Si un dossier `6 GARDEN/Notes/` existe, scanne les notes et MOC pour connaître les thèmes documentés
3. Si un dossier `3 RESSOURCES/Readwise/` existe, note les sources disponibles

## Étape 1 : Choisir la source

Demande à l'utilisateur :

```
Session Notes Permanentes

Comment tu veux procéder ?
a) Je scanne tes sources récentes (Readwise, podcasts, livres) et te propose les meilleurs concepts à extraire
b) Tu me donnes une source spécifique à traiter (note, livre, podcast, article)
c) On complète les notes en brouillon (stubs/drafts) existantes dans le Zettelkasten
```

## Étape 2 : Identifier les concepts

### Si option a) : Sources récentes
1. Scanne les fichiers récents dans `3 RESSOURCES/` (Readwise, Podcasts, Livres)
2. Identifie les passages riches en concepts (pas les simples citations)
3. Propose 3-5 concepts extractibles, avec pour chacun :
   - Le concept en une phrase
   - La source
   - Un lien potentiel avec une note existante

### Si option b) : Source spécifique
1. Lis la source demandée
2. Identifie TOUS les concepts extractibles
3. Propose-les groupés par thème

### Si option c) : Compléter l'existant
1. Lis les stubs et drafts du Zettelkasten
2. Cherche dans les sources des highlights pertinents pour les compléter
3. Propose du contenu pour chaque note incomplète

**→ Attendre validation de l'utilisateur avant de créer.**

## Étape 3 : Créer les notes permanentes

Pour chaque concept validé par l'utilisateur :

### 3.1 : Créer la note

Emplacement : `6 GARDEN/Notes/`

```markdown
---
type: permanent
status: complete
source: [[Nom de la source]]
MOC: [[MOC pertinente]]
created: [date]
---

# [Titre du concept]

[Le concept reformulé dans les mots de l'utilisateur - 5-10 lignes, autonome et compréhensible sans contexte]

---

## References

> [Citation originale ou passage clé de la source]
- *[Source]*

## Liens

- [[Note existante 1]] - [type de relation : renforce, nuance, contredit, complète]
- [[Note existante 2]] - [type de relation]

## Notes connexes

- [Suggestion de connexion avec d'autres thèmes du vault]
```

### 3.2 : Mettre à jour la MOC

Si une MOC pertinente existe dans `6 GARDEN/Notes/MOC/`, ajouter la nouvelle note.
Si aucune MOC ne correspond, proposer d'en créer une.

### 3.3 : Proposer des connexions

Scanner le Zettelkasten et le vault pour des notes liées :
- Types de relation : renforce, nuance, contredit, complète, applique
- Ne forcer aucune connexion : seulement les liens réels

## Étape 4 : Résumé de session

```
Session terminée !

**Notes créées :** [X]
**Notes complétées :** [X]
**MOC mises à jour :** [liste]

Veux-tu :
a) Continuer avec d'autres concepts de la même source ?
b) Traiter une autre source ?
c) C'est bon pour maintenant ?
```

## Règles

- **Une note = un concept** (atomicité) : si une note couvre 2 idées, la découper
- **Max 1 écran** par note (~200-500 mots)
- **Toujours reformuler** dans les mots de l'utilisateur, jamais copier-coller le highlight brut
- **Toujours lier** à au moins une MOC et proposer des connexions
- **Demander validation** avant de créer chaque note (montrer le contenu proposé)
- **Style de l'utilisateur** : lire `Moi.md` et le référentiel style s'il existe
- Les notes vont dans `6 GARDEN/Notes/`, les MOC dans `6 GARDEN/Notes/MOC/`
