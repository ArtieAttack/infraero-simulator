// =============================================
// LÓGICA DO SIMULADO
// =============================================

import { questoesSimulado, trilhasData } from './data.js';
import { desbloquearProximaArea, finalizarSimulador, fecharElementosAreaConcluida, marcarComoVisitado, verificarTodasTrilhasCompletas } from './areas.js';
import { fecharModalVideo, fecharModalSimulado, abrirModalVideo } from './modal.js';

// Função para iniciar o simulado
export function iniciarSimulado(trilhaId) {
  // Debug: mostrar estado atual das trilhas
  console.log('=== INICIANDO SIMULADO ===');
  console.log('Trilha atual:', trilhaId);
  console.log('Tipo da trilha:', typeof trilhaId);
  console.log('Dados da trilha:', trilhasData[trilhaId]);
  const visitadas = JSON.parse(localStorage.getItem('areasVisitadas')) || [];
  console.log('Trilhas já visitadas:', visitadas);
  console.log('=========================');

  // Verificar se a trilha existe
  if (!trilhasData[trilhaId]) {
    console.error('Trilha não encontrada:', trilhaId);
    return;
  }

  // Verificar se as questões existem
  if (!questoesSimulado[trilhaId]) {
    console.error('Questões não encontradas para trilha:', trilhaId);
    return;
  }

  // Fechar o modal de vídeo
  fecharModalVideo();

  // Configurar simulado
  const questoesData = questoesSimulado[trilhaId];
  const trilha = trilhasData[trilhaId];
  let questaoAtual = 0;
  let respostas = [];

  // Configurar modal
  const modalSimulado = document.getElementById('modalSimulado');
  modalSimulado.className = `modal-simulado ativo ${trilha.classe}`;
  // Armazenar trilha ID no modal para uso posterior
  modalSimulado.dataset.trilhaAtual = trilhaId;

  document.getElementById('simuladoTitulo').textContent = questoesData.titulo;
  document.getElementById('totalQuestoes').textContent = questoesData.questoes.length;

  // Esconder botões de resultado inicialmente
  document.getElementById('btnProximaArea').style.display = 'none';
  document.getElementById('btnFecharSimulado').style.display = 'none';

  // Configurar botão de fechar no header
  const btnFecharHeader = document.getElementById('btnFecharSimuladoHeader');
  if (btnFecharHeader) {
    btnFecharHeader.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      fecharModalSimulado();
    });
  }

  function mostrarQuestao(index) {
    const questao = questoesData.questoes[index];
    document.getElementById('questaoAtual').textContent = index + 1;
    document.getElementById('numeroQuestao').textContent = index + 1;
    document.getElementById('perguntaTexto').textContent = questao.pergunta;

    const container = document.getElementById('opcoesContainer');
    container.innerHTML = '';

    questao.opcoes.forEach((opcao, i) => {
      const div = document.createElement('div');
      div.className = 'opcao';
      div.innerHTML = `<input type="radio" name="questao" value="${i}" id="opcao${i}"><label for="opcao${i}" class="opcao-texto">${opcao}</label>`;

      const radioInput = div.querySelector('input[type="radio"]');

      // Event listener simplificado - apenas no div da opção
      div.addEventListener('click', (e) => {
        // Se clicou diretamente no radio button, deixar o comportamento nativo
        if (e.target === radioInput) {
          respostas[index] = i;
          return;
        }

        // Para cliques em qualquer outro lugar da div (label, texto, etc.)
        e.preventDefault();
        e.stopPropagation();

        // Desmarcar todas as outras opções primeiro
        const todasOpcoes = container.querySelectorAll('input[type="radio"]');
        todasOpcoes.forEach(radio => radio.checked = false);

        // Marcar a opção clicada
        radioInput.checked = true;
        respostas[index] = i;
      });

      // Event listener no radio button para garantir que funciona
      radioInput.addEventListener('change', (e) => {
        if (e.target.checked) {
          respostas[index] = i;
        }
      });

      container.appendChild(div);
    });

    // Restaurar resposta se existir
    if (respostas[index] !== undefined) {
      document.getElementById(`opcao${respostas[index]}`).checked = true;
    }

    // Configurar botões
    const btnAnterior = document.getElementById('btnAnterior');
    const btnProximo = document.getElementById('btnProximo');
    const btnFinalizar = document.getElementById('btnFinalizar');

    // Configurar botão Anterior
    btnAnterior.disabled = index === 0;
    btnAnterior.style.display = 'inline-block';

    // Configurar botões Próximo/Finalizar
    const isUltima = index === questoesData.questoes.length - 1;

    if (isUltima) {
      btnProximo.style.display = 'none';
      btnFinalizar.style.display = 'inline-block';
    } else {
      btnProximo.style.display = 'inline-block';
      btnFinalizar.style.display = 'none';
    }

    // Garantir que botões de resultado estão escondidos durante as questões
    document.getElementById('btnProximaArea').style.display = 'none';
    document.getElementById('btnFecharSimulado').style.display = 'none';
  }

  // Event listeners
  document.getElementById('btnAnterior').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (questaoAtual > 0) {
      questaoAtual--;
      mostrarQuestao(questaoAtual);
    }
  });

  document.getElementById('btnProximo').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (questaoAtual < questoesData.questoes.length - 1) {
      questaoAtual++;
      mostrarQuestao(questaoAtual);
    }
  });

  document.getElementById('btnFinalizar').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    let pontos = 0;
    questoesData.questoes.forEach((questao, i) => {
      if (respostas[i] === questao.correta) pontos++;
    });

    const percentual = Math.round((pontos / questoesData.questoes.length) * 100);

    // Mostrar tela de resultado
    mostrarResultado(questoesData, respostas, pontos, percentual);
  });

  // Mostrar modal
  mostrarQuestao(0);
  document.getElementById('modalSimulado').classList.add('ativo');
  document.body.style.overflow = 'hidden';
}

// Função para mostrar resultado do simulado
function mostrarResultado(questoesData, respostas, pontos, percentual) {
  // Esconder questão e mostrar resultado
  document.getElementById('questaoContainer').style.display = 'none';
  document.getElementById('resultadoContainer').style.display = 'block';

  // Manter título original da trilha (não mudar para "Resultado do Simulado")
  document.querySelector('.progresso').style.display = 'none';

  // Aplicar classe para reduzir padding do body
  const simuladoBody = document.querySelector('.simulado-body');
  if (simuladoBody) {
    simuladoBody.classList.add('resultado-compacto');
  }

  // Calcular estatísticas
  const total = questoesData.questoes.length;
  const erradas = total - pontos;
  const isAprovado = percentual >= 60;

  // Criar resultado com layout de caixas coloridas
  const pontuacaoEl = document.getElementById('pontuacaoFinal');
  pontuacaoEl.innerHTML = `
    <div class="resultado-elegante">
      <div class="percentual-destaque">
        Você acertou ${percentual}% do simulado!
      </div>
      
      <div class="caixas-stats">
        <div class="caixa-stat acertos">
          <div class="stat-numero">${pontos}</div>
          <div class="stat-label">Acertos</div>
        </div>
        <div class="caixa-stat erros">
          <div class="stat-numero">${erradas}</div>
          <div class="stat-label">Erros</div>
        </div>
        <div class="caixa-stat respondidos">
          <div class="stat-numero">${total}</div>
          <div class="stat-label">Respondidos</div>
        </div>
      </div>
      
      <div class="mensagem-final">
        ${isAprovado
      ? 'Parabéns! Você demonstrou bom conhecimento.'
      : 'Revise o conteúdo e tente novamente.'}
      </div>
    </div>
  `;

  // Esconder todos os botões de navegação
  document.getElementById('btnAnterior').style.display = 'none';
  document.getElementById('btnProximo').style.display = 'none';
  document.getElementById('btnFinalizar').style.display = 'none';

  // Aplicar classe especial ao footer para centralizar
  const footer = document.querySelector('.simulado-footer');
  if (footer) {
    footer.classList.add('resultado-ativo');
  }

  // Lógica condicional baseada na aprovação
  const btnProximaArea = document.getElementById('btnProximaArea');
  const btnTenteNovamente = document.getElementById('btnTenteNovamente');

  if (isAprovado) {
    // Usuário passou (≥60%) - mostrar botão "Próxima Área" ou "Finalizar Simulados"

    // Verificar se é a última trilha e se todas as trilhas foram completadas
    const modalSimulado = document.getElementById('modalSimulado');
    const trilhaAtual = modalSimulado.dataset.trilhaAtual;

    // Verificar se todas as trilhas foram completadas (considerando a atual)
    const visitadas = JSON.parse(localStorage.getItem('areasVisitadas')) || [];
    const trilhaAtualNum = parseInt(trilhaAtual);
    const visitadasIncluindoAtual = [...visitadas, trilhaAtualNum];
    const todasCompletas = [1, 2, 3, 4, 5].every(num => visitadasIncluindoAtual.includes(num));

    if (trilhaAtual === '5' && todasCompletas) {
      btnProximaArea.textContent = 'Finalizar Simulados';
    } else {
      btnProximaArea.textContent = 'Próxima Área';
    }

    btnProximaArea.style.display = 'inline-block';

    // Remover listeners anteriores e adicionar novo
    btnProximaArea.replaceWith(btnProximaArea.cloneNode(true));
    const novoBtnProximaArea = document.getElementById('btnProximaArea');
    novoBtnProximaArea.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Pegar a trilha atual do dataset do modal
      const modalSimulado = document.getElementById('modalSimulado');
      const trilhaAtual = modalSimulado.dataset.trilhaAtual;

      // Marcar a trilha atual como visitada/concluída
      marcarComoVisitado(parseInt(trilhaAtual));
      console.log(`Trilha ${trilhaAtual} marcada como concluída`);

      // Fechar todos os elementos da área antes de prosseguir
      fecharElementosAreaConcluida();

      // Verificar se é a última trilha (outros) E se todas as trilhas foram completadas
      if (trilhaAtual === '5') {
        console.log('Última trilha (Outras Áreas) concluída! Verificando se todas as trilhas foram completadas...');

        // Verificar se todas as trilhas foram realmente completadas
        const todasCompletas = verificarTodasTrilhasCompletas();

        if (todasCompletas) {
          console.log('Todas as trilhas foram completadas! Finalizando simulador...');
          desbloquearProximaArea();

          // Aguardar um pouco para permitir a atualização das áreas desbloqueadas
          setTimeout(() => {
            finalizarSimulador();
          }, 1000);
        } else {
          console.log('Nem todas as trilhas foram completadas ainda. Continuando simulador...');
          // Comportamento normal - desbloquear próxima área (se houver)
          desbloquearProximaArea();
        }
      } else {
        // Comportamento normal para outras áreas
        console.log(`Trilha ${trilhaAtual} concluída! Desbloqueando próxima área...`);
        desbloquearProximaArea();
      }
    });

    // Esconder botão "Tente Novamente"
    if (btnTenteNovamente) {
      btnTenteNovamente.style.display = 'none';
    }
  } else {
    // Usuário não passou (<60%) - mostrar botão "Tente Novamente"
    btnProximaArea.style.display = 'none';

    if (btnTenteNovamente) {
      btnTenteNovamente.style.display = 'inline-block';

      // Remover listeners anteriores e adicionar novo
      btnTenteNovamente.replaceWith(btnTenteNovamente.cloneNode(true));
      const novoBtnTenteNovamente = document.getElementById('btnTenteNovamente');
      novoBtnTenteNovamente.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Fechar simulado e abrir modal de vídeo para revisar
        fecharModalSimulado();
        // Pegar a trilha atual do dataset do modal
        const modalSimulado = document.getElementById('modalSimulado');
        const trilhaAtual = modalSimulado.dataset.trilhaAtual;
        if (trilhaAtual) {
          setTimeout(() => {
            abrirModalVideo(trilhaAtual);
          }, 300);
        }
      });
    }
  }

  // Esconder o botão "Fechar Simulado" do footer (só usar o X do header)
  const btnFecharSimulado = document.getElementById('btnFecharSimulado');
  if (btnFecharSimulado) {
    btnFecharSimulado.style.display = 'none';
  }
}

// Função de debug para testar trilha 5
window.testarTrilha5 = () => {
  console.log('=== TESTANDO TRILHA 5 ===');
  console.log('Dados da trilha 5:', trilhasData[5]);
  console.log('Questões da trilha 5:', questoesSimulado[5]);
  console.log('Vídeo da trilha 5:', trilhasData[5]?.video);
  console.log('URL do vídeo:', trilhasData[5]?.video?.url);
  console.log('========================');

  // Tentar iniciar simulado diretamente
  console.log('Tentando iniciar simulado da trilha 5...');
  if (window.iniciarSimulado) {
    window.iniciarSimulado(5);
  } else {
    console.error('Função iniciarSimulado não encontrada');
  }
};
