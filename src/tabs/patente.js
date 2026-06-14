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
