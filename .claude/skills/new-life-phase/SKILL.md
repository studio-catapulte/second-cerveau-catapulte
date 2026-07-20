---
name: new-life-phase
description: Clôturer la phase actuelle et en ouvrir une nouvelle
---

# Nouvelle Phase de Vie

Transition vers une nouvelle phase de vie avec bilan de la précédente.

## Argument

$ARGUMENTS = Nom de la nouvelle phase (ex: "Lancement business", "Transition", "Focus créatif")

## Process

### Étape 1 : Identifier la phase actuelle

Scanne le dossier `2 CASQUETTES/Sur ma vie/Life Phases/` pour trouver la phase avec le numéro le plus élevé.

Structure attendue :
```
2 CASQUETTES/Sur ma vie/Life Phases/
├── Life Phases.md
└── 1 Phase initiale/
    └── 1 Intention.md
```

### Étape 2 : Créer le bilan de la phase actuelle

**Lis l'intention de la phase actuelle** pour comprendre les objectifs initiaux.

**Pose des questions pour le bilan :**

```
Avant de passer à la nouvelle phase, faisons le bilan de "[Nom phase actuelle]".

1. Comment résumerais-tu cette phase en quelques phrases ?
2. Quelles leçons as-tu apprises ?
3. Quels ont été tes moments préférés ?
4. Où en es-tu sur tes objectifs ?
   - [Objectif 1 de l'intention] : ?
   - [Objectif 2 de l'intention] : ?
5. Qu'aimerais-tu améliorer pour la prochaine phase ?
```

**Crée le fichier bilan** `[N] Bilan.md` dans le dossier de la phase actuelle avec le template `4 TOOLS/Templates/Bilan Phase de vie.md`.

**Marque l'intention comme terminée :** Change `status: "active"` en `status: "completed"`.

### Étape 3 : Créer la nouvelle phase

**Calcule le nouveau numéro :** numéro actuel + 1

**Crée le dossier :** `2 CASQUETTES/Sur ma vie/Life Phases/[N] [Nom]/`

**Pose des questions pour l'intention :**

```
Maintenant, définissons ton intention pour "[Nom nouvelle phase]".

1. Quelle est ton intention principale pour cette phase ?
2. Décris ta journée idéale pendant cette période.
3. Quels sont tes 3 objectifs principaux ?
4. Que fais-tu quand tu es surchargé ? dispersé ? fatigué ? dans le flow ?
```

**Crée le fichier intention** `[N] Intention.md` avec le template `4 TOOLS/Templates/Phase de vie.md`.

### Étape 4 : Mettre à jour Life Phases.md

Ajoute la nouvelle phase dans le tableau de `2 CASQUETTES/Sur ma vie/Life Phases/Life Phases.md` et mets à jour la section "Phase actuelle".

### Étape 5 : Mettre à jour les plugins Obsidian

**daily-notes.json** - Change le folder :
```json
{
  "folder": "2 CASQUETTES/Sur ma vie/Life Phases/[N] [Nom]",
  "template": "4 TOOLS/Templates/Daily Note.md",
  "autorun": false
}
```

**plugins/calendar/data.json** - Change le weeklyNoteFolder :
```json
{
  ...
  "weeklyNoteFolder": "2 CASQUETTES/Sur ma vie/Life Phases/[N] [Nom]",
  ...
}
```

### Étape 6 : Confirmation

```
Phase [N-1] "[Ancien nom]" clôturée.
Phase [N] "[Nouveau nom]" créée.

Fichiers créés/modifiés :
- 2 CASQUETTES/Sur ma vie/Life Phases/[N-1] .../[N-1] Bilan.md
- 2 CASQUETTES/Sur ma vie/Life Phases/[N-1] .../[N-1] Intention.md (status: completed)
- 2 CASQUETTES/Sur ma vie/Life Phases/[N] .../[N] Intention.md
- 2 CASQUETTES/Sur ma vie/Life Phases/Life Phases.md
- .obsidian/daily-notes.json
- .obsidian/plugins/calendar/data.json

⚠️ Redémarre Obsidian pour que les changements prennent effet.
```

## Notes

- Toujours demander confirmation avant de créer les fichiers
- Le bilan peut être fait de manière interactive ou complété plus tard
- Si c'est la première phase, pas de bilan à faire
