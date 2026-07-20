# Installation pas à pas (Windows)

De zéro jusqu'à ton second cerveau opérationnel. Tu coches au fur et à mesure. Chaque bloc a une **vérif** : tant qu'elle ne passe pas, on ne passe pas à la suite.

> Tu peux copier les commandes directement depuis cette page. Tout ce qui est entre `< >` est à remplacer par ta valeur.

**Le principe :** on installe Git et Claude Code à la main, et ensuite **c'est Claude qui finit l'installation tout seul**. Tu ne tapes des commandes que jusqu'à la Phase 2.

| Phase | Qui fait | Quoi |
|---|---|---|
| 0-2 | toi | Git, Claude Code, le raccourci `cc` |
| 3 | **Claude** | Obsidian, Node, le vault |
| 4 | toi | Obsidian : ouvrir le coffre et ses plugins (interface graphique) |
| 5-9 | vous deux | L'agent prend le relais |

---

## Phase 0 - Avant de commencer

- [ ] Abonnement **Claude Pro ou Max** actif
- [ ] Droits d'installation sur la machine (pas besoin d'être administrateur, mais il faut pouvoir installer des logiciels)
- [ ] Ta matière prête dans un dossier : tes notes, tes documents de référence, ce que tu veux voir entrer dans ton second cerveau

> Pas besoin de compte GitHub. Pas besoin de VPS. Pas besoin de WSL.

**Ouvrir PowerShell :** touche Windows, taper `powershell`, Entrée. (Pas « PowerShell ISE », pas « Invite de commandes ».)

---

## Phase 1 - Git

Ton second cerveau est un dossier versionné avec Git : c'est ce qui permet de récupérer le vault, et c'est ce que `/done` utilise pour enregistrer chaque session. Il installe aussi Git Bash, le terminal que Claude Code préfère sur Windows.

**Téléchargement direct (recommandé)** - ne dépend d'aucun outil système, ne demande jamais de mot de passe administrateur :

1. Va sur https://git-scm.com/download/win
2. Clique « 64-bit Git for Windows Setup » (premier lien, ~65 Mo)
3. Lance le `.exe`. Si une fenêtre te demande un mot de passe administrateur : **Annuler** → l'installeur bascule tout seul en installation « pour moi uniquement », ça marche très bien
4. L'installeur est bavard (une dizaine d'écrans). Tu fais « Next » partout, **sauf deux écrans** :
   - **« Choosing the default editor »** → choisis **Notepad** (le défaut, Vim, est un éditeur dont on ne sort pas sans connaître une combinaison de touches particulière)
   - **« Adjusting the name of the initial branch »** → coche **« Override... use `main` »**

> Si tu as laissé l'éditeur sur Vim par erreur, pas grave, ça se corrige après : `git config --global core.editor notepad`. Dans l'usage prévu ici tu n'y seras de toute façon jamais confronté, c'est Claude qui fait les commits.

**Autre option, winget** (seulement si winget marche déjà sur ta machine - ce n'est pas garanti, voir Dépannage) :

```powershell
winget install --id Git.Git -e --source winget --accept-source-agreements --accept-package-agreements
```

- [ ] Git installé
- [ ] **Ferme et rouvre PowerShell** (obligatoire, sinon la commande n'est pas encore reconnue)
- [ ] Vérif : `git --version` renvoie un numéro de version

---

## Phase 2 - Claude Code

### 2.1 Installation

```powershell
irm https://claude.ai/install.ps1 | iex
```

L'installeur place `claude.exe` dans `%USERPROFILE%\.local\bin`.

- [ ] Installation terminée sans erreur
- [ ] **Ferme et rouvre le terminal**
- [ ] Vérif : `claude --version` renvoie un numéro de version

**Si `claude` n'est pas reconnu :** le dossier n'est pas dans le PATH.

D'abord, vérifie que le programme est bien là :

```powershell
Test-Path "$env:USERPROFILE\.local\bin\claude.exe"
```

**Si ça affiche `True`** - c'est juste le PATH. Cette commande l'ajoute pour ton compte (pas besoin d'administrateur) :

```powershell
[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path","User") + ";$env:USERPROFILE\.local\bin", "User")
```

Puis **ferme et rouvre le terminal**, et refais `claude --version`.

**Si ça affiche `False`** - l'installation a échoué en silence. Relance `irm https://claude.ai/install.ps1 | iex` et lis les messages d'erreur.

> À noter : la commande `$env:PATH -split ';' | Select-String '\.local\\bin'` sert seulement à *vérifier* si le chemin est présent, elle n'ajoute rien. C'est la commande `SetEnvironmentVariable` ci-dessus qui corrige le problème.

### 2.2 Connexion

```powershell
claude
```

Au premier lancement, Claude ouvre le navigateur pour la connexion. Se connecter avec le compte qui porte l'abonnement Pro/Max.

- [ ] Connecté, le prompt Claude Code s'affiche
- [ ] Taper `/exit` pour sortir

### 2.3 Le raccourci `cc`

Par défaut, Claude Code demande ta validation avant chaque action sur tes fichiers. C'est rassurant les premières minutes, pénible au bout d'une heure. Le raccourci `cc` lance l'agent en sautant ces demandes.

> **Ce que ça change exactement :** les demandes de confirmation courantes disparaissent. Les interdictions explicites définies dans le vault (`rm`, `git push`) **restent actives**, ainsi que les garde-fous de Claude Code sur les suppressions dangereuses. Tu n'es pas sans filet, tu enlèves les questions répétitives.

**a. Autoriser PowerShell à charger ton profil** (bloqué par défaut sur Windows) :

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Répondre `O` (ou `Y`) à la confirmation.

**b. Créer le fichier de profil s'il n'existe pas :**

```powershell
if (!(Test-Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }
```

**c. Y ajouter le raccourci :**

```powershell
Add-Content $PROFILE "`nfunction cc { claude --dangerously-skip-permissions @args }"
```

- [ ] **Ferme et rouvre le terminal**
- [ ] Vérif : taper `cc` lance Claude Code sans demander de confirmation

> Au **tout premier** `cc`, un écran d'avertissement s'affiche pour te faire confirmer. Tu valides une fois, tu ne le reverras plus.
>
> Un alias PowerShell classique (`Set-Alias`) ne sait pas transporter d'arguments, d'où la fonction. `@args` permet de passer des options au passage, par exemple `cc --continue` pour reprendre la conversation précédente.

---

## Phase 3 - Obsidian, Node, et le clone du vault

### 3.1 Obsidian et Node - à la main (recommandé)

Deux téléchargements directs, environ 5 minutes. Aucun mot de passe administrateur requis, et ça évite winget qui n'est pas fiable sur toutes les machines.

1. **Obsidian** : https://obsidian.md → « Download for Windows » → lance le `.exe`. **N'ouvre pas Obsidian tout de suite**, on s'en occupe en Phase 4.
2. **Node.js LTS** : https://nodejs.org → clique le gros bouton **LTS** → lance le `.msi`, puis « Next » partout.

> **Reste devant l'écran.** Le `.msi` de Node peut afficher une fenêtre d'autorisation Windows. Si on te demande un mot de passe administrateur que tu n'as pas, il existe une version portable (`.zip`) sur nodejs.org qui s'en passe - demande de l'aide à ce moment-là.

- [ ] Obsidian installé (pas ouvert)
- [ ] Node installé

### 3.2 Le clone du vault - par Claude

C'est le moment où tu arrêtes de taper des commandes. Lance l'agent :

```powershell
cc
```

Puis **copie-colle ce bloc entier** dans Claude :

```
Tu vas finir d'installer mon environnement de travail sur Windows.

1. Clone le vault dans mon dossier Documents :
   git clone https://github.com/studio-catapulte/second-cerveau-catapulte.git "$HOME/Documents/Second Cerveau"

2. Vérifie que le dossier "$HOME/Documents/Second Cerveau" contient bien
   0 INBOX, 1 PROJETS, CLAUDE.md, et un dossier .claude/skills avec 14 skills.

Obsidian et Node sont déjà installés à la main, ne les réinstalle pas et ne
cherche pas à vérifier que node fonctionne : le PATH de cette session n'est
pas à jour, c'est normal, je redémarre le terminal juste après.

Termine par un récapitulatif : ce qui a marché, ce qui a échoué, et ce qu'il
me reste à faire à la main. Si une commande échoue, dis-le-moi franchement
plutôt que de chercher un contournement.
```

- [ ] Claude a terminé et donné son récapitulatif
- [ ] Aucune étape signalée en échec

Puis, **obligatoire** :

- [ ] Taper `/exit`
- [ ] **Fermer et rouvrir PowerShell** (pour que Node soit reconnu)
- [ ] Vérif : `node --version` renvoie un numéro de version

<details>
<summary><strong>Si Claude a coincé sur le clone : la commande à faire à la main</strong></summary>

```powershell
cd $HOME\Documents
git clone https://github.com/studio-catapulte/second-cerveau-catapulte.git "Second Cerveau"
```

(Obsidian et Node ont été installés en 3.1 par téléchargement direct.)
</details>

<details>
<summary><strong>Si winget fonctionne sur ta machine et que tu préfères laisser Claude tout faire</strong></summary>

Au lieu du 3.1 à la main, ajoute ces deux lignes au bloc collé à Claude, avant le clone :

```
Installe Obsidian :
   winget install --id Obsidian.Obsidian -e --accept-source-agreements --accept-package-agreements
Installe Node.js LTS :
   winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
```

À ne tenter que si `winget --version` répond et qu'une installation winget a déjà marché sur cette machine.
</details>

> **Un seul dossier pour tout.** `Second Cerveau` est à la fois ton vault Obsidian (ce que tu vois) et le répertoire depuis lequel l'agent travaille (ce qu'il lit et écrit). Pas de niveau intermédiaire, pas de sous-dossier à ne pas confondre.

---

## Phase 4 - Obsidian et ses plugins

Cette phase se fait à la souris : Claude n'a pas accès à l'interface d'Obsidian.

### 4.1 Ouvrir le vault

Lancer Obsidian → « Ouvrir un dossier comme coffre » → sélectionner le dossier **`Second Cerveau`** dans `Documents`.

- [ ] Le vault s'ouvre
- [ ] Dans l'explorateur, tu vois directement `0 INBOX`, `1 PROJETS`, `2 CASQUETTES`, `3 RESSOURCES`, `4 TOOLS`, `5 ARCHIVE`

### 4.2 Autoriser les plugins communautaires

Paramètres → Plugins communautaires → **désactiver le mode restreint**.

- [ ] Mode restreint désactivé

### 4.3 Installer les trois plugins

Paramètres → Plugins communautaires → Parcourir, puis chercher, installer et activer :

- [ ] **Lean Terminal** (auteur LeanProductivity) - le terminal intégré à Obsidian
- [ ] **Excalidraw** - schémas et dessins dans le vault
- [ ] **Hidden Folders Access** - pour voir et éditer `.claude/skills` depuis Obsidian (c'est un dossier caché, donc invisible par défaut)

> **Déjà fournis dans le repo, rien à installer :** Calendar, et le patch **Lean Terminal - Escape Fix**. Ce dernier est important : sans lui, Obsidian intercepte la touche Échap et tu ne peux pas interrompre Claude Code en cours de route. Vérifie juste qu'il est activé dans la liste.
>
> **Daily notes** et **Templates** sont des plugins cœur d'Obsidian, déjà activés et déjà configurés dans le repo. Rien à faire.

- [ ] `Lean Terminal - Escape Fix` apparaît bien activé dans la liste

### 4.4 Régler le terminal sur PowerShell

Par défaut, Lean Terminal lance `cmd.exe` sous Windows, où les commandes de ce guide ne marchent pas.

Paramètres → Lean Terminal → champ du shell Windows. Renseigner :

```
powershell.exe
```

- [ ] Shell réglé sur PowerShell

### 4.5 Vérifier que le terminal démarre au bon endroit

Ouvrir un terminal dans Obsidian (icône terminal dans la barre latérale, ou palette de commandes avec `Ctrl+P` puis « terminal »).

```powershell
dir
```

- [ ] `dir` liste `0 INBOX`, `1 PROJETS`, `CLAUDE.md`... c'est-à-dire exactement ce que tu vois dans Obsidian

> C'est tout l'intérêt de la structure à plat : le terminal démarre là où est ton vault, et c'est aussi là que l'agent travaille. Un seul endroit.

---

## Phase 5 - Lancer l'agent

Dans le terminal d'Obsidian :

```powershell
cc
```

- [ ] Claude Code démarre
- [ ] Vérif : taper `/` et voir apparaître `initialisation`, `create-skill`, `done`, `connect-mcp` dans la liste

**La barre de statut** est déjà configurée dans le repo, tu n'as rien à installer. En bas de l'écran :

```
Opus 4.8   Second Cerveau   main   ctx 12%   5h 24% | 7j 41%
```

- `ctx` : la part de sa mémoire de travail que l'agent a consommée sur ce fil
- `5h` : ton quota d'usage sur le bloc de 5 heures en cours
- `7j` : ton quota sur la semaine glissante

- [ ] La barre affiche bien `ctx`
- [ ] Les quotas `5h` et `7j` apparaissent

> Les quotas ne s'affichent qu'à partir du **deuxième échange**. S'ils manquent au tout début, pose n'importe quelle question et regarde à nouveau.

> **Règle à retenir :** au-delà de 40 % de contexte utilisé, tu lances `/done` et tu ouvres un nouveau fil. Un agent qui sature son contexte se met à raconter n'importe quoi sans prévenir. La barre passe en jaune à ce seuil, tu n'as pas à surveiller le chiffre.

---

## Phase 6 - Initialisation du vault

C'est une conversation guidée : l'agent te pose des questions et personnalise le vault avec tes réponses. Compte 30 à 45 minutes. Tu peux lui déposer des fichiers (CV, bio, documents de référence) à tout moment, il les lit et en extrait ce qui compte.

```
/initialisation
```

- [ ] Conversation terminée
- [ ] Vérif dans Obsidian : tes notes de contexte sont créées et te ressemblent (pas du générique)

> Attention : `/initialisation`, pas `/init`. `/init` est une commande native de Claude Code qui fait tout autre chose.

---

## Phase 7 - Ta matière

- [ ] Copier tes fichiers dans `0 INBOX\`

Puis dans Claude Code :

```
/inbox-processor
```

- [ ] L'agent a classé ta matière dans les bons dossiers
- [ ] Vérif dans Obsidian : `0 INBOX` est vidé (ou presque), le contenu est rangé et relié

---

## Phase 8 - Firecrawl

Nécessaire pour que l'agent aille chercher des pages web. Node est déjà installé (Phase 3).

### 8.1 Clé API

Créer un compte gratuit sur https://firecrawl.dev (500 crédits par mois) et copier la clé API depuis le dashboard.

- [ ] Clé récupérée (elle commence par `fc-`)

### 8.2 Brancher le connecteur

Le plus simple, dans Claude Code :

```
/connect-mcp firecrawl
```

L'agent cherche la configuration exacte et l'installe pour toi.

Si tu préfères le faire à la main, dans le terminal (hors Claude Code) :

```powershell
claude mcp add firecrawl --scope user --env FIRECRAWL_API_KEY=<ta-clé-fc> -- npx -y firecrawl-mcp
```

- [ ] Connecteur ajouté
- [ ] **Quitter Claude Code (`/exit`) et le relancer** (sinon le connecteur n'est pas chargé, piège classique)
- [ ] Vérif : demander à Claude de scraper une page web publique et de la résumer. Ça doit ramener du contenu réel.

---

## Phase 9 - Ton premier skill

On ne te livre pas un skill tout fait : **on mappe ton process, et il devient ton skill.** C'est ça, l'autonomie.

### 9.1 Préparer tes réponses

L'agent va te demander tout ça, autant l'avoir en tête :

- [ ] **Nom** du process (ex. « ma veille hebdo »)
- [ ] **Déclencheur** : quand tu le fais (tous les matins, le vendredi, à la demande)
- [ ] **Input** : d'où tu pars, quelles sources concrètes
- [ ] **Output** : ce que tu produis (pour qui ? lu quand ?)
- [ ] **Étapes** : comment tu procèdes aujourd'hui, dans l'ordre
- [ ] **Critères de tri** : ce qui mérite d'être retenu, ce que tu jettes
- [ ] **Exemples** : une bonne sortie que tu as produite, une mauvaise, et pourquoi

> Le dernier point est celui qui fait la différence. Un skill sans exemples concrets produit du générique.

> Astuce : Excalidraw est parfait pour dessiner ton process avant de le figer en skill.

### 9.2 Construire le skill

```
/create-skill
```

- [ ] Conversation terminée
- [ ] Le skill est écrit dans `.claude\skills\<nom>\SKILL.md`
- [ ] Vérif : le relire dans Obsidian (via Hidden Folders Access). Tes sources réelles y sont, tes critères aussi.

### 9.3 Le lancer

- [ ] Quitter Claude Code et le relancer (pour qu'il charge le nouveau skill)
- [ ] Taper `/<nom-du-skill>`

### 9.4 L'affûter

Première sortie rarement parfaite, c'est normal et c'est le geste à apprendre.

- [ ] Repérer ce qui cloche (trop long, mauvaises sources, manque de recul, mauvais format)
- [ ] Le dire à l'agent : « modifie mon skill pour que... »
- [ ] Relancer et comparer

- [ ] **Tu sais maintenant modifier tes propres skills.**

---

## Phase 10 - Clôturer

```
/done
```

Logge la session, met à jour la mémoire du vault, commit git.

- [ ] Session clôturée

---

## Dépannage rapide

| Symptôme | Cause probable | Correctif |
|---|---|---|
| `winget` échoue (« échec de la recherche de la source ») | Sources winget non initialisées, ou App Installer trop ancien | Ne pas insister : passer par les téléchargements directs (Git, Obsidian et Node ont tous une page de téléchargement). Le correctif `winget source reset` demanderait un mot de passe administrateur. |
| `claude` non reconnu | PATH pas rafraîchi | Fermer/rouvrir le terminal. Sinon `Test-Path "$env:USERPROFILE\.local\bin\claude.exe"`, puis la commande `SetEnvironmentVariable` de la Phase 2.1 |
| `cc` non reconnu | Profil PowerShell pas chargé ou terminal pas rouvert | Phase 2.3. Sinon lancer `claude` tout court, ça marche aussi |
| `irm` non reconnu, ou erreur sur `&&` | Le terminal est en CMD, pas PowerShell | Phase 4.4, régler Lean Terminal sur `powershell.exe` |
| `node` ou `npx` non reconnu | Terminal pas rouvert après l'install | Fermer et rouvrir le terminal |
| Aucun skill dans la liste `/` | Claude lancé depuis le mauvais dossier | Vérifier avec `dir` que tu vois `0 INBOX` et `CLAUDE.md` |
| La barre de statut est vide | Node absent, ou lancé hors du vault | `node --version`, puis `dir` pour vérifier le dossier |
| Pas de `5h` / `7j` dans la barre | Normal au premier échange | Poser une question, la barre se remplit ensuite |
| Échap n'interrompt pas Claude | Plugin Escape Fix désactivé | L'activer dans les plugins communautaires (Phase 4.3) |
| `.claude\skills` invisible dans Obsidian | Plugin Hidden Folders Access absent | L'installer (Phase 4.3). C'est un dossier caché, c'est normal |
| Le connecteur Firecrawl semble absent | Claude pas relancé après l'ajout | `/exit` puis `cc` |
| Firecrawl renvoie une erreur d'authentification | Clé mal collée (espace en trop) | Recoller la clé proprement |
| L'agent part en vrille, invente | Contexte saturé | `/done` puis nouveau fil |

---

## Mémo des commandes

| Commande | Quand |
|---|---|
| `cc` | Lancer l'agent, depuis le terminal d'Obsidian |
| `claude` | Idem, mais avec confirmation avant chaque action |
| `/initialisation` | Une seule fois, au démarrage |
| `/inbox-processor` | Quand tu as déposé de la matière dans `0 INBOX` |
| `/create-skill` | Transformer un de tes process en commande |
| `/connect-mcp <outil>` | Brancher un outil externe |
| `/daily-review`, `/weekly-review` | Journaling et bilans |
| `/done` | Fin de session, toujours |
| `/exit` | Sortir de Claude Code |
