// =============================================
// SUPORTE MOBILE E GESTOS DE TOQUE
// =============================================

// Variáveis para controle de gestos
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let initialDistance = 0;
let currentDistance = 0;
let isZooming = false;
let isPanning = false;
let initialScale = 1;
let pinchStarted = false;

// Configurações de mobile
const mobileConfig = {
  minZoom: 0.5,
  maxZoom: 3,
  zoomStep: 0.1,
  panThreshold: 10,
  zoomThreshold: 20,
  doubleTapDelay: 300,
  touchSensitivity: 1.5
};

// Inicializar suporte mobile
export function inicializarSuporteMobile() {
  console.log('Inicializando suporte mobile...');

  // Detectar se é dispositivo móvel
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    document.body.classList.add('is-mobile');
    configurarGestosToque();
    configurarOrientacao();
    configurarViewport();
  }

  // Adicionar indicador de zoom
  adicionarIndicadorZoom();
  
  // Configurar zoom controls
  configurarZoomControls();
  
  // Melhorar performance em mobile
  melhorarPerformanceMobile();
}

// Configurar gestos de toque
function configurarGestosToque() {
  const mapaContainer = document.querySelector('.mapa-container');
  if (!mapaContainer) return;

  // Prevenir comportamento padrão de zoom
  mapaContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
  mapaContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
  mapaContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
  
  // Prevenir zoom do navegador
  document.addEventListener('gesturestart', e => e.preventDefault());
  document.addEventListener('gesturechange', e => e.preventDefault());
  document.addEventListener('gestureend', e => e.preventDefault());
}

// Manipular início do toque
function handleTouchStart(e) {
  const touches = e.touches;
  
  if (touches.length === 1) {
    // Toque único - preparar para pan
    startX = touches[0].clientX;
    startY = touches[0].clientY;
    currentX = startX;
    currentY = startY;
    isPanning = false;
    
  } else if (touches.length === 2) {
    // Dois toques - preparar para zoom
    e.preventDefault();
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    initialDistance = getDistance(touch1, touch2);
    currentDistance = initialDistance;
    
    const centerX = (touch1.clientX + touch2.clientX) / 2;
    const centerY = (touch1.clientY + touch2.clientY) / 2;
    
    startX = centerX;
    startY = centerY;
    
    isZooming = true;
    pinchStarted = true;
    initialScale = window.zoomLevel || 1;
  }
}

// Manipular movimento do toque
function handleTouchMove(e) {
  const touches = e.touches;
  
  if (touches.length === 1 && !isZooming) {
    // Pan com um dedo
    currentX = touches[0].clientX;
    currentY = touches[0].clientY;
    
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    
    if (Math.abs(deltaX) > mobileConfig.panThreshold || Math.abs(deltaY) > mobileConfig.panThreshold) {
      isPanning = true;
      e.preventDefault();
      
      // Aplicar pan
      aplicarPan(deltaX, deltaY);
    }
    
  } else if (touches.length === 2 && isZooming) {
    // Zoom com dois dedos
    e.preventDefault();
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    currentDistance = getDistance(touch1, touch2);
    
    if (Math.abs(currentDistance - initialDistance) > mobileConfig.zoomThreshold) {
      const scale = (currentDistance / initialDistance) * initialScale;
      const clampedScale = Math.max(mobileConfig.minZoom, Math.min(mobileConfig.maxZoom, scale));
      
      aplicarZoom(clampedScale);
    }
  }
}

// Manipular fim do toque
function handleTouchEnd(e) {
  if (isPanning) {
    isPanning = false;
  }
  
  if (isZooming) {
    isZooming = false;
    pinchStarted = false;
  }
  
  // Reset das variáveis
  startX = 0;
  startY = 0;
  currentX = 0;
  currentY = 0;
  initialDistance = 0;
  currentDistance = 0;
}

// Calcular distância entre dois pontos
function getDistance(touch1, touch2) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Aplicar pan
function aplicarPan(deltaX, deltaY) {
  if (window.translateX !== undefined && window.translateY !== undefined) {
    window.translateX += deltaX * mobileConfig.touchSensitivity;
    window.translateY += deltaY * mobileConfig.touchSensitivity;
    
    atualizarTransform();
  }
}

// Aplicar zoom
function aplicarZoom(scale) {
  window.zoomLevel = scale;
  atualizarTransform();
  atualizarIndicadorZoom();
}

// Atualizar transform do mapa
function atualizarTransform() {
  const mapaImg = document.querySelector('.mapa-img');
  const areasOverlay = document.querySelector('.areas-sobrepostas');
  
  if (mapaImg && areasOverlay) {
    const transform = `scale(${window.zoomLevel}) translate(${window.translateX}px, ${window.translateY}px)`;
    mapaImg.style.transform = transform;
    areasOverlay.style.transform = transform;
  }
}

// Configurar orientação
function configurarOrientacao() {
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      // Ajustar viewport após mudança de orientação
      configurarViewport();
      
      // Reposicionar elementos se necessário
      const modals = document.querySelectorAll('.modal-simulado.ativo');
      modals.forEach(modal => {
        const content = modal.querySelector('.simulado-conteudo');
        if (content) {
          content.style.maxHeight = '95vh';
        }
      });
    }, 100);
  });
}

// Configurar viewport
function configurarViewport() {
  const viewport = document.querySelector('meta[name=viewport]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }
}

// Adicionar indicador de zoom
function adicionarIndicadorZoom() {
  const existingIndicator = document.querySelector('.zoom-indicator');
  if (existingIndicator) return;
  
  const indicator = document.createElement('div');
  indicator.className = 'zoom-indicator';
  indicator.textContent = '100%';
  document.body.appendChild(indicator);
}

// Atualizar indicador de zoom
function atualizarIndicadorZoom() {
  const indicator = document.querySelector('.zoom-indicator');
  if (indicator) {
    const percentage = Math.round((window.zoomLevel || 1) * 100);
    indicator.textContent = `${percentage}%`;
    
    // Mostrar temporariamente
    indicator.classList.add('ativo');
    setTimeout(() => {
      indicator.classList.remove('ativo');
    }, 2000);
  }
}

// Configurar zoom controls
function configurarZoomControls() {
  const zoomControls = document.querySelector('.zoom-controls');
  if (!zoomControls) {
    criarZoomControls();
  }
  
  // Adicionar event listeners
  const zoomInBtn = document.querySelector('.zoom-in');
  const zoomOutBtn = document.querySelector('.zoom-out');
  const resetBtn = document.querySelector('.zoom-reset');
  
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      const newZoom = Math.min(mobileConfig.maxZoom, (window.zoomLevel || 1) + mobileConfig.zoomStep);
      aplicarZoom(newZoom);
    });
  }
  
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      const newZoom = Math.max(mobileConfig.minZoom, (window.zoomLevel || 1) - mobileConfig.zoomStep);
      aplicarZoom(newZoom);
    });
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      window.zoomLevel = 1;
      window.translateX = 0;
      window.translateY = 0;
      atualizarTransform();
      atualizarIndicadorZoom();
    });
  }
}

// Criar zoom controls
function criarZoomControls() {
  const controls = document.createElement('div');
  controls.className = 'zoom-controls';
  controls.innerHTML = `
    <button class="zoom-btn zoom-in" title="Zoom In">+</button>
    <button class="zoom-btn zoom-out" title="Zoom Out">-</button>
    <button class="zoom-btn zoom-reset" title="Reset">⌂</button>
  `;
  
  document.body.appendChild(controls);
}

// Melhorar performance em mobile
function melhorarPerformanceMobile() {
  // Otimizar animações
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      * {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
      }
      
      .mapa-img,
      .areas-sobrepostas {
        will-change: transform;
      }
      
      .painel-trilha {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
      
      .simulado-conteudo {
        -webkit-overflow-scrolling: touch;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Otimizar scroll
  const scrollElements = document.querySelectorAll('.simulado-body, .painel-trilha');
  scrollElements.forEach(element => {
    element.style.webkitOverflowScrolling = 'touch';
  });
}

// Configurar sidebar mobile
export function configurarSidebarMobile() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const toggle = document.querySelector('.menu-toggle');
  
  if (!sidebar || !toggle) return;
  
  // Criar overlay se não existir
  if (!overlay) {
    const newOverlay = document.createElement('div');
    newOverlay.className = 'sidebar-overlay';
    document.body.appendChild(newOverlay);
  }
  
  // Toggle sidebar
  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    document.querySelector('.sidebar-overlay').classList.toggle('active');
  });
  
  // Fechar sidebar ao clicar no overlay
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('sidebar-overlay')) {
      sidebar.classList.remove('active');
      document.querySelector('.sidebar-overlay').classList.remove('active');
    }
  });
  
  // Fechar sidebar ao clicar em link
  const sidebarLinks = document.querySelectorAll('.sidebar .menu-item');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('active');
      document.querySelector('.sidebar-overlay').classList.remove('active');
    });
  });
}

// Otimizar modais para mobile
export function otimizarModalMobile() {
  const modals = document.querySelectorAll('.modal-simulado');
  
  modals.forEach(modal => {
    modal.addEventListener('touchstart', (e) => {
      // Prevenir scroll do body quando modal estiver aberto
      if (e.target === modal) {
        e.preventDefault();
      }
    });
    
    modal.addEventListener('touchmove', (e) => {
      // Permitir scroll apenas dentro do conteúdo do modal
      if (e.target === modal) {
        e.preventDefault();
      }
    });
  });
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarSuporteMobile);
} else {
  inicializarSuporteMobile();
}
