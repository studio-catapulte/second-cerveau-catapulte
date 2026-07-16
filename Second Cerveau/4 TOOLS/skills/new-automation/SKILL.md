---
name: new-automation
description: Concevoir et créer une automatisation sur n8n
---

# New Automation

Tu aides l'utilisateur à concevoir et créer une automatisation sur n8n.

## Arguments

- `$ARGUMENTS` : Nom du process ou de l'automatisation (optionnel)

## Avant de commencer

1. Lis `Second Cerveau/2 CASQUETTES/Sur ma vie/Moi.md` et la phase active pour le contexte utilisateur
2. Si un process est mentionné, lis sa fiche dans `Second Cerveau/4 TOOLS/Process/`

## Processus

### Étape 1 : Identifier l'automatisation

Si `$ARGUMENTS` est fourni :
- Cherche une fiche process correspondante
- Ou utilise-le comme point de départ

Sinon :
```
Quelle automatisation veux-tu créer ?

Exemples :
- "Quand je reçois un paiement Stripe, créer le compte client"
- "Tous les lundis, générer un draft de newsletter"
- "Quand un fichier arrive dans mon inbox, le traiter"

Décris ce que tu veux automatiser.
```

### Étape 2 : Définir le trigger

```
Qu'est-ce qui déclenche cette automatisation ?

**Schedule (temps) :**
- Tous les jours à [heure]
- Toutes les semaines le [jour] à [heure]
- Tous les mois le [date]
- Toutes les [X] minutes/heures

**Webhook (événement externe) :**
- Paiement reçu (Stripe, PayPal...)
- Email reçu
- Formulaire soumis
- Nouveau fichier (Google Drive, Dropbox...)
- Appel API depuis un autre service

**Événement interne :**
- Changement dans une base de données
- Fin d'un autre workflow

Lequel ?
```

### Étape 3 : Mapper les actions

```
Quelles actions doivent s'enchaîner après le trigger ?

Liste-moi les étapes dans l'ordre :
1. [Action 1] : Quoi ? Vers où ?
2. [Action 2] : Quoi ? Vers où ?
3. ...

Pour chaque action, précise :
- Le service concerné (Gmail, Notion, PocketBase, Slack...)
- Ce qui entre (input)
- Ce qui sort (output)
```

### Étape 4 : Gérer les conditions

```
Y a-t-il des conditions ou des cas particuliers ?

**Conditions :**
- Si [condition] → faire [action A]
- Sinon → faire [action B]

**Erreurs :**
- Si ça échoue → [que faire ?]

**Validation humaine :**
- Y a-t-il une étape où tu veux valider avant de continuer ?
- Si oui, comment veux-tu être notifié ? (Slack, email, SMS...)
```

### Étape 5 : Identifier les credentials

```
De quels accès as-tu besoin ?

Services identifiés dans ton workflow :
- [ ] [Service 1] : API key / OAuth ?
- [ ] [Service 2] : API key / OAuth ?

Tu as déjà configuré ces credentials dans n8n ?
```

### Étape 6 : Concevoir le workflow

Génère un schéma textuel du workflow :

```
## Workflow : [Nom]

### Trigger
[Type] : [Détail]

### Actions

┌─────────────────────────────────────┐
│ 1. [Trigger]                        │
│    Type: [Schedule/Webhook/...]     │
│    Config: [Détails]                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 2. [Action 1]                       │
│    Service: [Nom]                   │
│    Input: [...]                     │
│    Output: [...]                    │
└──────────────┬──────────────────────┘
               │
               ▼
        [Condition ?]
              / \
            /     \
           ▼       ▼
    [Action A]  [Action B]
               │
               ▼
┌─────────────────────────────────────┐
│ N. [Action finale]                  │
│    Service: [Nom]                   │
│    Output: [Résultat final]         │
└─────────────────────────────────────┘

### Gestion d'erreur
[Ce qui se passe si ça échoue]

### Credentials nécessaires
- [Service 1] : [Type d'auth]
- [Service 2] : [Type d'auth]
```

**Demande validation avant de continuer.**

### Étape 7 : Créer le workflow n8n

```
Je vais maintenant créer ce workflow dans n8n.

**Prérequis :**
1. Ton instance n8n doit être accessible
2. Les credentials doivent être configurés

Tu veux que je crée le workflow maintenant ?
```

Si oui, utilise l'API n8n pour créer le workflow.

**Structure du workflow n8n (JSON) :**

```json
{
  "name": "[Nom du workflow]",
  "nodes": [
    {
      "name": "[Nom du node]",
      "type": "[Type de node n8n]",
      "position": [X, Y],
      "parameters": {
        // Paramètres spécifiques au node
      }
    }
    // ... autres nodes
  ],
  "connections": {
    "[Node source]": {
      "main": [
        [
          {
            "node": "[Node destination]",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

### Étape 8 : Documentation

Crée ou mets à jour la fiche dans le vault :

Si c'est une nouvelle automatisation standalone, crée `Second Cerveau/3 RESSOURCES/Automatisations/Automatisation - [Nom].md` (créer le dossier `Automatisations/` s'il n'existe pas) :

```markdown
# Automatisation : [Nom]

**Créée le :** [DATE]
**Statut :** 🟢 Active / 🟡 En test / 🔴 Inactive

---

## Trigger
[Type] : [Détail]

## Actions
1. [Action 1]
2. [Action 2]
3. ...

## Validation (si applicable)
[Comment l'humain intervient]

## Gestion d'erreur
[Ce qui se passe si ça échoue]

## Credentials
- [Service 1] : configuré dans n8n
- [Service 2] : configuré dans n8n

## Logs
| Date | Modification |
|------|--------------|
| [DATE] | Création initiale |
```

### Étape 9 : Test

```
Workflow créé !

**Prochaines étapes :**
1. Va dans n8n → Workflows → "[Nom]"
2. Active le workflow
3. Teste avec des données réelles
4. Vérifie que tout fonctionne

**Si ça ne marche pas :**
- Vérifie les credentials
- Regarde les logs d'exécution dans n8n
- Reviens me voir avec l'erreur

Tu veux tester maintenant ?
```



## Règles

- Toujours valider le schéma avant de créer
- Prévoir la gestion d'erreur
- Documenter dans le vault
- Proposer un test après création

## Ce que tu ne fais PAS

- Créer un workflow sans validation
- Oublier la gestion d'erreur
- Créer des workflows trop complexes (découper en plusieurs si besoin)
- Supposer les credentials : toujours demander s'ils sont configurés
