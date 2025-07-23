// =============================================
// CONTROLE DE MODAIS
// =============================================

import { trilhasData } from './data.js';

// Função para abrir modal de vídeo
export function abrirModalVideo(numero) {
  console.log('Abrindo modal de vídeo para trilha:', numero);
  const trilha = trilhasData[numero];
  const modal = document.getElementById('modalVideo');

  if (!trilha || !modal) {
    console.error('Trilha ou modal não encontrado:', { trilha, modal });
    return;
  }

  // Verificar se o vídeo tem URL válida
  if (!trilha.video.url || trilha.video.url.trim() === '') {
    console.warn('Trilha sem vídeo - URL vazia:', numero);
    // Para trilhas sem vídeo, iniciar simulado diretamente
    console.log('Iniciando simulado diretamente para trilha sem vídeo:', numero);
    setTimeout(() => {
      window.iniciarSimulado(numero);
    }, 100);
    return;
  }

  // Atualizar conteúdo do modal
  document.getElementById('videoTitulo').textContent = trilha.video.titulo;

  // Configurar vídeo (YouTube, Vimeo ou local)
  configureVideoPlayer(trilha.video.url);

  // Atualizar botão de iniciar simulado
  const btnIniciarSimulado = document.getElementById('btnIniciarSimulado');

  // Remover listener anterior se existir
  btnIniciarSimulado.replaceWith(btnIniciarSimulado.cloneNode(true));
  const novoBtnIniciarSimulado = document.getElementById('btnIniciarSimulado');

  novoBtnIniciarSimulado.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Iniciando simulado para trilha:', numero);
    window.iniciarSimulado(numero);
  });

  // Aplicar classe de cor do modal
  modal.className = `modal-video ativo ${trilha.classe}`;

  // Mostrar modal
  document.body.style.overflow = 'hidden';
  console.log('Modal de vídeo aberto');
}

// Função para configurar o player de vídeo (YouTube, Vimeo ou local)
function configureVideoPlayer(url) {
  const videoPlayer = document.getElementById('videoPlayer');
  const youtubePlayer = document.getElementById('youtubePlayer');

  // Verificar se é um link do YouTube
  if (isYouTubeUrl(url)) {
    // Configurar iframe do YouTube
    const embedUrl = convertToYouTubeEmbed(url);
    youtubePlayer.src = embedUrl;
    youtubePlayer.style.display = 'block';
    videoPlayer.style.display = 'none';
    console.log('Configurado para YouTube:', embedUrl);
  } else if (isVimeoUrl(url)) {
    // Configurar iframe do Vimeo
    const embedUrl = convertToVimeoEmbed(url);
    youtubePlayer.src = embedUrl;
    youtubePlayer.style.display = 'block';
    videoPlayer.style.display = 'none';
    console.log('Configurado para Vimeo:', embedUrl);
  } else {
    // Configurar vídeo local
    videoPlayer.src = url;
    videoPlayer.style.display = 'block';
    youtubePlayer.style.display = 'none';
    console.log('Configurado para vídeo local:', url);
  }
}

// Função para verificar se é URL do YouTube
function isYouTubeUrl(url) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

// Função para verificar se é URL do Vimeo
function isVimeoUrl(url) {
  return url.includes('vimeo.com');
}

// Função para converter URL do YouTube para embed
function convertToYouTubeEmbed(url) {
  let videoId = '';

  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }

  return `https://www.youtube.com/embed/${videoId}`;
}

// Função para converter URL do Vimeo para embed
function convertToVimeoEmbed(url) {
  let videoId = '';

  // Extrair ID do vídeo da URL do Vimeo
  if (url.includes('vimeo.com/')) {
    const matches = url.match(/vimeo\.com\/(\d+)/);
    if (matches && matches[1]) {
      videoId = matches[1];
    }
  }

  return `https://player.vimeo.com/video/${videoId}`;
}

// Função para fechar modal de vídeo
export function fecharModalVideo() {
  const modal = document.getElementById('modalVideo');
  const videoPlayer = document.getElementById('videoPlayer');
  const youtubePlayer = document.getElementById('youtubePlayer');

  if (modal) {
    modal.classList.remove('ativo');

    // Pausar vídeo local se estiver rodando
    if (videoPlayer && videoPlayer.style.display !== 'none') {
      videoPlayer.pause();
      videoPlayer.src = '';
    }

    // Limpar iframe do YouTube/Vimeo
    if (youtubePlayer && youtubePlayer.style.display !== 'none') {
      youtubePlayer.src = '';
    }

    document.body.style.overflow = 'auto';
  }
}

// Função para fechar modal do simulado
export function fecharModalSimulado() {
  const modal = document.getElementById('modalSimulado');
  if (modal) {
    modal.classList.remove('ativo');
    document.body.style.overflow = 'auto';

    // Resetar modal para próxima vez
    document.getElementById('questaoContainer').style.display = 'block';
    document.getElementById('resultadoContainer').style.display = 'none';
    document.querySelector('.progresso').style.display = 'flex';

    // Remover classe especial do footer
    const footer = document.querySelector('.simulado-footer');
    if (footer) {
      footer.classList.remove('resultado-ativo');
    }

    // Limpar classes de resultado do body
    const simuladoBody = document.querySelector('.simulado-body');
    if (simuladoBody) {
      simuladoBody.classList.remove('resultado-modo', 'resultado-compacto');
    }

    // Esconder botões de resultado
    const btnProximaArea = document.getElementById('btnProximaArea');
    const btnTenteNovamente = document.getElementById('btnTenteNovamente');

    if (btnProximaArea) {
      btnProximaArea.style.display = 'none';
    }
    if (btnTenteNovamente) {
      btnTenteNovamente.style.display = 'none';
    }
  }
}
