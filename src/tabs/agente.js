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
