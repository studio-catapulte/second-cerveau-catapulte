---
name: connect-mcp
description: Connecter un serveur MCP au niveau utilisateur sur Claude Code et Claude Desktop. Utiliser quand l'utilisateur veut "ajouter un MCP", "installer un MCP", "connecter un outil IA externe", "donner accès à X à mon IA".
---

# /connect-mcp : Installer un serveur MCP

## Argument

`$ARGUMENTS` = nom ou description du MCP à installer (ex: "firecrawl", "playwright", "le MCP de GitHub", "scraping web", "base de données Supabase", ...)

Si vide, demande à l'utilisateur quel MCP il veut connecter avant de continuer.

---

## Procédure complète

### 1. Identifier le MCP

Commence par trouver les informations exactes sur le MCP demandé. Ne suppose rien, cherche.

**Sources à consulter dans l'ordre :**

1. Recherche web : `"<nom> MCP npm package site:npmjs.com OR site:github.com"`
2. Si un package npm est trouvé, récupère son README pour avoir la config exacte
3. Cherche dans `https://github.com/modelcontextprotocol/servers` si le MCP fait partie des serveurs officiels

> **Quel outil de recherche ?** Utilise Firecrawl (`mcp__firecrawl-mcp__firecrawl_search`) s'il est déjà branché. Sinon — et c'est notamment le cas quand ce skill sert justement à installer Firecrawl — utilise `WebSearch` et `WebFetch`, qui sont natifs et toujours disponibles. Ne bloque jamais l'installation au prétexte que Firecrawl est absent.

**Cas particulier : installer Firecrawl lui-même.** Pas besoin de chercher, la configuration est connue :
- package : `firecrawl-mcp`
- variable requise : `FIRECRAWL_API_KEY` (clé commençant par `fc-`, obtenue sur https://firecrawl.dev)
- commande : `claude mcp add firecrawl --scope user --env FIRECRAWL_API_KEY=<clé> -- npx -y firecrawl-mcp`

Passe directement à l'étape 3.

**Informations à extraire :**

- Nom canonique du MCP (celui qui sera dans la config)
- Package npm exact (ex: `firecrawl-mcp`, `@playwright/mcp`, `@modelcontextprotocol/server-github`)
- Type de transport : `stdio` (local, le plus courant) ou `sse`/`http` (distant, avec URL)
- Variables d'environnement requises (clés API, tokens, paths) : nom exact + comment l'obtenir
- Arguments spéciaux à passer (`args` supplémentaires, ex: `--headless` pour Playwright)

**Si le type n'est pas clair :** stdio = le serveur tourne localement via npx. Remote = le serveur est hébergé, on se connecte via URL.

---

### 2. Détecter les outils installés

Exécute ce bloc pour savoir quels outils sont présents sur la machine :

```bash
echo "=== Détection des outils IA ==="

# Claude Code CLI
if [ -f "$HOME/.claude.json" ]; then
  echo "Claude Code CLI: DETECTE ($HOME/.claude.json)"
else
  echo "Claude Code CLI: absent"
fi

# Claude Desktop (macOS / Windows / Linux)
if [ -f "$HOME/Library/Application Support/Claude/claude_desktop_config.json" ]; then
  echo "Claude Desktop (macOS): DETECTE"
elif [ -n "$APPDATA" ] && [ -f "$APPDATA/Claude/claude_desktop_config.json" ]; then
  echo "Claude Desktop (Windows): DETECTE"
elif [ -f "$HOME/.config/Claude/claude_desktop_config.json" ]; then
  echo "Claude Desktop (Linux): DETECTE"
else
  echo "Claude Desktop: absent"
fi

# Vérifier si jq est disponible
if command -v jq >/dev/null 2>&1; then
  echo "jq: disponible"
else
  echo "jq: ABSENT (fallback Python sera utilisé)"
fi
```

Note les outils détectés, ils guident les étapes suivantes.

> Sur Windows, ces commandes tournent dans le bash fourni par Git for Windows. `jq` n'y est en général pas présent : le fallback Python (ou, mieux, la commande `claude mcp add`) est la voie normale.

---

### 3. Demander la clé API si nécessaire

Si le MCP requiert une ou plusieurs variables d'environnement (clé API, token, etc.) :

- Indique à l'utilisateur exactement quelle(s) variable(s) sont nécessaires
- Explique brièvement où les obtenir si tu l'as trouvé dans le README
- Demande-lui de les fournir avant d'écrire la config
- Ne continue pas sans elles si elles sont obligatoires

Format de la demande :
```
Ce MCP nécessite :
- NOM_VARIABLE : [explication courte, ex: "ta clé API Firecrawl, disponible sur app.firecrawl.dev"]

Fournis ces valeurs pour que je puisse configurer la connexion.
```

---

### 4. Installer

**Principe général : ne jamais écraser la config existante.** Toujours lire le fichier, ajouter la clé, réécrire.

#### a. Claude Code CLI — méthode recommandée

La commande native gère le JSON proprement, sur tous les OS. C'est la voie à privilégier systématiquement :

```bash
claude mcp add \
  --transport stdio \
  --scope user \
  --env CLE=VALEUR \
  NOM -- npx -y PACKAGE
```

> À lancer depuis le terminal, **hors** d'une session Claude Code interactive.

Pour un MCP distant :

```bash
claude mcp add --transport sse --scope user NOM https://mcp.example.com/sse
```

#### b. Claude Code CLI — patch manuel (`~/.claude.json`)

Seulement si `claude mcp add` échoue. Format de la clé `mcpServers` (note : `command` est une string, `args` est un tableau séparé) :

```json
{
  "mcpServers": {
    "<nom-du-mcp>": {
      "command": "npx",
      "args": ["-y", "<package-npm>"],
      "env": {
        "MA_CLE_API": "valeur"
      }
    }
  }
}
```

Patch avec jq :

```bash
# Créer le fichier si absent
if [ ! -f "$HOME/.claude.json" ]; then
  echo '{"mcpServers":{}}' > "$HOME/.claude.json"
fi

jq '.mcpServers["NOM"] = {
  "command": "npx",
  "args": ["-y", "PACKAGE"],
  "env": {"CLE": "VALEUR"}
}' "$HOME/.claude.json" > "$HOME/.claude.json.tmp" && mv "$HOME/.claude.json.tmp" "$HOME/.claude.json"

echo "Claude Code CLI patché."
```

Fallback Python (si `jq` est absent, cas courant sur Windows) :

```bash
python3 - <<'EOF'
import json, os

path = os.path.expanduser("~/.claude.json")

if os.path.exists(path):
    with open(path, encoding="utf-8") as f:
        config = json.load(f)
else:
    config = {"mcpServers": {}}

config.setdefault("mcpServers", {})["NOM"] = {
    "command": "npx",
    "args": ["-y", "PACKAGE"],
    "env": {"CLE": "VALEUR"}
}

with open(path, "w", encoding="utf-8") as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

print("Claude Code CLI patché.")
EOF
```

> Si `python3` n'existe pas (fréquent sur Windows), essaie `python`.

#### c. Claude Desktop

Même format que Claude Code CLI (clé `mcpServers`). Seul le chemin varie selon l'OS.

Détection du chemin :

```bash
if [ -d "$HOME/Library/Application Support/Claude" ]; then
  CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
elif [ -n "$APPDATA" ]; then
  CONFIG="$APPDATA/Claude/claude_desktop_config.json"
else
  CONFIG="$HOME/.config/Claude/claude_desktop_config.json"
fi
echo "Config path: $CONFIG"
```

Patch :

```bash
# Créer si absent
if [ ! -f "$CONFIG" ]; then
  mkdir -p "$(dirname "$CONFIG")"
  echo '{"mcpServers":{}}' > "$CONFIG"
fi

jq '.mcpServers["NOM"] = {
  "command": "npx",
  "args": ["-y", "PACKAGE"],
  "env": {"CLE": "VALEUR"}
}' "$CONFIG" > "$CONFIG.tmp" && mv "$CONFIG.tmp" "$CONFIG"

echo "Claude Desktop patché."
```

Fallback Python : reprendre le bloc de la section b en remplaçant le `path` par la valeur de `$CONFIG` détectée ci-dessus.

Important : Claude Desktop ne recharge pas la config automatiquement. Il faut redémarrer l'application après le patch.

---

### 5. Vérifier l'installation

Après l'installation, vérifie que tout est en place.

**Claude Code CLI :**

```bash
claude mcp list
```

Le MCP doit apparaître dans la liste avec son nom.

> Un MCP ajouté n'est **pas** chargé dans la session en cours. Quitter Claude Code (`/exit`) et le relancer. C'est le piège numéro un.

**Claude Desktop :**

Redémarre l'application. Dans une nouvelle conversation, le MCP doit apparaître dans les outils disponibles (icône marteau ou liste des outils selon la version).

**Test fonctionnel :**

Exécute une commande simple via le MCP pour confirmer qu'il répond. Exemple pour un MCP de scraping : demande de scraper une URL simple. Exemple pour un MCP GitHub : demande la liste des repos.

---

### 6. Réponse finale à l'utilisateur

Fournis un récapitulatif structuré :

```
MCP installé : <nom canonique> (<package npm>)

Outils configurés :
- Claude Code CLI : oui / non détecté
- Claude Desktop : oui (redémarrage requis) / non détecté

Variables d'environnement configurées :
- NOM_VARIABLE : définie

Pour vérifier : `claude mcp list`, puis `/exit` et relancer `claude`.
Pour Claude Desktop : redémarre l'application.
```

Si une étape a échoué (fichier non trouvé, jq absent, erreur de parsing), indique-le clairement et propose la correction.

---

## Notes techniques

### Cas particuliers

**MCP sans variable d'environnement :** omettre le bloc `env` dans la config. Ne pas mettre un objet vide `{}`.

**MCP avec args supplémentaires** (ex: `--headless`, `--port 3000`) : les ajouter dans le tableau `args` après le package, ex: `"args": ["-y", "@playwright/mcp", "--headless"]`.

**MCP distant (HTTP/SSE) :** utiliser `--transport sse` (ou `http`) et une URL au lieu de `command`/`args`. Vérifier dans le README du MCP si ce mode est supporté.

**Si npx n'est pas disponible :** proposer d'installer Node.js.
- Windows : `winget install --id OpenJS.NodeJS.LTS -e`, puis **fermer et rouvrir le terminal**
- macOS : `brew install node`
- Linux : `apt install nodejs npm`

Le MCP s'installera automatiquement via npx au premier lancement.

### Erreurs fréquentes

| Symptôme | Cause | Correctif |
|---|---|---|
| Le MCP n'apparaît pas dans la session | Claude Code pas relancé | `/exit` puis `claude` |
| Erreur d'authentification | Clé mal collée (espace ou retour à la ligne) | Recoller la clé proprement |
| `npx` non reconnu | Node absent, ou terminal pas rouvert après l'install | Réinstaller Node, rouvrir le terminal |
| `jq: command not found` | jq absent (courant sur Windows) | Utiliser `claude mcp add`, ou le fallback Python |
