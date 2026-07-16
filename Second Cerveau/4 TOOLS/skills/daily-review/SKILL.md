---
name: daily-review
description: Réflexion quotidienne guidée
---

# Daily Review

Tu guides l'utilisateur dans sa réflexion quotidienne.

## Avant de commencer

1. Lis `Second Cerveau/2 CASQUETTES/Sur ma vie/Moi.md` pour comprendre l'utilisateur
2. Détecte la phase active :
   ```bash
   ls -d "Second Cerveau/2 CASQUETTES/Sur ma vie/Life Phases/"*/ | sort -V | tail -1
   ```
3. Lis l'intention de la phase active et les objectifs
4. Lis la daily note du jour si elle existe déjà (logs de session précédents)
5. Vérifie s'il y a des notes récentes dans `Second Cerveau/0 INBOX/`

## Le processus

### Ouverture

```
Daily Review : [Date]

Quelques questions pour ta réflexion du jour :
```

### Questions

Pose ces questions une par une, en laissant l'utilisateur répondre :

1. **Énergie**
   "Comment tu te sens aujourd'hui ? (1-10)"

2. **Wins**
   "Qu'est-ce qui s'est bien passé aujourd'hui ?"

3. **Friction**
   "Qu'est-ce qui a été difficile ou frustrant ?"

4. **Apprentissage**
   "Qu'est-ce que tu as appris ou réalisé ?"

5. **Demain**
   "Quelle est LA chose importante pour demain ?"

### Clôture

```
Résumé de ta journée :

**Énergie :** [X]/10
**Win principal :** [Win]
**Friction principale :** [Friction]
**Insight :** [Apprentissage]
**Focus demain :** [Priorité]

Veux-tu que je crée une note avec ce résumé ?
```

## Écriture dans la daily note (si demandé)

La daily note du jour vit dans `Second Cerveau/2 CASQUETTES/Sur ma vie/Life Phases/[Phase active]/YYYY-MM-DD.md`. Format obligatoire : `YYYY-MM-DD.md` (pas de suffixe).

- **Si elle existe déjà** : append la section Daily Review à la fin du fichier, sans toucher au reste (logs `/done`, Focus, Notes...).
- **Si elle n'existe pas** : la créer à partir du template `Second Cerveau/4 TOOLS/Templates/Daily Note.md` puis ajouter la section Daily Review à la fin.

Section Daily Review à ajouter (fusionnée avec la section « Fin de journée » du template si pertinent) :

```markdown
---

## Daily Review : [HH:MM]

**Énergie :** [X]/10

### Ce qui s'est bien passé
- [Win 1]
- [Win 2]

### Ce qui a été difficile
- [Friction 1]

### Ce que j'ai appris
[Insight]

### Focus demain
[Priorité]
```

## Connexions

Si l'utilisateur mentionne un projet ou une casquette, propose de créer un lien :

```
Tu as mentionné [[Projet X]]. Veux-tu que j'ajoute une note dans ce projet ?
```
