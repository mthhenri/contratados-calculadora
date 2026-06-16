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
        return '7m';
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
    document.getElementById('sequelas').textContent = 'VON (' + von + ')';
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
    const habTurnoTotal = isCivil ? 3 : (habTurnoBase + habTurnoGanhos);
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
            if (b.includes('Habilidade Geral') && !b.includes('Classe')) total.geral++;
            if (b.includes('Habilidade de Classe') && !b.includes('Classe ou Arquétipo') && !isCivil) total.classe++;
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
    document.getElementById('patente-tabela-full').innerHTML = `<div style="overflow-x:auto">${tbl}</div>`;
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
    document.getElementById('desc-roll-container').style.display = 'none';
}

function rollDice(faces, count) {
    const rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * faces) + 1);
    }
    return rolls;
}

function parseExtraDice(str) {
    const s = str.trim().toLowerCase();
    if (!s || s === '0') return null;
    const match = s.match(/^(\d+)d(\d+)$/);
    if (match) {
        const count = Math.min(+match[1], 20);
        const faces = +match[2];
        if (faces < 2) return null;
        return { rolls: rollDice(faces, count), faces };
    }
    const flat = parseInt(s, 10);
    if (!isNaN(flat) && flat > 0) return { rolls: [flat], faces: 0 };
    return null;
}

function rollDescanso(animate = true) {
    const tipo = document.getElementById('desc-tipo').value;
    const qual = document.getElementById('desc-qualidade').value;
    const vigD = +document.getElementById('desc-vig').value || 0;
    const desD = +document.getElementById('desc-des').value || 0;
    const nivel = +document.getElementById('desc-nivel').value || 0;
    const refei = document.getElementById('desc-refeicao').value;
    const inter = document.getElementById('desc-interrupcao').value;
    const extraVidaStr = document.getElementById('desc-extra-vida').value;
    const extraEnStr = document.getElementById('desc-extra-energia').value;

    const cfg = DADOS_DESCANSO[tipo];
    let modTotal = QUALIDADE_MOD[qual];
    if (refei === 'sim') modTotal += 1;

    const bonus = nivel * 2;
    const dadoEnFinal = tipoDado(cfg.dadoEn, modTotal);
    const interrupted = inter === 'sim';

    function buildResult(atributo, dado, extraStr, bonusFlat) {
        const baseRolls = rollDice(dado, atributo);
        const baseSum = baseRolls.reduce((a, b) => a + b, 0);
        const extra = parseExtraDice(extraStr);
        const extraSum = extra ? extra.rolls.reduce((a, b) => a + b, 0) : 0;
        const rawTotal = baseSum + extraSum + bonusFlat;
        const finalTotal = interrupted ? Math.floor(rawTotal / 2) : rawTotal;

        let breakdown = atributo > 0 ? `[${baseRolls.join(' + ')}]` : '0';
        if (extra) {
            breakdown += extra.faces > 0
                ? ` +extra[${extra.rolls.join(' + ')}]`
                : ` +${extraSum}`;
        }
        breakdown += ` + ${bonusFlat} = ${rawTotal}`;
        if (interrupted) breakdown += ` ÷ 2 = ${finalTotal}`;

        return { total: finalTotal, breakdown };
    }

    const en = buildResult(desD, dadoEnFinal, extraEnStr, bonus);

    let vidaTotal = null, vidaBreakdown = '—';
    if (cfg.temVida) {
        const dadoVidFinal = tipoDado(cfg.dadoVid, modTotal);
        const vid = buildResult(vigD, dadoVidFinal, extraVidaStr, bonus);
        vidaTotal = vid.total;
        vidaBreakdown = vid.breakdown;
    }

    document.getElementById('desc-roll-container').style.display = '';

    const enEl = document.getElementById('desc-roll-energia');
    const vidEl = document.getElementById('desc-roll-vida');

    function applyResults() {
        enEl.classList.remove('roll-pop');
        void enEl.offsetWidth;
        enEl.textContent = en.total;
        document.getElementById('desc-roll-energia-breakdown').textContent = en.breakdown;
        enEl.classList.add('roll-pop');

        vidEl.classList.remove('roll-pop');
        void vidEl.offsetWidth;
        if (vidaTotal !== null) {
            vidEl.textContent = vidaTotal;
            document.getElementById('desc-roll-vida-breakdown').textContent = vidaBreakdown;
        } else {
            vidEl.textContent = 'Não recupera';
            document.getElementById('desc-roll-vida-breakdown').textContent = 'Descanso Curto não recupera Vida';
        }
        vidEl.classList.add('roll-pop');
    }

    if (!animate) {
        applyResults();
        return;
    }

    const btn = document.getElementById('desc-roll-btn');
    btn.classList.add('rolling');
    enEl.textContent = '...';
    document.getElementById('desc-roll-energia-breakdown').textContent = '';
    if (vidaTotal !== null) {
        vidEl.textContent = '...';
        document.getElementById('desc-roll-vida-breakdown').textContent = '';
    }

    const SCRAMBLE_MS = 650;
    const enMax = Math.max(en.total * 2, 30);
    const vidMax = vidaTotal !== null ? Math.max(vidaTotal * 2, 30) : 0;
    const startTime = Date.now();

    function scramble() {
        const elapsed = Date.now() - startTime;
        if (elapsed < SCRAMBLE_MS) {
            enEl.textContent = Math.floor(Math.random() * enMax) + 1;
            if (vidaTotal !== null) vidEl.textContent = Math.floor(Math.random() * vidMax) + 1;
            requestAnimationFrame(scramble);
        } else {
            btn.classList.remove('rolling');
            applyResults();
        }
    }
    requestAnimationFrame(scramble);
}

function rollDescansoIfVisible() {
    if (document.getElementById('desc-roll-container').style.display !== 'none') {
        rollDescanso(false);
    }
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
// ABA COMPRAS — DADOS
// ============================================================

// Limites de patente para modificações
const PATENTES_MOD = [
    { nome: 'Agente',              min: 0,  max: 2,        maxStack: 1, maxMods: 2  },
    { nome: 'Operador',            min: 3,  max: 5,        maxStack: 2, maxMods: 4  },
    { nome: 'Experiente',          min: 6,  max: 11,       maxStack: 2, maxMods: 6  },
    { nome: 'Veterano',            min: 12, max: 20,       maxStack: 3, maxMods: 9  },
    { nome: 'Força Tarefa',        min: 21, max: 32,       maxStack: 3, maxMods: 12 },
    { nome: 'FT Especial',         min: 33, max: 47,       maxStack: 4, maxMods: 15 },
    { nome: 'Op. Especiais',       min: 48, max: 65,       maxStack: 4, maxMods: 18 },
    { nome: 'Líder Operacional',   min: 66, max: Infinity, maxStack: 5, maxMods: 20 }
];

function getPatenteMod(prest) {
    return PATENTES_MOD.find(p => prest >= p.min && prest <= p.max) || PATENTES_MOD[0];
}

// modCost per category key
const MOD_CUSTO = {
    'cac': 750, 'explosivos': 250, 'armasFogo': 750,
    'municoes': 250, 'protecoes': 750, 'exoticos': 750, 'armazenamento': 300
};

// Catalog: categories with items
// weight: inventory slots used (parenthetical for storage items)
const CATALOGO_CATS = [
    { key: 'cac',          label: 'Corpo a Corpo',    icon: '🗡️'  },
    { key: 'explosivos',   label: 'Explosivos',        icon: '💥'  },
    { key: 'armasFogo',    label: 'Armas de Fogo',     icon: '🔫'  },
    { key: 'municoes',     label: 'Munições',          icon: '🔹'  },
    { key: 'protecoes',    label: 'Proteções',         icon: '🛡️'  },
    { key: 'exoticos',     label: 'Exóticos',          icon: '⚡'  },
    { key: 'armazenamento',label: 'Armazenamento',     icon: '🎒'  },
    { key: 'operacional',  label: 'Operacional',       icon: '🔧'  },
    { key: 'medicinal',    label: 'Medicinal',         icon: '💊'  },
    { key: 'amplificador', label: 'Amplificadores',    icon: '🔬'  },
];

const CATALOGO_ITENS = {
    cac: [
        { nome: 'Acessório de Combate', custo: 250,  peso: 0.5, dano: '1D3~1D6+Corpo [Físico]', desc: 'Adereço de combate para as mãos, sapatos, etc.' },
        { nome: 'Leve',                 custo: 500,  peso: 1,   dano: '1D6+DES [Físico]',       desc: 'Armas pequenas e ágeis como facas ou martelos — 1 mão' },
        { nome: 'Mediana',              custo: 1000, peso: 2,   dano: '3D4+FOR [Físico]',       desc: 'Espadas, sabres e martelos médios — 1 mão' },
        { nome: 'Grande',               custo: 1250, peso: 3,   dano: '3D6+FOR [Físico]',       desc: 'Claymore, maça pesada e armas de grande porte — 2 mãos' },
        { nome: 'Pesada',               custo: 1500, peso: 5,   dano: '3D8+FOR [Físico]',       desc: 'Armas massivas e destrutivas — 2 mãos' },
    ],
    explosivos: [
        { nome: 'Molotov',                  custo: 400,  peso: 1, dano: '3D8 [Químico]',    info: 'Curto · 2m · Em Chamas (2t)',         desc: 'Garrafa incendiária que cobre área em chamas' },
        { nome: 'Granada de Mão',           custo: 350,  peso: 1, dano: '3D10 [Explosão]',  info: 'Médio · 3m',                          desc: 'Granada explosiva padrão — 1 mão' },
        { nome: 'Granada de Fragmentação',  custo: 500,  peso: 1, dano: '5D10 [Explosão]',  info: 'Médio · 3m',                          desc: 'Alta fragmentação, dano elevado em área — 1 mão' },
        { nome: 'Granada Incendiária',      custo: 600,  peso: 1, dano: '2D12 [Químico]',   info: 'Médio · 3m · Em Chamas',              desc: 'Cobre área em fogo persistente — 1 mão' },
        { nome: 'Granada de Impacto',       custo: 750,  peso: 1, dano: '5D12 [Explosão]',  info: 'Médio · 3m · −2 dados p/ reagir',     desc: 'Explode no impacto, difícil de esquivar — 1 mão' },
        { nome: 'Granada de Fumaça',        custo: 300,  peso: 1, dano: '— (fumaça)',        info: 'Médio · 5m · +5 furtividade (3t)',    desc: 'Cortina de fumaça por 3 turnos — 1 mão' },
        { nome: 'Granada de Congelamento',  custo: 600,  peso: 1, dano: '2D10 [Químico]',   info: 'Médio · 3m · Imobiliza (FOR DT PON)', desc: 'Congela alvos, podendo imobilizar — 1 mão' },
    ],
    armasFogo: [
        { nome: 'Pistola',           custo: 500,  peso: 1, dano: '2D6 [Balístico]',  info: 'Curto · Mun: 9mm',     desc: 'Leve e compacta, ideal para curta distância — 1 mão' },
        { nome: 'Submetralhadora',   custo: 600,  peso: 1, dano: '3D4 [Balístico]',  info: 'Curto · Mun: 10mm',    desc: 'Alta cadência, eficaz contra múltiplos alvos — 1 mão' },
        { nome: 'Escopeta',          custo: 750,  peso: 2, dano: '3D6 [Balístico]',  info: 'Curto · Mun: 12GA',    desc: 'Devastadora em ambientes fechados — 2 mãos' },
        { nome: 'Fuzil de Assalto',  custo: 1000, peso: 2, dano: '2D8 [Balístico]',  info: 'Médio · Mun: 5.56mm',  desc: 'Versátil, equilibra alcance e poder de fogo — 2 mãos' },
        { nome: 'Rifle de Precisão', custo: 1250, peso: 2, dano: '2D10 [Balístico]', info: 'Longo · Mun: 7.62mm',  desc: 'Preciso a longas distâncias — 2 mãos' },
        { nome: 'Metralhadora',      custo: 2000, peso: 4, dano: '4D4 [Balístico]',  info: 'Médio · Mun: 12.7mm',  desc: 'Alta cadência, enorme poder de fogo — 2 mãos' },
    ],
    municoes: [
        { nome: '9mm',                custo: 100,  peso: 0.5, desc: 'Para pistolas e SMGs' },
        { nome: '10mm',               custo: 180,  peso: 0.7, desc: 'Para submetralhadoras' },
        { nome: 'Cartuchos 12GA',     custo: 100,  peso: 0.5, desc: 'Para escopetas' },
        { nome: '5.56mm',             custo: 200,  peso: 1,   desc: 'Para fuzis de assalto' },
        { nome: '7.62mm',             custo: 300,  peso: 1,   desc: 'Para rifles de precisão' },
        { nome: '12.7mm',             custo: 450,  peso: 1.5, desc: 'Para metralhadoras e torretas' },
        { nome: 'Granadas Simples',   custo: 500,  peso: 1.5, desc: 'Para lança-granadas' },
        { nome: 'Tanque de Propano',  custo: 500,  peso: 1,   desc: 'Combustível para lança-chamas' },
        { nome: 'Míssil',             custo: 1000, peso: 3,   desc: 'Para bazucas' },
        { nome: 'Virotes',            custo: 130,  peso: 1,   desc: 'Para balestras' },
        { nome: 'Células de Plasma',  custo: 400,  peso: 1.5, desc: 'Para o Quebra-Átomos e armas Plasma' },
        { nome: 'Gasolina',           custo: 300,  peso: 2,   desc: 'Combustível para a Motoserra. Mods: Calibre, Explosiva, Incendiária, Perfurante, Selante, Supressora, Tóxica' },
    ],
    protecoes: [
        { nome: 'Colete Leve',            custo: 500,  peso: 0.5, resist: '2 [Físico]',                  desc: 'Proteção básica, leve e discreta' },
        { nome: 'Colete Tático',          custo: 1000, peso: 1,   resist: '4 [Físico]',                  desc: 'Proteção tática balanceada' },
        { nome: 'Colete de Kevlar',       custo: 1500, peso: 2,   resist: '5 [Físico], 3 [Balístico]',   desc: 'Proteção contra projéteis e impactos' },
        { nome: 'Roupa Anti-Químico',     custo: 2500, peso: 2,   resist: '6 [Químico]',                 desc: 'Proteção total contra agentes químicos e gases' },
        { nome: 'Armadura Pesada',        custo: 3000, peso: 4,   resist: '10 [Físico], 6 [Balístico]',  desc: 'Máxima proteção. Penalidade: −1 dado DES' },
        { nome: 'Escudo Leve',            custo: 300,  peso: 1,   resist: '1 [Físico/Balístico]',        desc: 'Escudo compacto para bloqueio rápido — 1 mão' },
        { nome: 'Escudo Médio',           custo: 750,  peso: 2,   resist: '3 [Físico/Balístico]',        desc: 'Equilíbrio entre proteção e mobilidade — 1 mão' },
        { nome: 'Escudo Pesado',          custo: 1250, peso: 3,   resist: '5 [Físico/Balístico]',        desc: 'Proteção robusta — 2 mãos' },
        { nome: 'Escudo-Barreira Móvel',  custo: 1750, peso: 4,   resist: '7 [Físico/Balístico]',        desc: 'Barreira de combate. Penalidade: −1 dado DES — 2 mãos' },
    ],
    exoticos: [
        { nome: 'Lança-Granada',    custo: 3000, peso: 3,   dano: '4D8 [Explosão]',  info: 'Médio · 3m · Mun: Granadas',        desc: 'Lança granadas explosivas em área — 2 mãos',        fazParteCat: 'armasFogo'  },
        { nome: 'Balestra',         custo: 750,  peso: 1.5, dano: '2D6 [Físico]',    info: 'Médio · Mun: Virotes',              desc: 'Arco mecânico de alta precisão — 2 mãos',           fazParteCat: 'armasFogo'  },
        { nome: 'Torreta',          custo: 7500, peso: 5,   dano: '3D6 [Balístico]', info: 'Médio · Mun: 12.7mm',              desc: 'Máquina autônoma de disparo; usa PON de quem a posicionou', fazParteCat: 'armasFogo' },
        { nome: 'Bazuca',           custo: 5000, peso: 7,   dano: '12D8 [Explosão]', info: 'Médio · 7m · Mun: Míssil',         desc: 'Míssil em linha reta, explode no contato — 2 mãos', fazParteCat: 'armasFogo'  },
        { nome: 'Lança-Chamas',     custo: 3000, peso: 4,   dano: '3D8 [Químico]',   info: 'Curto · Em Chamas · Mun: Propano', desc: 'Rajada de fogo contínua, incendeia área — 2 mãos',  fazParteCat: 'armasFogo'  },
        { nome: 'Motoserra',        custo: 2500, peso: 3,   dano: '2D8 [Físico]',    info: 'CaC · Crítico ×3 · Mun: Gasolina', desc: 'Arma brutal — crítico causa dano ×3 — 2 mãos',     fazParteCat: 'cac'        },
        { nome: 'Quebra-Átomos',    custo: 3500, peso: 4,   dano: '2D12 [Químico]',  info: 'Médio · Mun: Células de Plasma',   desc: 'Fuzil de plasma que desintegra alvos — 2 mãos',    fazParteCat: 'armasFogo'  },
    ],
    armazenamento: [
        { nome: 'Bolso de Corpo',     custo: 75,   peso: 0.1, bonus: '+1 inv.',    desc: 'Pequeno bolso corporal discreto' },
        { nome: 'Pochete',            custo: 200,  peso: 0.2, bonus: '+2 inv.',    desc: 'Pochete compacta de cintura' },
        { nome: 'Mochila Pequena',    custo: 300,  peso: 0.3, bonus: '+3 inv.',    desc: 'Mochila leve para missões rápidas' },
        { nome: 'Mochila Mediana',    custo: 750,  peso: 0.5, bonus: '+6 inv.',    desc: 'Mochila tática de uso geral' },
        { nome: 'Mochila Grande',     custo: 1200, peso: 0.7, bonus: '+9 inv.',    desc: 'Mochila de grande capacidade' },
        { nome: 'Mochila Cargueira',  custo: 2000, peso: 1.0, bonus: '+12 inv.',   desc: 'Mochila de capacidade máxima' },
        { nome: 'Mochila Kevlar',     custo: 1200, peso: 0.7, bonus: '+4,5 inv.',  desc: 'Proteção para conteúdo + armazenamento médio' },
        { nome: 'Mochila Médica',     custo: 1600, peso: 0.5, bonus: '+5 inv.',    desc: 'Bolsas organizadas para kits médicos' },
    ],
    operacional: [
        { nome: 'Energético',                   custo: 50,   peso: 0.5, desc: 'Recupera 50% da Energia máxima (2×/missão)' },
        { nome: 'Energético Concentrado',        custo: 250,  peso: 0.5, desc: 'Recupera 100% da Energia máxima (2×/missão)' },
        { nome: 'Carga Vital',                   custo: 450,  peso: 1,   desc: 'Reduz custo de habilidades −2E por 2D4t. Depois: −1 dado DES/FOR' },
        { nome: 'Refeição',                      custo: 50,   peso: 0.5, desc: 'Usada em descanso para aumentar recuperação de Vida e Energia' },
        { nome: 'Equipamento de Descanso',       custo: 400,  peso: 2.5, desc: '+1 nível de qualidade de descanso (ou +1 dado se já Confortável)' },
        { nome: 'Lanterna',                      custo: 50,   peso: 0.5, desc: 'Remove Escuridão até alcance Curto — 1 mão' },
        { nome: 'Lanterna Tática',               custo: 200,  peso: 0.3, desc: 'Remove Escuridão até alcance Médio (corporal)' },
        { nome: 'Binóculos',                     custo: 250,  peso: 1,   desc: 'Visão precisa a até 50 metros de distância' },
        { nome: 'Lockpick',                      custo: 50,   peso: 0.5, desc: 'Abre fechaduras (DES/INT). 3 usos; falha remove 1 uso' },
        { nome: 'Óculos de Visão Noturna',       custo: 1250, peso: 1,   desc: 'Remove penalidade de Escuridão até alcance Médio (corporal)' },
        { nome: 'Óculos de Visão Térmica',       custo: 1000, peso: 1,   desc: 'Vê alvos com calor corporal através de paredes (corporal)' },
        { nome: 'Máscara de Respiração',         custo: 1000, peso: 1,   desc: 'Auxilia respiração em ambientes difíceis. Recarga: Tanque de Oxigênio' },
        { nome: 'Tanque de Oxigênio',            custo: 300,  peso: 1,   desc: 'Dura 1 cena. Recarga para Máscara de Respiração' },
        { nome: 'Ponto de Comunicação',          custo: 250,  peso: 0.2, desc: 'Comunicação a distância em até 100 metros (corporal)' },
        { nome: 'Radio Comunicador',             custo: 100,  peso: 0.5, desc: 'Comunicação a distância em até 50 metros — 1 mão' },
        { nome: 'Bandoleira',                    custo: 250,  peso: 1,   desc: 'Saca/guarda uma arma como ação livre (corporal)' },
        { nome: 'Kit de Transmissão de Rádio',   custo: 2500, peso: 4,   desc: 'Base de transmissão portátil — alcance 50m em zonas bloqueadas' },
        { nome: 'Algemas',                       custo: 200,  peso: 0.5, desc: 'Prende alvo (LUT/DES × LUT/DES). Liberta com FOR DT INT' },
        { nome: 'Contingência Viva',             custo: 1500, peso: 0.5, desc: 'Prende alvos de até tamanho grande (DT INT+5)' },
        { nome: 'Dispositivo de Distração',      custo: 300,  peso: 0.5, desc: 'Som em alcance Médio: seres fazem INT DT SOC' },
        { nome: 'Equipamentos de Emergência',    custo: 2500, peso: 4,   desc: 'Carrega até 3 itens úteis pré-definidos (sem armas/munições)' },
        { nome: 'Sinalizador',                   custo: 500,  peso: 1,   desc: 'Emite luz e fumaça a 100m por 1D4 turnos' },
        { nome: 'Kit de Reparo',                 custo: 350,  peso: 1,   desc: '+3 no teste de reparo de equipamento' },
    ],
    medicinal: [
        { nome: 'Calmante',                        custo: 300,  peso: 0.5, desc: 'Suprime 1 sequela à escolha por 1 cena' },
        { nome: 'Inalador Medicinal',              custo: 100,  peso: 0.5, desc: 'Suprime 1 sequela à escolha por 3 turnos' },
        { nome: 'Ampola Estímulo Neurológico',     custo: 1150, peso: 1,   desc: 'Suprime 1 sequela à escolha por 3 cenas' },
        { nome: 'Bandagem',                        custo: 50,   peso: 0.2, desc: 'Cura: 2D4 Vida' },
        { nome: 'Gel Cicatrizante',                custo: 250,  peso: 0.5, desc: 'Cura: 2D6 Vida' },
        { nome: 'Spray Medicinal',                 custo: 150,  peso: 0.3, desc: 'Cura: 1D8 Vida (ação de Movimento)' },
        { nome: 'Pomada Médica',                   custo: 500,  peso: 1,   desc: 'Cura: 2D8+MED Vida. +1 dado p/ tratar Morrendo (DT 10)' },
        { nome: 'Kit Médico',                      custo: 1000, peso: 2,   desc: 'Cura: 3D10+MED×2 Vida. +1 dado +3 p/ Morrendo (DT 15)' },
        { nome: 'Reanimador',                      custo: 1750, peso: 3,   desc: 'Cura: 2D12+MED×3 Vida. +1 dado +5 p/ Morrendo (DT 20)' },
        { nome: 'Atadura de Luxo',                 custo: 2500, peso: 1,   desc: 'Cura: 4D12+MED×2+Patente×2 Vida. +2 dados +7 p/ Morrendo (DT 25)' },
        { nome: 'Kit de Recuperação Completo',     custo: 4000, peso: 4,   desc: 'Cura: (4D6)×Patente Vida. +3 dados +10 p/ Morrendo (DT 30)' },
        { nome: 'Estabilizador de Lesão',          custo: 2000, peso: 1,   desc: 'Ignora penalidade de 1 lesão por 1D3+1t. MED DT 15' },
        { nome: 'Estimulante Potente',             custo: 1750, peso: 0.5, desc: '−50% dano recebido por 1D8t. Depois: Cansado 2t. DT 10' },
        { nome: 'Solução Energizante',             custo: 1000, peso: 0.5, desc: '+VIG de resist. [Físico] por 1D8t. DT 10' },
        { nome: 'Adrenalina',                      custo: 1000, peso: 0.5, desc: '+1 tipo dado CaC, remove Inconsciente. Depois: Cansado 1t. DT 10' },
        { nome: 'Morfina',                         custo: 1000, peso: 0.5, desc: 'Nega 1D4 testes em Morrendo. Depois: Inconsciente. DT 10' },
        { nome: 'Desfibrilador',                   custo: 1500, peso: 1,   desc: '−1D6×5 da DT de Morrendo. Teste INT DT 15 (falha: inutiliza). DT 10' },
        { nome: 'Esterilizante Medicinal',         custo: 1250, peso: 1,   desc: 'Junto a outro item de cura: +1 tipo de dado na cura. DT 10' },
        { nome: 'Analgésico',                      custo: 1500, peso: 1,   desc: '−1 nível de DT de lesão por 1D6+1t. DT 10' },
        { nome: 'Anestesia',                       custo: 1250, peso: 1,   desc: 'Ignora dano recebido por 1D4+1t; recebe tudo depois (sem lesões). DT 10' },
        { nome: 'Compressor de Ferida',            custo: 500,  peso: 0.5, desc: 'Remove condição Sangramento. MED DT 15' },
        { nome: 'Kit de Tratamento',               custo: 500,  peso: 0.5, desc: 'Remove condição Envenenado. MED DT 15' },
    ],
    amplificador: [
        { nome: 'Atento',       initStacks: 1, maxStack: 3, efeito: '+1 dado de Iniciativa' },
        { nome: 'Conservador',  initStacks: 2, maxStack: 2, efeito: '-1 de Energia em custos (mín. 1)' },
        { nome: 'Defesa',       initStacks: 1, maxStack: 5, efeito: '+1 em Defesa (2º+: -1 resist./empilh.)' },
        { nome: 'Duradouro',    initStacks: 1, maxStack: 3, efeito: '+1 turno em habilidades com duração' },
        { nome: 'Energia',      initStacks: 1, maxStack: 5, efeito: '+1 Energia/progressão (2º+: -1 Vida/nível)' },
        { nome: 'Interpessoal', initStacks: 1, maxStack: 5, efeito: '+2 em Social e Vontade (2º+: -1 Luta/Pont.)' },
        { nome: 'Inventário',   initStacks: 1, maxStack: 4, efeito: '+5 Inventário Base (2º+: -1m Deslocamento)' },
        { nome: 'Letalidade',   initStacks: 1, maxStack: 5, efeito: '+1D6+1 de dano Furtivo' },
        { nome: 'Muscular',     initStacks: 1, maxStack: 5, efeito: '+2 em Luta e Força (2º+: -1 Intelecto)' },
        { nome: 'Precisão',     initStacks: 1, maxStack: 5, efeito: '+2 em Pontaria e Medicina (2º+: -1 Social)' },
        { nome: 'Reflexos',     initStacks: 1, maxStack: 5, efeito: '+1 Destreza e +1 Esquiva (2º+: -1 Vigor)' },
        { nome: 'Resiliência',  initStacks: 1, maxStack: 5, efeito: '+1 Vigor e +1 Bloqueio (2º+: -1 Destreza)' },
        { nome: 'Resistente',   initStacks: 1, maxStack: 5, efeito: '+1 resist. Geral (2º+: -1 Defesa)' },
        { nome: 'Sinapses',     initStacks: 1, maxStack: 5, efeito: '+2 em Intelecto e Sentidos (2º+: -1 Força)' },
        { nome: 'Veloz',        initStacks: 2, maxStack: 4, efeito: '+3m Deslocamento (2º+: -2 Inventário)' },
        { nome: 'Vida',         initStacks: 1, maxStack: 5, efeito: '+1 Vida/progressão (2º+: -1 Energia/nível)' },
    ]
};

// Modifications per weapon/item category
// format: { nome, initStacks, maxStack, bloqueia: [], desc, statEffect }
const MODIFICACOES = {
    cac: [
        { nome: 'Balanceada',              initStacks: 1, maxStack: 1, bloqueia: [],                                       desc: '+1 dado nos testes',                                       statEffect: null },
        { nome: 'Confortável',             initStacks: 3, maxStack: 4, bloqueia: [],                                       desc: 'Concede Ataque Duplo (+1E). Extras: −1E/stack',            statEffect: null },
        { nome: 'Empunhadura Sofisticada', initStacks: 1, maxStack: 5, bloqueia: [],                                       desc: '+2 nos testes de ataque por stack',                        statEffect: null },
        { nome: 'Explosiva',               initStacks: 1, maxStack: 5, bloqueia: ['Fervente','Furtiva','Plasma'],          desc: '+1D4 [Explosão] por stack',                               statEffect: '+1D4 [Explosão]' },
        { nome: 'Fervente',                initStacks: 1, maxStack: 5, bloqueia: ['Explosiva'],                            desc: '+1D4 [Químico] por stack',                                statEffect: '+1D4 [Químico]' },
        { nome: 'Furtiva',                 initStacks: 1, maxStack: 2, bloqueia: ['Explosiva','Pesada','Plasma'],          desc: '−1 peso (mín. 1), sem acréscimo de peso da mod',          statEffect: null, peso: 0 },
        { nome: 'Impacto',                 initStacks: 1, maxStack: 5, bloqueia: [],                                       desc: 'Atordoar 1E (DT Força). +2 DT/stack extra',               statEffect: null },
        { nome: 'Lacerante',               initStacks: 1, maxStack: 5, bloqueia: [],                                       desc: 'Ignora 5 pts de resist. [Físico] por stack',              statEffect: 'Ignora 5 resist. [Físico]' },
        { nome: 'Letal',                   initStacks: 1, maxStack: 5, bloqueia: [],                                       desc: '+2 de dano por stack',                                    statEffect: '+2 dano' },
        { nome: 'Pesada',                  initStacks: 3, maxStack: 5, bloqueia: ['Furtiva','Tática','Veloz'],             desc: '+1 tipo de dado (máx D10), +0,5 peso/stack',              statEffect: '+1 tipo dado (máx D10)', peso: 0.5 },
        { nome: 'Plasma',                  initStacks: 1, maxStack: 5, bloqueia: ['Explosiva','Furtiva','Sangramento','Venenosa'], desc: '+1D6 [Químico] por stack, +0,5 peso', statEffect: '+1D6 [Químico]', peso: 0.5 },
        { nome: 'Reforçada',               initStacks: 1, maxStack: 3, bloqueia: [],                                       desc: '+1 dado de dano por stack',                               statEffect: '+1 dado' },
        { nome: 'Sangramento',             initStacks: 1, maxStack: 4, bloqueia: ['Plasma','Venenosa'],                    desc: 'Causa Sangramento 2t (DT Força). +2 DT/+1t por stack',   statEffect: null },
        { nome: 'Tática',                  initStacks: 1, maxStack: 3, bloqueia: ['Pesada'],                               desc: 'Saque livre. Extras: +1 dado no 1º turno/stack',          statEffect: null },
        { nome: 'Veloz',                   initStacks: 1, maxStack: 5, bloqueia: ['Pesada'],                               desc: 'Atrib. → DES. Extras: +1 iniciativa/stack',               statEffect: null },
        { nome: 'Venenosa',                initStacks: 1, maxStack: 4, bloqueia: ['Plasma','Sangramento'],                 desc: 'Causa Envenenado 2t (DT Força). +2 DT/+1t por stack',    statEffect: null },
    ],
    explosivos: [
        { nome: 'Adesiva',       initStacks: 1, maxStack: 3, bloqueia: ['Posicionável'],                      desc: 'Reação do alvo −1 dado',                                  statEffect: null },
        { nome: 'Aerodinâmica',  initStacks: 1, maxStack: 3, bloqueia: ['Posicionável'],                      desc: '+1 nível de alcance. Extras: +2 no teste/stack',           statEffect: null },
        { nome: 'Atordoamento',  initStacks: 1, maxStack: 3, bloqueia: ['Corrosiva'],                         desc: 'Alvos atingidos ficam Atordoados por 1 turno',             statEffect: null },
        { nome: 'Corrosiva',     initStacks: 1, maxStack: 3, bloqueia: ['Atordoamento','Posicionável'],       desc: 'Alvos com −2 Defesa por 1 turno',                          statEffect: null },
        { nome: 'Estabilizada',  initStacks: 1, maxStack: 5, bloqueia: [],                                    desc: '+1 metro de raio por stack',                               statEffect: '+1m raio' },
        { nome: 'Persistente',   initStacks: 1, maxStack: 2, bloqueia: [],                                    desc: '+1 turno de duração por stack',                            statEffect: null },
        { nome: 'Posicionável',  initStacks: 1, maxStack: 5, bloqueia: ['Adesiva','Aerodinâmica','Corrosiva'],desc: 'Instalável e ativável remotamente (30m; DT +2/+5m/stack)',  statEffect: null },
        { nome: 'Potente',       initStacks: 2, maxStack: 4, bloqueia: [],                                    desc: '+2 dados de dano por stack',                               statEffect: '+2 dados' },
        { nome: 'Estilhaços',    initStacks: 3, maxStack: 5, bloqueia: [],                                    desc: 'Ignora 10 pontos de resistência por stack',               statEffect: 'Ignora 10 resist.' },
    ],
    armasFogo: [
        { nome: 'Alcance',       initStacks: 1, maxStack: 1, bloqueia: [],                               desc: '+1 nível de alcance',                                          statEffect: null },
        { nome: 'Estabilizador', initStacks: 3, maxStack: 4, bloqueia: [],                               desc: 'Concede Ataque Duplo (+1E). Extras: −1E/stack',                statEffect: null },
        { nome: 'Explosiva',     initStacks: 1, maxStack: 5, bloqueia: ['Furtiva','Silenciada','Plasma'], desc: '+1D6 [Explosão] por stack',                                   statEffect: '+1D6 [Explosão]' },
        { nome: 'Furtiva',       initStacks: 1, maxStack: 2, bloqueia: ['Plasma','Explosiva'],           desc: '−1 peso (mín. 1), sem acréscimo de peso da mod',               statEffect: null, peso: 0 },
        { nome: 'Mira Dot',      initStacks: 1, maxStack: 5, bloqueia: [],                               desc: '+2 nos testes de ataque por stack',                            statEffect: null },
        { nome: 'Mira Laser',    initStacks: 1, maxStack: 1, bloqueia: [],                               desc: '+1 dado no teste',                                             statEffect: null },
        { nome: 'Plasma',        initStacks: 1, maxStack: 5, bloqueia: ['Silenciada','Furtiva','Explosiva'], desc: '+1D8 [Químico] por stack, +0,5 peso. Mun: Células de Plasma', statEffect: '+1D8 [Químico]', peso: 0.5 },
        { nome: 'Potência',      initStacks: 1, maxStack: 5, bloqueia: [],                               desc: '+2 de dano por stack',                                         statEffect: '+2 dano' },
        { nome: 'Silenciada',    initStacks: 1, maxStack: 1, bloqueia: ['Explosiva','Plasma'],           desc: 'Não concede bônus ao alvo ao ficar furtivo após ataque furtivo', statEffect: null },
        { nome: 'Tática',        initStacks: 1, maxStack: 3, bloqueia: [],                               desc: 'Saque livre. Extras: +1 dado no 1º turno/stack',               statEffect: null },
    ],
    municoes: [
        { nome: 'Calibre',       initStacks: 1, maxStack: 4, bloqueia: ['Selante','Supressora'],         desc: '+1 dado de dano por stack',                                    statEffect: '+1 dado' },
        { nome: 'Estilhaços',    initStacks: 1, maxStack: 5, bloqueia: ['Incendiária','Tóxica'],         desc: '+1D6 [Físico] por stack',                                      statEffect: '+1D6 [Físico]' },
        { nome: 'Explosiva',     initStacks: 1, maxStack: 5, bloqueia: [],                               desc: '+1D6 [Explosão] por stack',                                    statEffect: '+1D6 [Explosão]' },
        { nome: 'Impacto',       initStacks: 2, maxStack: 5, bloqueia: [],                               desc: 'Atordoar (DT Intelecto). +2 DT/stack extra',                  statEffect: null },
        { nome: 'Incendiária',   initStacks: 1, maxStack: 5, bloqueia: ['Estilhaços','Ponta Oca'],       desc: '+1D6 [Químico] + 50% Em Chamas. Extras: +1 dado +2 DT/stack', statEffect: '+1D6 [Químico]' },
        { nome: 'Instável',      initStacks: 1, maxStack: 5, bloqueia: [],                               desc: '+1D10 [Balístico]. Falhar: 10% de chance de reduzir 1 cena', statEffect: '+1D10 [Balístico]' },
        { nome: 'Munição Extra', initStacks: 3, maxStack: 3, bloqueia: [],                               desc: '+1 cena de duração (por 3 stacks iniciais)',                  statEffect: null },
        { nome: 'Perfurante',    initStacks: 1, maxStack: 5, bloqueia: [],                               desc: 'Ignora 5 resist. [Balístico] por stack',                      statEffect: 'Ignora 5 resist. [Balístico]' },
        { nome: 'Ponta Oca',     initStacks: 1, maxStack: 5, bloqueia: ['Incendiária','Tóxica'],         desc: '+1D6 [Físico] + 50% Sangramento. Extras: +1 dado +2 DT/stack', statEffect: '+1D6 [Físico]' },
        { nome: 'Selante',       initStacks: 3, maxStack: 4, bloqueia: ['Calibre','Supressora'],         desc: 'Inibe regeneração neste turno. Extras: +5 fraqueza ao dano', statEffect: null },
        { nome: 'Supressora',    initStacks: 2, maxStack: 4, bloqueia: ['Calibre','Selante'],            desc: 'Ao acertar com crítico, −1 dado no próximo teste de ataque',  statEffect: null },
        { nome: 'Tóxica',        initStacks: 1, maxStack: 5, bloqueia: ['Estilhaços','Ponta Oca'],       desc: '+1D6 [Químico] por stack',                                     statEffect: '+1D6 [Químico]' },
    ],
    protecoes: [
        { nome: 'Antibombas',  initStacks: 1, maxStack: 5, bloqueia: ['Camuflada','Espinhos','Hazmat','Flexível'], desc: '+2 resist. [Explosão] por stack',              statEffect: '+2 [Explosão]' },
        { nome: 'Blindada',    initStacks: 1, maxStack: 5, bloqueia: ['Camuflada','Flexível','Reforçada'],         desc: '+2 na resist. principal, +0,5 peso/stack',     statEffect: '+2 resist.', peso: 0.5 },
        { nome: 'Camuflada',   initStacks: 1, maxStack: 5, bloqueia: ['Antibombas','Blindada','Espinhos'],         desc: '−1 peso (mín. 1), −1 resist. por stack',       statEffect: '−1 resist.' },
        { nome: 'Espinhos',    initStacks: 1, maxStack: 5, bloqueia: ['Antibombas','Camuflada','Hazmat'],          desc: '1D6+VIG [Físico] ao atacante. +1 dado/stack',  statEffect: null },
        { nome: 'Flexível',    initStacks: 2, maxStack: 5, bloqueia: ['Antibombas','Blindada','Resistente'],       desc: '+1 ao Esquivar por stack',                     statEffect: null },
        { nome: 'Hazmat',      initStacks: 1, maxStack: 5, bloqueia: ['Antibombas','Espinhos'],                    desc: '+2 resist. [Químico] por stack',                statEffect: '+2 [Químico]' },
        { nome: 'Reforçada',   initStacks: 1, maxStack: 5, bloqueia: ['Blindada'],                                 desc: '+1 na resist. principal por stack',            statEffect: '+1 resist.' },
        { nome: 'Resistente',  initStacks: 2, maxStack: 5, bloqueia: ['Flexível'],                                 desc: '+1 ao Bloquear por stack',                     statEffect: null },
    ],
    exoticos: [
        { nome: 'Antimatéria', initStacks: 4, maxStack: 4, bloqueia: ['Faz Parte','Vibrante','Flamejante'], desc: 'Muda o tipo de dano da arma para Dano Geral',                  statEffect: null },
        { nome: 'Faz Parte',   initStacks: 2, maxStack: 2, bloqueia: ['Antimatéria'],                      desc: 'Permite aplicar modificações do tipo especificado',            statEffect: null },
        { nome: 'Vibrante',    initStacks: 1, maxStack: 5, bloqueia: ['Antimatéria'],                      desc: '+1D8 [Físico] por stack',            statEffect: '+1D8 [Físico]' },
        { nome: 'Flamejante',  initStacks: 1, maxStack: 5, bloqueia: ['Antimatéria'],                      desc: '+1D8 [Químico] por stack e causa Em Chamas',                   statEffect: '+1D8 [Químico]' },
    ],
    armazenamento: [
        { nome: 'Compartimentos Extras', initStacks: 1, maxStack: 5, bloqueia: ['Espaço Reservado'],      desc: '+1 inventário por stack',                    statEffect: '+1 inv.' },
        { nome: 'Bolso Tático',          initStacks: 1, maxStack: 3, bloqueia: [],                        desc: 'Seleciona uma arma (ação de movimento) ou item (ação livre) para sacar', statEffect: null },
        { nome: 'Camadas Extras',        initStacks: 1, maxStack: 5, bloqueia: ['Distribuição de Peso'],  desc: '+1 resist. [Físico] e [Balístico] por stack', statEffect: '+1 resist. [Físico/Bal.]' },
        { nome: 'Espaço Reservado',      initStacks: 2, maxStack: 4, bloqueia: ['Compartimentos Extras'], desc: 'Item selecionado: 2ª repetição não conta peso. Extras: +1 item desconsiderado', statEffect: null },
        { nome: 'Arsenal Reserva',       initStacks: 2, maxStack: 5, bloqueia: [],                        desc: 'Arma de até 1 peso não conta no inventário. Extras: +1 limite de peso',          statEffect: null },
        { nome: 'Distribuição de Peso',  initStacks: 1, maxStack: 5, bloqueia: ['Camadas Extras'],        desc: '−1 deslocamento ao Sobrecarregado. 5º: DEF −2, dados −1',                        statEffect: null },
    ],
};

// ============================================================
// ABA COMPRAS — ESTADO
// ============================================================
let comprasCart = [];   // [{uid, nome, cat, custo, peso, qty, mods:[{nome, stacks}]}]
let comprasAmps = [];   // [{nome, stacks}]
let cmpCatAtiva = 'cac';
let cmpSearch = '';
let cmpUidCounter = 0;
let cmpOpenPanels = new Set();

function saveCmpState() {
    const state = {
        cart: comprasCart,
        amps: comprasAmps,
        uid: cmpUidCounter,
        dinheiro: document.getElementById('cmp-dinheiro').value,
        prestigio: document.getElementById('cmp-prestigio').value,
        inventario: document.getElementById('cmp-inventario').value,
        vontade: document.getElementById('cmp-vontade').value,
    };
    localStorage.setItem('contratados_compras_v1', JSON.stringify(state));
}

function loadCmpState() {
    const raw = localStorage.getItem('contratados_compras_v1');
    if (!raw) return;
    try {
        const state = JSON.parse(raw);
        comprasCart = state.cart || [];
        comprasAmps = state.amps || [];
        cmpUidCounter = state.uid || 0;
        if (state.dinheiro !== undefined) document.getElementById('cmp-dinheiro').value = state.dinheiro;
        if (state.prestigio !== undefined) document.getElementById('cmp-prestigio').value = state.prestigio;
        if (state.inventario !== undefined) document.getElementById('cmp-inventario').value = state.inventario;
        if (state.vontade !== undefined) document.getElementById('cmp-vontade').value = state.vontade;
    } catch (e) {
        localStorage.removeItem('contratados_compras_v1');
    }
}

// ============================================================
// ABA COMPRAS — LÓGICA
// ============================================================
function calcCompras() {
    renderCmpSummary();
    renderCmpCatalog();
    renderCmpCart();
    saveCmpState();
}

function getCmpInputs() {
    return {
        dinheiro:   parseFloat(document.getElementById('cmp-dinheiro').value) || 0,
        prestigio:  parseInt(document.getElementById('cmp-prestigio').value) || 0,
        inventario: parseFloat(document.getElementById('cmp-inventario').value) || 0,
        vontade:    parseInt(document.getElementById('cmp-vontade').value) || 0,
    };
}

function parseStorageBonus(bonusStr) {
    if (!bonusStr) return 0;
    const m = bonusStr.match(/([\d,]+)/);
    return m ? parseFloat(m[1].replace(',', '.')) : 0;
}

// Returns the borrowed category key for an exotic item when "Faz Parte" is active, else null.
function getFazParteBorrowedCat(item) {
    if (item.cat !== 'exoticos') return null;
    const hasFazParte = item.mods.some(m => m.nome === 'Faz Parte');
    if (!hasFazParte) return null;
    const ci = CATALOGO_ITENS.exoticos.find(i => i.nome === item.nome);
    return (ci && ci.fazParteCat) || null;
}

// Returns the full mod definition list available for an item (base + borrowed if applicable).
function getAllModDefs(item) {
    const base = MODIFICACOES[item.cat] || [];
    const borrowedCat = getFazParteBorrowedCat(item);
    if (!borrowedCat) return base;
    const borrowed = (MODIFICACOES[borrowedCat] || []).map(m => ({ ...m, _borrowedFrom: borrowedCat }));
    return [...base, ...borrowed];
}

// Returns number of purchases for a mod (1 for the first initStacks, +1 per extra stack).
function getModPurchases(item, modNome, stacks) {
    const def = getAllModDefs(item).find(m => m.nome === modNome);
    const initStacks = def ? def.initStacks : 1;
    return Math.max(1, stacks - initStacks + 1);
}

// Returns weight added per stack for a given mod (defaults to 0.2).
function getModPeso(item, modNome) {
    const def = getAllModDefs(item).find(m => m.nome === modNome);
    return (def && def.peso !== undefined) ? def.peso : 0.2;
}

// Returns the cost per stack for a given mod on an item.
function getModCusto(item, modNome) {
    const borrowedCat = getFazParteBorrowedCat(item);
    if (borrowedCat) {
        const isBorrowed = (MODIFICACOES[borrowedCat] || []).some(m => m.nome === modNome);
        if (isBorrowed) return MOD_CUSTO[borrowedCat] || 750;
    }
    return MOD_CUSTO[item.cat] || 750;
}

function getCmpTotals() {
    let gasto = 0, pesoUsado = 0, bonusInventory = 0;

    comprasCart.forEach(item => {
        const qty = item.qty || 1;
        gasto += item.custo * qty;
        const isStorage = item.cat === 'armazenamento';
        // Armazenamento vestida: amplia inventário, não pesa. Guardada: pesa, não amplia.
        if (!isStorage || item.stored) pesoUsado += item.peso * qty;
        if (isStorage && !item.stored) {
            const ci = (CATALOGO_ITENS.armazenamento || []).find(c => c.nome === item.nome);
            bonusInventory += parseStorageBonus(ci && ci.bonus) * qty;
        }
        item.mods.forEach(mod => {
            gasto += getModPurchases(item, mod.nome, mod.stacks) * getModCusto(item, mod.nome) * qty;
            if (!isStorage || item.stored) pesoUsado += mod.stacks * getModPeso(item, mod.nome) * qty;
            if (isStorage && !item.stored) {
                if (mod.nome === 'Compartimentos Extras') bonusInventory += mod.stacks * qty;
                else if (mod.nome === 'Camadas Extras') bonusInventory += mod.stacks * 0.5 * qty;
            }
        });
    });

    // Amplificadores: first stack = $3000, each additional = $1000
    comprasAmps.forEach(amp => {
        gasto += 3000 + Math.max(0, amp.stacks - 1) * 1000;
    });

    const ampStacks = comprasAmps.reduce((s, a) => s + a.stacks, 0);

    return { gasto, pesoUsado, ampStacks, bonusInventory };
}

function renderCmpSummary() {
    const { dinheiro, prestigio, inventario, vontade } = getCmpInputs();
    const pat = getPatenteMod(prestigio);
    const { gasto, pesoUsado, ampStacks, bonusInventory } = getCmpTotals();
    const restante = dinheiro - gasto;
    const ampLimit = vontade * 3;
    const vontadePenalty = comprasAmps.reduce((s, a) => s + Math.max(0, a.stacks - 1) * 2, 0);
    const effectiveInv = inventario + bonusInventory;

    document.getElementById('cmp-s-patente').textContent = pat.nome;
    document.getElementById('cmp-s-gasto').textContent = '$' + gasto.toLocaleString('pt-BR');
    const dinEl = document.getElementById('cmp-s-dinheiro');
    dinEl.textContent = '$' + restante.toLocaleString('pt-BR');
    dinEl.style.color = restante < 0 ? 'var(--accent)' : 'var(--green)';
    const invEl = document.getElementById('cmp-s-inv');
    const fmtN = n => n % 1 === 0 ? n : n.toFixed(1);
    invEl.textContent = fmtN(pesoUsado) + ' / ' + fmtN(effectiveInv)
        + (bonusInventory > 0 ? ` (base ${fmtN(inventario)} +${fmtN(bonusInventory)} vest.)` : '');
    invEl.style.color = pesoUsado > effectiveInv ? 'var(--accent)' : 'var(--txt)';
    const ampEl = document.getElementById('cmp-s-amps');
    ampEl.textContent = ampStacks + ' / ' + ampLimit;
    ampEl.style.color = ampStacks > ampLimit ? 'var(--accent)' : 'var(--txt)';
    document.getElementById('cmp-s-modlimit').textContent =
        'máx. ' + pat.maxMods + ' mods (' + pat.maxStack + ' stack/mod)';
    const penEl = document.getElementById('cmp-s-vontade-pen');
    if (penEl) {
        penEl.textContent = vontadePenalty > 0 ? '−' + vontadePenalty + ' Vontade' : '—';
        penEl.style.color = vontadePenalty > 0 ? 'var(--accent)' : 'var(--txt)';
    }
}

function renderCmpCatalog() {
    // Category tabs
    const tabsEl = document.getElementById('cmp-cat-tabs');
    tabsEl.innerHTML = CATALOGO_CATS.map(c =>
        `<button class="cmp-cat-btn${cmpCatAtiva === c.key ? ' active' : ''}${cmpSearch ? ' disabled' : ''}" onclick="setCmpCat('${c.key}')">${c.icon} ${c.label}</button>`
    ).join('');

    const el = document.getElementById('cmp-catalog');
    const cat = cmpCatAtiva;

    // --- Amplificador section (only shown if no search, or search matches amps) ---
    if (!cmpSearch) {
        if (cat === 'amplificador') {
            el.innerHTML = buildAmpCatalogHtml();
            return;
        }
    } else {
        const ampMatch = CATALOGO_ITENS.amplificador.some(a => a.nome.toLowerCase().includes(cmpSearch));
        if (ampMatch && !CATALOGO_CATS.filter(c => c.key !== 'amplificador').some(c =>
            (CATALOGO_ITENS[c.key] || []).some(i => i.nome.toLowerCase().includes(cmpSearch))
        )) {
            // Only amp results — show amp section
            el.innerHTML = buildAmpCatalogHtml(cmpSearch);
            return;
        }
        if (ampMatch) {
            // Mixed results: show regular items + amp section below
            const regularHtml = buildRegularItemsHtml(cmpSearch);
            el.innerHTML = regularHtml + buildAmpCatalogHtml(cmpSearch);
            return;
        }
        el.innerHTML = buildRegularItemsHtml(cmpSearch);
        return;
    }

    el.innerHTML = buildRegularItemsHtml(null, cat);
}

function buildAmpCatalogHtml(search) {
    const { vontade, prestigio } = getCmpInputs();
    const pat = getPatenteMod(prestigio);
    const ampLimit = vontade * 3;
    const ampStacks = comprasAmps.reduce((s, a) => s + a.stacks, 0);
    const amps = search
        ? CATALOGO_ITENS.amplificador.filter(a => a.nome.toLowerCase().includes(search))
        : CATALOGO_ITENS.amplificador;
    return `<div class="cmp-info-box">Limite: <strong>Vontade × 3 = ${ampLimit} stacks</strong> totais · máx. <strong>${pat.maxStack} stack/amp</strong> (${pat.nome}) · Primeiro empilhamento: $3.000 · Adicionais: $1.000</div>
    <div class="cmp-item-grid">` +
    amps.map(amp => {
        const inCart = comprasAmps.find(a => a.nome === amp.nome);
        const curStacks = inCart ? inCart.stacks : 0;
        const effectiveMax = Math.min(amp.maxStack, pat.maxStack);
        const canAdd = ampStacks < ampLimit && curStacks < effectiveMax;
        return `<div class="cmp-item-card">
            <div class="cmp-item-name">${amp.nome}</div>
            <div class="cmp-item-desc">${amp.efeito}</div>
            <div class="cmp-item-meta">
                <span class="cmp-item-cost">$${curStacks === 0 ? '3.000' : '1.000'}</span>
                <span class="cmp-item-weight">máx. ${effectiveMax} stacks</span>
            </div>
            ${curStacks > 0 ? `<div class="cmp-amp-stacks">Ativo: ${curStacks}/${effectiveMax} stack${curStacks > 1 ? 's' : ''}
                ${curStacks >= 2 ? '<span class="cmp-penalty-tag">-2 Vontade</span>' : ''}</div>` : ''}
            <div class="cmp-item-actions">
                ${curStacks > 0 ? `<button class="cmp-btn-remove" onclick="removeAmp('${amp.nome}')">−</button>` : ''}
                <button class="cmp-btn-add${!canAdd ? ' disabled' : ''}" onclick="addAmp('${amp.nome}',${amp.initStacks},${amp.maxStack})"${!canAdd ? ' disabled' : ''}>
                    ${curStacks === 0 ? '+ Adquirir ($3.000)' : '+ Stack ($1.000)'}
                </button>
            </div>
        </div>`;
    }).join('') + '</div>';
}

function buildRegularItemsHtml(search, cat) {
    let itensParaRender;
    if (search) {
        itensParaRender = [];
        for (const [catKey, itens] of Object.entries(CATALOGO_ITENS)) {
            if (catKey === 'amplificador') continue;
            for (const item of itens) {
                if (item.nome.toLowerCase().includes(search)) {
                    itensParaRender.push({ ...item, _cat: catKey });
                }
            }
        }
    } else {
        itensParaRender = (CATALOGO_ITENS[cat] || []).map(item => ({ ...item, _cat: cat }));
    }

    if (itensParaRender.length === 0) {
        return `<div class="cmp-item-grid"><p style="color:var(--txt-muted,#888);padding:1rem;">Nenhum item encontrado.</p></div>`;
    }

    return `<div class="cmp-item-grid">` +
    itensParaRender.map(item => {
        const hasBonus = item.bonus ? `<span class="cmp-bonus-tag">${item.bonus}</span>` : '';
        const statLine = item.dano
            ? `<div class="cmp-item-stat">⚔ ${item.dano}${item.info ? ' · ' + item.info : ''}</div>`
            : item.resist
                ? `<div class="cmp-item-stat">🛡 ${item.resist}</div>`
                : '';
        const descLine = item.desc ? `<div class="cmp-item-desc">${item.desc}</div>` : '';
        return `<div class="cmp-item-card">
            <div class="cmp-item-name">${item.nome} ${hasBonus}</div>
            ${statLine}${descLine}
            <div class="cmp-item-meta">
                <span class="cmp-item-cost">$${item.custo.toLocaleString('pt-BR')}</span>
                <span class="cmp-item-weight">${item.peso} slot${item.peso !== 1 ? 's' : ''}</span>
            </div>
            <button class="cmp-btn-add" onclick="addToCart('${item._cat}','${item.nome.replace(/'/g, "\\'")}',${item.custo},${item.peso})">+ Adicionar</button>
        </div>`;
    }).join('') + '</div>';
}

function setCmpCat(key) {
    cmpCatAtiva = key;
    renderCmpCatalog();
}

function setCmpSearch(val) {
    cmpSearch = val.trim().toLowerCase();
    renderCmpCatalog();
}

function addToCart(cat, nome, custo, peso) {
    const existing = comprasCart.find(i => i.cat === cat && i.nome === nome);
    if (existing) { existing.qty = (existing.qty || 1) + 1; }
    else { comprasCart.push({ uid: cmpUidCounter++, nome, cat, custo, peso, qty: 1, mods: [], stored: false }); }
    renderCmpSummary();
    renderCmpCatalog();
    renderCmpCart();
    saveCmpState();
}

function limparCarrinho() {
    if (comprasCart.length === 0 && comprasAmps.length === 0) return;
    comprasCart = [];
    comprasAmps = [];
    cmpOpenPanels = new Set();
    renderCmpSummary();
    renderCmpCatalog();
    renderCmpCart();
    saveCmpState();
}

function removeFromCart(uid) {
    const item = comprasCart.find(i => i.uid === uid);
    if (!item) return;
    if ((item.qty || 1) > 1) { item.qty--; }
    else { comprasCart = comprasCart.filter(i => i.uid !== uid); cmpOpenPanels.delete(uid); }
    renderCmpSummary();
    renderCmpCatalog();
    renderCmpCart();
    saveCmpState();
}

function addAmp(nome, initStacks, maxStack) {
    const { vontade, prestigio } = getCmpInputs();
    const pat = getPatenteMod(prestigio);
    const effectiveMax = Math.min(maxStack, pat.maxStack);
    const ampLimit = vontade * 3;
    const totalStacks = comprasAmps.reduce((s, a) => s + a.stacks, 0);
    const existing = comprasAmps.find(a => a.nome === nome);
    if (existing) {
        if (existing.stacks < effectiveMax && totalStacks < ampLimit) existing.stacks++;
    } else {
        if (totalStacks + 1 <= ampLimit) comprasAmps.push({ nome, stacks: 1 });
    }
    renderCmpSummary();
    renderCmpCatalog();
    renderCmpCart();
    saveCmpState();
}

function removeAmp(nome) {
    const existing = comprasAmps.find(a => a.nome === nome);
    if (!existing) return;
    if (existing.stacks <= 1) comprasAmps = comprasAmps.filter(a => a.nome !== nome);
    else existing.stacks--;
    renderCmpSummary();
    renderCmpCatalog();
    renderCmpCart();
    saveCmpState();
}

function addMod(uid, modNome) {
    const item = comprasCart.find(i => i.uid === uid);
    if (!item) return;
    const { prestigio } = getCmpInputs();
    const pat = getPatenteMod(prestigio);
    const mods = getAllModDefs(item);
    const modDef = mods.find(m => m.nome === modNome);
    if (!modDef) return;

    const existing = item.mods.find(m => m.nome === modNome);
    const curStacks = existing ? existing.stacks : 0;
    const modsUsed = item.mods.reduce((s, m) => s + m.stacks, 0);

    // Check if blocked by existing mods
    const blocked = item.mods.some(m => {
        const def = mods.find(d => d.nome === m.nome);
        return def && def.bloqueia.includes(modNome);
    });
    if (blocked) return;

    // Check patente stacking limit
    const newStacks = curStacks === 0 ? modDef.initStacks : curStacks + 1;
    const stacksToAdd = curStacks === 0 ? modDef.initStacks : 1;
    if (newStacks > pat.maxStack) return;
    if (modsUsed + stacksToAdd > pat.maxMods) return;
    if (newStacks > modDef.maxStack) return;

    if (existing) existing.stacks = newStacks;
    else item.mods.push({ nome: modNome, stacks: modDef.initStacks });

    renderCmpSummary();
    renderCmpCart();
    saveCmpState();
}

function removeMod(uid, modNome) {
    const item = comprasCart.find(i => i.uid === uid);
    if (!item) return;
    const mods = getAllModDefs(item);
    const modDef = mods.find(m => m.nome === modNome);
    const existing = item.mods.find(m => m.nome === modNome);
    if (!existing || !modDef) return;

    if (existing.stacks <= modDef.initStacks) {
        item.mods = item.mods.filter(m => m.nome !== modNome);
    } else {
        existing.stacks--;
    }
    renderCmpSummary();
    renderCmpCart();
    saveCmpState();
}

function toggleStored(uid) {
    const item = comprasCart.find(i => i.uid === uid);
    if (item) item.stored = !item.stored;
    renderCmpSummary();
    renderCmpCart();
    saveCmpState();
}

const _DIE_LADDER = [3, 4, 6, 8, 10, 12, 20];
function _upgradeDie(sides, steps, cap) {
    const idx = _DIE_LADDER.indexOf(sides);
    if (idx === -1) return sides;
    const capIdx = cap ? _DIE_LADDER.indexOf(cap) : _DIE_LADDER.length - 1;
    return _DIE_LADDER[Math.min(idx + steps, capIdx)];
}

function computeItemStat(item) {
    const ci = (CATALOGO_ITENS[item.cat] || []).find(c => c.nome === item.nome);
    if (!ci) return null;
    const M = {};
    item.mods.forEach(m => M[m.nome] = m.stacks);

    // --- DAMAGE ---
    if (ci.dano) {
        const base = ci.dano;
        const m = base.match(/^(\d+)D(\d+)(.*?)\s*\[([^\]]+)\]$/);
        if (!m) return `⚔ ${base}${ci.info ? ' · ' + ci.info : ''}`;
        let dice = parseInt(m[1]);
        let sides = parseInt(m[2]);
        const mod = m[3].trim(); // '+DES', '+FOR', etc.
        const type = m[4];
        const extra = []; // {dice, sides, type}
        let flat = 0;

        if (item.cat === 'cac') {
            // Pesada: initStacks=3 = 1 upgrade; each extra stack = +1 more upgrade (máx D10)
            if (M['Pesada'])    sides = _upgradeDie(sides, 1 + Math.max(0, M['Pesada'] - 3), 10);
            if (M['Reforçada']) dice += M['Reforçada'];
            if (M['Letal'])     flat += M['Letal'] * 2;
            if (M['Explosiva']) extra.push({ dice: M['Explosiva'], sides: 4,  type: 'Explosão' });
            if (M['Fervente'])  extra.push({ dice: M['Fervente'],  sides: 4,  type: 'Químico'  });
            if (M['Plasma'])    extra.push({ dice: M['Plasma'],    sides: 6,  type: 'Químico'  });
        } else if (item.cat === 'armasFogo') {
            if (M['Potência'])  flat += M['Potência'] * 2;
            if (M['Explosiva']) extra.push({ dice: M['Explosiva'], sides: 6,  type: 'Explosão' });
            if (M['Plasma'])    extra.push({ dice: M['Plasma'],    sides: 8,  type: 'Químico'  });
        } else if (item.cat === 'exoticos') {
            if (M['Vibrante'])   extra.push({ dice: M['Vibrante'],   sides: 8,     type: 'Físico'   });
            if (M['Flamejante']) extra.push({ dice: M['Flamejante'], sides: 8,     type: 'Químico'  });
            if (M['Antimatéria']) extra.push({ dice: M['Antimatéria'], sides: sides, type: 'Explosão' });
        } else if (item.cat === 'explosivos') {
            if (M['Potente'])   dice += M['Potente'] * 2;
        }

        const flatStr = flat > 0 ? `+${flat}` : '';
        const baseStr = `${dice}D${sides}${mod}${flatStr} [${type}]`;
        const parts = [baseStr, ...extra.map(e => `${e.dice}D${e.sides} [${e.type}]`)];
        let infoStr = ci.info || '';
        if (item.cat === 'armasFogo' && M['Plasma']) {
            infoStr = infoStr.replace(/Mun:[^·\n]+/, 'Mun: Células de Plasma');
        }
        return `⚔ ${parts.join(' + ')}${infoStr ? ' · ' + infoStr : ''}`;
    }

    // --- RESIST ---
    if (ci.resist) {
        const entries = ci.resist.split(',').map(s => {
            const pm = s.trim().match(/^(\d+)\s*\[([^\]]+)\]$/);
            return pm ? { value: parseInt(pm[1]), typesRaw: pm[2] } : null;
        }).filter(Boolean);

        const findOrAdd = (typeName) => {
            let e = entries.find(e => e.typesRaw === typeName || e.typesRaw.includes(typeName));
            if (!e) { e = { value: 0, typesRaw: typeName }; entries.push(e); }
            return e;
        };

        if (item.cat === 'protecoes' && entries.length > 0) {
            if (M['Blindada'])   entries.forEach(e => { e.value += M['Blindada'] * 2; });
            if (M['Reforçada'])  entries.forEach(e => { e.value += M['Reforçada']; });
            if (M['Camuflada'])  entries.forEach(e => { e.value = Math.max(0, e.value - M['Camuflada']); });
            if (M['Hazmat'])     findOrAdd('Químico').value   += M['Hazmat']    * 2;
            if (M['Antibombas']) findOrAdd('Explosão').value  += M['Antibombas'] * 2;
        }
        if (item.cat === 'armazenamento') {
            if (M['Camadas Extras']) {
                findOrAdd('Físico').value   += M['Camadas Extras'];
                findOrAdd('Balístico').value += M['Camadas Extras'];
            }
        }

        const resistStr = entries.filter(e => e.value > 0).map(e => `${e.value} [${e.typesRaw}]`).join(', ');
        return resistStr ? `🛡 ${resistStr}` : null;
    }

    // --- STORAGE ---
    if (ci.bonus) {
        let slots = parseStorageBonus(ci.bonus);
        if (M['Compartimentos Extras']) slots += M['Compartimentos Extras'];
        const display = slots % 1 === 0 ? slots : slots.toFixed(1);
        return `📦 +${display} inv.`;
    }

    return null;
}

function toggleModPanel(uid) {
    if (cmpOpenPanels.has(uid)) cmpOpenPanels.delete(uid);
    else cmpOpenPanels.add(uid);
    const panel = document.getElementById('cmp-modpanel-' + uid);
    if (panel) panel.style.display = cmpOpenPanels.has(uid) ? 'block' : 'none';
}

function renderCmpCart() {
    const cartEl = document.getElementById('cmp-cart');
    const emptyEl = document.getElementById('cmp-cart-empty');
    const { prestigio } = getCmpInputs();
    const pat = getPatenteMod(prestigio);

    // Group: regular items + amps
    const allEmpty = comprasCart.length === 0 && comprasAmps.length === 0;
    emptyEl.style.display = allEmpty ? 'block' : 'none';
    if (allEmpty) { cartEl.innerHTML = ''; return; }

    let html = '';

    // Regular items
    comprasCart.forEach(item => {
        const modList = MODIFICACOES[item.cat] || [];
        const borrowedCat = getFazParteBorrowedCat(item);
        const borrowedModList = borrowedCat ? (MODIFICACOES[borrowedCat] || []) : [];
        const fullModList = borrowedCat ? [...modList, ...borrowedModList.map(m => ({ ...m, _borrowedFrom: borrowedCat }))] : modList;
        const hasMods = fullModList.length > 0;
        const modsUsed = item.mods.reduce((s, m) => s + m.stacks, 0);
        const modsCost = item.mods.reduce((s, m) => s + getModPurchases(item, m.nome, m.stacks) * getModCusto(item, m.nome), 0);
        const modsWeight = item.mods.reduce((s, m) => s + m.stacks * getModPeso(item, m.nome), 0);
        const qty = item.qty || 1;
        const totalCost = (item.custo + modsCost) * qty;
        const isStorage = item.cat === 'armazenamento';
        const countsWeight = !isStorage || item.stored;
        const rawWeight = (item.peso + modsWeight) * qty;
        const totalWeight = countsWeight ? rawWeight : 0;
        const fmtW = w => (w % 1 === 0 ? w : w.toFixed(1));
        const weightLabel = isStorage && !item.stored
            ? fmtW(rawWeight) + ' slots se guardada'
            : fmtW(totalWeight) + ' slots';

        // Computed stat (mods applied)
        const computedStat = computeItemStat(item);
        const statHtml = computedStat ? `<div class="cmp-cart-stats">${computedStat}</div>` : '';

        // Guardada toggle for armazenamento
        const storedToggle = item.cat === 'armazenamento'
            ? `<button class="cmp-stored-btn${item.stored ? ' active' : ''}" onclick="toggleStored(${item.uid})">${item.stored ? '📦 Guardada (ocupa slots, não amplia inv.)' : '🎒 Vestida (amplia inv., não ocupa slots)'}</button>`
            : '';

        html += `<div class="cmp-cart-item">
            <div class="cmp-cart-header">
                <div>
                    <span class="cmp-cart-name">${item.nome}${qty > 1 ? ' <span class="cmp-qty-badge">×' + qty + '</span>' : ''}</span>
                    <span class="cmp-cart-cat">${CATALOGO_CATS.find(c => c.key === item.cat)?.label || ''}</span>
                </div>
                <div class="cmp-cart-meta">
                    <span class="cmp-cart-cost">$${totalCost.toLocaleString('pt-BR')}</span>
                    <span class="cmp-cart-weight">${weightLabel}</span>
                    <button class="cmp-btn-remove cmp-btn-remove-sm" onclick="removeFromCart(${item.uid})" title="Remover −1">✕</button>
                </div>
            </div>
            ${statHtml}${storedToggle ? `<div class="cmp-stored-row">${storedToggle}</div>` : ''}`;

        // Active mods display
        if (item.mods.length > 0) {
            html += `<div class="cmp-active-mods">`;
            item.mods.forEach(mod => {
                const def = fullModList.find(m => m.nome === mod.nome);
                const canAdd = mod.stacks < (def ? def.maxStack : 1) && mod.stacks < pat.maxStack && modsUsed < pat.maxMods;
                const modTotalCost = getModPurchases(item, mod.nome, mod.stacks) * getModCusto(item, mod.nome);
                html += `<div class="cmp-mod-tag">
                    <div class="cmp-mod-tag-info">
                        <span>${mod.nome} ×${mod.stacks}</span>
                        <span class="cmp-mod-tag-cost">$${modTotalCost.toLocaleString('pt-BR')}</span>
                    </div>
                    <div class="cmp-mod-tag-btns">
                        <button class="cmp-mod-mini-btn" onclick="removeMod(${item.uid},'${mod.nome}')">−</button>
                        <button class="cmp-mod-mini-btn${!canAdd ? ' disabled' : ''}" onclick="addMod(${item.uid},'${mod.nome}')"${!canAdd ? ' disabled' : ''}>+</button>
                    </div>
                </div>`;
            });
            html += `</div>`;
        }

        // Helper: renders a list of mod entries into html
        const renderModSection = (mods, sectionCat) => {
            let out = '';
            mods.forEach(mod => {
                const existing = item.mods.find(m => m.nome === mod.nome);
                const curStacks = existing ? existing.stacks : 0;
                const blockedByExisting = item.mods.some(m => {
                    const d = fullModList.find(d => d.nome === m.nome);
                    return d && d.bloqueia.includes(mod.nome);
                });
                const thisBlocks = existing && mod.bloqueia.length > 0
                    ? mod.bloqueia.filter(b => item.mods.some(m => m.nome === b))
                    : [];
                const alreadyBlocks = thisBlocks.length > 0;
                const stacksToAdd = curStacks === 0 ? mod.initStacks : 1;
                const wouldExceedMods = modsUsed + stacksToAdd > pat.maxMods;
                const wouldExceedStack = (curStacks === 0 ? mod.initStacks : curStacks + 1) > pat.maxStack;
                const wouldExceedModMax = curStacks >= mod.maxStack;
                const canAdd = !blockedByExisting && !alreadyBlocks && !wouldExceedMods && !wouldExceedStack && !wouldExceedModMax && curStacks < mod.maxStack;

                let reason = '';
                if (blockedByExisting) reason = '🚫 Bloqueado';
                else if (alreadyBlocks) reason = '⚠ Bloqueia mod ativa';
                else if (wouldExceedStack) reason = `⚠ Limite patente (${pat.maxStack})`;
                else if (wouldExceedMods) reason = `⚠ Slots cheios (${pat.maxMods})`;
                else if (wouldExceedModMax) reason = `✓ Máx. empilh.`;

                const stackDots = Array.from({length: mod.maxStack}, (_, i) =>
                    `<span class="cmp-stack-dot${i < curStacks ? ' filled' : ''}"></span>`
                ).join('');

                out += `<div class="cmp-mod-entry${blockedByExisting ? ' blocked' : ''}${curStacks > 0 ? ' active' : ''}">
                    <div class="cmp-mod-entry-top">
                        <span class="cmp-mod-entry-name">${mod.nome}</span>
                        <div class="cmp-mod-entry-stacks">${stackDots}</div>
                    </div>
                    ${mod.desc ? `<div class="cmp-item-desc">${mod.desc}</div>` : ''}
                    ${reason ? `<div class="cmp-mod-reason">${reason}</div>` : ''}
                    ${mod.bloqueia.length > 0 ? `<div class="cmp-mod-blocks">Bloqueia: ${mod.bloqueia.join(', ')}</div>` : ''}
                    <div class="cmp-mod-entry-cost">$${(MOD_CUSTO[sectionCat] || 750).toLocaleString('pt-BR')}/stack</div>
                    <button class="cmp-btn-add cmp-btn-add-sm${!canAdd ? ' disabled' : ''}"
                        onclick="addMod(${item.uid},'${mod.nome}')"
                        ${!canAdd ? 'disabled' : ''}>
                        ${curStacks === 0 ? `+ Aplicar (${mod.initStacks > 1 ? mod.initStacks + ' stacks' : '1 stack'})` : '+ Stack'}
                    </button>
                </div>`;
            });
            return out;
        };

        // Mod panel
        if (hasMods) {
            html += `<button class="cmp-mods-toggle" onclick="toggleModPanel(${item.uid})">
                ⚙ Modificações (${modsUsed}/${pat.maxMods} slots usados) ▾
            </button>
            <div id="cmp-modpanel-${item.uid}" class="cmp-mod-panel" style="display:${cmpOpenPanels.has(item.uid) ? 'block' : 'none'}">
                <div class="cmp-mod-grid">`;
            html += renderModSection(modList, item.cat);
            if (borrowedCat && borrowedModList.length > 0) {
                const borrowedCatLabel = CATALOGO_CATS.find(c => c.key === borrowedCat)?.label || borrowedCat;
                html += `</div><div class="cmp-mod-section-header">Via Faz Parte — ${borrowedCatLabel}</div><div class="cmp-mod-grid">`;
                html += renderModSection(borrowedModList, borrowedCat);
            }
            html += `</div></div>`;
        }

        html += `</div>`;
    });

    // Amplifiers section
    if (comprasAmps.length > 0) {
        const { vontade, prestigio } = getCmpInputs();
        const pat = getPatenteMod(prestigio);
        const ampLimit = vontade * 3;
        const totalAmpStacks = comprasAmps.reduce((s, a) => s + a.stacks, 0);
        const totalVontadePenalty = comprasAmps.reduce((s, a) => s + Math.max(0, a.stacks - 1) * 2, 0);
        html += `<div class="cmp-amps-section">
            <div class="cmp-amps-header">⚡ Amplificadores (${totalAmpStacks}/${ampLimit} stacks)${totalVontadePenalty > 0 ? ' · <span style="color:var(--accent)">−' + totalVontadePenalty + ' Vontade total</span>' : ''}</div>`;
        comprasAmps.forEach(amp => {
            const def = CATALOGO_ITENS.amplificador.find(a => a.nome === amp.nome);
            const effectiveMax = Math.min(def ? def.maxStack : 5, pat.maxStack);
            const cost = 3000 + Math.max(0, amp.stacks - 1) * 1000;
            const thisPenalty = Math.max(0, amp.stacks - 1) * 2;
            const canAdd = totalAmpStacks < ampLimit && amp.stacks < effectiveMax;
            html += `<div class="cmp-cart-item cmp-amp-item">
                <div class="cmp-cart-header">
                    <div>
                        <span class="cmp-cart-name">${amp.nome}</span>
                        ${amp.stacks >= 2 ? `<span class="cmp-penalty-tag">−${thisPenalty} Vontade</span>` : ''}
                    </div>
                    <div class="cmp-cart-meta">
                        <span class="cmp-cart-cost">$${cost.toLocaleString('pt-BR')}</span>
                        <span class="cmp-cart-weight">${amp.stacks}/${effectiveMax} stack${amp.stacks > 1 ? 's' : ''}</span>
                    </div>
                </div>
                ${def ? `<div class="cmp-cart-stats">${def.efeito}</div>` : ''}
                <div class="cmp-amp-controls">
                    <button class="cmp-btn-remove" onclick="removeAmp('${amp.nome}')">− Stack</button>
                    <button class="cmp-btn-add${!canAdd ? ' disabled' : ''}" onclick="addAmp('${amp.nome}',1,${def ? def.maxStack : 5})"${!canAdd ? ' disabled' : ''}>+ Stack ($1.000)</button>
                    <button class="cmp-btn-remove cmp-btn-remove-sm" onclick="while(comprasAmps.find(a=>a.nome==='${amp.nome}'))removeAmp('${amp.nome}')" title="Remover tudo">✕</button>
                </div>
            </div>`;
        });
        html += `</div>`;
    }

    cartEl.innerHTML = html;
}

function toggleExportMenu(event) {
    event.stopPropagation();
    document.getElementById('cmp-export-menu').classList.toggle('open');
}

function exportarCarrinho(mode) {
    document.getElementById('cmp-export-menu').classList.remove('open');

    const showCost = mode !== 'pesos';
    const showPeso = mode !== 'custos';

    const { dinheiro, prestigio, inventario, vontade } = getCmpInputs();
    const { gasto, pesoUsado, ampStacks, bonusInventory } = getCmpTotals();
    const pat = getPatenteMod(prestigio);
    const restante = dinheiro - gasto;
    const effectiveInv = inventario + bonusInventory;
    const vontadePenalty = comprasAmps.reduce((s, a) => s + Math.max(0, a.stacks - 1) * 2, 0);
    const _f = n => n % 1 === 0 ? n : n.toFixed(1);

    let txt = '=== CONTRATADOS — LISTA DE COMPRAS ===\n';
    txt += `Patente: ${pat.nome} (Prestígio ${prestigio})\n`;
    if (showCost) {
        txt += `Dinheiro disponível: $${dinheiro.toLocaleString('pt-BR')}\n`;
        txt += `Gasto total: $${gasto.toLocaleString('pt-BR')}\n`;
        txt += `Dinheiro restante: $${restante.toLocaleString('pt-BR')}\n`;
    }
    if (showPeso) {
        txt += `Inventário: ${_f(pesoUsado)} / ${_f(effectiveInv)} slots${bonusInventory > 0 ? ` (${_f(inventario)} base + ${_f(bonusInventory)} armazenamento)` : ''}\n`;
    }
    txt += '\n';

    if (comprasCart.length > 0) {
        txt += '--- EQUIPAMENTOS ---\n';
        comprasCart.forEach(item => {
            const qty = item.qty || 1;
            const isStorage = item.cat === 'armazenamento';
            const modsCost = item.mods.reduce((s, m) => s + getModPurchases(item, m.nome, m.stacks) * getModCusto(item, m.nome), 0);
            const totalCost = (item.custo + modsCost) * qty;
            const modsWeight = item.mods.reduce((s, m) => s + m.stacks * getModPeso(item, m.nome), 0);
            const totalWeight = (item.peso + modsWeight) * qty;
            const countsWeight = !isStorage || item.stored;

            let line = `• ${item.nome}${qty > 1 ? ' ×' + qty : ''}${isStorage && !item.stored ? ' [vestida]' : ''}`;
            if (showCost) line += ` — $${totalCost.toLocaleString('pt-BR')}`;
            if (showPeso && countsWeight) line += ` | ${_f(totalWeight)} slot${totalWeight !== 1 ? 's' : ''}`;
            txt += line + '\n';

            const computedStatTxt = computeItemStat(item);
            if (computedStatTxt) txt += `  Stat: ${computedStatTxt.replace(/[⚔🛡📦] /g, '')}\n`;
            if (item.mods.length > 0) {
                item.mods.forEach(mod => {
                    let modLine = `  └ ${mod.nome} ×${mod.stacks}`;
                    if (showCost) {
                        const modCost = getModPurchases(item, mod.nome, mod.stacks) * getModCusto(item, mod.nome);
                        modLine += ` — $${modCost.toLocaleString('pt-BR')}`;
                    }
                    txt += modLine + '\n';
                });
            }
        });
        txt += '\n';
    }

    if (comprasAmps.length > 0) {
        txt += '--- AMPLIFICADORES ---\n';
        comprasAmps.forEach(amp => {
            const cost = 3000 + Math.max(0, amp.stacks - 1) * 1000;
            const def = CATALOGO_ITENS.amplificador.find(a => a.nome === amp.nome);
            let line = `• ${amp.nome} ×${amp.stacks}`;
            if (showCost) line += ` — $${cost.toLocaleString('pt-BR')}`;
            txt += line + '\n';
            if (def) txt += `  └ Efeito: ${def.efeito}\n`;
        });
        if (showCost && vontadePenalty > 0) txt += `\n⚠ Penalidade de Amplificadores: −${vontadePenalty} Vontade\n`;
        txt += '\n';
    }

    const now = new Date();
    const dateStr = now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0');
    const timeStr = now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0');
    txt += `Exportado em: ${now.toLocaleDateString('pt-BR')}\n`;

    const modeLabel = mode === 'custos' ? 'custos' : mode === 'pesos' ? 'pesos' : 'completa';
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contratados-compras-${modeLabel}-${dateStr}-${timeStr}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// ── Exportar/Importar código compartilhável ──

function abrirModalExportarCodigo() {
    document.getElementById('cmp-export-menu').classList.remove('open');
    const payload = {
        v: 1,
        cart: comprasCart,
        amps: comprasAmps,
        dinheiro: document.getElementById('cmp-dinheiro').value,
        prestigio: document.getElementById('cmp-prestigio').value,
        inventario: document.getElementById('cmp-inventario').value,
        vontade: document.getElementById('cmp-vontade').value,
    };
    const code = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    document.getElementById('cmp-export-code-text').value = code;
    document.getElementById('cmp-modal-export-code').classList.remove('hidden');
}

function fecharModalExportarCodigo() {
    document.getElementById('cmp-modal-export-code').classList.add('hidden');
}

function copiarCodigoCarrinho() {
    const ta = document.getElementById('cmp-export-code-text');
    ta.select();
    navigator.clipboard.writeText(ta.value).catch(() => document.execCommand('copy'));
}

function abrirModalImportar() {
    document.getElementById('cmp-import-text').value = '';
    document.getElementById('cmp-modal-import').classList.remove('hidden');
}

function fecharModalImportar() {
    document.getElementById('cmp-modal-import').classList.add('hidden');
}

function importarCarrinho() {
    const raw = document.getElementById('cmp-import-text').value.trim();
    if (!raw) return;
    let payload;
    try {
        payload = JSON.parse(decodeURIComponent(escape(atob(raw))));
    } catch (e) {
        alert('Código inválido. Verifique se copiou o código corretamente.');
        return;
    }
    if (!payload || payload.v !== 1 || !Array.isArray(payload.cart) || !Array.isArray(payload.amps)) {
        alert('Código incompatível ou corrompido.');
        return;
    }
    comprasCart = payload.cart;
    comprasAmps = payload.amps;
    cmpUidCounter = comprasCart.reduce((max, item) => Math.max(max, item.uid ?? 0), 0) + 1;
    if (payload.dinheiro !== undefined) document.getElementById('cmp-dinheiro').value = payload.dinheiro;
    if (payload.prestigio !== undefined) document.getElementById('cmp-prestigio').value = payload.prestigio;
    if (payload.inventario !== undefined) document.getElementById('cmp-inventario').value = payload.inventario;
    if (payload.vontade !== undefined) document.getElementById('cmp-vontade').value = payload.vontade;
    fecharModalImportar();
    calcCompras();
    saveCmpState();
}

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

function hexToRgbStr(hex) {
    return [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)).join(',');
}
function darkenHex(hex, f) {
    return '#'+[1,3,5].map(i => Math.max(0,Math.floor(parseInt(hex.slice(i,i+2),16)*(1-f))).toString(16).padStart(2,'0')).join('');
}
function lightenHex(hex, f) {
    return '#'+[1,3,5].map(i => Math.min(255,Math.round(parseInt(hex.slice(i,i+2),16)+(255-parseInt(hex.slice(i,i+2),16))*f)).toString(16).padStart(2,'0')).join('');
}
function relativeLuminance(hex) {
    return [1,3,5].reduce((acc, i, idx) => {
        const v = parseInt(hex.slice(i,i+2),16)/255;
        const lin = v <= 0.04045 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
        return acc + lin * [0.2126, 0.7152, 0.0722][idx];
    }, 0);
}
function contrastRatio(hex1, hex2) {
    const l1 = relativeLuminance(hex1), l2 = relativeLuminance(hex2);
    return (Math.max(l1,l2)+0.05) / (Math.min(l1,l2)+0.05);
}
function buildCustomAccent(hex) {
    return { hex, rgb: hexToRgbStr(hex), g2: darkenHex(hex, 0.4) };
}
function buildCustomBase(hex) {
    const isDark = relativeLuminance(hex) < 0.18;
    const [r,g,b] = [1,3,5].map(i => parseInt(hex.slice(i,i+2),16));
    const modal = isDark ? lightenHex(hex, 0.08) : '#ffffff';
    const modal2 = isDark ? lightenHex(hex, 0.14) : hex;
    return { bg: hex, modal, modal2, nav: `rgba(${r},${g},${b},.97)`, sel: modal, selopt: isDark ? hex : '#ffffff', dark: isDark };
}

const ACCENTS = {
    vermelho: { hex: '#ff3333', rgb: '255,51,51',     g2: '#990000' },
    azul:     { hex: '#0099dd', rgb: '0,153,221',     g2: '#005588' },
    verde:    { hex: '#00e87a', rgb: '0,232,122',     g2: '#007a40' },
    roxo:     { hex: '#c084fc', rgb: '192,132,252',   g2: '#7c3aed' },
    rosa:     { hex: '#d61586', rgb: '214,21,134',    g2: '#8a0753' },
    laranja:  { hex: '#ff8c00', rgb: '255,140,0',     g2: '#cc5500' },
    amarelo:  { hex: '#ffd166', rgb: '255,209,102',   g2: '#b38200' },
    ciano:    { hex: '#00e5ff', rgb: '0,229,255',     g2: '#007799' },
    branco:   { hex: '#ffffff', rgb: '255,255,255',   g2: '#999999' },
    preto:    { hex: '#111111', rgb: '17,17,17',      g2: '#000000' },
    dourado:  { hex: '#f0b429', rgb: '240,180,41',    g2: '#8a6100' },
    coral:    { hex: '#ff6b6b', rgb: '255,107,107',   g2: '#cc2222' },
    turquesa: { hex: '#00c4b8', rgb: '0,196,184',     g2: '#007a72' },
};

const BASES = {
    preto:   { bg: '#05050a', modal: '#0c0c14', modal2: '#111120', nav: 'rgba(5,5,10,.97)',      sel: '#0c0c14', selopt: '#05050a', dark: true  },
    cinza:   { bg: '#0c0e18', modal: '#131624', modal2: '#191c30', nav: 'rgba(12,14,24,.97)',    sel: '#131624', selopt: '#0c0e18', dark: true  },
    ardosia: { bg: '#141a2e', modal: '#1c2440', modal2: '#222950', nav: 'rgba(20,26,46,.97)',    sel: '#1c2440', selopt: '#141a2e', dark: true  },
    marinho: { bg: '#090e1a', modal: '#111828', modal2: '#161f30', nav: 'rgba(9,14,26,.97)',     sel: '#111828', selopt: '#090e1a', dark: true  },
    cafe:    { bg: '#100c07', modal: '#1c1510', modal2: '#221a12', nav: 'rgba(16,12,7,.97)',     sel: '#1c1510', selopt: '#100c07', dark: true  },
    branco:  { bg: '#f0f2f8', modal: '#ffffff', modal2: '#f0f2f8', nav: 'rgba(240,242,248,.97)', sel: '#f0f2f8', selopt: '#ffffff', dark: false },
};

const SIMILAR_THRESHOLD = 1.5;

function _getBaseHex(base, customHex) {
    if (base === 'custom') return customHex || '#05050a';
    return BASES[base]?.bg || '#05050a';
}
function _getAccentHex(accent, customHex) {
    if (accent === 'custom') return customHex || '#ff3333';
    return ACCENTS[accent]?.hex || '#ff3333';
}
function fallbackAccentForBase(baseHex) {
    const preferred = relativeLuminance(baseHex) > 0.5 ? 'preto' : 'vermelho';
    if (contrastRatio(ACCENTS[preferred].hex, baseHex) >= SIMILAR_THRESHOLD) return preferred;
    return Object.keys(ACCENTS).find(k => contrastRatio(ACCENTS[k].hex, baseHex) >= SIMILAR_THRESHOLD) || 'vermelho';
}

let _themeState = { accent: 'vermelho', base: 'preto', glass: true, liquid: true, customAccentHex: null, customBaseHex: null, ...JSON.parse(localStorage.getItem('ct-theme-v2') || 'null') };
// Corrige estado salvo incompatível no localStorage
(function () {
    const baseHex = _getBaseHex(_themeState.base, _themeState.customBaseHex);
    const accentHex = _getAccentHex(_themeState.accent, _themeState.customAccentHex);
    if (contrastRatio(accentHex, baseHex) < SIMILAR_THRESHOLD) {
        _themeState.accent = fallbackAccentForBase(baseHex);
        _themeState.customAccentHex = null;
    }
}());

function applyTheme(accent, base, glass, liquid = _themeState.liquid) {
    const a = accent === 'custom' && _themeState.customAccentHex
        ? buildCustomAccent(_themeState.customAccentHex)
        : (ACCENTS[accent] || ACCENTS.vermelho);
    const b = base === 'custom' && _themeState.customBaseHex
        ? buildCustomBase(_themeState.customBaseHex)
        : (BASES[base] || BASES.preto);
    const r = document.documentElement;

    r.style.setProperty('--accent', a.hex);
    r.style.setProperty('--accent-rgb', a.rgb);
    r.style.setProperty('--bg-solid', b.bg);
    r.style.setProperty('--modal-bg', b.modal);
    r.style.setProperty('--modal-bg2', b.modal2);
    r.style.setProperty('--nav-bg', b.nav);
    r.style.setProperty('--select-bg', b.sel);
    r.style.setProperty('--select-opt-bg', b.selopt);
    r.setAttribute('data-base', base === 'custom' ? (b.dark ? 'preto' : 'branco') : base);

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

function updateSwatchLocks() {
    const baseHex = _getBaseHex(_themeState.base, _themeState.customBaseHex);
    const accentHex = _getAccentHex(_themeState.accent, _themeState.customAccentHex);
    document.querySelectorAll('.swatch-accent').forEach(s => {
        const aHex = ACCENTS[s.dataset.accent]?.hex;
        if (!aHex) return;
        const locked = contrastRatio(aHex, baseHex) < SIMILAR_THRESHOLD;
        s.classList.toggle('swatch-locked', locked);
        if (locked) s.setAttribute('title', 'Muito parecido com a base atual');
        else s.setAttribute('title', s.dataset.accent.charAt(0).toUpperCase() + s.dataset.accent.slice(1));
    });
    document.querySelectorAll('.swatch-base').forEach(s => {
        const bHex = BASES[s.dataset.base]?.bg;
        if (!bHex) return;
        const locked = contrastRatio(accentHex, bHex) < SIMILAR_THRESHOLD;
        s.classList.toggle('swatch-locked', locked);
        if (locked) s.setAttribute('title', 'Muito parecido com a cor principal atual');
        else s.setAttribute('title', s.dataset.base.charAt(0).toUpperCase() + s.dataset.base.slice(1));
    });
}

function setAccent(accent) {
    const baseHex = _getBaseHex(_themeState.base, _themeState.customBaseHex);
    if (contrastRatio(ACCENTS[accent]?.hex || '#ff3333', baseHex) < SIMILAR_THRESHOLD) return;
    _themeState.accent = accent;
    _themeState.customAccentHex = null;
    applyTheme(_themeState.accent, _themeState.base, _themeState.glass);
    saveTheme();
    document.querySelectorAll('.swatch-accent').forEach(s => {
        s.classList.toggle('active', s.dataset.accent === accent);
    });
    const picker = document.getElementById('accent-custom-picker');
    if (picker) picker.value = ACCENTS[accent]?.hex || '#ff3333';
    updateSwatchLocks();
}

function setBase(base) {
    _themeState.base = base;
    _themeState.customBaseHex = null;
    const newBaseHex = BASES[base]?.bg || '#05050a';
    const accentHex = _getAccentHex(_themeState.accent, _themeState.customAccentHex);
    if (contrastRatio(accentHex, newBaseHex) < SIMILAR_THRESHOLD) {
        _themeState.accent = fallbackAccentForBase(newBaseHex);
        _themeState.customAccentHex = null;
        const ap = document.getElementById('accent-custom-picker');
        if (ap) ap.value = ACCENTS[_themeState.accent]?.hex || '#ff3333';
    }
    applyTheme(_themeState.accent, _themeState.base, _themeState.glass);
    saveTheme();
    document.querySelectorAll('.swatch-accent').forEach(s => {
        s.classList.toggle('active', s.dataset.accent === _themeState.accent);
    });
    document.querySelectorAll('.swatch-base').forEach(s => {
        s.classList.toggle('active', s.dataset.base === base);
    });
    const picker = document.getElementById('base-custom-picker');
    if (picker) picker.value = BASES[base]?.bg || '#05050a';
    updateSwatchLocks();
}

function setCustomAccent(hex) {
    _themeState.customAccentHex = hex;
    _themeState.accent = 'custom';
    document.querySelectorAll('.swatch-accent').forEach(s => s.classList.remove('active'));
    applyTheme('custom', _themeState.base, _themeState.glass);
    saveTheme();
    updateSwatchLocks();
}

function setCustomBase(hex) {
    _themeState.customBaseHex = hex;
    _themeState.base = 'custom';
    const accentHex = _getAccentHex(_themeState.accent, _themeState.customAccentHex);
    if (contrastRatio(accentHex, hex) < SIMILAR_THRESHOLD) {
        _themeState.accent = fallbackAccentForBase(hex);
        _themeState.customAccentHex = null;
        const ap = document.getElementById('accent-custom-picker');
        if (ap) ap.value = ACCENTS[_themeState.accent]?.hex || '#ff3333';
        document.querySelectorAll('.swatch-accent').forEach(s => {
            s.classList.toggle('active', s.dataset.accent === _themeState.accent);
        });
    }
    document.querySelectorAll('.swatch-base').forEach(s => s.classList.remove('active'));
    applyTheme(_themeState.accent, 'custom', _themeState.glass);
    saveTheme();
    updateSwatchLocks();
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
    const accentPicker = document.getElementById('accent-custom-picker');
    if (accentPicker) accentPicker.value = (_themeState.accent === 'custom' && _themeState.customAccentHex) ? _themeState.customAccentHex : (ACCENTS[_themeState.accent]?.hex || '#ff3333');
    const basePicker = document.getElementById('base-custom-picker');
    if (basePicker) basePicker.value = (_themeState.base === 'custom' && _themeState.customBaseHex) ? _themeState.customBaseHex : (BASES[_themeState.base]?.bg || '#05050a');
    updateSwatchLocks();
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
// Init
aplicarLimitesPorClasse(document.getElementById('classe').value);
calc();
calcDT();
calcPatente();
calcDescanso();
loadCmpState();
calcCompras();
calcNovoAgente();
if (initialTab !== 'agente') switchTab(initialTab);

// Aplica tema salvo
applyTheme(_themeState.accent, _themeState.base, _themeState.glass, _themeState.liquid);
updateSwatchLocks();

// ============================================================
// EASTER EGG — título "Contratados": 2 cliques, 5 cliques, 1 clique
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