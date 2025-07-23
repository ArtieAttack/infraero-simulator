// =============================================
// CONTROLE DO PAINEL LATERAL
// =============================================

import { trilhasData } from './data.js';

// Função auxiliar para resetar completamente o painel
function resetarPainelCompleto() {
  const painel = document.getElementById('painelTrilha');
  if (!painel) return;

  console.log('Resetando painel completamente...');

  // Remover todas as classes exceto a classe base
  painel.className = 'painel-trilha';

  // Limpar todos os estilos inline
  painel.style.left = '';
  painel.style.right = '';
  painel.style.transform = '';
  painel.style.transition = '';

  // Garantir que não há classe ativo
  painel.classList.remove('ativo');

  console.log('Painel resetado');
}

// Função para aplicar zoom usando coordenadas precisas do data.js
function aplicarZoomComCoordenadas(trilhaNumero, coordenadas) {
  const mapaContainer = document.querySelector('.mapa-container');
  const mapaImg = document.querySelector('.mapa-img');
  const areasContainer = document.querySelector('.areas-sobrepostas');
  const zoomIndicator = document.getElementById('zoomIndicator');

  if (!mapaContainer || !mapaImg || !areasContainer || !coordenadas) return;

  console.log('Aplicando zoom com coordenadas:', coordenadas);

  // Mostrar indicador de zoom
  if (zoomIndicator) {
    zoomIndicator.textContent = `🔍 Focalizando Trilha ${trilhaNumero}...`;
    zoomIndicator.classList.add('ativo');
  }

  // Remover classes de zoom anteriores
  const classesZoom = ['zoom-trilha-1', 'zoom-trilha-2', 'zoom-trilha-3', 'zoom-trilha-4', 'zoom-trilha-5'];
  classesZoom.forEach(cls => mapaContainer.classList.remove(cls));

  // Calcular zoom baseado na trilha (zoom progressivo)
  const zoomLevel = 2.3 + (trilhaNumero * 0.15);
  const x = coordenadas.x;
  const y = coordenadas.y;

  // Aplicar transform tanto na imagem quanto nas áreas (zoom automático da trilha)
  const transformStyle = `scale(${zoomLevel})`;
  const originStyle = `${x}% ${y}%`;
  const transitionStyle = 'transform 1.2s cubic-bezier(0.23, 1, 0.32, 1), filter 0.8s ease';

  // Aplicar na imagem de fundo
  mapaImg.style.transform = transformStyle;
  mapaImg.style.transformOrigin = originStyle;
  mapaImg.style.transition = transitionStyle;

  // Aplicar nas áreas sobrepostas
  areasContainer.style.transform = transformStyle;
  areasContainer.style.transformOrigin = originStyle;
  areasContainer.style.transition = transitionStyle;

  // Aplicar classe de zoom com delay para animação
  setTimeout(() => {
    mapaContainer.classList.add(`zoom-trilha-${trilhaNumero}`);
    console.log(`Zoom aplicado: Scale ${zoomLevel}, Origin: ${x}% ${y}%`);
    console.log('Zoom automático aplicado tanto na imagem quanto nas áreas');
    console.log('Zoom interativo via mouse foi desabilitado');

    // Esconder indicador após zoom completar
    if (zoomIndicator) {
      setTimeout(() => {
        zoomIndicator.classList.remove('ativo');
      }, 1000);
    }
  }, 50);
}

// Função para abrir painel da trilha
export function abrirPainelTrilha(numero) {
  console.log('🔍 FUNÇÃO abrirPainelTrilha CHAMADA - Número:', numero);
  console.log('🔍 Type do número:', typeof numero);
  console.log('🔍 trilhasData disponível:', Object.keys(trilhasData));

  const trilha = trilhasData[numero];
  const painel = document.getElementById('painelTrilha');
  const mapaContainer = document.querySelector('.mapa-container');
  const mapaImg = document.querySelector('.mapa-img');

  if (!trilha || !painel) {
    console.error('Trilha ou painel não encontrado:', { trilha, painel });
    return;
  }

  // Resetar painel completamente antes de abrir
  resetarPainelCompleto();

  // Resetar variáveis de zoom se existirem
  if (window.zoomLevel !== undefined) {
    window.zoomLevel = 1;
    window.translateX = 0;
    window.translateY = 0;
  }

  // Reaplicar efeitos visuais do mapa
  if (mapaContainer && mapaImg) {
    console.log('Reaplicando efeitos visuais do mapa');

    // Aplicar classe de foco para escurecer o mapa
    mapaContainer.classList.add('area-focada');

    // Aplicar zoom direcionado usando as coordenadas do data.js
    aplicarZoomComCoordenadas(numero, trilha.zoom);

    // Aplicar classe da trilha específica
    mapaContainer.classList.add(trilha.classe);
    mapaContainer.dataset.trilhaAtiva = numero;

    // Destacar a área específica que está sendo visualizada
    const todasAreas = document.querySelectorAll('.area-interativa');
    todasAreas.forEach(area => area.classList.remove('area-ativa'));

    // Adicionar classe de destaque à área atual
    const areaAtual = document.querySelector(`.${trilha.areaClasse || trilha.classe}`);
    if (areaAtual) {
      areaAtual.classList.add('area-ativa');
      console.log('Área destacada:', trilha.areaClasse || trilha.classe);
    }

    // Ativar cores do mapa
    mapaImg.classList.add('ativo');

    console.log('Classes aplicadas ao mapa:', mapaContainer.className);
    console.log('Zoom aplicado para trilha:', numero, 'Coordenadas:', trilha.zoom);
  }

  // Aplicar classe de cor ao painel
  painel.className = `painel-trilha ${trilha.classe}`;

  // Adicionar classe especial para trilha 5 (Outras Áreas)
  if (numero == 5) {
    painel.classList.add('trilha-5');
  }

  // Atualizar conteúdo do painel
  document.getElementById('trilhaTitulo').textContent = trilha.titulo;
  document.getElementById('trilhaObjetivo').textContent = trilha.objetivo;
  document.getElementById('trilhaDescricao').innerHTML = trilha.descricao;

  // Atualizar imagem da área
  const trilhaImagem = document.getElementById('trilhaImagem');
  if (trilhaImagem && trilha.imagem) {
    trilhaImagem.src = trilha.imagem;
    trilhaImagem.alt = `Imagem da ${trilha.titulo}`;

    // Fallback caso a imagem não carregue
    trilhaImagem.onerror = function () {
      console.log('Erro ao carregar imagem da trilha, usando fallback');
      this.src = 'assets/images/campo.jpg';
      this.alt = 'Imagem do campo - fallback';
    };

    // Adicionar evento de clique para abrir modal da imagem
    trilhaImagem.onclick = () => {
      abrirModalImagem(trilha.titulo, trilhaImagem.src, trilhaImagem.alt);
    };
  }

  // Atualizar botão de vídeo
  const btnAssistirVideo = document.getElementById('assistirVideo');
  if (btnAssistirVideo) {
    // Verificar se a trilha tem vídeo disponível
    if (trilha.video.url && trilha.video.url.trim() !== '') {
      // Trilha com vídeo - mostrar botão "ASSISTIR VÍDEO"
      btnAssistirVideo.innerHTML = '<span class="icone-play">▶</span> ASSISTIR VÍDEO';
    } else {
      // Trilha sem vídeo (como "Outras Áreas") - mostrar botão "INICIAR SIMULADO"
      btnAssistirVideo.innerHTML = 'INICIAR SIMULADO';
    }

    btnAssistirVideo.onclick = () => {
      console.log('Clicou em assistir vídeo para trilha:', numero);
      window.abrirModalVideo(numero);
    };
  }

  // Forçar repaint do DOM
  painel.offsetHeight;

  // Mostrar painel com tempo suficiente para as classes CSS serem aplicadas
  setTimeout(() => {
    painel.classList.add('ativo');
    console.log('Painel ativo adicionado para trilha:', numero);
    console.log('Classes finais do painel:', painel.className);

    // Verificar posição final
    const computedLeft = window.getComputedStyle(painel).getPropertyValue('left');
    const computedRight = window.getComputedStyle(painel).getPropertyValue('right');
    console.log('Posição computada - left:', computedLeft, 'right:', computedRight);
  }, 150);
}

// Função para fechar painel da trilha
export function fecharPainelTrilha() {
  const painel = document.getElementById('painelTrilha');
  const mapaContainer = document.querySelector('.mapa-container');
  const mapaImg = document.querySelector('.mapa-img');
  const areasOverlay = document.querySelector('.areas-sobrepostas');

  if (painel) {
    // Remover classe ativo do painel
    painel.classList.remove('ativo');
    console.log('Classe ativo removida do painel');

    // Esperar a transição CSS completar antes de resetar posições
    setTimeout(() => {
      // Resetar posicionamento com estilos inline temporários
      if (painel.classList.contains('trilha-5')) {
        painel.style.left = '-500px';
        painel.style.right = 'auto';
      } else {
        painel.style.right = '-500px';
        painel.style.left = 'auto';
      }

      // Remover classe trilha-5 e resetar classes
      painel.classList.remove('trilha-5');
      painel.className = 'painel-trilha';

      console.log('Painel resetado para fechamento');
    }, 400); // Aguardar a transição CSS completar (0.4s)
  }

  // Resetar estado do mapa sem remover completamente as classes
  if (mapaContainer) {
    mapaContainer.classList.remove('area-focada');

    // Aplicar animação de zoom out suave
    const mapaImg = document.querySelector('.mapa-img');
    const areasContainer = document.querySelector('.areas-sobrepostas');

    if (mapaImg && areasContainer) {
      const resetTransform = 'scale(1)';
      const resetOrigin = 'center center';
      const resetTransition = 'transform 1s cubic-bezier(0.23, 1, 0.32, 1), filter 0.8s ease';

      // Reset da imagem de fundo
      mapaImg.style.transform = resetTransform;
      mapaImg.style.transformOrigin = resetOrigin;
      mapaImg.style.transition = resetTransition;

      // Reset das áreas sobrepostas
      areasContainer.style.transform = resetTransform;
      areasContainer.style.transformOrigin = resetOrigin;
      areasContainer.style.transition = resetTransition;

      // Reset das variáveis de zoom interativo
      window.zoomLevel = 1;
      window.translateX = 0;
      window.translateY = 0;
      window.isPanning = false;
    }

    // Remover classes de zoom com delay
    setTimeout(() => {
      mapaContainer.classList.remove('zoom-trilha-1', 'zoom-trilha-2', 'zoom-trilha-3', 'zoom-trilha-4', 'zoom-trilha-5');
      mapaContainer.classList.add('zoom-reset');
    }, 100);

    mapaContainer.removeAttribute('data-trilha-ativa');
    mapaContainer.removeAttribute('data-vem-do-overview');

    // Remover zoom-reset após a transição
    setTimeout(() => {
      mapaContainer.classList.remove('zoom-reset');
      if (mapaImg && areasContainer) {
        mapaImg.style.transform = '';
        mapaImg.style.transformOrigin = '';
        mapaImg.style.transition = '';
        areasContainer.style.transform = '';
        areasContainer.style.transformOrigin = '';
        areasContainer.style.transition = '';
      }
    }, 1000);
  }

  // Remover destaque de todas as áreas
  const todasAreas = document.querySelectorAll('.area-interativa');
  todasAreas.forEach(area => area.classList.remove('area-ativa'));

  // Resetar filtro do mapa ao estado inicial (cinza)
  if (mapaImg) {
    mapaImg.classList.remove('ativo');
    mapaImg.style.transform = '';
    mapaImg.style.transformOrigin = '';
    mapaImg.style.filter = 'grayscale(90%) blur(0px) brightness(1)';
  }

  // Garantir que as áreas continuem interativas
  if (areasOverlay) {
    areasOverlay.style.opacity = '1';
    areasOverlay.style.pointerEvents = 'auto';
  }

  // Reativar áreas interativas
  const areasInterativas = document.querySelectorAll('.area-interativa:not(.bloqueada)');
  areasInterativas.forEach(area => {
    area.style.pointerEvents = 'auto';
    area.style.opacity = '1';
  });

  // Remover elementos criados dinamicamente
  const spotlight = document.querySelector('.spotlight-overlay');
  const indicador = document.querySelector('.indicador-trilha');
  const circuloIndicador = document.querySelector('.circulo-indicador-area');

  if (spotlight) spotlight.remove();
  if (indicador) indicador.remove();
  if (circuloIndicador) circuloIndicador.remove();

  // Restaurar visibilidade do indicador da trilha se existir
  const indicadorTrilha = document.querySelector('.indicador-trilha');
  if (indicadorTrilha) {
    indicadorTrilha.style.opacity = '1';
    indicadorTrilha.style.pointerEvents = 'auto';
  }

  // Reinicializar áreas interativas para garantir que os event listeners funcionem
  setTimeout(() => {
    console.log('=== REINICIALIZANDO ÁREAS APÓS FECHAMENTO ===');
    if (window.inicializarAreasInterativas) {
      window.inicializarAreasInterativas();
      console.log('Áreas reinicializadas com sucesso');
    } else {
      console.error('Função inicializarAreasInterativas não encontrada no window');
    }
  }, 500); // Tempo maior para garantir que tudo foi limpo
}

// Função auxiliar para garantir fechamento completo do painel lateral
function garantirFechamentoPainel() {
  const painel = document.getElementById('painelTrilha');
  const mapaContainer = document.querySelector('.mapa-container');
  const mapaImg = document.querySelector('.mapa-img');
  const areasOverlay = document.querySelector('.areas-sobrepostas');

  if (painel) {
    // Remover classe ativo do painel
    painel.classList.remove('ativo');

    // Forçar posicionamento correto baseado na trilha
    setTimeout(() => {
      if (painel.classList.contains('trilha-5')) {
        painel.style.left = '-500px';
        painel.style.right = 'auto';
      } else {
        painel.style.right = '-500px';
        painel.style.left = 'auto';
      }

      // Remover classe trilha-5 para próximas aberturas
      painel.classList.remove('trilha-5');

      // Remover todas as classes de trilha do painel
      painel.className = 'painel-trilha';
    }, 50);
  }

  // Resetar estado do mapa
  if (mapaContainer) {
    mapaContainer.classList.remove('area-focada');
    mapaContainer.className = 'mapa-container';
    mapaContainer.removeAttribute('data-trilha-ativa');
    mapaContainer.removeAttribute('data-vem-do-overview');
  }

  // Resetar imagem do mapa ao estado inicial (cinza)
  if (mapaImg) {
    mapaImg.classList.remove('ativo');
    mapaImg.style.transform = '';
    mapaImg.style.transformOrigin = '';
    mapaImg.style.filter = 'grayscale(90%) blur(0px) brightness(1)';
  }

  // Mostrar áreas novamente
  if (areasOverlay) {
    areasOverlay.style.opacity = '1';
    areasOverlay.style.pointerEvents = 'auto';
  }

  // Reativar áreas interativas
  const areasInterativas = document.querySelectorAll('.area-interativa');
  areasInterativas.forEach(area => {
    area.style.pointerEvents = 'auto';
  });

  // Remover elementos criados dinamicamente
  const spotlight = document.querySelector('.spotlight-overlay');
  const indicador = document.querySelector('.indicador-trilha');
  const circuloIndicador = document.querySelector('.circulo-indicador-area');

  if (spotlight) spotlight.remove();
  if (indicador) indicador.remove();
  if (circuloIndicador) circuloIndicador.remove();
}

// Função para voltar à visão geral do mapa
export function voltarParaVisaoGeral() {
  const mapaContainer = document.querySelector('.mapa-container');
  const mapaImg = document.querySelector('.mapa-img');
  const areasOverlay = document.querySelector('.areas-sobrepostas');
  const painelTrilha = document.getElementById('painelTrilha');

  // Fechar painel se estiver aberto
  painelTrilha.classList.remove('ativo');

  setTimeout(() => {
    if (painelTrilha.classList.contains('trilha-5')) {
      painelTrilha.style.left = '-500px';
      painelTrilha.style.right = 'auto';
    } else {
      painelTrilha.style.right = '-500px';
      painelTrilha.style.left = 'auto';
    }

    painelTrilha.classList.remove('trilha-5');
  }, 50);

  // Remover classes de foco
  mapaContainer.classList.remove('area-focada');
  mapaContainer.className = 'mapa-container';
  mapaContainer.removeAttribute('data-trilha-ativa');

  // Resetar zoom e filtros
  mapaImg.classList.remove('ativo');
  mapaImg.style.transform = '';
  mapaImg.style.transformOrigin = '';
  mapaImg.style.filter = 'grayscale(90%) blur(0px) brightness(1)';

  // Mostrar áreas novamente
  if (areasOverlay) {
    areasOverlay.style.opacity = '1';
    areasOverlay.style.pointerEvents = 'auto';
  }

  // Reativar áreas interativas
  const areasInterativas = document.querySelectorAll('.area-interativa');
  areasInterativas.forEach(area => {
    area.style.pointerEvents = 'auto';
  });

  // Limpar elementos de trilha específica
  const spotlightOverlay = document.querySelector('.spotlight-overlay');
  const indicadorTrilha = document.querySelector('.indicador-trilha');

  if (spotlightOverlay) spotlightOverlay.remove();
  if (indicadorTrilha) indicadorTrilha.remove();

  // Reinicializar áreas interativas para garantir que os event listeners funcionem
  setTimeout(() => {
    console.log('=== REINICIALIZANDO ÁREAS APÓS VOLTAR VISÃO GERAL ===');
    if (window.inicializarAreasInterativas) {
      window.inicializarAreasInterativas();
      console.log('Áreas reinicializadas com sucesso');
    } else {
      console.error('Função inicializarAreasInterativas não encontrada no window');
    }
  }, 200);
}

// Função de teste para verificar se o painel abre/fecha corretamente
window.testarPainel = function (numero = 1) {
  console.log('=== TESTE DE PAINEL INICIADO ===');
  console.log('Testando trilha:', numero);

  // Primeiro, abrir o painel
  console.log('1. Abrindo painel...');
  if (window.iniciarTrilhaArea) {
    window.iniciarTrilhaArea(numero, 'teste');
  }

  // Depois de 2 segundos, fechar
  setTimeout(() => {
    console.log('2. Fechando painel...');
    if (window.fecharPainelTrilha) {
      window.fecharPainelTrilha();
    }

    // Depois de mais 2 segundos, tentar abrir novamente
    setTimeout(() => {
      console.log('3. Tentando reabrir painel...');
      if (window.iniciarTrilhaArea) {
        window.iniciarTrilhaArea(numero, 'teste');
      }

      setTimeout(() => {
        console.log('=== TESTE FINALIZADO ===');
        console.log('Se o painel abriu pela segunda vez, o problema foi corrigido!');
      }, 1000);
    }, 2000);
  }, 2000);
};

// Função de teste para verificar efeitos visuais
window.testarEfeitosVisuais = function () {
  const mapaContainer = document.querySelector('.mapa-container');
  const mapaImg = document.querySelector('.mapa-img');

  console.log('=== TESTE EFEITOS VISUAIS ===');
  console.log('Mapa Container classes:', mapaContainer?.className);
  console.log('Mapa Img classes:', mapaImg?.className);
  console.log('Filtro aplicado:', window.getComputedStyle(mapaImg).filter);
  console.log('========================');
};

// =============================================
// CONTROLE DO MODAL DE IMAGEM DA TRILHA
// =============================================

// Função para abrir modal da imagem
function abrirModalImagem(titulo, imagemSrc, imagemAlt) {
  const modal = document.getElementById('modalImagemTrilha');
  const modalTitulo = document.getElementById('imagemTituloModal');
  const modalImagem = document.getElementById('imagemModalVisualizacao');

  if (!modal || !modalTitulo || !modalImagem) {
    console.error('Elementos do modal de imagem não encontrados');
    return;
  }

  // Configurar conteúdo do modal
  modalTitulo.textContent = titulo;
  modalImagem.src = imagemSrc;
  modalImagem.alt = imagemAlt;

  // Mostrar modal
  modal.classList.add('ativo');

  console.log('Modal de imagem aberto para:', titulo);
}

// Função para fechar modal da imagem
function fecharModalImagem() {
  const modal = document.getElementById('modalImagemTrilha');

  if (modal) {
    modal.classList.remove('ativo');
    console.log('Modal de imagem fechado');
  }
}

// Configurar eventos do modal de imagem quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
  // Botão de fechar do modal de imagem
  const btnFecharModalImagem = document.getElementById('btnFecharModalImagem');
  if (btnFecharModalImagem) {
    btnFecharModalImagem.addEventListener('click', fecharModalImagem);
  }

  // Fechar modal ao clicar fora dele
  const modalImagem = document.getElementById('modalImagemTrilha');
  if (modalImagem) {
    modalImagem.addEventListener('click', function (e) {
      if (e.target === modalImagem) {
        fecharModalImagem();
      }
    });
  }

  // Fechar modal com tecla ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('modalImagemTrilha');
      if (modal && modal.classList.contains('ativo')) {
        fecharModalImagem();
      }
    }
  });
});

// Função de teste para abrir painel diretamente
window.testarAberturaPainel = function (numero = 1) {
  console.log('🧪 TESTE: Tentando abrir painel para trilha:', numero);
  try {
    abrirPainelTrilha(numero);
  } catch (error) {
    console.error('🚨 ERRO ao abrir painel:', error);
  }
};

// Função de teste super simples
window.testeSimples = function () {
  console.log('🧪 TESTE SIMPLES INICIADO');
  const painel = document.getElementById('painelTrilha');
  console.log('🔍 Painel encontrado:', painel);
  if (painel) {
    console.log('🔍 Classes atuais do painel:', painel.className);
    painel.classList.add('ativo');
    console.log('✅ Classe ativo adicionada');
    console.log('🔍 Classes após adicionar ativo:', painel.className);
  }
};
