---
name: connect-mcp
description: Connecter un serveur MCP au niveau utilisateur sur Claude Code, OpenCode et Claude Desktop. Utiliser quand l'utilisateur veut "ajouter un MCP", "installer un MCP", "connecter un outil IA externe", "donner accès à X à mon IA".
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

1. Recherche web avec Firecrawl (`mcp__firecrawl-mcp__firecrawl_search`) : `"<nom> MCP npm package site:npmjs.com OR site:github.com"`
2. Si un package npm est trouvé, récupère le README via Firecrawl pour avoir la config exacte
3. Cherche dans `https://github.com/modelcontextprotocol/servers` si le MCP fait partie des serveurs officiels

**Informations à extraire :**

- Nom canonique du MCP (celui qui sera dans la config)
- Package npm exact (ex: `@firecrawl/mcp-server`, `@playwright/mcp`, `@modelcontextprotocol/server-github`)
- Type de transport : `local` (stdio, le plus courant) ou `remote` (HTTP/SSE avec URL)
- Variables d'environnement requises (clés API, tokens, paths) : nom exact + comment l'obtenir
- Arguments spéciaux à passer (`args` supplémentaires, ex: `--headless` pour Playwright)

**Si le type n'est pas clair :** stdio = le serveur tourne localement via npx. Remote = le serveur est hébergé, on se connecte via URL.

---

### 2. Détecter les outils installés

Exécute ce bloc pour savoir quels outils sont présents sur la machine :

```bash
echo "=== Détection des outils IA ==="

# OpenCode
if [ -f "$HOME/.config/opencode/opencode.json" ]; then
  echo "OpenCode: DETECTE ($HOME/.config/opencode/opencode.json)"
else
  echo "OpenCode: absent"
fi

# Claude Code CLI
if [ -f "$HOME/.claude.json" ]; then
  echo "Claude Code CLI: DETECTE ($HOME/.claude.json)"
else
  echo "Claude Code CLI: absent"
fi

# Claude Desktop (macOS)
if [ -f "$HOME/Library/Application Support/Claude/claude_desktop_config.json" ]; then
  echo "Claude Desktop (macOS): DETECTE"
elif [ -f "$APPDATA/Claude/claude_desktop_config.json" ] 2>/dev/null; then
  echo "Claude Desktop (Windows): DETECTE"
elif [ -f "$HOME/.config/Claude/claude_desktop_config.json" ]; then
  echo "Claude Desktop (Linux): DETECTE"
else
  echo "Claude Desktop: absent"
fi

# Vérifier si jq est disponible
if command -v jq &>/dev/null; then
  echo "jq: disponible"
else
  echo "jq: ABSENT (fallback Python sera utilisé)"
fi
```

Note les outils détectés, ils guident les étapes suivantes.

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

### 4. Patcher les fichiers de config

Applique les patches pour chaque outil détecté. Utilise `jq` en priorité, Python comme fallback si `jq` est absent.

**Principe général : ne jamais écraser la config existante.** Toujours lire le fichier, ajouter la clé, réécrire.

#### a. OpenCode (`~/.config/opencode/opencode.json`)

Format de la clé `mcp` dans OpenCode (note : `command` est un tableau, pas une string) :

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "<nom-du-mcp>": {
      "type": "local",
      "command": ["npx", "-y", "<package-npm>"],
      "environment": {
        "MA_CLE_API": "valeur"
      },
      "enabled": true
    }
  }
}
```

Pour un MCP remote (HTTP/SSE) :

```json
{
  "mcp": {
    "<nom-du-mcp>": {
      "type": "remote",
      "url": "https://mcp.example.com/sse",
      "headers": {
        "Authorization": "Bearer TOKEN"
      },
      "enabled": true
    }
  }
}
```

Commande pour patcher (remplace NOM, PACKAGE, CLE, VALEUR par les valeurs réelles) :

```bash
mkdir -p "$HOME/.config/opencode"

# Créer le fichier si absent
if [ ! -f "$HOME/.config/opencode/opencode.json" ]; then
  echo '{"$schema":"https://opencode.ai/config.json","mcp":{}}' > "$HOME/.config/opencode/opencode.json"
fi

# Patcher avec jq
jq '.mcp["NOM"] = {
  "type": "local",
  "command": ["npx", "-y", "PACKAGE"],
  "environment": {"CLE": "VALEUR"},
  "enabled": true
}' "$HOME/.config/opencode/opencode.json" > /tmp/oc_patch.json && mv /tmp/oc_patch.json "$HOME/.config/opencode/opencode.json"

echo "OpenCode patche."
```

Fallback Python si `jq` absent :

```bash
python3 - <<'EOF'
import json, os

path = os.path.expanduser("~/.config/opencode/opencode.json")
os.makedirs(os.path.dirname(path), exist_ok=True)

if os.path.exists(path):
    with open(path) as f:
        config = json.load(f)
else:
    config = {"$schema": "https://opencode.ai/config.json", "mcp": {}}

config.setdefault("mcp", {})["NOM"] = {
    "type": "local",
    "command": ["npx", "-y", "PACKAGE"],
    "environment": {"CLE": "VALEUR"},
    "enabled": True
}

with open(path, "w") as f:
    json.dump(config, f, indent=2)

print("OpenCode patche.")
EOF
```

---

#### b. Claude Code CLI (`~/.claude.json`)

Format de la clé `mcpServers` (note : `command` est une string, `args` est un tableau separé) :

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

Méthode CLI (préférable, gère le JSON proprement) :

```bash
claude mcp add \
  --transport stdio \
  --scope user \
  --env CLE=VALEUR \
  NOM -- npx -y PACKAGE
```

Si la commande `claude` n'est pas disponible ou si tu veux patcher manuellement :

```bash
# Créer le fichier si absent
if [ ! -f "$HOME/.claude.json" ]; then
  echo '{"mcpServers":{}}' > "$HOME/.claude.json"
fi

# Patcher avec jq
jq '.mcpServers["NOM"] = {
  "command": "npx",
  "args": ["-y", "PACKAGE"],
  "env": {"CLE": "VALEUR"}
}' "$HOME/.claude.json" > /tmp/cc_patch.json && mv /tmp/cc_patch.json "$HOME/.claude.json"

echo "Claude Code CLI patche."
```

Fallback Python :

```bash
python3 - <<'EOF'
import json, os

path = os.path.expanduser("~/.claude.json")

if os.path.exists(path):
    with open(path) as f:
        config = json.load(f)
else:
    config = {"mcpServers": {}}

config.setdefault("mcpServers", {})["NOM"] = {
    "command": "npx",
    "args": ["-y", "PACKAGE"],
    "env": {"CLE": "VALEUR"}
}

with open(path, "w") as f:
    json.dump(config, f, indent=2)

print("Claude Code CLI patche.")
EOF
```

---

#### c. Claude Desktop

Même format que Claude Code CLI (clé `mcpServers`). Le path varie selon l'OS.

Détection du path :

```bash
if [[ "$OSTYPE" == "darwin"* ]]; then
  CLAUDE_DESKTOP_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
  CLAUDE_DESKTOP_CONFIG="$APPDATA/Claude/claude_desktop_config.json"
else
  CLAUDE_DESKTOP_CONFIG="$HOME/.config/Claude/claude_desktop_config.json"
fi
echo "Config path: $CLAUDE_DESKTOP_CONFIG"
```

Patch :

```bash
# Adapter CLAUDE_DESKTOP_CONFIG au path détecté ci-dessus
CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

# Créer si absent
if [ ! -f "$CONFIG" ]; then
  mkdir -p "$(dirname "$CONFIG")"
  echo '{"mcpServers":{}}' > "$CONFIG"
fi

# Patcher avec jq
jq '.mcpServers["NOM"] = {
  "command": "npx",
  "args": ["-y", "PACKAGE"],
  "env": {"CLE": "VALEUR"}
}' "$CONFIG" > /tmp/cd_patch.json && mv /tmp/cd_patch.json "$CONFIG"

echo "Claude Desktop patche."
```

Fallback Python :

```bash
python3 - <<'EOF'
import json, os, sys

path = os.path.join(
    os.path.expanduser("~"),
    "Library/Application Support/Claude/claude_desktop_config.json"
)
os.makedirs(os.path.dirname(path), exist_ok=True)

if os.path.exists(path):
    with open(path) as f:
        config = json.load(f)
else:
    config = {"mcpServers": {}}

config.setdefault("mcpServers", {})["NOM"] = {
    "command": "npx",
    "args": ["-y", "PACKAGE"],
    "env": {"CLE": "VALEUR"}
}

with open(path, "w") as f:
    json.dump(config, f, indent=2)

print("Claude Desktop patche.")
EOF
```

Important : Claude Desktop ne recharge pas la config automatiquement. Il faut redémarrer l'application apres le patch.

---

### 5. Vérifier l'installation

Apres les patches, vérifie que tout est en place.

**Claude Code CLI :**

```bash
claude mcp list
```

Le MCP doit apparaitre dans la liste avec son nom.

**OpenCode :**

Ouvre OpenCode, tape `/mcp` dans le chat. La liste des MCP actifs doit inclure le nouveau.

**Claude Desktop :**

Redémarre l'application. Dans une nouvelle conversation, le MCP doit apparaitre dans les outils disponibles (icone marteau ou liste des outils selon la version).

**Test fonctionnel :**

Si possible, exécute une commande simple via le MCP pour confirmer qu'il répond correctement. Exemple pour un MCP de scraping : demande de scraper une URL simple. Exemple pour un MCP GitHub : demande la liste des repos.

---

### 6. Réponse finale à l'utilisateur

Fournis un récapitulatif structuré :

```
MCP installé : <nom canonique> (<package npm>)

Outils configurés :
- OpenCode : oui / non détecté
- Claude Code CLI : oui / non détecté
- Claude Desktop : oui (redémarrage requis) / non détecté

Variables d'environnement configurées :
- NOM_VARIABLE : définie

Pour vérifier dans Claude Code : `claude mcp list`
Pour vérifier dans OpenCode : `/mcp`
Pour Claude Desktop : redémarre l'application.
```

Si une étape a échoué (fichier non trouvé, jq absent, erreur de parsing), indique-le clairement et propose la correction.

---

## Notes techniques

### Cas particuliers

**MCP sans variable d'environnement :** omettre le bloc `env` / `environment` dans la config. Ne pas mettre un objet vide `{}`.

**MCP avec args supplémentaires** (ex: `--headless`, `--port 3000`) : les ajouter dans le tableau `args` apres le package, ex: `["npx", "-y", "@playwright/mcp", "--headless"]` pour OpenCode, ou dans `args` pour Claude Code/Desktop.

**MCP remote (HTTP/SSE) dans Claude Code/Desktop :** utiliser `type: "sse"` et une clé `url` au lieu de `command`/`args`. Vérifier dans le README du MCP si ce mode est supporté.

**Si npx n'est pas disponible :** proposer d'installer Node.js (`brew install node` sur macOS, `apt install nodejs` sur Linux). Le MCP s'installera automatiquement via npx lors du premier lancement.

### Compatibilité des formats

| Champ | OpenCode | Claude Code / Desktop |
|---|---|---|
| Commande | `command: ["npx", "-y", "pkg"]` (tableau) | `command: "npx"` + `args: ["-y", "pkg"]` (séparés) |
| Variables | `environment: {}` | `env: {}` |
| Type local | `type: "local"` | pas de champ type |
| Activation | `enabled: true` | toujours actif |

Ne pas confondre les deux formats : c'est la source d'erreur la plus fréquente.
