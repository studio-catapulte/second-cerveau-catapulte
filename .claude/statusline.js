#!/usr/bin/env node
/**
 * Barre de statut Claude Code.
 *
 * Affiche : modele | dossier | branche git | contexte utilise | quotas 5h / 7j
 *
 * Volontairement sans aucune dependance (pas de jq, pas de npm install) :
 * ce script doit tourner tel quel sur Windows, macOS et Linux.
 * Claude Code envoie un JSON sur stdin, on ecrit une ligne sur stdout.
 *
 * Les champs `rate_limits` n'apparaissent que pour les abonnes Pro/Max,
 * et seulement apres la premiere reponse de l'API : la barre se remplit
 * donc au deuxieme echange, c'est normal.
 */

const { execFileSync } = require("child_process");

const dim = (code, text) => `\x1b[2;${code}m${text}\x1b[0m`;
const CYAN = 36, BLUE = 34, GREEN = 32, YELLOW = 33, MAGENTA = 35;

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    process.exit(0); // JSON illisible : barre vide plutot qu'un message d'erreur
  }

  const parts = [];

  // Modele
  const model = data?.model?.display_name;
  if (model) parts.push(dim(CYAN, model));

  // Dossier courant
  const cwd = data?.workspace?.current_dir;
  if (cwd) {
    const name = cwd.split(/[\\/]/).filter(Boolean).pop();
    if (name) parts.push(dim(BLUE, name));
  }

  // Branche git (silencieux si on n'est pas dans un repo)
  if (cwd) {
    try {
      const branch = execFileSync("git", ["-C", cwd, "branch", "--show-current"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      if (branch) parts.push(dim(GREEN, branch));
    } catch {
      /* pas un repo git, ou git absent */
    }
  }

  // Contexte utilise
  const ctx = data?.context_window?.used_percentage;
  if (typeof ctx === "number") {
    // Au-dela de 40 %, on passe en jaune : c'est le seuil ou on lance /done.
    parts.push(dim(ctx >= 40 ? YELLOW : MAGENTA, `ctx ${Math.round(ctx)}%`));
  }

  // Quotas Claude Pro/Max : bloc de 5h et fenetre de 7 jours
  const fiveHour = data?.rate_limits?.five_hour?.used_percentage;
  const sevenDay = data?.rate_limits?.seven_day?.used_percentage;
  if (typeof fiveHour === "number" || typeof sevenDay === "number") {
    const h = Math.round(fiveHour ?? 0);
    const d = Math.round(sevenDay ?? 0);
    parts.push(dim(h >= 80 || d >= 80 ? YELLOW : CYAN, `5h ${h}% | 7j ${d}%`));
  }

  process.stdout.write(parts.join(" "));
});
