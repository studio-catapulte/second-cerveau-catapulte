'use strict';

const obsidian = require('obsidian');

/*
 * Lean Terminal - Escape Fix
 * -------------------------------------------------------------
 * Empeche Obsidian de voler la touche "Echap" quand le focus est
 * dans un terminal Lean Terminal (ex: une session Claude Code).
 *
 * Contexte technique :
 *  - Obsidian ecoute Echap sur `window` en phase capture, AVANT le
 *    chargement des plugins : impossible de le devancer avec un
 *    simple listener. Quand on appuie sur Echap, Obsidian a deja
 *    bascule le focus vers le dernier onglet markdown.
 *  - Le pty de la session vit dans : view.tabManager.sessions[N].pty
 *    (Lean Terminal gere ses propres onglets internes).
 *
 * Strategie :
 *  1) Livrer l'octet ESC (0x1b) directement au pty de la session
 *     focalisee -> Claude Code recoit bien son Echap.
 *  2) Re-activer immediatement (de facon synchrone, avant le rendu)
 *     le leaf du terminal et lui redonner le focus -> le switch
 *     d'onglet declenche par Obsidian est annule sans clignotement.
 *     Un second passage via requestAnimationFrame sert de filet.
 *
 * Hors terminal, le plugin ne fait rien : Obsidian se comporte
 * normalement partout ailleurs.
 */

const ESC = '\x1b';

function isTerminalFocus(active) {
  return !!(active && active.classList && active.classList.contains('xterm-helper-textarea'));
}

function activeTerminalView(app, active) {
  if (!active) return null;
  const leaves = app.workspace.getLeavesOfType('terminal-view');
  for (const leaf of leaves) {
    const v = leaf.view;
    if (v && v.containerEl && v.containerEl.contains(active)) return v;
  }
  return null;
}

function focusedSession(view, active) {
  const sessions = view && view.tabManager && view.tabManager.sessions;
  if (!Array.isArray(sessions)) return null;
  return (
    sessions.find((s) => s && s.terminal && s.terminal.textarea === active) ||
    sessions.find((s) => s && s.terminal && s.terminal.textarea && s.terminal.textarea.contains(active)) ||
    sessions.find((s) => s && s.pty && typeof s.pty.write === 'function') ||
    null
  );
}

module.exports = class LeanTermEscapeFix extends obsidian.Plugin {
  onload() {
    // Tentative "propre" via le keymap d'Obsidian (inoffensif si sans effet).
    this._scopeHandler = null;
    try {
      if (this.app.scope && typeof this.app.scope.register === 'function') {
        this._scopeHandler = this.app.scope.register([], 'Escape', () =>
          isTerminalFocus(document.activeElement) ? false : true
        );
      }
    } catch (e) {}

    this._onKeydown = (e) => {
      if (e.key !== 'Escape') return;
      const active = document.activeElement;
      if (!isTerminalFocus(active)) return;

      const view = activeTerminalView(this.app, active);
      const leaf = view && view.leaf;
      const session = focusedSession(view, active);

      // 1) Livrer l'ESC a Claude Code.
      if (session && session.pty && typeof session.pty.write === 'function') {
        try { session.pty.write(ESC); } catch (err) {}
      }

      // (utile si un jour on gagne la course sur l'evenement)
      e.stopImmediatePropagation();
      e.preventDefault();

      // 2) Annuler le switch d'onglet : restauration synchrone (sans
      //    clignotement) + filet en rAF.
      const restore = () => {
        try {
          if (leaf && this.app.workspace.activeLeaf !== leaf) {
            this.app.workspace.setActiveLeaf(leaf, { focus: true });
          }
          if (session && session.terminal && typeof session.terminal.focus === 'function') {
            session.terminal.focus();
          } else if (active && typeof active.focus === 'function') {
            active.focus();
          }
        } catch (err) {}
      };
      if (leaf) {
        restore();
        requestAnimationFrame(restore);
      }
    };
    window.addEventListener('keydown', this._onKeydown, true);
    this.register(() => window.removeEventListener('keydown', this._onKeydown, true));
  }

  onunload() {
    try {
      if (this._scopeHandler && this.app.scope && this.app.scope.unregister) {
        this.app.scope.unregister(this._scopeHandler);
      }
    } catch (e) {}
  }
};
