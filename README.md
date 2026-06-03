# ⚔️ Contratados — Terminal de Agente (v5)

Uma ferramenta web automatizada desenvolvida para o sistema de RPG **Contratados** (v5), ambientado no universo de ficção científica e horror da **Fundação SCP (Classe E)**. O terminal centraliza e simplifica os cálculos matemáticos complexos de progressão, balanceamento de encontros e gerenciamento de recursos para Jogadores e Mestres.

---

## 🚀 Funcionalidades Principais

O terminal é dividido em 5 módulos estratégicos acessíveis por abas:

* **⚔️ Agente / Civil:** Simulador completo de progressão de nível (0 a 20 para Agentes, 0 a 5 para Civis). Calcula automaticamente Vida, Energia, Defesa, Proficiência, Deslocamento, Capacidade de Carga, Dano Corporal/Furtivo e exibe os benefícios acumulados e futuros de cada classe.
* **🎯 Calculadora de DT:** Gera instantaneamente as Dificuldades de Teste (DT) de Habilidade e de Atributo baseadas no nível e atributos do causador, acompanhada de uma matriz de referência rápida.
* **🔄 Novo Agente:** Utilitário para o Mestre. Calcula o Nível, Prestígio e Patente iniciais de um personagem substituto com base na média do esquadrão atual, aplicando as deduções corretas por regras de Morte, Aposentadoria ou transições de Experimentos.
* **🏅 Patentes:** Painel de consulta do plano de carreira da Fundação SCP. Exibe salários por missão, limites de modificadores por item e multiplicadores financeiros de acordo com o Prestígio.
* **💤 Descanso:** Automatiza a recuperação de Vida e Energia pós-missão ou *short rests*, considerando a qualidade do ambiente (Insalubre, Adequado, Confortável), bônus de refeições e penalidades por interrupção.

---

## 🛠️ Tecnologias Utilizadas

Este é um projeto **Single Page Application (SPA)** construído de forma nativa e leve, sem dependências externas:

* **HTML5:** Estruturação semântica da interface.
* **CSS3 (Modern Vanilla):** Visual futurista e sombrio ("Glassmorphism") utilizando variáveis CSS, animações de gradiente dinâmicas e total responsividade para dispositivos móveis.
* **JavaScript (ES6+):** Lógica matemática do sistema de RPG, manipulação de DOM e reatividade em tempo real por meio de seletores e sliders de input.

---

## 🌐 Como Executar o Projeto

Como o projeto foi desenvolvido em arquivo único, você não precisa instalar nada:

1. Baixe o arquivo `Contratados_calculadora_v5_slider.html`.
2. Dê um duplo clique no arquivo para abri-lo em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).

*Opção online:* Acesse a ferramenta rodando diretamente pelo GitHub Pages em: `https://<seu-usuario>.github.io/<nome-do-repositorio>/`

---

## 📊 Regras Adaptadas no Código

Abaixo estão as fórmulas base implementadas nativamente no motor JavaScript do terminal:

* **DT de Habilidade:** $5 + N\acute{\iota}vel + (Atributo \times 3)$
* **DT de Atributo:** $10 + N\acute{\iota}vel + (Atributo \times 2)$
* **Limite de Energia (Agentes):** $(Vigor + Destreza) \times 2$
* **Fórmula Base de Recuperação:** $Atributo \times Dado\_Modificado + (N\acute{\iota}vel \times 2)$
* **Bônus Monetário Inicial:** $Prest\acute{\iota}gio \times (500 \times Multiplicador\_Patente)$

---
Desenvolvido para automatizar a burocracia e focar no Roleplay. *Segurar. Conter. Proteger.* 🫙