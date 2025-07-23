// =============================================
// MAPA FINALIZADO - ARQUIVO PRINCIPAL
// =============================================

// Importar módulos necessários
import { trilhasData } from './data.js';
import { abrirPainelTrilha, fecharPainelTrilha } from './painel.js';
import { abrirModalVideo, fecharModalVideo } from './modal.js';
import { iniciarSimulado } from './simulado.js';

// Inicialização da aplicação
console.log('Script mapa-finalizado.js carregado');

// Aguardar DOM carregar
document.addEventListener('DOMContentLoaded', () => {
  console.log('=== MAPA FINALIZADO INICIANDO ===');
  try {
    inicializarMapaFinalizado();
    configurarEventListeners();
    console.log('=== MAPA FINALIZADO INICIADO COM SUCESSO ===');
  } catch (error) {
    console.error('Erro ao inicializar mapa finalizado:', error);
  }
});

// Função para inicializar o mapa finalizado
function inicializarMapaFinalizado() {
  console.log('Inicializando mapa finalizado...');

  // Configurar botões das áreas
  const botoesAreas = document.querySelectorAll('.botao-area');
  botoesAreas.forEach(botao => {
    const trilhaId = parseInt(botao.dataset.trilha);

    botao.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Clicou no botão da trilha:', trilhaId);

      abrirTrilhaFinalizada(trilhaId);
    });

    // Efeitos hover mais suaves - APENAS quando não há zoom ativo
    botao.addEventListener('mouseenter', () => {
      const mapaContainer = document.querySelector('.mapa-container');
      if (!mapaContainer.classList.contains('area-focada')) {
        botao.style.transform = 'translate(-50%, -50%) scale(1.1)';
      }
    });

    botao.addEventListener('mouseleave', () => {
      const mapaContainer = document.querySelector('.mapa-container');
      if (!mapaContainer.classList.contains('area-focada')) {
        botao.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    });
  });

  console.log('Botões das áreas configurados:', botoesAreas.length);
}

// Função para configurar event listeners
function configurarEventListeners() {
  // Botão fechar painel
  const btnFecharPainel = document.getElementById('fecharPainel');
  if (btnFecharPainel) {
    btnFecharPainel.addEventListener('click', fecharPainelTrilha);
  }

  // Botão finalizar simulador - CORRIGIDO
  const btnFinalizarSimulador = document.getElementById('btnFinalizarSimulador');
  if (btnFinalizarSimulador) {
    btnFinalizarSimulador.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Botão Finalizar Simulador clicado');
      finalizarSimulador();
    });
  }

  // Botão fechar modal de vídeo
  const btnFecharModalVideo = document.getElementById('btnFecharModalVideo');
  if (btnFecharModalVideo) {
    btnFecharModalVideo.addEventListener('click', fecharModalVideo);
  }

  // Botão fechar modal de simulado
  const btnFecharModalSimulado = document.getElementById('btnFecharSimuladoHeader');
  if (btnFecharModalSimulado) {
    btnFecharModalSimulado.addEventListener('click', () => {
      const modal = document.getElementById('modalSimulado');
      if (modal) {
        modal.classList.remove('ativo');
        document.body.style.overflow = 'auto';
      }
    });
  }

  console.log('Event listeners configurados');
}

// Função para abrir trilha no mapa finalizado
function abrirTrilhaFinalizada(trilhaId) {
  console.log('Abrindo trilha finalizada:', trilhaId);

  const trilha = trilhasData[trilhaId];
  if (!trilha) {
    console.error('Trilha não encontrada:', trilhaId);
    return;
  }

  const mapaContainer = document.querySelector('.mapa-container');
  const mapaImg = document.querySelector('.mapa-img');

  // Aplicar efeitos visuais do mapa
  if (mapaContainer && mapaImg) {
    // Aplicar zoom direcionado usando as coordenadas do data.js
    aplicarZoomMapaFinalizado(trilhaId, trilha.zoom);

    // Aplicar classe da trilha específica
    mapaContainer.classList.add(trilha.classe);
    mapaContainer.dataset.trilhaAtiva = trilhaId;

    // Destacar o botão da área atual (mas eles ficarão escondidos pelo CSS)
    const todosBotoes = document.querySelectorAll('.botao-area');
    todosBotoes.forEach(botao => {
      botao.classList.remove('ativo');
    });

    const botaoAtual = document.querySelector(`[data-trilha="${trilhaId}"]`);
    if (botaoAtual) {
      botaoAtual.classList.add('ativo');
    }

    console.log('Classes aplicadas ao mapa:', mapaContainer.className);
  }

  // Abrir painel
  setTimeout(() => {
    console.log('Abrindo painel para trilha:', trilhaId);
    abrirPainelTrilha(trilhaId);
  }, 100);
}

// Função para aplicar zoom no mapa finalizado
function aplicarZoomMapaFinalizado(trilhaNumero, coordenadas) {
  const mapaContainer = document.querySelector('.mapa-container');
  const mapaImg = document.querySelector('.mapa-img');

  if (!mapaContainer || !mapaImg || !coordenadas) return;

  console.log('Aplicando zoom no mapa finalizado:', coordenadas);

  // NÃO mostrar indicador de zoom - REMOVIDO

  // Remover classes de zoom anteriores
  const classesZoom = ['zoom-trilha-1', 'zoom-trilha-2', 'zoom-trilha-3', 'zoom-trilha-4', 'zoom-trilha-5'];
  classesZoom.forEach(cls => mapaContainer.classList.remove(cls));

  // APLICAR CLASSE DE FOCO QUE VAI ESCONDER OS BOTÕES VIA CSS
  mapaContainer.classList.add('area-focada');

  // Calcular zoom baseado na trilha
  const zoomLevel = 2.3 + (trilhaNumero * 0.15);
  const x = coordenadas.x;
  const y = coordenadas.y;

  // Aplicar transform APENAS na imagem de fundo
  const transformStyle = `scale(${zoomLevel})`;
  const originStyle = `${x}% ${y}%`;
  const transitionStyle = 'transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)';

  // Aplicar zoom APENAS na imagem de fundo
  mapaImg.style.transform = transformStyle;
  mapaImg.style.transformOrigin = originStyle;
  mapaImg.style.transition = transitionStyle;

  // Aplicar classe de zoom com delay para animação
  setTimeout(() => {
    mapaContainer.classList.add(`zoom-trilha-${trilhaNumero}`);
    console.log(`Zoom aplicado: Scale ${zoomLevel}, Origin: ${x}% ${y}% - Botões escondidos`);
  }, 100);
}

// Função para finalizar simulador
function finalizarSimulador() {
  console.log('Finalizando simulador...');

  // Salvar TODOS os estados necessários para evitar redirecionamento
  if (typeof (Storage) !== "undefined") {
    // Estado de conclusão
    localStorage.setItem('simuladorConcluido', 'true');
    localStorage.setItem('simuladorCompleto', 'true'); // Esta é a chave que o final.html verifica
    localStorage.setItem('dataFinalizacao', new Date().toISOString());

    // Garantir que todas as áreas estejam marcadas como visitadas
    const areasVisitadas = [1, 2, 3, 4, 5]; // Todas as trilhas
    localStorage.setItem('areasVisitadas', JSON.stringify(areasVisitadas));

    console.log('Estados salvos:', {
      simuladorConcluido: localStorage.getItem('simuladorConcluido'),
      simuladorCompleto: localStorage.getItem('simuladorCompleto'),
      areasVisitadas: localStorage.getItem('areasVisitadas')
    });
  }

  // Redirecionar para página final
  console.log('Redirecionando para final.html...');
  window.location.href = 'final.html';
}

// Função customizada para fechar painel no mapa finalizado
function fecharPainelMapaFinalizado() {
  const painel = document.getElementById('painelTrilha');
  const mapaContainer = document.querySelector('.mapa-container');
  const mapaImg = document.querySelector('.mapa-img');

  if (painel) {
    painel.classList.remove('ativo');
    console.log('Painel fechado no mapa finalizado');
  }

  // Resetar estado do mapa
  if (mapaContainer) {
    // REMOVER CLASSE DE FOCO - ISSO VAI MOSTRAR OS BOTÕES NOVAMENTE
    mapaContainer.classList.remove('area-focada');

    // Reset zoom suave APENAS na imagem
    if (mapaImg) {
      const resetTransform = 'scale(1)';
      const resetOrigin = 'center center';
      const resetTransition = 'transform 1s cubic-bezier(0.23, 1, 0.32, 1)';

      mapaImg.style.transform = resetTransform;
      mapaImg.style.transformOrigin = resetOrigin;
      mapaImg.style.transition = resetTransition;
    }

    // Remover classes de zoom
    setTimeout(() => {
      mapaContainer.classList.remove('zoom-trilha-1', 'zoom-trilha-2', 'zoom-trilha-3', 'zoom-trilha-4', 'zoom-trilha-5');
      console.log('Zoom removido - Botões voltaram a aparecer');
    }, 100);

    mapaContainer.removeAttribute('data-trilha-ativa');
  }

  // Remover destaque de todos os botões
  const todosBotoes = document.querySelectorAll('.botao-area');
  todosBotoes.forEach(botao => {
    botao.classList.remove('ativo');
  });
}

// Expor funções globalmente
window.abrirTrilhaFinalizada = abrirTrilhaFinalizada;
window.finalizarSimulador = finalizarSimulador;
window.fecharPainelTrilha = fecharPainelMapaFinalizado;
window.abrirModalVideo = abrirModalVideo;
window.fecharModalVideo = fecharModalVideo;
window.iniciarSimulado = iniciarSimulado;

// Função de debug
window.debugMapaFinalizado = () => {
  console.log('=== DEBUG MAPA FINALIZADO ===');
  console.log('Funções disponíveis:', {
    abrirTrilhaFinalizada: !!window.abrirTrilhaFinalizada,
    finalizarSimulador: !!window.finalizarSimulador,
    fecharPainelTrilha: !!window.fecharPainelTrilha,
    abrirModalVideo: !!window.abrirModalVideo,
    fecharModalVideo: !!window.fecharModalVideo,
    iniciarSimulado: !!window.iniciarSimulado
  });

  const botoes = document.querySelectorAll('.botao-area');
  console.log('Botões encontrados:', botoes.length);

  const mapaContainer = document.querySelector('.mapa-container');
  console.log('Mapa Container classes:', mapaContainer?.className);

  const painelTrilha = document.getElementById('painelTrilha');
  console.log('Painel Trilha:', !!painelTrilha);
};
