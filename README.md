# Simulador INFRAERO - Treinamento de Emergência Aeroportuária

## 📋 Sobre o Projeto

O Simulador INFRAERO é uma aplicação web educacional interativa desenvolvida para treinamento de profissionais em procedimentos de emergência aeroportuária. O sistema simula cenários de acidentes aéreos e ensina as melhores práticas para gerenciamento de vítimas, triagem médica e organização das áreas de atendimento.

## 🎯 Objetivos

- **Capacitar profissionais** em procedimentos de emergência aeroportuária
- **Simular cenários reais** de acidentes aéreos de forma interativa
- **Ensinar o processo de triagem** e classificação de vítimas
- **Treinar a organização** das diferentes áreas de atendimento
- **Avaliar conhecimentos** através de simulados específicos

## 🗂️ Estrutura do Projeto

```
infraero-simulador/
├── index.html              # Página inicial
├── mapa.html               # Mapa interativo principal
├── mapa-finalizado.html    # Mapa com todas as áreas concluídas
├── mapeador.html           # Ferramenta para configurar coordenadas
├── sobre.html              # Informações sobre o projeto
├── como-funciona.html      # Instruções de uso
├── final.html              # Página de conclusão
├── assets/
│   ├── images/
│   │   ├── campo.jpg       # Imagem base do mapa
│   │   ├── areas/          # Imagens das áreas interativas
│   │   └── painel/         # Imagens do painel informativo
│   └── videos/             # Vídeos explicativos de cada área
├── css/
│   ├── modern-layout.css   # Estilos principais
│   ├── styles.css          # Estilos do mapa
│   └── mapa-finalizado.css # Estilos do mapa finalizado
└── js/
    ├── main.js             # Lógica principal
    ├── areas.js            # Gerenciamento das áreas
    ├── data.js             # Dados das trilhas e questões
    ├── simulado.js         # Lógica dos simulados
    ├── modal.js            # Controle de modais
    ├── painel.js           # Painel informativo
    └── mapa-finalizado.js  # Lógica do mapa finalizado
```

## 🚀 Funcionalidades

### 1. Sistema de Trilhas Progressivas

- **5 áreas distintas** que devem ser completadas em sequência
- **Desbloqueio gradual** de novas áreas conforme progresso
- **Persistência de dados** via localStorage

### 2. Áreas de Treinamento

#### 🔴 Área de Coleta (Área Quente)

- **Objetivo:** Organizar e coordenar a coleta inicial de vítimas
- **Duração:** 10-15 minutos
- **Dificuldade:** Básica
- **Conceitos:** Estabilização inicial, segurança da equipe, primeiros socorros

#### 🟡 Área de Triagem (Área Morna)

- **Objetivo:** Classificar vítimas por gravidade
- **Duração:** 15-20 minutos
- **Dificuldade:** Intermediária
- **Conceitos:** Sistema de cores, priorização, avaliação médica

#### 🟢 Área de Estabilização (Área Fria)

- **Objetivo:** Estabilizar vítimas antes do transporte
- **Duração:** 20-25 minutos
- **Dificuldade:** Avançada
- **Conceitos:** Cuidados intensivos, monitoramento, preparação para transporte

#### 🚚 Área de Transporte

- **Objetivo:** Registrar e evacuar vítimas organizadamente
- **Duração:** 25-30 minutos
- **Dificuldade:** Avançada
- **Conceitos:** Logística, documentação, evacuação

#### 🚁 Outras Áreas (Heliponto e Fatalidades)

- **Objetivo:** Gerenciar áreas complementares
- **Duração:** 15-20 minutos
- **Dificuldade:** Intermediária
- **Conceitos:** Isolamento, transporte aéreo, protocolos especiais

### 3. Sistema de Avaliação

- **Simulados específicos** para cada área
- **Questões múltipla escolha** baseadas em cenários reais
- **Feedback imediato** com explicações detalhadas
- **Pontuação e aprovação** (mínimo 70% para aprovação)

### 4. Recursos Multimídia

- **Vídeos explicativos** para cada área
- **Imagens ilustrativas** dos procedimentos
- **Interface interativa** com zoom e navegação
- **Modais informativos** com detalhes técnicos

## 🔧 Tecnologias Utilizadas

### Frontend

- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização e animações
- **JavaScript ES6+** - Lógica e interatividade
- **Font Awesome** - Ícones
- **LocalStorage** - Persistência de dados

### Estrutura Técnica

- **Modular JavaScript** - Separação de responsabilidades
- **CSS Grid/Flexbox** - Layout responsivo
- **CSS Custom Properties** - Temas e cores
- **Media Queries** - Responsividade

## 📱 Como Usar

### 1. Acesso Inicial

- Abra o `index.html` em um navegador
- Clique em "Iniciar Simulação" para começar

### 2. Navegação no Mapa

- Use o mapa interativo para explorar as áreas
- Clique nas áreas disponíveis (não bloqueadas)
- Assista aos vídeos explicativos

### 3. Realização dos Simulados

- Complete o vídeo de cada área
- Responda ao simulado correspondente
- Obtenha pelo menos 70% de acertos para aprovar

### 4. Progressão

- Complete as áreas em sequência
- Novas áreas são desbloqueadas automaticamente
- Visualize seu progresso no mapa

### 5. Finalização

- Complete todas as 5 áreas
- Acesse a página de conclusão
- Visualize o mapa finalizado com todas as áreas

## 🎮 Mecânica do Jogo

### Sistema de Progressão

1. **Início:** Apenas a Área de Coleta está disponível
2. **Conclusão:** Após completar uma área, a próxima é desbloqueada
3. **Sequência:** Coleta → Triagem → Estabilização → Transporte → Outras Áreas
4. **Persistência:** O progresso é salvo no navegador

### Critérios de Aprovação

- **70% de acertos** no simulado de cada área
- **Visualização completa** do vídeo explicativo
- **Respostas corretas** nas questões conceituais

### Estados das Áreas

- **🔒 Bloqueada:** Não pode ser acessada ainda
- **🔓 Disponível:** Pode ser acessada e completada
- **✅ Concluída:** Já foi completada com sucesso

## 📊 Dados e Configuração

### Arquivo `data.js`

Contém todas as informações das trilhas:

- Títulos e descrições
- Objetivos e durações
- Vídeos e imagens
- Questões dos simulados

### Personalização

Para modificar conteúdo:

1. Edite o arquivo `js/data.js`
2. Atualize as imagens em `assets/images/`
3. Substitua os vídeos em `assets/videos/`
4. Ajuste os estilos em `css/modern-layout.css`

## 🎨 Interface e UX

### Design Responsivo

- Adaptável a diferentes tamanhos de tela
- Interface otimizada para desktop e tablets
- Controles touch-friendly

### Acessibilidade

- Contraste adequado de cores
- Textos legíveis
- Navegação por teclado
- Indicadores visuais claros

### Experiência do Usuário

- Feedback visual imediato
- Transições suaves
- Indicadores de progresso
- Mensagens de confirmação

## 🔄 Fluxo de Utilização

```
[Página Inicial] → [Mapa Interativo] → [Seleção de Área] →
[Vídeo Explicativo] → [Simulado] → [Resultado] →
[Próxima Área] → ... → [Conclusão]
```

## 📈 Métricas e Avaliação

### Dados Coletados

- Tempo gasto em cada área
- Pontuação dos simulados
- Tentativas realizadas
- Progresso geral

### Relatórios

- Áreas concluídas
- Desempenho por simulado
- Tempo total de treinamento

## 🐛 Troubleshooting

### Problemas Comuns

1. **Vídeos não carregam:** Verifique os caminhos dos arquivos
2. **Progresso não salva:** Verifique se localStorage está habilitado
3. **Áreas não desbloqueiam:** Confirme se o simulado foi aprovado
4. **Interface não responsiva:** Atualize o navegador

### Logs e Debug

- Console do navegador mostra logs detalhados
- Verificação de estado das áreas
- Rastreamento de progresso

## 🚀 Melhorias Futuras

### Funcionalidades Planejadas

- Sistema de relatórios avançado
- Múltiplos idiomas
- Modo offline
- Certificação digital
- Integração com LMS

### Otimizações

- Carregamento lazy de mídia
- Compressão de assets
- Service Workers
- Performance melhorada

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste thoroughly
5. Faça um pull request

## 📄 Licença

Este projeto é destinado ao uso educacional e treinamento profissional em emergências aeroportuárias.

## 📞 Suporte

Para dúvidas ou suporte técnico, consulte a documentação ou entre em contato com a equipe de desenvolvimento.

---

**Versão:** 1.0.0  
**Última atualização:** Julho 2025  
**Compatibilidade:** Navegadores modernos (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
