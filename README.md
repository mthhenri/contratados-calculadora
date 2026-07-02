# Contratados — Terminal de Agente

Calculadora web para o sistema de RPG **Contratados v4**, ambientado no universo da **Fundação SCP**. Automatiza os cálculos de progressão, recursos e combate para que você foque no roleplay.

Não precisa instalar nada — basta abrir `src/index.html` no navegador.

---

## Abas disponíveis

| Aba | O que faz |
|-----|-----------|
| **Agente / Civil** | Calcula Vida, Energia, Defesa, Deslocamento, Dano e benefícios de nível para qualquer classe (níveis 0–20 para Agentes, 0–5 para Civis) |
| **Calculadora de DT** | Gera a Dificuldade de Teste de Habilidade e de Atributo com base no nível e atributo do personagem |
| **Novo Agente** | Calcula nível, prestígio e dinheiro iniciais de um personagem substituto com base na média do esquadrão |
| **Patentes** | Consulta a tabela de patentes: salário por missão, limite de modificadores e multiplicador financeiro |
| **Descanso** | Calcula a recuperação de Vida e Energia considerando tipo de descanso, qualidade do ambiente, refeição e interrupção |
| **Compras** | Monta o equipamento da missão: catálogo de itens, modificações, amplificadores e controle de orçamento/inventário |

---

## Como usar

1. Clone o repositório ou baixe os arquivos.
2. Abra `src/index.html` diretamente no navegador (Chrome, Edge, Firefox).
3. Nenhuma instalação, servidor ou build é necessário.

---

## Estrutura do projeto

```
src/
  index.html   — interface e estrutura das abas
  script.js    — toda a lógica de cálculo
  styles.css   — tema escuro (glassmorphism)
docs/
  sistema-v4.1.0.md          — fonte oficial das regras do sistema
  guia_de_mestre-v4.0.0.md   — guia do mestre (criação de ameaças, NPCs e missões)
```

Todas as regras de domínio estão em `docs/sistema-v4.1.0.md`. Em caso de conflito entre o código e o documento, o documento prevalece. O `docs/guia_de_mestre-v4.0.0.md` é material de apoio para o mestre e não é utilizado pela calculadora.

---

*Segurar. Conter. Proteger.*
***SCP - Você é nossa prioridade***
***2026***