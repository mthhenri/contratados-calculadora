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
