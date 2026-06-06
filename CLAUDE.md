# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Project

No build step or server needed. Open `index.html` directly in any modern browser. All logic is self-contained — no npm, no dependencies.

## Architecture

This is a vanilla JS SPA with three files:

- **[index.html](index.html)** — All markup and tab structure. Each tab is a `<div id="tab-*" class="tab-panel">` toggled via `switchTab()`.
- **[script.js](script.js)** — All game logic. Each tab has its own `calc*()` function (`calc()`, `calcDT()`, `calcNovoAgente()`, `calcBonus()`, `calcPatente()`, `calcDescanso()`). All inputs call these directly via `oninput`/`onchange` attributes in the HTML.
- **[styles.css](styles.css)** — Dark glassmorphism theme using CSS custom properties (`--txt`, `--blue`, `--green`, `--yellow`, etc.).

## Source of Truth

All game rules are in [docs/Contratados - Sistema v4.0.0.md](docs/Contratados%20-%20Sistema%20v4.0.0.md). Consult it before changing any formula, progression table, or domain rule. If there is any conflict between the code and the document, the document wins.

## Domain Context (SCP Foundation RPG — "Contratados" v5)

The app implements tabletop RPG rules. Key formulas:

- **HP (Vida):** base per class + Vigor scaling per level
- **Energy (Energia):** base per class + Destreza scaling per level  
- **DT de Habilidade:** `5 + Nível + (Atributo × 3)`
- **DT de Atributo:** `10 + Nível + (Atributo × 2)`
- **Energy Cap:** `(Vigor + Destreza) × 2`
- **Trauma capacity:** `Vontade + 1`
- **Proficiency:** scales with level, same for all classes

Classes (Combatente, Especialista, Suporte) and Experiment subclasses (Bestial, Artificial, Híbrido) have distinct stat progressions. Civis cap at level 5. The `script.js` data tables are the authoritative source for per-level benefits.
