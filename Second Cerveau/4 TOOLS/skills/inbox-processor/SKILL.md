---
name: inbox-processor
description: Traiter les items de l'inbox
---

# Inbox Processor

Tu aides l'utilisateur à traiter les items de son inbox.

## Contexte

L'inbox (`Second Cerveau/0 INBOX/`) est un point de capture temporaire. Les notes ne doivent pas y rester plus de quelques jours.

## Avant de commencer

1. Lis le contexte de l'utilisateur :
   - `Second Cerveau/2 CASQUETTES/Sur ma vie/Moi.md`
   - Intention de la phase active (détectée dans `Second Cerveau/2 CASQUETTES/Sur ma vie/Life Phases/`)
2. Liste les projets actifs (`Second Cerveau/1 PROJETS/*/`) et casquettes (`Second Cerveau/2 CASQUETTES/*/`)
3. Scanne le contenu de `Second Cerveau/0 INBOX/`

## Processus

### Étape 1 : Scanner l'inbox

Liste tous les fichiers dans `Second Cerveau/0 INBOX/` :

```
J'ai trouvé [X] items dans ton inbox :

1. [Fichier 1] : [Aperçu du contenu]
2. [Fichier 2] : [Aperçu du contenu]
...

On les traite un par un ?
```

### Étape 2 : Pour chaque item

Analyse et propose une action :

```
**Item :** [Nom du fichier]

**Contenu :** [Résumé en 1-2 phrases]

**Type détecté :** [Idée / Tâche / Référence / Note de réflexion / Autre]

**Actions possibles :**
1. → Transformer en projet (`Second Cerveau/1 PROJETS/`)
2. → Rattacher à une casquette (`Second Cerveau/2 CASQUETTES/`)
3. → Classer en ressource (`Second Cerveau/3 RESSOURCES/`)
4. → Archiver (`Second Cerveau/5 ARCHIVE/`)
5. → Supprimer (pas utile)
6. → Développer maintenant (on creuse ensemble)

Que veux-tu faire ?
```

### Étape 3 : Exécuter l'action

Selon le choix :

**→ Projet :**
- Crée une note avec le template Projet
- Déplace/fusionne le contenu
- Supprime l'item de l'inbox

**→ Casquette :**
- Identifie la casquette concernée
- Ajoute le contenu à la note existante ou crée une sous-note
- Supprime l'item de l'inbox

**→ Ressource :**
- Propose un sous-dossier (Journal, Lectures, Réflexions, etc.)
- Renomme si nécessaire
- Déplace

**→ Archive :**
- Déplace vers `Second Cerveau/5 ARCHIVE/`

**→ Supprimer :**
- Confirme avant de supprimer

**→ Développer :**
- Passe en mode thinking-partner pour explorer l'idée
- Puis classe le résultat

### Étape 4 : Récapitulatif

```
Inbox traité !

**Résumé :**
- [X] → Projets
- [X] → Casquettes
- [X] → Ressources
- [X] → Archives
- [X] → Supprimés

**Items restants :** [X]

Ton inbox est [vide / presque vide / encore chargé].
```

## Règles de traitement

### → Projet si :
- C'est une initiative avec un objectif clair
- Ça a une deadline (même floue)
- Ça nécessite plusieurs actions

### → Casquette si :
- C'est lié à une responsabilité ongoing
- C'est une note de process ou méthode
- C'est une réflexion sur un de tes rôles

### → Ressource si :
- C'est une référence utile
- C'est une idée à garder pour plus tard
- C'est une note de lecture ou apprentissage

### → Archive si :
- C'est obsolète
- C'est déjà traité
- Ça ne sera probablement jamais utile

### → Supprimer si :
- C'est un doublon
- C'est une note vide ou incompréhensible
- Ça n'a clairement aucune valeur

## Conseils

- Traite l'inbox régulièrement (idéalement quotidien)
- En cas de doute, demande à l'utilisateur
- Privilégie l'action rapide : mieux vaut classer imparfaitement que laisser traîner
- Si un item est trop vague, propose de le développer ou de le supprimer
