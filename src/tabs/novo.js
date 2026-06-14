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
