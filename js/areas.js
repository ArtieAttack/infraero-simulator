// =============================================
// GERENCIAMENTO DAS ÁREAS INTERATIVAS
// =============================================

import { trilhasData, proximasAreas, nomeAreas } from './data.js';

// Estado das áreas desbloqueadas
export let areasDesbloqueadas = ['coleta'];

// Inicializar sistema de áreas interativas
export function inicializarAreasInterativas() {
  console.log('Inicializando áreas interativas...');

  // Limpar todos os event listeners existentes
  removerEventListeners();

  const botoesEntrarTrilha = document.querySelectorAll('.btn-entrar-trilha');

  botoesEntrarTrilha.forEach((botao, index) => {
    const areaName = botao.dataset.area;
    const trilhaId = botao.dataset.trilha;
    const areaContainer = botao.closest('.area-interativa');

    console.log(`Configurando botão ${index + 1}:`, areaName, trilhaId);

    // Verificar se a área está desbloqueada
    if (areasDesbloqueadas.includes(areaName)) {
      areaContainer.classList.remove('bloqueada');
      console.log(`Área ${areaName} desbloqueada`);
    } else {
      areaContainer.classList.add('bloqueada');
      console.log(`Área ${areaName} bloqueada`);
    }

    // Criar função específica para este botão
    const clickHandler = function (e) {
      e.stopPropagation();
      e.preventDefault();
      console.log('=== CLIQUE DETECTADO ===');
      console.log('Área:', areaName, 'Trilha:', trilhaId);
      console.log('Container bloqueado?', areaContainer.classList.contains('bloqueada'));
      console.log('TrilhaId type:', typeof trilhaId);
      console.log('TrilhaId value:', trilhaId);

      // Verificar se a área não está bloqueada
      if (!areaContainer.classList.contains('bloqueada')) {
        console.log('Iniciando trilha...');
        // Chamar função para iniciar trilha
        if (window.iniciarTrilhaArea) {
          console.log('Chamando iniciarTrilhaArea...');
          window.iniciarTrilhaArea(trilhaId, areaName);
        } else {
          console.error('Função iniciarTrilhaArea não encontrada');
        }
      } else {
        console.log('Área bloqueada, clique ignorado');
      }
    };

    // Armazenar a referência do handler para poder removê-lo depois
    botao._clickHandler = clickHandler;

    // Adicionar event listener
    botao.addEventListener('click', clickHandler);

    console.log(`Event listener adicionado para ${areaName}`);
  });

  console.log('Botões de trilha inicializados:', botoesEntrarTrilha.length);
}

// Função para remover todos os event listeners
function removerEventListeners() {
  console.log('Removendo event listeners antigos...');

  const botoesEntrarTrilha = document.querySelectorAll('.btn-entrar-trilha');

  botoesEntrarTrilha.forEach(botao => {
    if (botao._clickHandler) {
      botao.removeEventListener('click', botao._clickHandler);
      delete botao._clickHandler;
    }
  });

  console.log('Event listeners removidos');
}

// Função para desbloquear próxima área
export function desbloquearProximaArea() {
  const ultimaAreaCompleta = areasDesbloqueadas[areasDesbloqueadas.length - 1];
  const proximaArea = proximasAreas[ultimaAreaCompleta];

  if (proximaArea && !areasDesbloqueadas.includes(proximaArea)) {
    areasDesbloqueadas.push(proximaArea);

    // Encontrar o elemento da área e desbloqueá-lo visualmente
    const areaElement = document.querySelector(`[data-area="${proximaArea}"]`);
    if (areaElement) {
      areaElement.classList.add('desbloqueando');

      // Verificar se o título já existe (já existe no HTML)
      const tituloArea = areaElement.querySelector('.area-hover');
      if (tituloArea) {
        // Título já existe no HTML, não criar outro
        console.log('Título já existe para área desbloqueada:', proximaArea);
      }

      setTimeout(() => {
        areaElement.classList.remove('bloqueada', 'desbloqueando');
      }, 1500);
    }

    console.log(`Área desbloqueada: ${proximaArea}`);
  }
}

// Funções para gerenciar áreas visitadas
export function marcarComoVisitado(numero) {
  const visitadas = JSON.parse(localStorage.getItem('areasVisitadas')) || [];
  if (!visitadas.includes(numero)) {
    visitadas.push(numero);
    localStorage.setItem('areasVisitadas', JSON.stringify(visitadas));
  }
}

export function verificarAreasVisitadas() {
  const visitadas = JSON.parse(localStorage.getItem('areasVisitadas')) || [];
  return visitadas;
}

// Função para verificar se todas as trilhas foram completadas
export function verificarTodasTrilhasCompletas() {
  const areasNecessarias = ['coleta', 'triagem', 'estabilizacao', 'transporte', 'outros'];
  const areasVisitadas = JSON.parse(localStorage.getItem('areasVisitadas')) || [];

  // Verificar se todas as áreas necessárias foram visitadas/completadas
  return areasNecessarias.every(area => {
    // Mapear nomes das áreas para números das trilhas
    const mapeamentoAreas = {
      'coleta': 1,
      'triagem': 2,
      'estabilizacao': 3,
      'transporte': 4,
      'outros': 5
    };

    const numeroTrilha = mapeamentoAreas[area];
    return areasVisitadas.includes(numeroTrilha);
  });
}

// Função para fechar todos os modais e painéis quando uma área é concluída
export function fecharElementosAreaConcluida() {
  console.log('Fechando todos os elementos da área concluída...');

  // Fechar modal de simulado se estiver aberto
  const modalSimulado = document.getElementById('modalSimulado');
  if (modalSimulado && modalSimulado.classList.contains('ativo')) {
    if (window.fecharModalSimulado) {
      window.fecharModalSimulado();
    }
  }

  // Fechar modal de vídeo se estiver aberto
  const modalVideo = document.getElementById('modalVideo');
  if (modalVideo && modalVideo.classList.contains('ativo')) {
    if (window.fecharModalVideo) {
      window.fecharModalVideo();
    }
  }

  // Fechar painel lateral se estiver aberto
  const painelTrilha = document.getElementById('painelTrilha');
  if (painelTrilha && painelTrilha.classList.contains('ativo')) {
    if (window.fecharPainelTrilha) {
      window.fecharPainelTrilha();
    }
  }

  console.log('Elementos da área fechados com sucesso.');
}

// Função para finalizar o simulador e redirecionar para a página final
export function finalizarSimulador() {
  console.log('Finalizando simulador - redirecionando para mapa-finalizado.html');

  // Fechar todos os elementos abertos
  fecharElementosAreaConcluida();

  // Salvar o estado de conclusão
  localStorage.setItem('simuladorCompleto', 'true');

  // Redirecionar para a página final após um breve delay
  setTimeout(() => {
    window.location.href = 'mapa-finalizado.html';
  }, 500);
}

// Função de teste para verificar se os botões estão funcionando
export function testarBotoes() {
  console.log('=== TESTE DOS BOTÕES ===');

  const botoesEntrarTrilha = document.querySelectorAll('.btn-entrar-trilha');

  botoesEntrarTrilha.forEach((botao, index) => {
    const areaName = botao.dataset.area;
    const trilhaId = botao.dataset.trilha;
    const areaContainer = botao.closest('.area-interativa');
    const temClickHandler = !!botao._clickHandler;

    console.log(`Botão ${index + 1}:`, {
      area: areaName,
      trilha: trilhaId,
      bloqueado: areaContainer.classList.contains('bloqueada'),
      temEventListener: temClickHandler,
      elemento: botao
    });
  });

  console.log('=== FIM DO TESTE ===');
}

// Função para debug - verificar estado das trilhas
export function debugTrilhasVisitadas() {
  const visitadas = JSON.parse(localStorage.getItem('areasVisitadas')) || [];
  const todasCompletas = verificarTodasTrilhasCompletas();

  console.log('=== DEBUG TRILHAS VISITADAS ===');
  console.log('Trilhas visitadas:', visitadas);
  console.log('Todas as trilhas completadas:', todasCompletas);
  console.log('Áreas desbloqueadas:', areasDesbloqueadas);
  console.log('===============================');

  return {
    visitadas,
    todasCompletas,
    areasDesbloqueadas
  };
}

// Tornar funções disponíveis globalmente para teste
if (typeof window !== 'undefined') {
  window.testarBotoes = testarBotoes;
  window.finalizarSimulador = finalizarSimulador;
  window.fecharElementosAreaConcluida = fecharElementosAreaConcluida;
  window.debugTrilhasVisitadas = debugTrilhasVisitadas;
}
