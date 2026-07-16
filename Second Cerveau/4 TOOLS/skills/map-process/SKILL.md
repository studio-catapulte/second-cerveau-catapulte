---
name: map-process
description: Cartographier tous les process et réfléchir à leur optimisation avec IA
---

# Map Process

Tu guides l'utilisateur pour cartographier tous ses process de vie et réfléchir à leur optimisation avec l'IA.

## Avant de commencer

1. Lis `Second Cerveau/2 CASQUETTES/Sur ma vie/Moi.md` pour comprendre qui est l'utilisateur
2. Vérifie si `Second Cerveau/4 TOOLS/Process/Cartographie des process.md` existe déjà

## Processus

### Étape 1 : Exploration des domaines de vie

```
On va cartographier tous tes process : les tâches récurrentes ou déclenchées que tu fais régulièrement.

Pour chaque domaine, dis-moi les process que tu fais :

**Perso :**
- Routines quotidiennes (inbox, emails, admin...)
- Santé, sport, alimentation
- Apprentissage, lecture

**Pro :**
- Acquisition (prospection, marketing, contenu...)
- Vente (devis, calls, closing...)
- Delivery (production, livrables...)
- Admin (facturation, compta, juridique...)

**Vie quotidienne :**
- Courses, maison, organisation
- Relations, planning famille

Commence par un domaine. On fait le tour.
```

Pose des questions pour extraire :
- Les tâches répétitives
- Les tâches déclenchées par un événement
- Les tâches ponctuelles mais fréquentes

Demande à l'utilisateur de se projeter heure par heure dans une journée type pour comprendre ce qu'il fait, pour se voir faire des actions.

### Étape 2 : Classification par temporalité

Une fois les process listés, propose cette classification :

```markdown
## Daily
- [Process 1]
- [Process 2]

## Weekly
- [Process 3]

## Monthly
- [Process 4]

## On Trigger (événement déclencheur)
- [Process 5] → Trigger : [événement]

## Manuel (ponctuel)
- [Process 6]
```

Demande validation et ajustements.

### Étape 3 : Création des fichiers

**Demande validation avant de créer.**

1. Crée `Second Cerveau/4 TOOLS/Process/Cartographie des process.md` avec la vue d'ensemble :

```markdown
# Cartographie Process

> Dernière mise à jour : [DATE]

## Daily
- [[Process - Inbox processing]]
- ...

## Weekly
- [[Process - Newsletter]]
- ...

## Monthly
- [[Process - Facturation]]
- ...

## On Trigger
- [[Process - Nouveau client]]
- ...

## Manuel
- [[Process - Création vidéo]]
- ...
```

## Étape 4 : Récapitulatif

```
## Récapitulatif

**Process cartographiés :** [X]
**Agents à créer :** [Liste]
**Automatisations à créer :** [Liste]

**Prochaines étapes :**
1. Utilise `/create-skill` pour documenter les process et créer les skills
2. Utilise `/new-automation` pour créer les workflows d'automatisation

Tu veux commencer par quoi ?
```

## Règles

- Pose des questions ouvertes pour faire émerger les process
- Ne suppose pas : demande des clarifications
- Garde une vue d'ensemble avant d'entrer dans le détail
- Propose des exemples pour débloquer l'utilisateur
- Valide avant de créer des fichiers
