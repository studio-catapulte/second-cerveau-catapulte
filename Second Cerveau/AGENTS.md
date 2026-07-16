# Ontologie de stockage

## Structure (méthode IPCRA)

```
0 INBOX/        # Capture rapide, traitement en attente
1 PROJETS/      # Projets actifs (1 dossier par projet, avec note de contexte)
2 CASQUETTES/   # Responsabilités ongoing (1 dossier par casquette)
│   └── Sur ma vie/
│       ├── Moi.md              # Qui il est, style, valeurs
│       ├── Mon Parcours.md     # Historique chronologique
│       └── Life Phases/        # Phases de vie (intentions, daily, weekly)
3 RESSOURCES/   # Références, inspirations (brut, raw)
4 TOOLS/        # Templates, scripts, process documentés, skills
│   └── skills/  # Tous les skills disponibles
5 ARCHIVE/      # Terminé ou inactif
6 GARDEN/       # Notes permanentes (Zettelkasten) : concepts atomiques et MOCs
│   └── Notes/   # Notes permanentes + MOCs (cartes de contenu)
_Import/        # Notes à reclasser
```

`6 GARDEN/` est la couche durable : pensée distillée, reformulée, densément connectée. Différent de `3 RESSOURCES/` qui contient le brut (articles sauvegardés, highlights, transcripts).

Chaque projet et casquette est un dossier avec une note de contexte principale plus des notes liées.

IMPORTANT : Quand je te parle d'un projet, lis toujours la note de contexte du projet ou de la casquette concernée (avec le même nom que le dossier projet)

## Life Phases

Ses phases de vie sont dans `2 CASQUETTES/Sur ma vie/Life Phases/`. Toujours détecter la phase active via le système (jamais hardcoder le numéro) :

```bash
ls -d "2 CASQUETTES/Sur ma vie/Life Phases/"*/ | sort -V | tail -1
```

Structure d'une phase :

```
N Nom de la phase/
├── N Intention.md      # status: active
├── N Bilan.md          # rempli quand la phase se termine
├── YYYY-MM-DD.md       # daily notes (logs de session IA)
└── YYYY-WXX.md         # weekly notes (planification)
```

Règles :
- Tout le journaling va dans la phase active
- Une seule phase active à la fois
- Liens et idées : daily note + routage vers le projet ou la casquette concernée
- Tâches et todos : weekly note active
- S'il parle d'un changement de cap : proposer `/new-life-phase`
