// ============================================================
// PATENTES
// ============================================================
const PATENTES = [
    { nome: 'Agente', min: 0, max: 2, salario: 1000, mult: 1.0, modif: '1 nível / 2 mods/item' },
    { nome: 'Operador', min: 3, max: 5, salario: 1500, mult: 1.5, modif: '2 níveis / 4 mods/item' },
    { nome: 'Experiente', min: 6, max: 11, salario: 2500, mult: 2.0, modif: '2 níveis / 6 mods/item' },
    { nome: 'Veterano', min: 12, max: 20, salario: 3500, mult: 2.5, modif: '3 níveis / 9 mods/item' },
    { nome: 'Força Tarefa', min: 21, max: 32, salario: 4500, mult: 3.0, modif: '3 níveis / 12 mods/item' },
    { nome: 'FT Especial', min: 33, max: 47, salario: 5250, mult: 3.5, modif: '4 níveis / 15 mods/item' },
    { nome: 'Op. Especiais', min: 48, max: 65, salario: 6250, mult: 4.0, modif: '4 níveis / 18 mods/item' },
    { nome: 'Líder Operacional', min: 66, max: Infinity, salario: 7500, mult: 4.5, modif: '5 níveis / 20 mods/item' }
];

function getPatente(prest) {
    return PATENTES.find(p => prest >= p.min && prest <= p.max) || PATENTES[PATENTES.length - 1];
}

// ============================================================
// SISTEMA DE ABAS
// ============================================================
function switchTab(id) {
    document.querySelectorAll('[data-tab]').forEach(el => {
        el.classList.toggle('active', el.dataset.tab === id);
    });
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', '#' + id);

    if (id === 'dt') calcDT();
    if (id === 'patente') calcPatente();
    if (id === 'descanso') calcDescanso();
    if (id === 'novo') calcNovoAgente();
    if (id === 'compras') calcCompras();
}

const VALID_TABS = ['agente', 'dt', 'novo', 'patente', 'descanso', 'compras'];
const initialTab = VALID_TABS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'agente';

// ============================================================
// HELPERS DE INPUT
// ============================================================
function stepInput(id, delta) {
    const el = document.getElementById(id);
    const val = (parseInt(el.value) || 0) + delta;
    const max = el.max !== '' ? parseInt(el.max) : Infinity;
    const min = el.min !== '' ? parseInt(el.min) : -Infinity;
    el.value = Math.min(max, Math.max(min, val));
    el.dispatchEvent(new Event('input'));
}

function stepInputFloat(id, delta) {
    const el = document.getElementById(id);
    const step = parseFloat(el.step) || 1;
    const val = Math.round(((parseFloat(el.value) || 0) + delta) * 100) / 100;
    const max = el.max !== '' ? parseFloat(el.max) : Infinity;
    const min = el.min !== '' ? parseFloat(el.min) : -Infinity;
    el.value = Math.min(max, Math.max(min, val));
    el.dispatchEvent(new Event('input'));
}

// ============================================================
// LIMPAR ABA
// ============================================================
function clearTab(id) {
    if (id === 'agente') {
        document.getElementById('classe').value = 'Combatente';
        document.getElementById('nivel').value = 0;
        ['vig','des','for','von','sen'].forEach(x => document.getElementById(x).value = 1);
        calc();
    } else if (id === 'dt') {
        document.getElementById('dt-attr-nivel').value = 0;
        document.getElementById('dt-attr-attr').value = 1;
        calcDT();
    } else if (id === 'novo') {
        document.getElementById('novo-motivo').selectedIndex = 0;
        document.getElementById('novo-media-nivel').value = 5;
        document.getElementById('novo-media-prest').value = 10;
        document.getElementById('bonus-prest').value = 0;
        calcNovoAgente();
    } else if (id === 'patente') {
        document.getElementById('prest-input').value = 0;
        calcPatente();
    } else if (id === 'descanso') {
        document.getElementById('desc-tipo').selectedIndex = 0;
        document.getElementById('desc-qualidade').selectedIndex = 0;
        document.getElementById('desc-vig').value = 1;
        document.getElementById('desc-des').value = 1;
        document.getElementById('desc-nivel').value = 0;
        document.getElementById('desc-refeicao').selectedIndex = 0;
        document.getElementById('desc-interrupcao').selectedIndex = 0;
        calcDescanso();
    } else if (id === 'compras') {
        comprasCart = [];
        comprasAmps = [];
        cmpOpenPanels = new Set();
        document.getElementById('cmp-dinheiro').value = 1000;
        document.getElementById('cmp-prestigio').value = 0;
        document.getElementById('cmp-inventario').value = 5;
        document.getElementById('cmp-vontade').value = 1;
        calcCompras();
        saveCmpState();
    }
}

// ============================================================
// MODAL DE AJUDA
// ============================================================
const HELP_CONTENT = {
    agente: {
        title: 'Ajuda — Agente / Civil',
        html: `
<h3>O que esta aba faz</h3>
<p>Calcula todos os stats derivados do seu personagem com base na classe, nível e atributos.</p>
<h3>Classe &amp; Nível</h3>
<table class="help-table"><thead><tr><th>Campo</th><th>O que representa</th></tr></thead><tbody>
<tr><td>Classe / Registro</td><td>Define as fórmulas de Vida e Energia, e os limites de nível/atributos. Civis têm progressão própria, cap nível 5 e atributos 3.</td></tr>
<tr><td>Nível</td><td>Nível atual (0–20 para Agentes, 0–5 para Civis — chamado "Treinamentos").</td></tr>
</tbody></table>
<h3>Atributos</h3>
<table class="help-table"><thead><tr><th>Atributo</th><th>O que influencia</th></tr></thead><tbody>
<tr><td>Vigor</td><td>Vida, Limite de Energia, Dano Corpo a Corpo, recuperação de Vida no Descanso.</td></tr>
<tr><td>Destreza</td><td>Energia, Limite de Energia, Deslocamento, recuperação de Energia no Descanso.</td></tr>
<tr><td>Força</td><td>Dano Corpo a Corpo e Inventário Máximo.</td></tr>
<tr><td>Vontade</td><td>Capacidade de Traumas/Sequelas suportadas.</td></tr>
<tr><td>Sentidos</td><td>Raio da Área de Percepção.</td></tr>
</tbody></table>
<h3>Stats calculados</h3>
<table class="help-table"><thead><tr><th>Stat</th><th>Fórmula</th></tr></thead><tbody>
<tr><td>Vida / Energia</td><td>Base + escala por Vigor/Destreza × nível. Varia por classe.</td></tr>
<tr><td>Defesa Base</td><td>10 + Nível (N/A para Civis).</td></tr>
<tr><td>Proficiência</td><td>+Nível (N/A para Civis).</td></tr>
<tr><td>Deslocamento</td><td>Escalonado por Destreza: 8–10 m (Agente) ou 6–8 m (Civil).</td></tr>
<tr><td>Inventário Máx.</td><td>Força × 5 (Agente) ou Força × 3 (Civil). Força 0 = 3 slots; negativa = 0.</td></tr>
<tr><td>Corpo (Dano)</td><td>Escalonado por Força + Vigor (Agente) ou Força − 1 (Civil).</td></tr>
<tr><td>Dano Furtivo</td><td>Começa em 1D6+1; ganha +1D6+1 nos níveis 3, 6, 9, 12, 15, 18.</td></tr>
<tr><td>Limite de Energia</td><td>(Vigor + Destreza) × 2 (N/A para Civis).</td></tr>
<tr><td>Traumas Suport.</td><td>Vontade + 1 (N/A para Civis).</td></tr>
<tr><td>Hab. / Turno</td><td>Começa em 4; +1 em níveis pares, +2 extra nos níveis 10 e 20.</td></tr>
<tr><td>Área de Percepção</td><td>Sentidos ≤ 0 → 3 m; senão 5 + (Sentidos × 5) m.</td></tr>
</tbody></table>
<div class="help-note"><strong>Seções de progressão:</strong> "Benefícios deste Nível" mostra ganhos do nível atual. "Habilidades Acumuladas" exibe totais até agora. "Progressão Detalhada" lista nível a nível. "Próximo Nível" antecipa o próximo ganho.</div>`
    },
    dt: {
        title: 'Ajuda — Calculadora de DT',
        html: `
<h3>O que esta aba faz</h3>
<p>Calcula a Dificuldade de Teste (DT) que aliados e inimigos precisam superar para resistir às ações do seu personagem.</p>
<h3>Campos</h3>
<table class="help-table"><thead><tr><th>Campo</th><th>O que representa</th></tr></thead><tbody>
<tr><td>Nível do personagem</td><td>Nível de quem realiza a ação (0–20).</td></tr>
<tr><td>Atributo usado</td><td>Valor do atributo base da ação.</td></tr>
<tr><td>Resultado</td><td>DT calculada: <strong>10 + Nível + (Atributo × 2)</strong>.</td></tr>
</tbody></table>
<h3>Tabela de Referência Rápida</h3>
<p>Mostra a DT resultante para atributos de 1 a 6 nos níveis 0, 5, 10, 15 e 20. Útil para consulta durante o jogo sem precisar digitar valores.</p>
<div class="help-note"><strong>Exemplo:</strong> Personagem nível 10, atributo 3 → DT = 10 + 10 + 6 = <strong>26</strong>.</div>`
    },
    novo: {
        title: 'Ajuda — Novo Agente',
        html: `
<h3>O que esta aba faz</h3>
<p>Calcula nível inicial, prestígio inicial e bônus monetário de um personagem que entra no grupo.</p>
<h3>Campos de entrada</h3>
<table class="help-table"><thead><tr><th>Campo</th><th>O que representa</th></tr></thead><tbody>
<tr><td>Motivo de entrada</td><td>Determina o divisor de penalidade de Prestígio e se pode cair uma patente.</td></tr>
<tr><td>Média de Nível</td><td>Média dos níveis dos membros atuais (excluindo quem está saindo).</td></tr>
<tr><td>Média de Prestígio</td><td>Média de Prestígio dos membros atuais (excluindo quem está saindo).</td></tr>
</tbody></table>
<h3>Motivos e divisores</h3>
<table class="help-table"><thead><tr><th>Motivo</th><th>Divisor</th></tr></thead><tbody>
<tr><td>Morte / Entrada do zero</td><td>÷7</td></tr>
<tr><td>Aposentadoria</td><td>÷10 (penalidade menor)</td></tr>
<tr><td>Experimento → Regular</td><td>÷5, pode cair uma patente</td></tr>
<tr><td>Experimento → Experimento</td><td>÷3, pode cair uma patente</td></tr>
<tr><td>Contido/Exterminado → Regular</td><td>÷5, pode cair uma patente + condição Amaldiçoado</td></tr>
<tr><td>Contido/Exterminado → Experimento</td><td>÷3, pode cair uma patente + condição Amaldiçoado</td></tr>
</tbody></table>
<h3>Fórmulas</h3>
<table class="help-table"><thead><tr><th>Valor</th><th>Fórmula</th></tr></thead><tbody>
<tr><td>Nível Inicial</td><td>⌈média⌉ − 1, mínimo 0.</td></tr>
<tr><td>Prestígio Inicial</td><td>média − ⌊média ÷ divisor⌋, com cap mínimo de patente.</td></tr>
</tbody></table>
<h3>Bônus Monetário</h3>
<p>Prestígio Inicial × (500 × Multiplicador de Patente). Não inclui o dinheiro inicial padrão (1.000 + 4D4 × 250), que deve ser calculado separadamente por ser aleatório.</p>`
    },
    patente: {
        title: 'Ajuda — Patentes',
        html: `
<h3>O que esta aba faz</h3>
<p>Consulta a patente de um personagem pelo Prestígio atual e exibe a tabela completa de todas as patentes.</p>
<h3>Informações da patente</h3>
<table class="help-table"><thead><tr><th>Campo</th><th>O que representa</th></tr></thead><tbody>
<tr><td>Prestígio atual</td><td>Valor de Prestígio do personagem.</td></tr>
<tr><td>Patente</td><td>Nome da patente correspondente ao Prestígio informado.</td></tr>
<tr><td>Salário por missão</td><td>Quanto o personagem recebe ao completar uma missão.</td></tr>
<tr><td>Limite de mods</td><td>Máximo de stacks por modificação (1ª coluna) e total de mods por item (2ª coluna). Ex: "3 níveis / 9 mods/item" significa até 3 stacks de qualquer mod, e até 9 mods no mesmo item.</td></tr>
<tr><td>Multiplicador monetário</td><td>Usado no cálculo do bônus monetário de novos agentes.</td></tr>
</tbody></table>
<h3>Tabela de Referência</h3>
<p>Lista todas as 8 patentes em ordem, com a patente atual destacada. Útil para planejar progressão ou comparar benefícios entre níveis de Prestígio.</p>
<div class="help-note"><strong>Patentes disponíveis:</strong> Agente (0–2) → Operador → Experiente → Veterano → Força Tarefa → FT Especial → Op. Especiais → Líder Operacional (66+).</div>`
    },
    descanso: {
        title: 'Ajuda — Descanso',
        html: `
<h3>O que esta aba faz</h3>
<p>Calcula a recuperação de Vida e Energia de um descanso, com base no tipo, ambiente e modificadores.</p>
<h3>Tipos de descanso</h3>
<table class="help-table"><thead><tr><th>Tipo</th><th>Duração</th><th>Recupera</th></tr></thead><tbody>
<tr><td>Curto</td><td>~15 min</td><td>Apenas Energia (dado base D4)</td></tr>
<tr><td>Médio</td><td>2–4h</td><td>Vida (D4) e Energia (D6)</td></tr>
<tr><td>Longo</td><td>6–8h</td><td>Vida (D6) e Energia (D8) — uma vez por dia</td></tr>
</tbody></table>
<h3>Modificadores</h3>
<table class="help-table"><thead><tr><th>Campo</th><th>Efeito</th></tr></thead><tbody>
<tr><td>Qualidade do Ambiente</td><td>Insalubre: −1 tipo de dado. Adequado: padrão. Confortável: +1 tipo de dado. A Base da Fundação é sempre Confortável.</td></tr>
<tr><td>Vigor</td><td>Multiplicador da recuperação de Vida.</td></tr>
<tr><td>Destreza</td><td>Multiplicador da recuperação de Energia.</td></tr>
<tr><td>Nível</td><td>Bônus fixo de Nível × 2 somado à recuperação.</td></tr>
<tr><td>Refeição consumida</td><td>+1 tipo de dado na recuperação.</td></tr>
<tr><td>Foi interrompido</td><td>Resultado final ÷ 2 (arredonda para baixo).</td></tr>
</tbody></table>
<div class="help-note">
<strong>Fórmula geral:</strong> ATRIBUTO × Ddado + (Nível × 2)<br>
<strong>Escala de dados:</strong> D3 → D4 → D6 → D8 → D10 → D12 → D20<br>
Os modificadores de qualidade e refeição somam e sobem ou descem o tipo de dado nessa escala.
</div>`
    },
    compras: {
        title: 'Ajuda — Compras',
        html: `
<h3>O que esta aba faz</h3>
<p>Auxilia a montar o equipamento para uma missão respeitando orçamento, inventário, patente e limite de amplificadores.</p>
<h3>Configuração do Agente</h3>
<table class="help-table"><thead><tr><th>Campo</th><th>O que representa</th></tr></thead><tbody>
<tr><td>Dinheiro Disponível</td><td>Quanto dinheiro o personagem tem para gastar.</td></tr>
<tr><td>Prestígio Atual</td><td>Define a patente e os limites de modificações (stacks por mod e total de mods por item).</td></tr>
<tr><td>Inventário Máximo</td><td>Capacidade total de slots (calculada na aba Agente / Civil pela Força).</td></tr>
<tr><td>Vontade</td><td>Limite total de stacks de Amplificadores: Vontade × 3.</td></tr>
</tbody></table>
<h3>Painel de Resumo</h3>
<table class="help-table"><thead><tr><th>Campo</th><th>O que representa</th></tr></thead><tbody>
<tr><td>Dinheiro Restante</td><td>Disponível menos gasto total. Fica vermelho se negativo.</td></tr>
<tr><td>Inventário Usado</td><td>Slots ocupados vs. capacidade (inclui bônus de mochilas vestidas). Vermelho se excedido.</td></tr>
<tr><td>Amplificadores</td><td>Stacks totais vs. limite (Vontade × 3). Vermelho se excedido.</td></tr>
<tr><td>Mods por Item</td><td>Limite de mods e stacks por modificação para a patente atual.</td></tr>
<tr><td>Penalidade Amps</td><td>Cada amp com 2+ stacks aplica −2 Vontade por stack extra (ex: 3 stacks = −4 Vontade).</td></tr>
</tbody></table>
<h3>Amplificadores</h3>
<table class="help-table"><thead><tr><th>Regra</th><th>Detalhe</th></tr></thead><tbody>
<tr><td>Custo</td><td>1º stack: $3.000. Stacks adicionais do mesmo amp: $1.000 cada.</td></tr>
<tr><td>Limite total</td><td>Vontade × 3 stacks no total entre todos os amplificadores.</td></tr>
</tbody></table>
<h3>Modificações de itens</h3>
<table class="help-table"><thead><tr><th>Regra</th><th>Detalhe</th></tr></thead><tbody>
<tr><td>Custo por stack</td><td>$750 (armas, proteções, exóticos), $250 (explosivos, munições), $300 (armazenamento).</td></tr>
<tr><td>Peso</td><td>Cada stack de mod adiciona +0,2 slots ao item.</td></tr>
<tr><td>Conflitos</td><td>Mods bloqueadas aparecem em vermelho e não podem ser adicionadas juntas no mesmo item.</td></tr>
</tbody></table>
<div class="help-note"><strong>Armazenamento:</strong> Mochilas <em>vestidas</em> ampliam o inventário e não pesam. Mochilas <em>guardadas no inventário</em> pesam mas não dão bônus de slots.</div>`
    }
};

function openHelp(tab) {
    const content = HELP_CONTENT[tab];
    if (!content) return;
    document.getElementById('help-modal-title').textContent = content.title;
    document.getElementById('help-modal-body').innerHTML = content.html;
    document.getElementById('help-overlay').classList.add('open');
    document.getElementById('help-modal-body').scrollTop = 0;
}

function closeHelp() {
    document.getElementById('help-overlay').classList.remove('open');
}

function closeHelpOnOverlay(e) {
    if (e.target === document.getElementById('help-overlay')) closeHelp();
}

// ============================================================
// EVENT LISTENERS GLOBAIS
// ============================================================
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeHelp();
        const menu = document.getElementById('cmp-export-menu');
        if (menu) menu.classList.remove('open');
    }
});

document.addEventListener('click', () => {
    const menu = document.getElementById('cmp-export-menu');
    if (menu) menu.classList.remove('open');
});

// ============================================================
// SISTEMA DE TEMA V2
// ============================================================
const ACCENTS = {
    vermelho: { hex: '#ff3333', rgb: '255,51,51',     g2: '#990000' },
    azul:     { hex: '#0099dd', rgb: '0,153,221',     g2: '#005588' },
    verde:    { hex: '#00e87a', rgb: '0,232,122',     g2: '#007a40' },
    roxo:     { hex: '#c084fc', rgb: '192,132,252',   g2: '#7c3aed' },
    laranja:  { hex: '#ff8c00', rgb: '255,140,0',     g2: '#cc5500' },
    amarelo:  { hex: '#ffd166', rgb: '255,209,102',   g2: '#b38200' },
    ciano:    { hex: '#00e5ff', rgb: '0,229,255',     g2: '#007799' },
    branco:   { hex: '#ffffff', rgb: '255,255,255',   g2: '#999999' },
};

const BASES = {
    preto:   { bg: '#05050a', modal: '#0c0c14', modal2: '#111120', nav: 'rgba(5,5,10,.97)',      sel: '#0c0c14', selopt: '#05050a', dark: true  },
    cinza:   { bg: '#0c0e18', modal: '#131624', modal2: '#191c30', nav: 'rgba(12,14,24,.97)',    sel: '#131624', selopt: '#0c0e18', dark: true  },
    ardosia: { bg: '#141a2e', modal: '#1c2440', modal2: '#222950', nav: 'rgba(20,26,46,.97)',    sel: '#1c2440', selopt: '#141a2e', dark: true  },
    branco:  { bg: '#f0f2f8', modal: '#ffffff', modal2: '#f0f2f8', nav: 'rgba(240,242,248,.97)', sel: '#f0f2f8', selopt: '#ffffff', dark: false },
};

let _themeState = { accent: 'vermelho', base: 'preto', glass: true, liquid: true, ...JSON.parse(localStorage.getItem('ct-theme-v2') || 'null') };

function applyTheme(accent, base, glass, liquid = _themeState.liquid) {
    const a = ACCENTS[accent] || ACCENTS.vermelho;
    const b = BASES[base] || BASES.preto;
    const r = document.documentElement;

    r.style.setProperty('--accent', a.hex);
    r.style.setProperty('--accent-rgb', a.rgb);
    r.style.setProperty('--bg-solid', b.bg);
    r.style.setProperty('--modal-bg', b.modal);
    r.style.setProperty('--modal-bg2', b.modal2);
    r.style.setProperty('--nav-bg', b.nav);
    r.style.setProperty('--select-bg', b.sel);
    r.style.setProperty('--select-opt-bg', b.selopt);
    r.setAttribute('data-base', base);

    if (b.dark) {
        r.style.setProperty('--txt', '#f0eef6');
        r.style.setProperty('--txt2', '#6a6880');
        r.style.setProperty('--border', 'rgba(255,255,255,0.07)');
        r.style.setProperty('--card-bg', 'rgba(255,255,255,0.035)');
        r.style.setProperty('--glass-solid', 'rgba(255,255,255,0.06)');
        r.style.setProperty('--green', '#00e87a');
        r.style.setProperty('--blue', '#0099dd');
        r.style.setProperty('--yellow', '#ffd166');
    } else {
        r.style.setProperty('--txt', '#151825');
        r.style.setProperty('--txt2', '#5a5e7a');
        r.style.setProperty('--border', 'rgba(0,0,0,0.1)');
        r.style.setProperty('--card-bg', 'rgba(0,0,0,0.04)');
        r.style.setProperty('--glass-solid', 'rgba(0,0,0,0.07)');
        r.style.setProperty('--green', '#008844');
        r.style.setProperty('--blue', '#0066aa');
        r.style.setProperty('--yellow', '#885500');
    }

    if (glass) {
        r.classList.remove('no-glass');
    } else {
        r.classList.add('no-glass');
    }

    if (liquid) {
        r.classList.remove('no-liquid');
    } else {
        r.classList.add('no-liquid');
    }
}

function setAccent(accent) {
    _themeState.accent = accent;
    applyTheme(_themeState.accent, _themeState.base, _themeState.glass);
    saveTheme();
    document.querySelectorAll('.swatch-accent').forEach(s => {
        s.classList.toggle('active', s.dataset.accent === accent);
    });
}

function setBase(base) {
    _themeState.base = base;
    applyTheme(_themeState.accent, _themeState.base, _themeState.glass);
    saveTheme();
    document.querySelectorAll('.swatch-base').forEach(s => {
        s.classList.toggle('active', s.dataset.base === base);
    });
}

function toggleGlass() {
    _themeState.glass = !_themeState.glass;
    applyTheme(_themeState.accent, _themeState.base, _themeState.glass);
    saveTheme();
    const btn = document.getElementById('glass-toggle');
    if (btn) btn.classList.toggle('on', _themeState.glass);
}

function toggleLiquid() {
    _themeState.liquid = !_themeState.liquid;
    applyTheme(_themeState.accent, _themeState.base, _themeState.glass, _themeState.liquid);
    saveTheme();
    const btn = document.getElementById('liquid-toggle');
    if (btn) btn.classList.toggle('on', _themeState.liquid);
}

function saveTheme() {
    localStorage.setItem('ct-theme-v2', JSON.stringify(_themeState));
}

function openSettings() {
    const overlay = document.getElementById('settings-overlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    // sync UI state
    document.querySelectorAll('.swatch-accent').forEach(s => {
        s.classList.toggle('active', s.dataset.accent === _themeState.accent);
    });
    document.querySelectorAll('.swatch-base').forEach(s => {
        s.classList.toggle('active', s.dataset.base === _themeState.base);
    });
    const glassBtn = document.getElementById('glass-toggle');
    if (glassBtn) glassBtn.classList.toggle('on', _themeState.glass);
    const liquidBtn = document.getElementById('liquid-toggle');
    if (liquidBtn) liquidBtn.classList.toggle('on', _themeState.liquid);
}

function closeSettings() {
    const overlay = document.getElementById('settings-overlay');
    if (overlay) overlay.classList.add('hidden');
}

function closeSettingsOnOverlay(e) {
    if (e.target === document.getElementById('settings-overlay')) closeSettings();
}

// Legado — mantido para compatibilidade
function setTheme(theme) {}

// ============================================================
// EASTER EGG — título "Contratados": 2 cliques, 5 cliques, 1 clique
// ============================================================
(function () {
    const PATTERN = [2, 5, 1];
    let groups = [];
    let currentCount = 0;
    let timer = null;

    const el = document.getElementById('easter-egg-title');
    if (!el) return;

    el.style.cursor = 'default';

    el.addEventListener('click', function () {
        currentCount++;
        clearTimeout(timer);
        timer = setTimeout(function () {
            groups.push(currentCount);
            currentCount = 0;
            if (groups.length === PATTERN.length) {
                if (groups.every(function (v, i) { return v === PATTERN[i]; })) {
                    alert('Aquele que procura, acha, e você achou A MORTE');
                }
                groups = [];
            } else if (groups.length > PATTERN.length) {
                groups = [];
            }
        }, 700);
    });
})();

// ============================================================
// CARREGAMENTO DE ABAS E INICIALIZAÇÃO
// ============================================================
async function _loadTabs() {
    const tabs = ['agente', 'dt', 'novo', 'patente', 'descanso', 'compras'];
    try {
        await Promise.all(tabs.map(async tab => {
            const res = await fetch(`tabs/${tab}.html`);
            if (!res.ok) throw new Error(`Failed to load tabs/${tab}.html: ${res.status}`);
            const html = await res.text();
            document.getElementById(`tab-${tab}`).innerHTML = html;
        }));
    } catch (e) {
        console.error('Tab loading error:', e);
        document.body.innerHTML = `<div style="font-family:monospace;padding:40px;color:#ff5252;text-align:center">
            <h2>Erro ao carregar os arquivos</h2>
            <p>Este projeto precisa de um servidor local.</p>
            <p>Execute: <code>python -m http.server</code> ou <code>npx wrangler pages dev src</code></p>
            <p>Depois abra: <code>http://localhost:8000</code></p>
        </div>`;
        return;
    }
    _initApp();
}

function _initApp() {
    aplicarLimitesPorClasse(document.getElementById('classe').value);
    calc();
    calcDT();
    calcPatente();
    calcDescanso();
    loadCmpState();
    calcCompras();
    calcNovoAgente();
    if (initialTab !== 'agente') switchTab(initialTab);
    applyTheme(_themeState.accent, _themeState.base, _themeState.glass, _themeState.liquid);
}

document.addEventListener('DOMContentLoaded', _loadTabs);
