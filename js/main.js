// =============================================
// SIMULADOR INFRAERO - ARQUIVO PRINCIPAL
// =============================================

// Importar módulos
import { trilhasData } from './data.js';
import { inicializarAreasInterativas, finalizarSimulador, fecharElementosAreaConcluida } from './areas.js';
import { abrirPainelTrilha, fecharPainelTrilha, voltarParaVisaoGeral } from './painel.js';
import { abrirModalVideo, fecharModalVideo, fecharModalSimulado } from './modal.js';
import { iniciarSimulado } from './simulado.js';
import { inicializarSuporteMobile, configurarSidebarMobile, otimizarModalMobile } from './mobile-support.js';

// Estado global do simulador
let modoOverview = false;

// Variáveis de zoom interativo
window.zoomLevel = 1;
window.translateX = 0;
window.translateY = 0;
window.isPanning = false;

// Inicialização da aplicação
console.log('Script main.js carregado');

window.onload = () => {
  console.log('=== APLICAÇÃO INICIANDO ===');
  try {
    inicializarInterface();
    configurarEventListeners();
    inicializarZoomInterativo();
    
    // Inicializar suporte mobile
    inicializarSuporteMobile();
    configurarSidebarMobile();
    otimizarModalMobile();

    // Aguardar um pouco antes de inicializar as áreas
    setTimeout(() => {
      console.log('Inicializando áreas interativas...');
      inicializarAreasInterativas();

      // Testar botões após inicialização
      setTimeout(() => {
        if (window.testarBotoes) {
          window.testarBotoes();
        }
      }, 100);

    }, 100);

    console.log('=== APLICAÇÃO INICIADA COM SUCESSO ===');
  } catch (error) {
    console.error('Erro ao inicializar aplicação:', error);
  }
};

// Função para inicializar interface
function inicializarInterface() {
  // Garantir que o overlay esteja escondido
  const mapaOverlay = document.querySelector('.mapa-overlay');
  if (mapaOverlay) {
    mapaOverlay.classList.add('esconder');
  }

  // Garantir que áreas estejam visíveis
  const areasOverlay = document.querySelector('.areas-sobrepostas');
  if (areasOverlay) {
    areasOverlay.style.pointerEvents = 'auto';
    areasOverlay.style.opacity = '1';
  }
}

// Função para configurar event listeners
function configurarEventListeners() {
  // Botão fechar painel
  const fecharPainel = document.getElementById('fecharPainel');
  if (fecharPainel) {
    fecharPainel.addEventListener('click', fecharPainelTrilha);
  }

  // Botão assistir vídeo
  const assistirVideo = document.getElementById('assistirVideo');
  if (assistirVideo) {
    assistirVideo.addEventListener('click', () => {
      const trilhaAtual = document.querySelector('.mapa-container').dataset.trilhaAtiva || 1;
      abrirModalVideo(trilhaAtual);
    });
  }

  // Botão voltar ao overview
  const voltarOverview = document.getElementById('voltarOverview');
  if (voltarOverview) {
    voltarOverview.addEventListener('click', voltarParaVisaoGeral);
  }

  // Botão fechar modal de vídeo
  const btnFecharModalVideo = document.getElementById('btnFecharModalVideo');
  if (btnFecharModalVideo) {
    btnFecharModalVideo.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      fecharModalVideo();
    });
  }

  // Event listeners para fechar modais
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      fecharModalVideo();
    }
  });

  // Controles de zoom removidos - apenas zoom automático das trilhas
  const zoomIn = document.getElementById('zoomIn');
  const zoomOut = document.getElementById('zoomOut');
  const zoomReset = document.getElementById('zoomReset');

  if (zoomIn) {
    zoomIn.style.display = 'none'; // Esconder botão
    console.log('Botão zoom in desabilitado');
  }

  if (zoomOut) {
    zoomOut.style.display = 'none'; // Esconder botão
    console.log('Botão zoom out desabilitado');
  }

  if (zoomReset) {
    zoomReset.style.display = 'none'; // Esconder botão
    console.log('Botão zoom reset desabilitado');
  }

  // Zoom interativo com scroll e arrastar
  inicializarZoomInterativo();
}

// Função para iniciar trilha de uma área específica
function iniciarTrilhaArea(trilhaId, areaName) {
  console.log('=== INICIANDO TRILHA ===');
  console.log('Trilha ID:', trilhaId, 'Área:', areaName);
  console.log('Trilha ID type:', typeof trilhaId);

  const mapaContainer = document.querySelector('.mapa-container');
  const mapaImg = document.querySelector('.mapa-img');

  if (!mapaContainer || !mapaImg) {
    console.error('Elementos do mapa não encontrados:', { mapaContainer, mapaImg });
    return;
  }

  // Verificar se a trilha existe
  const trilha = trilhasData[trilhaId];
  if (!trilha) {
    console.error('Trilha não encontrada:', trilhaId);
    return;
  }

  console.log('Dados da trilha:', trilha);

  // Limpar classes anteriores
  mapaContainer.className = 'mapa-container';

  // Adicionar classe para indicar que uma área está sendo focada
  mapaContainer.classList.add('area-focada');

  // Aplicar classe de trilha
  mapaContainer.classList.add(trilha.classe);
  mapaContainer.dataset.trilhaAtiva = trilhaId;

  console.log('Aplicando classe:', trilha.classe);

  // Ativar cores do mapa
  if (mapaImg) {
    mapaImg.classList.add('ativo');
  }

  // Abrir painel
  setTimeout(() => {
    console.log('Abrindo painel para trilha:', trilhaId);
    abrirPainelTrilha(trilhaId);
  }, 100);

  console.log('=== TRILHA INICIADA ===');
}

// Função para mostrar trilha (compatibilidade com código existente)
function mostrarTrilha(numero) {
  const trilha = trilhasData[numero];
  const mapaContainer = document.querySelector('.mapa-container');
  const mapaImg = document.querySelector('.mapa-img');
  const mapaOverlay = document.querySelector('.mapa-overlay');

  // Capturar se está vindo do overview
  const estaVindoDoOverview = modoOverview;
  modoOverview = false;

  // Limpar elementos anteriores
  const spotlightAntigo = document.querySelector('.spotlight-overlay');
  const indicadorAntigo = document.querySelector('.indicador-trilha');
  const areasOverview = document.querySelectorAll('.area-marcador');
  const tituloOverview = document.querySelector('.overview-titulo');
  const instrucaoOverview = document.querySelector('.overview-instrucao');

  if (spotlightAntigo) spotlightAntigo.remove();
  if (indicadorAntigo) indicadorAntigo.remove();
  if (tituloOverview) tituloOverview.remove();
  if (instrucaoOverview) instrucaoOverview.remove();
  areasOverview.forEach(area => area.remove());

  // Ativar mapa
  mapaImg.classList.add('ativo');
  mapaOverlay.classList.add('esconder');

  // Aplicar classe de trilha
  mapaContainer.className = `mapa-container ${trilha.classe}`;
  mapaContainer.dataset.trilhaAtiva = numero;

  if (estaVindoDoOverview) {
    mapaContainer.dataset.vemDoOverview = 'true';
  } else {
    mapaContainer.removeAttribute('data-vem-do-overview');
  }

  // Debug estado antes de abrir
  debugEstadoPainel();

  // Abrir painel
  setTimeout(() => {
    abrirPainelTrilha(numero);

    // Debug estado após abertura
    setTimeout(() => {
      debugEstadoPainel();
    }, 200);
  }, 300);
}

// =============================================
// SISTEMA DE ZOOM AVANÇADO
// =============================================

// Variáveis globais para controle de zoom
window.zoomLevel = 1;
window.isPanning = false;
window.startX = 0;
window.startY = 0;
window.translateX = 0;
window.translateY = 0;

// Função para resetar zoom mantendo posicionamento da trilha melhorada
function resetarZoomTrilha(trilhaId) {
  const mapaContainer = document.querySelector('.mapa-container');
  const mapaImg = document.querySelector('.mapa-img');
  const areasContainer = document.querySelector('.areas-sobrepostas');

  if (!mapaContainer || !mapaImg) return;

  // Resetar zoom interativo das áreas sobrepostas primeiro
  if (areasContainer) {
    areasContainer.style.transform = '';
    areasContainer.style.transition = '';
  }

  // Aplicar animação suave de reset na imagem de fundo
  mapaImg.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';

  // Resetar para escala da trilha original
  setTimeout(() => {
    mapaImg.style.transform = '';
    mapaImg.style.transformOrigin = '';

    // Re-aplicar classe de zoom da trilha com animação
    const classesZoom = ['zoom-trilha-1', 'zoom-trilha-2', 'zoom-trilha-3', 'zoom-trilha-4', 'zoom-trilha-5'];
    classesZoom.forEach(cls => mapaContainer.classList.remove(cls));

    setTimeout(() => {
      mapaContainer.classList.add(`zoom-trilha-${trilhaId}`);
    }, 100);
  }, 50);

  // Resetar variáveis de zoom interativo
  window.zoomLevel = 1;
  window.translateX = 0;
  window.translateY = 0;
}

// Zoom interativo removido - apenas zoom automático das trilhas
function inicializarZoomInterativo() {
  console.log('=== ZOOM INTERATIVO DESABILITADO ===');
  console.log('Apenas zoom automático das trilhas está ativo');
  // Função mantida por compatibilidade, mas sem funcionalidade de zoom interativo
}

// Expor funções globalmente para compatibilidade
window.iniciarTrilhaArea = iniciarTrilhaArea;
window.mostrarTrilha = mostrarTrilha;
window.abrirModalVideo = abrirModalVideo;
window.fecharModalVideo = fecharModalVideo;
window.fecharModalSimulado = fecharModalSimulado;
window.iniciarSimulado = iniciarSimulado;
window.fecharPainelTrilha = fecharPainelTrilha;
window.debugEstadoPainel = debugEstadoPainel;
window.voltarParaVisaoGeral = voltarParaVisaoGeral;
window.inicializarAreasInterativas = inicializarAreasInterativas;
window.finalizarSimulador = finalizarSimulador;
window.fecharElementosAreaConcluida = fecharElementosAreaConcluida;

// Função de debug global
window.debugSimulador = () => {
  console.log('=== DEBUG DO SIMULADOR ===');
  console.log('Funções disponíveis:', {
    iniciarTrilhaArea: !!window.iniciarTrilhaArea,
    inicializarAreasInterativas: !!window.inicializarAreasInterativas,
    testarBotoes: !!window.testarBotoes,
    debugTrilhasVisitadas: !!window.debugTrilhasVisitadas,
    testarTrilha5: !!window.testarTrilha5,
    iniciarSimulado: !!window.iniciarSimulado
  });

  // Debug das trilhas visitadas
  if (window.debugTrilhasVisitadas) {
    window.debugTrilhasVisitadas();
  }

  if (window.testarBotoes) {
    window.testarBotoes();
  }

  const botoes = document.querySelectorAll('.btn-entrar-trilha');
  console.log('Botões encontrados:', botoes.length);

  // Debug específico da trilha 5
  const botaoTrilha5 = document.querySelector('[data-trilha="5"]');
  console.log('Botão trilha 5:', botaoTrilha5);
  console.log('Área da trilha 5:', botaoTrilha5?.dataset.area);
  console.log('Container da trilha 5:', botaoTrilha5?.closest('.area-interativa'));

  // Debug do estado do painel
  const painel = document.getElementById('painelTrilha');
  if (painel) {
    console.log('=== DEBUG ESTADO PAINEL ===');
    console.log('Classes:', painel.className);
    console.log('Estilo left:', painel.style.left);
    console.log('Estilo right:', painel.style.right);
    console.log('Tem classe ativo?', painel.classList.contains('ativo'));
    console.log('Position computed:', window.getComputedStyle(painel).getPropertyValue('left'));
    console.log('========================');
  }

  console.log('=== FIM DEBUG ===');
};

// Função para limpar localStorage (para teste)
window.limparProgresso = () => {
  localStorage.removeItem('areasVisitadas');
  localStorage.removeItem('simuladorCompleto');
  console.log('Progresso limpo! Recarregue a página para começar do zero.');
};
