---
name: done
description: Fin de session : extraction, logs, mise à jour des contextes
---

# Fin de Session

Clôture la session en extrayant les informations importantes et en mettant à jour le vault selon le flux de ruissellement.

## Process

### Étape 1 : Analyse de la conversation

Relis la conversation de cette session et extrais les **5 types d'information** :

1. **Décisions** : choix actés qui affectent les process ou l'organisation
   - Ex : "On part sur NocoDB pour le CRM", "J'arrête ce projet"
2. **Préférences** : feedback utilisateur sur le comportement de l'agent
   - Ex : "Sois plus direct", "Ne me demande pas de valider chaque fois"
3. **Faits** : informations factuelles nouvelles
   - Ex : "Nouveau client signé", "Le prix a changé", "Il a 30 personnes dans son équipe"
4. **Contradictions** : incohérences entre ce qui est documenté dans le vault et ce qui a été dit
   - Ex : La note de projet dit "deadline mars" mais on a parlé de "deadline juin"
5. **Ressources** : liens, références, outils, concepts mentionnés à documenter

Identifie aussi :
- **Fichiers créés ou modifiés** pendant la session
- **Todos complétés** (tâches qu'on a terminées et qui sont cochables quelque part)
- **Prochaines étapes** identifiées mais pas encore réalisées

### Étape 2 : Détecter la phase active

```bash
ls -d "Second Cerveau/2 CASQUETTES/Sur ma vie/Life Phases/"*/ | sort -V | tail -1
```

### Étape 3 : Log dans la daily note (NIVEAU 2, OBLIGATOIRE)

Trouve ou crée la daily note du jour dans la phase active :
- Chemin : `Second Cerveau/2 CASQUETTES/Sur ma vie/Life Phases/[Phase active]/[YYYY-MM-DD].md`
- Si elle n'existe pas, crée-la avec le template `Second Cerveau/4 TOOLS/Templates/Daily Note.md`

Ajoute à la fin de la note :

```markdown
---

## Logs IA / Session [HH:MM]

**Accompli :**
- [Action 1]
- [Action 2]

**Extractions :**
- Décisions : [liste des décisions actées]
- Faits : [liste des faits nouveaux appris]
- Préférences : [feedback sur le comportement IA]
- Contradictions : [incohérences détectées et résolues]
- Ressources : [liens, outils, concepts à retenir]

**Fichiers modifiés :**
- `[chemin/fichier1.md]`
- `[chemin/fichier2.md]`

**Prochaines étapes :**
- [ ] [TODO 1]
- [ ] [TODO 2]
```

### Étape 4 : Mise à jour des notes de contexte (NIVEAU 3, OBLIGATOIRE, avec validation)

Pour chaque extraction de type Décision, Fait, ou Contradiction qui concerne un projet ou une casquette :

1. **Lis la note de contexte** du projet/casquette concerné
2. **Vérifie si l'info est déjà présente** ou si elle contredit quelque chose
3. **Mets à jour directement** la note :
   - `Second Cerveau/1 PROJETS/[Projet]/[Projet].md` → Progression, roadmap, statut
   - `Second Cerveau/2 CASQUETTES/[Casquette]/[Casquette].md` → Nouvelles infos, responsabilités

Si une **contradiction** est détectée : résous-la en faveur de ce qui a été dit pendant la session (l'info la plus récente gagne).

### Étape 5 : Cocher les todos complétés

Cherche dans les notes du vault (weekly notes, notes de projet) les todos qui ont été réalisés pendant cette session. Coche-les (`- [x]`).

### Étape 6 : Mise à jour contexte personnel (NIVEAU 4, avec validation)

Si des extractions de type Préférence ou des infos personnelles importantes ont émergé :

Vérifie si des mises à jour sont nécessaires dans :
- `Second Cerveau/2 CASQUETTES/Sur ma vie/Moi.md` → Style IA, valeurs, nouvelles infos personnelles
- `Life Phases/[Active]/[N] Intention.md` → Progression sur les objectifs

Si des changements sont pertinents, montre le diff et demande validation :

```
Je propose de mettre à jour [fichier] :

- Ajouter : [contenu]
- Modifier : [ancien] → [nouveau]

OK ?
```

Si aucun changement n'est nécessaire, ne rien proposer.

### Étape 7 : Confirmation

```
Session loggée !

NIVEAU 2 : Daily note : [date] mise à jour
NIVEAU 3 : Contextes mis à jour : [liste des fichiers modifiés]
NIVEAU 4 : Contexte personnel : [mis à jour / pas de changement]

Extractions :
- X décisions
- X faits
- X préférences
- X contradictions résolues
- X ressources

À la prochaine !
```

## Notes

- NIVEAU 3 (projets/casquettes) est appliqué directement, pas de validation
- NIVEAU 4 (Moi.md, intention) nécessite validation
- Être concis dans les logs (pas de blabla)
- Utiliser des liens `[[wikilinks]]` quand pertinent
- Si la session a été très courte (juste une question), faire un log minimal
