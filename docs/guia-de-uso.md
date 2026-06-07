# Guia de Uso — Terminal de Agente (Contratados v4)

Este documento explica cada aba da calculadora, o que ela faz e o que cada campo representa.

---

## ⚔ Agente / Civil

Calcula todos os atributos derivados de um personagem com base na sua classe, nível e atributos base.

### Passo 1 — Classe & Nível

| Campo | O que representa |
|---|---|
| **Classe / Registro** | A classe do personagem. Afeta as fórmulas de Vida e Energia, e os limites máximos de nível e atributos. Civis têm progressão separada e cap de nível 5 e atributos 3. |
| **Nível** (slider) | O nível atual do personagem (0–20 para Agentes, 0–5 para Civis). Para Civis, o campo se chama "Treinamentos". |

### Passo 2 — Atributos

Cada atributo influencia um ou mais stats derivados. Use os botões **−/+** ou digite o valor diretamente.

| Atributo | O que representa |
|---|---|
| **Vigor** | Resiliência física. Influencia Vida, Limite de Energia, Dano Corpo a Corpo e recuperação de Vida no Descanso. |
| **Destreza** | Agilidade. Influencia Energia, Limite de Energia, Deslocamento e recuperação de Energia no Descanso. |
| **Força** | Potência bruta. Influencia Dano Corpo a Corpo e Inventário. |
| **Vontade** | Força mental. Determina a capacidade de Traumas/Sequelas suportadas. |
| **Sentidos** | Percepção. Determina o raio da Área de Percepção. |

### Passo 3 — Status do Personagem

Stats calculados automaticamente a partir dos inputs acima.

| Stat | Fórmula resumida |
|---|---|
| **Vida** | Base + Vigor × escala, por nível. Varia por classe. |
| **Energia** | Base + Destreza × escala, por nível. Varia por classe. |
| **Defesa Base** | `10 + Nível` (N/A para Civis). |
| **Proficiência** | `+Nível` (N/A para Civis). |
| **Deslocamento** | Escalonado por Destreza: 8–10m para Agentes, 6–8m para Civis. |
| **Inventário Máx.** | `Força × 5` para Agentes, `Força × 3` para Civis. Força 0 = 3 slots; Força negativa = 0 slots. |
| **Corpo (Dano)** | Escalonado por `Força + Vigor` (Agente) ou `Força − 1` (Civil). |
| **Dano Furtivo** | Começa em 1D6+1 e ganha +1D6+1 nos níveis 3, 6, 9, 12, 15, 18. |
| **Limite de Energia** | `(Vigor + Destreza) × 2` (N/A para Civis). |
| **Traumas Suportados** | `Vontade + 1` (N/A para Civis). |
| **Hab. / Turno** | Começa em 4. Ganha +1 em níveis pares e +2 adicional nos níveis 10 e 20. |
| **Sequelas (Desc.)** | Ao encerrar missão, o personagem pode descartar sequelas até o valor de Vontade. |
| **Área de Percepção** | `Sentidos ≤ 0 → 3 m`; senão `5 + (Sentidos × 5) m`. |

### Seções de progressão

| Seção | O que mostra |
|---|---|
| **Benefícios deste Nível** | O que o personagem ganhou especificamente no nível atual. |
| **Habilidades Acumuladas** | Totais acumulados de atributos, habilidades e outros ganhos até o nível atual. |
| **Progressão Detalhada** | Lista nível a nível de todos os ganhos desde o nível 1 até o atual. |
| **Próximo Nível** | O que o personagem ganhará ao subir de nível. Exibe mensagem especial ao atingir o máximo. |

---

## 🎯 Calculadora de DT

Calcula a Dificuldade de Teste (DT) que aliados e inimigos precisam superar para resistir às ações do personagem.

### Passo 1 — Calculadora

| Campo | O que representa |
|---|---|
| **Nível do personagem** | O nível de quem está realizando a ação (0–20). |
| **Atributo usado** | O valor do atributo base da ação sendo realizada. |
| **Resultado** | DT calculada: `10 + Nível + (Atributo × 2)`. |

### Passo 2 — Tabela de Referência Rápida

Tabela cruzada mostrando a DT resultante para atributos de 1 a 6 nos níveis 0, 5, 10, 15 e 20. Útil para consulta rápida durante o jogo sem precisar digitar valores.

---

## 🔄 Novo Agente

Calcula o nível inicial, o prestígio inicial e o bônus monetário de um personagem que está entrando para o grupo — seja por morte, aposentadoria ou mudança de status.

### Passo 1 — Configuração

| Campo | O que representa |
|---|---|
| **Motivo de entrada** | Por que o personagem está entrando. Determina o divisor usado para calcular a penalidade de Prestígio e se a patente pode cair uma rank abaixo. Entradas por Experimento ou Exterminado/Contido permitem cair uma patente. |
| **Média de Nível do grupo** | Média dos níveis dos membros atuais do grupo (excluindo quem está saindo). |
| **Média de Prestígio do grupo** | Média de Prestígio dos membros atuais (excluindo quem está saindo). |

**Motivos disponíveis:**

| Motivo | Divisor | Observação |
|---|---|---|
| Morte / Entrada do zero | ÷7 | Padrão |
| Aposentadoria | ÷10 | Penalidade menor |
| Experimento → Regular | ÷5 | Pode cair uma patente |
| Experimento → Experimento | ÷3 | Pode cair uma patente |
| Contido/Exterminado → Regular | ÷5 | Pode cair uma patente + condição Amaldiçoado |
| Contido/Exterminado → Experimento | ÷3 | Pode cair uma patente + condição Amaldiçoado |

### Passo 2 — Resultado

Exibe três valores calculados:

| Valor | Fórmula |
|---|---|
| **Nível Inicial** | `⌈média⌉ − 1`, mínimo 0. |
| **Prestígio Inicial** | `média − ⌊média ÷ divisor⌋`, com cap mínimo de patente. |
| **Patente Resultante** | A patente correspondente ao Prestígio calculado. |

Também lista o detalhamento passo a passo do cálculo e, se aplicável, avisa sobre a condição **Amaldiçoado pelo Passado**.

### Passo 3 — Bônus Monetário Inicial

| Campo | O que representa |
|---|---|
| **Prestígio Inicial** | Preenchido automaticamente com o valor calculado acima; pode ser ajustado manualmente. |
| **Resultado ($)** | Bônus monetário: `Prestígio × (500 × Multiplicador de Patente)`. Não inclui o dinheiro inicial padrão (1.000 + 4D4 × 250), que deve ser calculado separadamente por ser aleatório. |

---

## 🏅 Patentes

Consulta a patente atual de um personagem e exibe a tabela completa de todas as patentes.

### Passo 1 — Consulta por Prestígio

| Campo | O que representa |
|---|---|
| **Prestígio atual** | O valor de Prestígio atual do personagem. |
| **Resultado** | Nome da patente correspondente, faixa de Prestígio, salário por missão, limite de modificações e multiplicador monetário. |

### Passo 2 — Referência Completa de Patentes

Tabela com todas as 8 patentes e seus benefícios:

| Coluna | O que representa |
|---|---|
| **Patente** | Nome da patente. A patente atual é destacada. |
| **Prestígio** | Faixa de Prestígio necessária para essa patente. |
| **Salário** | Quanto o personagem recebe por missão completada. |
| **Mods** | Limite de stacks por modificação e total de mods por item nessa patente. |
| **Mult.** | Multiplicador monetário usado no cálculo do bônus de novos agentes. |

---

## 💤 Descanso

Calcula quanto de Vida e Energia um personagem recupera durante um descanso, levando em conta o tipo de descanso, o ambiente e outros modificadores.

### Passo 1 — Configuração do Descanso

| Campo | O que representa |
|---|---|
| **Tipo de Descanso** | Determina os dados base de recuperação. Curto (~15 min) recupera apenas Energia (1D4 base). Médio (2–4h) recupera Energia (1D6) e Vida (1D4). Longo (6–8h) recupera Energia (1D8) e Vida (1D6), mas só pode ser feito uma vez por dia. |
| **Qualidade do Ambiente** | Insalubre reduz 1 tipo de dado. Adequado é o padrão. Confortável aumenta 1 tipo de dado. A Base da Fundação é sempre Confortável. |
| **Vigor** | Atributo usado no cálculo de Vida recuperada. |
| **Destreza** | Atributo usado no cálculo de Energia recuperada. |
| **Nível** | Bônus fixo de `Nível × 2` adicionado à recuperação. |
| **Refeição consumida?** | Se Sim, aumenta 1 tipo de dado na recuperação. |
| **Foi interrompido?** | Se Sim, o resultado final é dividido por 2 (arredonda para baixo). |

### Passo 2 — Resultado

Exibe a faixa de recuperação (mínimo–máximo) e a fórmula exata usada para Vida e Energia separadamente.

**Fórmula geral:** `ATRIBUTO × Ddado + (Nível × 2)`, com o tipo de dado ajustado pelos modificadores acima.

**Escala de dados:** D3 → D4 → D6 → D8 → D10 → D12 → D20

---

## 🛒 Compras

Auxilia o jogador a montar o equipamento para uma missão, respeitando os limites de orçamento, inventário, patente e amplificadores.

### Passo 1 — Configuração do Agente

| Campo | O que representa |
|---|---|
| **Dinheiro Disponível ($)** | Quanto dinheiro o personagem tem para gastar. |
| **Prestígio Atual** | Define a patente do personagem e, com ela, os limites de modificações por item e stacks por modificação. |
| **Inventário Máximo (slots)** | Capacidade total de inventário do personagem (calculada na aba Agente / Civil pela Força). |
| **Vontade** | Define o limite total de stacks de Amplificadores: `Vontade × 3`. |

### Painel de Resumo

Atualizado em tempo real conforme itens são adicionados ao carrinho.

| Campo | O que representa |
|---|---|
| **Patente** | Patente atual baseada no Prestígio informado. |
| **Dinheiro Restante** | Dinheiro disponível menos o total gasto. Fica vermelho se negativo. |
| **Gasto Total** | Soma de todos os itens, modificações e amplificadores no carrinho. |
| **Inventário Usado** | Slots ocupados versus capacidade total (incluindo bônus de mochilas vestidas). Fica vermelho se excedido. |
| **Amplificadores** | Total de stacks de amplificadores versus o limite (`Vontade × 3`). Fica vermelho se excedido. |
| **Mods por Item** | Limite de modificações e stacks por modificação para a patente atual. |
| **Penalidade Amps** | Penalidade de Vontade acumulada por ter 2+ stacks do mesmo amplificador (−2 Vontade por stack extra). |

### Passo 2 — Catálogo de Equipamentos

O catálogo é organizado em categorias acessíveis por abas:

| Categoria | Conteúdo |
|---|---|
| **Corpo a Corpo** | Armas de combate próximo: acessórios, leve, mediana, grande, pesada. |
| **Explosivos** | Granadas e dispositivos explosivos de área. |
| **Armas de Fogo** | Armas de fogo com diferentes alcances e calibres. |
| **Munições** | Munições para cada tipo de arma de fogo e arma especial. |
| **Proteções** | Coletes, armaduras e escudos. |
| **Exóticos** | Armas especiais de alta potência (bazuca, torreta, lança-chamas, etc.). |
| **Armazenamento** | Mochilas e bolsos que ampliam o inventário quando vestidos. |
| **Operacional** | Itens de suporte e utilidade para missões. |
| **Medicinal** | Itens de cura, estabilização e supressão de condições. |
| **Amplificadores** | Modificações permanentes ao personagem (ver abaixo). |

Cada item exibe custo, peso em slots e efeitos. Clique em **Adicionar** para colocar no carrinho.

#### Amplificadores

Amplificadores são melhorias permanentes do personagem, não itens de inventário.

| Regra | Detalhe |
|---|---|
| **Custo** | Primeiro stack: $3.000. Cada stack adicional do mesmo amp: $1.000. |
| **Limite total** | `Vontade × 3` stacks entre todos os amplificadores. |
| **Penalidade** | 2+ stacks no mesmo amplificador aplicam −2 Vontade por stack extra (ex: 3 stacks = −4 Vontade). |

#### Modificações de itens

Armas, proteções e outros itens (exceto Operacional e Medicinal) podem receber modificações que alteram seus efeitos.

| Regra | Detalhe |
|---|---|
| **Custo por stack** | $750 (armas, proteções, exóticos), $250 (explosivos, munições), $300 (armazenamento). |
| **Limite de mods por item** | Definido pela patente (ex: Agente = 2 mods/item). |
| **Limite de stacks por mod** | Definido pela patente (ex: Agente = 1 stack por modificação). |
| **Conflitos** | Algumas modificações bloqueiam outras no mesmo item — indicado na lista da modificação. |
| **Peso** | Cada stack de modificação adiciona +0,2 slots ao peso do item. |

### Passo 3 — Carrinho

Lista todos os itens adicionados, com seus custos, pesos e modificações aplicadas. O carrinho atualiza o resumo em tempo real.

O botão **Exportar .txt** gera um arquivo de texto com o resumo completo do carrinho para salvar ou compartilhar.
