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
