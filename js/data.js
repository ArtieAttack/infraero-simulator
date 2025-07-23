// =============================================
// DADOS DAS TRILHAS E QUESTÕES
// =============================================

// Dados das áreas com informações específicas do projeto
export const trilhasData = {
  1: {
    titulo: "Área de Coleta (Área quente)",
    objetivo: "Organizar e coordenar a coleta inicial de vítimas no local do acidente.",
    duracao: "10-15 minutos",
    dificuldade: 1,
    descricao: "É o ponto inicial onde se concentram os feridos graves, próximos à aeronave ou aos destroços. Sempre que o ambiente for seguro, os feridos devem ser estabilizados no próprio local antes de serem transportados. Evita-se o transporte imediato de pacientes em estado crítico sem a devida estabilização. A responsabilidade pelos feridos passa das equipes de resgate para os profissionais de saúde nesse ponto.",
    classe: "trilha-1",
    areaClasse: "area-coleta",
    zoom: { x: 13.2, y: 8.8 },
    imagem: "assets/images/painel/coleta.jpg",
    video: {
      titulo: "Processo de Coleta de Vítimas",
      url: "https://vimeo.com/1102332807",
      inicio: "04:00",
      fim: "06:20"
    }
  },
  2: {
    titulo: "Área de Triagem (Área morna)",
    objetivo: "Classificar vítimas de acordo com a gravidade de suas lesões.",
    duracao: "15-20 minutos",
    dificuldade: 2,
    descricao: "Fica a cerca de 90 metros do local do acidente, no sentido do vento, especialmente se houver risco de fumaça ou fogo. É onde os feridos são classificados por gravidade antes de seguirem para o atendimento. Se não for possível fazer a triagem no local do acidente, os pacientes devem ser deslocados o mínimo possível até uma área segura, para não agravar seu estado.",
    classe: "trilha-2",
    areaClasse: "area-triagem",
    zoom: { x: 23.8, y: 28.8 },
    imagem: "assets/images/painel/triagem.jpg",
    video: {
      titulo: "Processo de Triagem das Vítimas",
      url: "https://vimeo.com/1102332992",
      inicio: "06:23",
      fim: "06:46"
    }
  },
  3: {
    titulo: "Área de Assistência / Estabilização (Área fria)",
    objetivo: "Estabilizar vítimas antes do transporte por prioridade.",
    duracao: "20-25 minutos",
    dificuldade: 3,
    descricao: "É o local onde as vítimas permanecem em observação e cuidados até o transporte. A área é definida pelo operador do PCM e pelo coordenador médico.<br><br>A sinalização pode ser feita com cones, faixas ou lonas coloridas. Cada área deve ser identificada conforme a gravidade dos feridos:<br><br><strong>Vermelho (Prioridade I):</strong> atendimento imediato<br><strong>Amarelo (Prioridade II):</strong> cuidados importantes, mas sem risco imediato<br><strong>Verde (Prioridade III):</strong> ferimentos leves<br><br>Pacientes críticos (vermelho) devem ser priorizados e transportados assim que estiverem estabilizados — o ideal é que aguardem no máximo 1 hora.",
    classe: "trilha-3",
    areaClasse: "area-estabilizacao",
    zoom: { x: 46.9, y: 51.3 },
    imagem: "assets/images/painel/estabilizacao.jpg",
    video: {
      titulo: "Procedimentos de Estabilização",
      url: "https://vimeo.com/1102333061",
      inicio: "06:50",
      fim: "07:57"
    }
  },
  4: {
    titulo: "Área de Transporte",
    objetivo: "Registrar e evacuar vítimas para hospitais de forma organizada.",
    duracao: "25-30 minutos",
    dificuldade: 3,
    descricao: "Fica entre a área de assistência e a saída, sendo usada para o registro, despacho e evacuação dos sobreviventes. Pode contar com escolta de segurança ou apoio de fiscais para guiar os deslocamentos, especialmente em terrenos difíceis. É importante manter as vias de acesso desobstruídas, evitando congestionamentos e facilitando a saída segura das vítimas.",
    classe: "trilha-4",
    areaClasse: "area-transporte",
    zoom: { x: 81.3, y: 27.9 },
    imagem: "assets/images/painel/transporte.jpg",
    video: {
      titulo: "Processo de Transporte e Registro",
      url: "https://vimeo.com/1102333200",
      inicio: "09:30",
      fim: "12:00"
    }
  },
  5: {
    titulo: "Outras Áreas (Vítimas fatais e heliponto)",
    objetivo: "Gerenciar áreas complementares: fatalidades e heliponto.",
    duracao: "15-20 minutos",
    dificuldade: 2,
    descricao: "Deve-se prever um local reservado para vítimas fatais (Prioridade 0), afastado do público, veículos e das demais vítimas. Também é necessário um espaço seguro para pouso e decolagem de helicópteros, usados no transporte de feridos graves. A direção do vento deve ser levada em conta para posicionar corretamente o heliponto e a área de triagem.",
    classe: "trilha-5",
    areaClasse: "area-outros",
    zoom: { x: 54.6, y: 84.3 },
    imagem: "assets/images/painel/outros.jpg",
    video: {
      titulo: "Isolamento de Fatalidades e Posicionamento do Heliponto",
      url: "",
      inicio: "00:00",
      fim: "03:00"
    }
  }
};

// Questões do simulado para cada área
export const questoesSimulado = {
  1: {
    titulo: "Simulado - Área de Coleta",
    questoes: [
      {
        pergunta: "O que deve ser evitado ao lidar com feridos gravemente lesionados na área de coleta?",
        opcoes: ["Estabilizá-los no local, mesmo que o ambiente seja seguro", "Transportá-los imediatamente, antes da estabilização", "Acionar o serviço médico somente após transferência", "Realizar atendimento apenas na triagem"],
        correta: 1
      },
      {
        pergunta: "Qual é a principal função da área de coleta em uma emergência aeroportuária?",
        opcoes: ["Realizar triagem detalhada dos feridos", "Transportar diretamente os pacientes para o hospital", "Receber feridos graves e iniciar estabilização quando o ambiente estiver seguro", "Isolar o local para investigação da causa do acidente"],
        correta: 2
      }
    ]
  },
  2: {
    titulo: "Simulado - Área de Triagem",
    questoes: [
      {
        pergunta: "Qual é o motivo de posicionar a área de triagem a cerca de 90 metros do acidente e no sentido do vento?",
        opcoes: ["Para evitar contato visual com a aeronave danificada", "Para garantir melhor visibilidade dos socorristas", "Para manter segurança em caso de fumaça ou incêndio", "Para facilitar o acesso das ambulâncias"],
        correta: 2
      },
      {
        pergunta: "Se a triagem não puder ser feita no local do acidente por questões de segurança, qual conduta é mais adequada?",
        opcoes: ["Transportar todos os feridos imediatamente para o hospital", "Manter os feridos no local até que a triagem seja possível", "Priorizar apenas os feridos leves para agilizar o processo", "Mover os pacientes o mínimo possível até uma área segura"],
        correta: 3
      }
    ]
  },
  3: {
    titulo: "Simulado - Área de Estabilização",
    questoes: [
      {
        pergunta: "Na área de estabilização, os pacientes de Prioridade I devem:",
        opcoes: ["Ser transportados à frente de todos, mesmo sem estabilização", "Receber tratamento prioritário e ser estabilizados antes do transporte", "Esperar até que todos os demais sejam atendidos", "Ser transferidos diretamente para a triagem"],
        correta: 1
      },
      {
        pergunta: "O que indica a cor amarela na sinalização da área de estabilização?",
        opcoes: ["Pacientes com ferimentos leves", "Cuidado não imediato, sem risco à vida", "Atendimento prioritário imediato", "Vítimas fatais"],
        correta: 1
      }
    ]
  },
  4: {
    titulo: "Simulado - Área de Transporte",
    questoes: [
      {
        pergunta: "Qual objetivo principal da área de transporte?",
        opcoes: ["Estocar materiais de resgate", "Realizar triagem secundária", "Organizar o registro, o encaminhamento e a evacuação dos sobreviventes", "Conter o acesso de curiosos"],
        correta: 2
      },
      {
        pergunta: "Por que é importante avaliar as condições do terreno na área de transporte?",
        opcoes: ["Para definir se o local pode abrigar helicópteros", "Para evitar congestionamento e bloqueio de acesso", "Para garantir o abastecimento de combustível", "Para manter os órgãos externos distantes da cena"],
        correta: 1
      }
    ]
  },
  5: {
    titulo: "Simulado - Outras Áreas",
    questoes: [
      {
        pergunta: "Qual é a principal recomendação em relação ao local destinado às vítimas fatais?",
        opcoes: ["Posicioná-lo ao lado da área de triagem", "Manter a visibilidade para familiares", "Afastá-lo da vista do público e das demais vítimas", "Compartilhar com a área de estabilização"],
        correta: 2
      },
      {
        pergunta: "O que deve ser considerado ao definir o local do heliponto em situações de emergência?",
        opcoes: ["Distância da área de transporte", "Presença de ambulâncias próximas", "Direção do vento e segurança para pouso", "Disponibilidade de sinalização visual"],
        correta: 2
      }
    ]
  }
};

// Mapeamento das próximas áreas
export const proximasAreas = {
  'coleta': 'triagem',
  'triagem': 'estabilizacao',
  'estabilizacao': 'transporte',
  'transporte': 'outros'
};

// Nomes das áreas para notificações
export const nomeAreas = {
  'triagem': 'Área de Triagem',
  'estabilizacao': 'Área de Estabilização',
  'transporte': 'Área de Transporte',
  'outros': 'Outras Áreas'
};
