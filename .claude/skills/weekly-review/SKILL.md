---
name: weekly-review
description: Weekly review : bilan de la semaine écoulée, carry-forward des tâches non complétées, intentions transverses, et répartition de la semaine suivante jour par jour.
---

# Weekly Review

Bilan de la semaine, carry-forward des tâches non complétées, intentions transverses, et planification de la semaine suivante répartie par jour. Pas d'organisation par type d'énergie : on reste sur une vue jour par jour, plus simple à tenir.

## Process

### Étape 1 : Lire le contexte
Lis `2 CASQUETTES/Sur ma vie/Moi.md` pour comprendre l'utilisateur. Lis aussi les daily notes de la semaine dans la phase active pour avoir le contexte des sessions récentes.

### Étape 2 : Détecter la phase active et la semaine
```bash
PHASE_DIR=$(ls -d "2 CASQUETTES/Sur ma vie/Life Phases/"*/ 2>/dev/null | sort -V | tail -1)
PHASE_NAME=$(basename "$PHASE_DIR")
CURRENT_WEEK=$(date +%Y-W%V)
PREV_WEEK=$(date -v-7d +%Y-W%V 2>/dev/null || date -d "7 days ago" +%Y-W%V)
echo "Phase: $PHASE_NAME | Semaine: $CURRENT_WEEK | Précédente: $PREV_WEEK"
```

### Étape 3 : Carry-forward des tâches non complétées
Lire la weekly note précédente (`$PREV_WEEK.md`) dans la phase active. Extraire toutes les lignes `- [ ]` (tâches non complétées). Les garder pour ré-injection dans la nouvelle note. Si la note précédente n'existe pas, passer cette étape.

### Étape 4 : Scanner l'activité de la semaine
```bash
find . -type f -name "*.md" -mtime -7 2>/dev/null | grep -v ".git" | head -50
```
Scanner en particulier les dossiers `1 PROJETS/`, `2 CASQUETTES/`, `0 INBOX/`. Présenter un résumé rapide de ce qui a bougé cette semaine. Repérer au passage les tâches ouvertes ou évoquées dans les fichiers modifiés.

### Étape 5 : Brain dump
Poser la question :
> Comment s'est passée ta semaine ? Qu'est-ce qui a avancé, qu'est-ce qui a bloqué, qu'est-ce qui a émergé ?

Attendre la réponse libre (l'utilisateur peut parler avec SuperWhisper). Extraire les éléments clés : avancées, blocages, émergences, et les nouvelles tâches qui en découlent.

### Étape 6 : Intentions transverses
Demander :
> Quelles sont tes 2-3 intentions transverses pour la semaine ? (les fils rouges qui traversent la semaine, pas liés à un jour précis)

Ces intentions vont en haut de la note, dans la section "Transverse / Intentions".

### Étape 7 : Répartir les tâches par jour
Répartir TOUTES les tâches sur les jours de la semaine (Lundi à Dimanche) : les tâches carry-forward (étape 3), les nouvelles issues du brain dump (étape 5), et les tâches repérées dans les fichiers modifiés (étape 4).

Pour chaque jour :
- Lister les tâches en `- [ ]`.
- Grouper par projet avec un sous-titre `### [[Projet]]` quand plusieurs tâches d'un même projet se suivent, sinon lister directement.
- Une tâche peut apparaître sur plusieurs jours si elle s'étale (par exemple "Avancer sur [[Projet X]]" du mardi au jeudi).

Présenter la répartition proposée et attendre la validation ou les corrections de l'utilisateur avant de générer la note.

### Étape 8 : Générer la weekly note
Créer `YYYY-WXX.md` dans la phase active avec ce format :

```markdown
---
type: weekly
week: YYYY-WXX
phase: "[Phase name]"
---
# YYYY-WXX (DD-DD mon)

## Transverse / Intentions
- [Intention 1]
- [Intention 2]

## Lundi
### [[Projet]]
- [ ] Tâche

## Mardi
- [ ] Tâche

## Mercredi
- [ ] Tâche

## Jeudi
- [ ] Tâche

## Vendredi
- [ ] Tâche

## Samedi
- [ ] Tâche

## Dimanche
- [ ] Tâche
```

Les intentions transverses viennent de l'étape 6. La répartition par jour vient de l'étape 7 validée. Le brain dump (étape 5) sert à extraire tâches et intentions, il n'est pas recopié tel quel dans la note.

### Étape 9 : Confirmation
Afficher un résumé : nombre de tâches carry-forward, intentions transverses retenues, nombre de tâches par jour, et les tâches prioritaires de la semaine.

## Output Style
- En français
- Concis, pas de blabla
- Interactif (attendre les réponses)
- Pas d'emojis
- Pas d'em-dash
