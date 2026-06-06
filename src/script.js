// ============================================================
// DADOS DE PROGRESSÃO
// ============================================================
const dadosAgente = {
    0: [],
    1: ['+1 Atributo', '+1 Habilidade Geral', '+1 Habilidade de Classe ou Arquétipo'],
    2: ['+2 Atributos', '+1 Habilidade por Turno', '+1 Habilidade de Classe'],
    3: ['+1 Atributo', '+1 Habilidade Geral', '+1 Habilidade de Classe ou Arquétipo', '+1D6+1 de dano furtivo'],
    4: ['+2 Atributos', '+1 Habilidade Geral', '+1 Habilidade por Turno'],
    5: ['+1 Atributo', '+1 Habilidade de outra classe/arquétipo da sua classe', '+1 Habilidade de Classe ou Arquétipo'],
    6: ['+2 Atributos', '+1 Habilidade Geral', '+1 Habilidade por Turno', '+1 Habilidade de Classe', '+1D6+1 de dano furtivo'],
    7: ['+1 Atributo', '+1 Habilidade de Classe ou Arquétipo', '+1 Fortificação de Personalidade'],
    8: ['+2 Atributos', '+1 Habilidade Geral', '+1 Habilidade por Turno'],
    9: ['+1 Atributo', '+1 Habilidade Geral', '+1 Habilidade de Classe ou Arquétipo', '+1D6+1 de dano furtivo'],
    10: ['+2 Atributos', '+2 Habilidades por Turno', '+1 Habilidade de outra classe/arquétipo da sua classe', '+1 Habilidade de Classe'],
    11: ['+1 Atributo', '+1 Habilidade Geral', '+1 Habilidade de Classe ou Arquétipo'],
    12: ['+2 Atributos', '+1 Habilidade por Turno', '+1D6+1 de dano furtivo'],
    13: ['+1 Atributo', '+1 Habilidade Geral', '+1 Habilidade de Classe ou Arquétipo'],
    14: ['+2 Atributos', '+1 Habilidade Geral', '+1 Habilidade por Turno', '+1 Habilidade de Classe', '+1 Fortificação de Personalidade'],
    15: ['+1 Atributo', '+1 Habilidade de outra classe/arquétipo da sua classe', '+1 Habilidade de Classe ou Arquétipo', '+1D6+1 de dano furtivo'],
    16: ['+2 Atributos', '+1 Habilidade Geral', '+1 Habilidade por Turno'],
    17: ['+1 Atributo', '+1 Habilidade de Classe ou Arquétipo'],
    18: ['+2 Atributos', '+1 Habilidade Geral', '+1 Habilidade por Turno', '+1 Habilidade de Classe', '+1D6+1 de dano furtivo'],
    19: ['+1 Atributo', '+1 Habilidade Geral', '+1 Habilidade de Classe ou Arquétipo'],
    20: ['+2 Atributos', '+2 Habilidades por Turno', '+1 Habilidade de outra classe/arquétipo da sua classe']
};

const dadosCivil = {
    0: [],
    1: ['Treinamento Iniciante', '+1 Habilidade Civil', '+1 Atributo'],
    2: ['Treinamento Treinado', '+1 Habilidade Civil'],
    3: ['Treinamento Profissional', '+1 Habilidade Civil', '+1 Atributo'],
    4: ['Treinamento Especialista', '+1 Habilidade Civil'],
    5: ['Treinamento Elite', '+1 Habilidade Civil', '+1 Atributo', '1 Habilidade de Classe (sem benefícios gerais da classe)']
};

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
// HELPERS
// ============================================================
function calcularDeslocamento(des, isCivil) {
    if (isCivil) {
        if (des <= 1) return '6m';
        if (des <= 3) return '7m';
        return '8m';
    } else {
        if (des <= 0) return '8m';
        if (des <= 4) return '9m';
        return '10m';
    }
}

function calcularDanoCorpo(forca, vigor, isCivil) {
    if (isCivil) {
        let d = forca - 1;
        return (d > 0 ? d : 0) + ' [Físico]';
    }
    let pts = forca + vigor;
    if (pts < 0) return '0 Dano';
    if (pts <= 1) return '1 [Físico]';
    if (pts <= 3) return '1D3 [Físico]';
    if (pts <= 5) return '1D4 [Físico]';
    if (pts <= 7) return '1D6 [Físico]';
    if (pts <= 9) return '2D6 [Físico]';
    if (pts <= 11) return '3D6 [Físico]';
    if (pts === 12) return '4D6 [Físico]';
    return '4D6+7 [Físico]';
}

function calcularInventario(forca, isCivil) {
    if (forca < 0) return '0';
    if (!isCivil && forca === 0) return '3';
    return isCivil ? (forca * 3).toString() : (forca * 5).toString();
}

function tagColor(texto) {
    if (texto.includes('Furtivo') || texto.includes('furtivo')) return 'tag-green';
    if (texto.includes('Turno')) return 'tag-blue';
    if (texto.includes('Outra') || texto.includes('outra')) return 'tag-blue';
    if (texto.includes('Fortific')) return '';
    return '';
}

function aplicarLimitesPorClasse(classe) {
    const isCivil = classe === 'Civil';
    const isExpArtificial = classe === 'Experimento Artificial';
    const limiteNivel = isCivil ? 5 : 20;
    let limiteAtributo;
    if (isCivil) limiteAtributo = 3;
    else if (isExpArtificial) limiteAtributo = 8;
    else limiteAtributo = 7;

    const nivelEl = document.getElementById('nivel');
    const nivelValor = document.getElementById('nivel-valor');
    nivelEl.min = 0;
    nivelEl.max = limiteNivel;
    nivelEl.step = 1;

    ['vig', 'des', 'for', 'von', 'sen'].forEach(id => {
        const el = document.getElementById(id);
        el.min = -5;
        el.max = limiteAtributo;
        if (+el.value > limiteAtributo) el.value = limiteAtributo;
        if (+el.value < -5) el.value = -5;
    });

    if (+nivelEl.value > limiteNivel) nivelEl.value = limiteNivel;
    if (+nivelEl.value < 0) nivelEl.value = 0;

    if (nivelValor) nivelValor.textContent = nivelEl.value;
}

// ============================================================
// ABA AGENTE — CÁLCULO PRINCIPAL
// ============================================================
function calc() {
    const c = document.getElementById('classe').value;
    const isCivil = (c === 'Civil');
    aplicarLimitesPorClasse(c);

    let n = +document.getElementById('nivel').value;
    const v = +document.getElementById('vig').value;
    const d = +document.getElementById('des').value;
    const f = +document.getElementById('for').value;
    const von = +document.getElementById('von').value;
    const sen = +document.getElementById('sen').value;

    // Adapta UI
    document.getElementById('label-nivel').textContent = isCivil ? 'Treinamentos (0–5)' : 'Nível';
    document.getElementById('titulo-beneficios').textContent = isCivil ? 'Benefícios deste Treinamento' : 'Benefícios deste Nível';
    document.getElementById('titulo-historico').textContent = isCivil ? 'Progresso de Treinamentos' : 'Progressão Detalhada';
    document.getElementById('titulo-proximo').textContent = isCivil ? 'Próximo Treinamento' : 'Próximo Nível';

    if (isCivil && n > 5) { n = 5; document.getElementById('nivel').value = 5; }
    if (!isCivil && n > 20) { n = 20; document.getElementById('nivel').value = 20; }
    document.getElementById('nivel-valor').textContent = n;

    // Saúde
    let vida = 0, energia = 0;
    if (c === 'Combatente') { vida = (30 + v * 4) + n * (7 + v * 2); energia = (15 + d * 2) + n * (4 + d * 2); }
    else if (c === 'Especialista') { vida = (20 + v * 3) + n * (4 + v * 2); energia = (22 + d * 3) + n * (7 + d * 2); }
    else if (c === 'Suporte') { vida = (25 + v * 3) + n * (5 + v * 2); energia = (18 + d * 2) + n * (6 + d * 2); }
    else if (c === 'Experimento Bestial') { vida = (30 + v * 5) + n * (9 + v * 2); energia = (22 + d * 2) + n * (5 + d * 2); }
    else if (c === 'Experimento Artificial') { vida = (27 + v * 3) + n * (5 + v * 2); energia = (22 + d * 4) + n * (9 + d * 2); }
    else if (c === 'Experimento Híbrido') { vida = (25 + v * 4) + n * (7 + v * 2); energia = (18 + d * 3) + n * (7 + d * 2); }
    else if (isCivil) { vida = (10 + v) + n * v; energia = (5 + d * 2) + n * d; }

    document.getElementById('vida').textContent = Math.floor(vida);
    document.getElementById('energia').textContent = Math.floor(energia);
    document.getElementById('defesa').textContent = isCivil ? 'N/A' : (10 + n);
    document.getElementById('prof').textContent = isCivil ? 'N/A' : ('+' + n);
    document.getElementById('deslocamento').textContent = calcularDeslocamento(d, isCivil);
    document.getElementById('corpo').textContent = calcularDanoCorpo(f, v, isCivil);
    document.getElementById('inventario').textContent = calcularInventario(f, isCivil);
    document.getElementById('traumas').textContent = isCivil ? 'N/A' : (von + 1);
    document.getElementById('sequelas').textContent = isCivil ? 'N/A' : ('VON (' + von + ')');
    document.getElementById('percepcao').textContent = sen <= 0 ? '3 m' : (5 + sen * 5) + ' m';

    // Limite de Energia
    const limEn = isCivil ? d : (v + d) * 2;
    document.getElementById('limiteenergia').textContent = isCivil ? 'N/A' : limEn;

    // Dano Furtivo
    const furtivos = isCivil ? 0 : [3, 6, 9, 12, 15, 18].filter(x => x <= n).length;
    document.getElementById('furtivo').textContent = isCivil ? 'N/A' : ((1 + furtivos) + 'D6+' + (1 + furtivos));

    // Limite Habilidades/Turno — começa em 4, +1 em nível 2,4,6,8,10(×2),12,14,16,18,20(×2)
    let habTurnoBase = 4;
    let habTurnoGanhos = 0;
    if (!isCivil) {
        for (let i = 1; i <= n; i++) {
            const bs = dadosAgente[i] || [];
            bs.forEach(b => {
                if (b.includes('2 Habilidades por Turno')) habTurnoGanhos += 2;
                else if (b.includes('Habilidade por Turno')) habTurnoGanhos += 1;
            });
        }
    }
    const habTurnoTotal = isCivil ? 'N/A' : (habTurnoBase + habTurnoGanhos);
    document.getElementById('habturno').textContent = habTurnoTotal;
    document.getElementById('habturno-sub').textContent = isCivil ? '' : ('base 4 + ' + habTurnoGanhos + ' ganhos');

    // Benefícios atuais
    const dados = isCivil ? dadosCivil : dadosAgente;
    const limite = isCivil ? 5 : 20;
    const atualItens = dados[n] || [];
    document.getElementById('atual').innerHTML = atualItens.length
        ? atualItens.map(x => {
            const isTitle = isCivil && x.startsWith('Treinamento');
            if (isTitle) return `<span style="color:var(--yellow);font-weight:700">◆ ${x}</span>`;
            const tc = tagColor(x);
            const tag = tc ? ` <span class="tag ${tc}">${x.includes('furtivo') ? 'Furtivo' : x.includes('Turno') || x.includes('outra') ? 'Especial' : ''}</span>` : '';
            return '• ' + x + tag;
        }).join('<br>')
        : (isCivil ? 'Nenhum treinamento.' : '<span style="color:var(--txt2)">Nível inicial — sem ganhos além do setup base.</span>');

    // Acumulados
    let total = { atributos: 0, geral: 0, classe: 0, ca: 0, outra: 0, fort: 0, civil: 0 };
    let hist = '';

    for (let i = 1; i <= n; i++) {
        const label = isCivil ? `Treino ${i}` : `Nível ${String(i).padStart(2, '0')}`;
        hist += `<div class="hist-item"><span class="badge">${label}</span><ul>`;

        (dados[i] || []).forEach(b => {
            const isTitle = isCivil && b.startsWith('Treinamento');
            if (!isTitle) hist += `<li>${b}</li>`;

            if (b.includes('Atributo')) {
                if (b.includes('x2') || b.includes('2 Atributos')) total.atributos += 2;
                else if (!b.startsWith('1 Habilidade de Classe') && !b.startsWith('+1 Habilidade')) total.atributos += 1;
                else if (b === '+1 Atributo') total.atributos += 1;
            }
            if (b === '+1 Atributo') total.atributos += 0; // já handled abaixo
            if (b.startsWith('+1 Atributo')) total.atributos += 0;
            if (b.includes('Habilidade Geral') && !b.includes('Classe')) total.geral++;
            if (b.includes('Habilidade de Classe') && !isCivil) total.classe++;
            if (b.includes('1 Habilidade de Classe') && isCivil) total.classe++;
            if (b.includes('Classe ou Arquétipo')) total.ca++;
            if (b.includes('outra classe') || b.includes('Outra Classe')) total.outra++;
            if (b.includes('Fortificação')) total.fort++;
            if (b.includes('Habilidade Civil')) total.civil++;
        });

        hist += '</ul></div>';
    }

    // Recalcula atributos corretamente (mais simples e seguro)
    let atribAcc = 0;
    for (let i = 1; i <= n; i++) {
        (dados[i] || []).forEach(b => {
            if (b === '+2 Atributos') atribAcc += 2;
            else if (b === '+1 Atributo') atribAcc += 1;
        });
    }
    // Civil atributos
    if (isCivil) {
        atribAcc = 0;
        for (let i = 1; i <= n; i++) {
            (dados[i] || []).forEach(b => { if (b === '+1 Atributo') atribAcc += 1; });
        }
    }

    document.getElementById('historico').innerHTML = hist || (isCivil ? 'Sem treinamentos ainda.' : 'Nenhum nível adquirido.');

    // Painel Acumulados
    let htmlAcc = '<ul>';
    htmlAcc += `<li><strong>Atributos recebidos:</strong> +${atribAcc} pontos</li>`;
    if (isCivil) {
        htmlAcc += `<li><strong>Habilidades Civis:</strong> ${total.civil}</li>`;
        if (total.classe > 0) htmlAcc += `<li><strong>Habilidades de Classe (Elite):</strong> ${total.classe}</li>`;
    } else {
        htmlAcc += `<li><strong>Habilidades Gerais:</strong> ${total.geral}</li>`;
        htmlAcc += `<li><strong>Habilidades de Classe (específicas):</strong> ${total.classe}</li>`;
        htmlAcc += `<li><strong>Habilidades Classe/Arquétipo (escolha livre):</strong> ${total.ca}</li>`;
        htmlAcc += `<li><strong>Habilidades de outra classe/arquétipo:</strong> ${total.outra}</li>`;
        htmlAcc += `<li><strong>Limite Hab./Turno atual:</strong> ${habTurnoTotal} max</li>`;
        htmlAcc += `<li><strong>Fortificações de Personalidade:</strong> ${total.fort} de 2</li>`;
        htmlAcc += `<li><strong>Dano Furtivo atual:</strong> ${(1 + furtivos)}D6+${(1 + furtivos)}</li>`;
    }
    htmlAcc += '</ul>';
    document.getElementById('acumulados').innerHTML = htmlAcc;

    // Próximo
    const proxMsg = isCivil ? 'Máximo de treinamentos (Elite) alcançado.' : 'Nível máximo (20) alcançado. Parabéns, veterano.';
    document.getElementById('proximo').innerHTML = n < limite
        ? (dados[n + 1] || []).map(x => '• ' + x).join('<br>')
        : `<span style="color:var(--yellow)">${proxMsg}</span>`;
}

// ============================================================
// ABA DT
// ============================================================
function calcDT() {
    const nAttr = +document.getElementById('dt-attr-nivel').value;
    const aAttr = +document.getElementById('dt-attr-attr').value;

    const dtAttr = 10 + nAttr + (aAttr * 2);

    document.getElementById('dt-attr-result').textContent = dtAttr;

    // Tabela de referência — Atributo 1..6, Nível 0/5/10/15/20
    const niveis = [0, 5, 10, 15, 20];
    const atributos = [1, 2, 3, 4, 5, 6];
    let tbl = '<table style="width:100%;border-collapse:collapse;font-size:.82rem">';
    tbl += '<thead><tr><th style="padding:8px;text-align:left;color:var(--txt2)">Attr \\ Nível</th>';
    niveis.forEach(nl => tbl += `<th style="padding:8px;text-align:center;color:var(--txt2)">${nl}</th>`);
    tbl += '</tr></thead><tbody>';

    atributos.forEach(at => {
        tbl += `<tr><td style="padding:8px;color:var(--yellow);font-weight:700">ATR ${at}</td>`;
        niveis.forEach(nl => {
            const a = 10 + nl + (at * 2);
            tbl += `<td style="padding:8px;text-align:center;border-left:1px solid var(--border);color:var(--green)">${a}</td>`;
        });
        tbl += '</tr>';
    });
    tbl += '</tbody></table>';
    document.getElementById('dt-tabela').innerHTML = tbl;
}

// ============================================================
// ABA NOVO AGENTE
// ============================================================
function calcNovoAgente() {
    const motivo = document.getElementById('novo-motivo').value;
    const mNivel = parseFloat(document.getElementById('novo-media-nivel').value) || 0;
    const mPrest = parseFloat(document.getElementById('novo-media-prest').value) || 0;

    // Nível inicial — arredonda para o inteiro mais próximo (0.5 para cima), depois -1, mínimo 0
    const nivelCalc = Math.max(0, Math.ceil(mNivel % 1 >= 0.5 ? Math.ceil(mNivel) : Math.round(mNivel)) - 1);

    // Prestígio inicial por motivo
    let divisor, descricao, permiteAbaixo = false;
    switch (motivo) {
        case 'morte': divisor = 7; descricao = 'Morte / Entrada do zero'; break;
        case 'aposent': divisor = 10; descricao = 'Aposentadoria'; break;
        case 'exp_regular': divisor = 5; descricao = 'Experimento → Regular'; permiteAbaixo = true; break;
        case 'exp_exp': divisor = 3; descricao = 'Experimento → Experimento'; permiteAbaixo = true; break;
        case 'extinto_regular': divisor = 5; descricao = 'Contido/Exterminado → Regular'; permiteAbaixo = true; break;
        case 'extinto_exp': divisor = 3; descricao = 'Contido/Exterminado → Experimento'; permiteAbaixo = true; break;
    }

    const deducao = Math.floor(mPrest / divisor);
    let prestCalc = Math.floor(mPrest - deducao);

    // Cap mínimo de patente
    const parenteGrupo = getPatente(Math.floor(mPrest));
    let capIdx = PATENTES.indexOf(parenteGrupo);
    let capMin, capNome;
    if (permiteAbaixo && capIdx > 0) {
        // Pode cair uma patente abaixo
        capMin = PATENTES[capIdx - 1].min;
        capNome = PATENTES[capIdx - 1].nome;
    } else {
        capMin = parenteGrupo.min;
        capNome = parenteGrupo.nome;
    }
    prestCalc = Math.max(prestCalc, capMin);

    const parenteResultado = getPatente(prestCalc);

    // Atualiza campo de bônus
    document.getElementById('bonus-prest').value = prestCalc;
    calcBonus();

    const amaldicStr = (motivo === 'extinto_regular' || motivo === 'extinto_exp')
        ? '<li style="color:var(--yellow)">⚠ Recebe permanentemente a condição <strong>Amaldiçoado pelo Passado</strong></li>'
        : '';

    document.getElementById('novo-resultado').innerHTML = `
<div class="grid-3">
    <div class="stat-box highlight">
        <div class="stat-label">Nível Inicial</div>
        <div class="stat">${nivelCalc}</div>
        <div class="stat-sub">média ${mNivel.toFixed(1)} → −1</div>
    </div>
    <div class="stat-box blue">
        <div class="stat-label">Prestígio Inicial</div>
        <div class="stat">${prestCalc}</div>
        <div class="stat-sub">média ${mPrest} − ÷${divisor} = −${deducao}</div>
    </div>
    <div class="stat-box green">
        <div class="stat-label">Patente Resultante</div>
        <div class="stat stat-sm">${parenteResultado.nome}</div>
        <div class="stat-sub">cap mín: ${capNome}</div>
    </div>
</div>
<ul style="margin-top:14px">
    <li><strong>Motivo:</strong> ${descricao}</li>
    <li><strong>Nível:</strong> ⌈${mNivel.toFixed(1)}⌉ − 1 = ${nivelCalc} (mínimo 0)</li>
    <li><strong>Prestígio:</strong> ${mPrest} − ⌊${mPrest}÷${divisor}⌋ = ${mPrest}−${deducao} = ${Math.floor(mPrest - deducao)} → cap ${capNome} (${capMin}) → <strong>${prestCalc}</strong></li>
    ${amaldicStr}
</ul>`;
}

function calcBonus() {
    const prest = +document.getElementById('bonus-prest').value || 0;
    const pat = getPatente(prest);
    const bonus = prest * (500 * pat.mult);
    const total = bonus; // + dinheiro inicial padrão (1000 + 4D4×250, variável)
    document.getElementById('bonus-result').textContent = '$ ' + bonus.toLocaleString('pt-BR');
    document.getElementById('bonus-patente-info').innerHTML =
        `<strong>Patente:</strong> ${pat.nome} · Multiplicador: ${pat.mult}× · Salário base: $${pat.salario.toLocaleString('pt-BR')}/missão<br>
    <span style="color:var(--txt2);font-size:.8rem">Nota: adicione ao total o dinheiro inicial padrão (1.000 + 4D4 × 250), calculado separadamente por ser aleatório.</span>`;
}

// ============================================================
// ABA PATENTE
// ============================================================
function calcPatente() {
    const prest = +document.getElementById('prest-input').value || 0;
    const pat = getPatente(prest);

    document.getElementById('patente-resultado').innerHTML = `
<div class="patente-box">
    <div class="patente-nome">${pat.nome}</div>
    <div style="color:var(--txt2);font-size:.85rem;margin-top:2px">${pat.min}–${pat.max === Infinity ? '∞' : pat.max} Prestígio</div>
    <div class="patente-info">
        <div class="patente-item"><strong>Salário por missão:</strong> $${pat.salario.toLocaleString('pt-BR')}</div>
        <div class="patente-item"><strong>Limite de mods:</strong> ${pat.modif}</div>
        <div class="patente-item"><strong>Multiplicador monetário:</strong> ${pat.mult}×</div>
    </div>
</div>`;

    // Tabela completa
    let tbl = '<table style="width:100%;border-collapse:collapse;font-size:.85rem">';
    tbl += `<thead><tr>
<th style="padding:10px 8px;text-align:left;color:var(--txt2);border-bottom:1px solid var(--border)">Patente</th>
<th style="padding:10px 8px;text-align:center;color:var(--txt2);border-bottom:1px solid var(--border)">Prestígio</th>
<th style="padding:10px 8px;text-align:center;color:var(--txt2);border-bottom:1px solid var(--border)">Salário</th>
<th style="padding:10px 8px;text-align:center;color:var(--txt2);border-bottom:1px solid var(--border)">Mods</th>
<th style="padding:10px 8px;text-align:center;color:var(--txt2);border-bottom:1px solid var(--border)">Mult.</th>
</tr></thead><tbody>`;

    PATENTES.forEach(p => {
        const isAtual = (p.nome === pat.nome);
        const bg = isAtual ? 'rgba(255,82,82,.06)' : 'transparent';
        const border = isAtual ? '1px solid rgba(255,82,82,.2)' : 'none';
        tbl += `<tr style="background:${bg};outline:${border};border-radius:8px">
    <td style="padding:10px 8px;font-weight:${isAtual ? '700' : '400'};color:${isAtual ? 'var(--accent)' : 'var(--txt)'}">${p.nome}</td>
    <td style="padding:10px 8px;text-align:center;color:var(--txt2)">${p.min}–${p.max === Infinity ? '∞' : p.max}</td>
    <td style="padding:10px 8px;text-align:center;color:var(--green)">$${p.salario.toLocaleString('pt-BR')}</td>
    <td style="padding:10px 8px;text-align:center;color:var(--txt2);font-size:.78rem">${p.modif}</td>
    <td style="padding:10px 8px;text-align:center;color:var(--yellow)">${p.mult}×</td>
</tr>`;
    });
    tbl += '</tbody></table>';
    document.getElementById('patente-tabela-full').innerHTML = tbl;
}

// ============================================================
// ABA DESCANSO
// ============================================================
const DADOS_DESCANSO = {
    curto: { label: 'Curto', dadoEn: 4, dadoVid: null, temVida: false },
    medio: { label: 'Médio', dadoEn: 6, dadoVid: 4, temVida: true },
    longo: { label: 'Longo', dadoEn: 8, dadoVid: 6, temVida: true }
};

const QUALIDADE_MOD = { insalubre: -1, adequado: 0, confortavel: 1 };

const DADOS_SEQ = [3, 4, 6, 8, 10, 12, 20]; // tipos de dado em ordem

function tipoDado(base, mod) {
    const idx = DADOS_SEQ.indexOf(base);
    const novo = Math.max(0, Math.min(DADOS_SEQ.length - 1, idx + mod));
    return DADOS_SEQ[novo];
}

function descDado(faces) {
    if (!faces) return '—';
    return faces === 0 ? '0' : 'D' + faces;
}

function calcDescanso() {
    const tipo = document.getElementById('desc-tipo').value;
    const qual = document.getElementById('desc-qualidade').value;
    const vigD = +document.getElementById('desc-vig').value || 0;
    const desD = +document.getElementById('desc-des').value || 0;
    const nivel = +document.getElementById('desc-nivel').value || 0;
    const refei = document.getElementById('desc-refeicao').value;
    const inter = document.getElementById('desc-interrupcao').value;

    const cfg = DADOS_DESCANSO[tipo];
    let modTotal = QUALIDADE_MOD[qual];
    if (refei === 'sim') modTotal += 1;

    // Dado de Energia
    const dadoEnBase = cfg.dadoEn;
    const dadoEnFinal = tipoDado(dadoEnBase, modTotal);
    const enMin = desD * 1 + nivel * 2;
    const enMed = desD * ((dadoEnFinal + 1) / 2) + nivel * 2;
    const enMax = desD * dadoEnFinal + nivel * 2;

    // Dado de Vida
    let vidaStr = '—', vidaFormula = '—';
    if (cfg.temVida) {
        const dadoVidBase = cfg.dadoVid;
        const dadoVidFinal = tipoDado(dadoVidBase, modTotal);
        const vMin = vigD * 1 + nivel * 2;
        const vMed = vigD * ((dadoVidFinal + 1) / 2) + nivel * 2;
        const vMax = vigD * dadoVidFinal + nivel * 2;
        vidaStr = inter === 'sim'
            ? `${Math.floor(vMin / 2)}–${Math.floor(vMax / 2)} (÷2 por interrupção)`
            : `${vMin}–${vMax}`;
        vidaFormula = `${vigD}D${dadoVidFinal} + (${nivel}×2) = ${vigD}D${dadoVidFinal}+${nivel * 2}`;
        if (inter === 'sim') vidaFormula += ' ÷ 2';
    }

    const enMinF = inter === 'sim' ? Math.floor(enMin / 2) : enMin;
    const enMaxF = inter === 'sim' ? Math.floor(enMax / 2) : enMax;
    const energiaStr = `${enMinF}–${enMaxF}`;
    const enFormula = `${desD}D${dadoEnFinal} + (${nivel}×2) = ${desD}D${dadoEnFinal}+${nivel * 2}${inter === 'sim' ? ' ÷ 2' : ''}`;

    document.getElementById('desc-vida-result').textContent = cfg.temVida ? vidaStr : 'Não recupera Vida';
    document.getElementById('desc-vida-formula').textContent = cfg.temVida ? vidaFormula : 'Descanso Curto não recupera Vida';
    document.getElementById('desc-energia-result').textContent = energiaStr;
    document.getElementById('desc-energia-formula').textContent = enFormula;

    const notas = [];
    if (tipo === 'longo') notas.push('⚠ Descanso Longo só pode ser feito <strong>uma vez por dia</strong>.');
    if (qual === 'insalubre') notas.push('Ambiente insalubre reduz os dados em 1 tipo.');
    if (qual === 'confortavel') notas.push('Ambiente confortável aumenta os dados em 1 tipo. A Base da Fundação é sempre Confortável.');
    if (refei === 'sim') notas.push('Refeição consumida: +1 tipo de dado na recuperação.');
    if (inter === 'sim') notas.push('Interrupção: resultado final dividido por 2 (arredonda para baixo).');
    notas.push(`Fórmula geral: <strong>ATRIBUTO × dados + (Nível × 2)</strong>`);

    document.getElementById('desc-notas').innerHTML = notas.map(n => '• ' + n).join('<br>');
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

    if (id === 'dt') calcDT();
    if (id === 'patente') calcPatente();
    if (id === 'descanso') calcDescanso();
    if (id === 'novo') calcNovoAgente();
}

function stepInput(id, delta) {
    const el = document.getElementById(id);
    const val = (parseInt(el.value) || 0) + delta;
    const max = el.max !== '' ? parseInt(el.max) : Infinity;
    const min = el.min !== '' ? parseInt(el.min) : -Infinity;
    el.value = Math.min(max, Math.max(min, val));
    el.dispatchEvent(new Event('input'));
}

// Init
aplicarLimitesPorClasse(document.getElementById('classe').value);
calc();
calcDT();
calcPatente();
calcDescanso();
calcNovoAgente();