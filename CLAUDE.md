# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Antes de Commitar / Fazer Push

Antes de realizar qualquer `git commit` ou `git push`, verifique se este arquivo (`CLAUDE.md`) precisa ser atualizado para refletir as mudanças feitas. Atualize as seções relevantes (Features Covered, Architecture, etc.) se qualquer nova funcionalidade, regra de domínio, aba, fórmula ou estrutura de arquivo tiver sido adicionada ou modificada.

## Running the Project

No build step or server needed. Open `src/index.html` directly in any modern browser. All logic is self-contained — no npm, no dependencies.

## Architecture

This is a vanilla JS SPA with three files under `src/`:

- **[src/index.html](src/index.html)** — All markup and tab structure. Each tab is a `<div id="tab-*" class="tab-panel">` toggled via `switchTab()`.
- **[src/script.js](src/script.js)** — All game logic. Each tab has its own `calc*()` function (`calc()`, `calcDT()`, `calcNovoAgente()`, `calcBonus()`, `calcPatente()`, `calcDescanso()`, `calcCompras()`). All inputs call these directly via `oninput`/`onchange` attributes in the HTML.
- **[src/styles.css](src/styles.css)** — Dark glassmorphism theme using CSS custom properties (`--txt`, `--blue`, `--green`, `--yellow`, etc.).

## Source of Truth

- **[docs/sistema-v4.1.0.md](docs/sistema-v4.1.0.md)** — player-facing rules: attributes, progression tables, classes, DT formulas, resting, purchases. Consult it before changing any formula, progression table, or domain rule the calculator implements. If there is any conflict between the code and this document, the document wins.
- **[docs/guia_de_mestre-v4.0.0.md](docs/guia_de_mestre-v4.0.0.md)** — Game Master guide: creature/threat creation (NA, VD, attack tables), NPC creation, mission generation. Not currently implemented by any tab in this calculator; consult it if adding GM-facing tools (e.g. threat/creature builders).

## Features Covered

### Tab: Agente / Civil (`calc()`)
Calculates a character's stats given class, level, and four attributes (Vigor, Destreza, Força, Vontade).

Outputs:
- **Vida (HP):** base + Vigor scaling per level, formula differs by class
- **Energia:** base + Destreza scaling per level, formula differs by class
- **Limite de Energia:** `(Vigor + Destreza) × 2` (N/A for Civis)
- **Defesa Base:** `10 + Nível` (N/A for Civis)
- **Proficiência:** `+Nível` (N/A for Civis)
- **Deslocamento:** tiered by Destreza, different ranges for Agente vs Civil
- **Dano Corpo a Corpo:** tiered by `Força + Vigor` (Agente) or `Força − 1` (Civil)
- **Inventário:** `Força × 5` slots (Agente), `Força × 3` (Civil); Força=0 → 3 slots; Força<0 → 0 slots
- **Traumas / Sequelas:** `Vontade + 1` capacity (N/A for Civis)
- **Área de Percepção:** `Sentidos ≤ 0 → 3 m`; senão `5 + (Sentidos × 5) m`
- **Dano Furtivo:** `(1 + count)D6+(1 + count)`, gained at levels 3/6/9/12/15/18
- **Limite Habilidades/Turno:** starts at 4, +1 at even levels, +2 at levels 10 and 20
- **Benefícios do nível atual** and **próximo nível**
- **Progressão acumulada** (atributos, habilidades gerais, de classe, arquétipo, outra classe, fortificações)

Supports all classes: Combatente, Especialista, Suporte, Experimento Bestial, Experimento Artificial, Experimento Híbrido, Civil. Civis cap at level 5 and attributes at 3; Agentes cap at level 20 and attributes at 8.

### Tab: Calculadora de DT (`calcDT()`)
Calculates difficulty thresholds for skill and attribute checks.

- **DT de Atributo:** `10 + Nível + (Atributo × 2)`
- Reference table showing DT Atributo for attributes 1–6 at levels 0/5/10/15/20

### Tab: Novo Agente (`calcNovoAgente()` + `calcBonus()`)
Calculates starting stats for a new character based on party averages and the reason for entry.

- **Nível inicial:** `⌈média⌉ − 1`, minimum 0
- **Prestígio inicial:** `média − ⌊média ÷ divisor⌋`, capped to minimum of the party's current rank (or one rank below for Experimento/Exterminado entries)
- **Bônus monetário:** `Prestígio × (500 × multiplicador_de_patente)`
- Motivos cobertos: Morte/Zero, Aposentadoria, Experimento→Regular, Experimento→Experimento, Contido/Exterminado→Regular, Contido/Exterminado→Experimento
- Condition **Amaldiçoado pelo Passado** flagged for Extinto entries

### Tab: Patentes (`calcPatente()`)
Looks up rank (Patente) for a given Prestígio value.

- Shows current rank: name, Prestígio range, mission salary, mod limit, monetary multiplier
- Full reference table for all 8 ranks (Agente → Líder Operacional)

### Tab: Descanso (`calcDescanso()`)
Calculates HP/Energy recovery for a rest.

- Three rest types: Curto (no HP), Médio, Longo
- Modifiers: environment quality (insalubre/adequado/confortável), refeição (+1 die type), interruption (÷2)
- Formula: `ATRIBUTO × Ddado + (Nível × 2)`, die type adjusted by combined modifiers
- Die type ladder: D3 → D4 → D6 → D8 → D10 → D12 → D20

### Tab: Compras (`calcCompras()`)
Assists the player in purchasing equipment and amplifiers for a mission.

Inputs:
- **Dinheiro Disponível:** current money
- **Prestígio Atual:** determines rank and modification limits
- **Inventário Máximo:** max inventory slots (from Força calc)
- **Vontade:** determines amplifier stack limit (Vontade × 3)

Limits enforced by Patente:
- **maxMods per item:** total stacks across all modifications on a single item
- **maxStack per mod:** max stacks of any single modification (per Patente level)
- **Blocked modifications:** conflict rules prevent simultaneous incompatible mods

Item categories: Corpo a Corpo, Explosivos, Armas de Fogo, Munições, Proteções, Exóticos, Armazenamento, Itens Operacionais, Itens Medicinais, Amplificadores.

Amplificadores:
- First stack costs $3.000, additional stacks $1.000 each
- Total stacks capped at Vontade × 3
- Stacks ≥ 2 on the same amp apply -2 Vontade penalty per extra stack

Modification costs: $750 (standard), $250 (Explosivos/Munições), $300 (Armazenamento).
Each modification stack adds +0.2 inventory weight.

Summary tracks: total spent, remaining money (red if negative), inventory used/max (red if exceeded), amp stacks used/limit (red if exceeded).

## Domain Context (SCP Foundation RPG — "Contratados" v4)

Classes (Combatente, Especialista, Suporte) and Experiment subclasses (Bestial, Artificial, Híbrido) have distinct stat progressions. Civis cap at level 5. The `src/script.js` data tables are the authoritative source for per-level benefits.
