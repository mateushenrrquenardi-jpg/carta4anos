/**
 * CARTA INTERATIVA — Mateus & Bruna
 * 4 Anos de Casamento
 * script.js
 *
 * Funcionalidades:
 * 1. Scroll suave ao clicar em "Começar"
 * 2. Parallax leve na capa
 * 3. Reveal suave de seções ao rolar
 * 4. Frases sequenciais no capítulo de desafios
 * 5. Animação da aliança (duas frases em sequência)
 * 6. Frases sequenciais no capítulo de escolha
 * 7. Mensagem final ao clicar em "Sim"
 */

/* ================================================
   UTILITÁRIOS
   ================================================ */

/**
 * Verifica se o usuário prefere movimento reduzido.
 * Caso sim, pulamos animações com timing.
 */
function prefereMovimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Executa callback após delay em ms.
 * Se o usuário preferir movimento reduzido, executa imediatamente.
 */
function delay(ms, callback) {
  if (prefereMovimentoReduzido()) {
    callback();
  } else {
    setTimeout(callback, ms);
  }
}


/* ================================================
   1. BOTÃO "COMEÇAR" — scroll suave até o Cap. 2
   ================================================ */
(function iniciarBotaoComecar() {
  const btn = document.getElementById('btn-comecar');
  if (!btn) return;

  btn.addEventListener('click', function () {
    const destino = document.getElementById('inicio');
    if (destino) {
      destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();


/* ================================================
   2. PARALLAX SUAVE NA CAPA
   Desloca levemente a imagem de fundo ao rolar
   ================================================ */
(function iniciarParallaxCapa() {
  const bg = document.querySelector('.capa__bg');
  if (!bg || prefereMovimentoReduzido()) return;

  let ticking = false;

  function atualizarParallax() {
    const scrollY = window.scrollY;
    // Limite de 50% da viewport para não ir longe demais
    const maxDeslocamento = window.innerHeight * 0.5;
    const deslocamento = Math.min(scrollY * 0.35, maxDeslocamento);
    bg.style.transform = 'translateY(' + deslocamento + 'px)';
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(atualizarParallax);
      ticking = true;
    }
  }, { passive: true });
})();


/* ================================================
   3. REVEAL DE SEÇÕES AO SCROLL (Intersection Observer)
   ================================================ */
(function iniciarReveal() {
  const elementos = document.querySelectorAll('.reveal');
  if (!elementos.length) return;

  // Se preferir movimento reduzido, mostra tudo imediatamente
  if (prefereMovimentoReduzido()) {
    elementos.forEach(function (el) { el.classList.add('visivel'); });
    return;
  }

  const opcoes = {
    root: null,
    // Gatilho quando 12% da seção fica visível
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        // Desconecta após revelar para melhor performance
        observer.unobserve(entrada.target);
        // Dispara lógica específica ao entrar na tela
        disparaLogicaSecao(entrada.target);
      }
    });
  }, opcoes);

  elementos.forEach(function (el) { observer.observe(el); });
})();


/* ================================================
   4. LÓGICA ESPECÍFICA POR SEÇÃO
   Chamada quando o elemento entra na viewport
   ================================================ */
function disparaLogicaSecao(elemento) {

  // Capítulo de desafios — frases sequenciais
  if (elemento.id === 'desafios' || elemento.contains(document.getElementById('frases-desafios'))) {
    iniciarFrasesDesafios();
  }

  // Capítulo aliança
  if (elemento.id === 'alianca' || elemento.classList.contains('capitulo--alianca')) {
    iniciarAlianca();
  }

  // Capítulo escolha
  if (elemento.id === 'escolha' || elemento.classList.contains('capitulo--escolha')) {
    iniciarFrasesEscolha();
  }
}


/* ================================================
   5. FRASES SEQUENCIAIS — CAPÍTULO DESAFIOS
   ================================================ */
var frasesDesafiosJaRodou = false;

function iniciarFrasesDesafios() {
  if (frasesDesafiosJaRodou) return;
  frasesDesafiosJaRodou = true;

  var frases = document.querySelectorAll('#frases-desafios .frase-seq');
  if (!frases.length) return;

  frases.forEach(function (frase) {
    var atraso = parseInt(frase.getAttribute('data-delay')) || 0;

    delay(atraso + 500, function () {
      frase.classList.add('apareceu');
    });
  });
}


/* ================================================
   6. ANIMAÇÃO ALIANÇA — duas frases em sequência
   ================================================ */
var aliancaJaRodou = false;

function iniciarAlianca() {
  if (aliancaJaRodou) return;
  aliancaJaRodou = true;

  var frase2 = document.getElementById('alianca-frase2');
  if (!frase2) return;

  // Segunda frase aparece 2.2s após entrar na tela
  delay(2200, function () {
    frase2.setAttribute('aria-hidden', 'false');
    frase2.classList.add('apareceu');
  });
}


/* ================================================
   7. FRASES SEQUENCIAIS — CAPÍTULO ESCOLHA
   + Pergunta e botão após todas as frases
   ================================================ */
var frasesEscolhaJaRodou = false;

function iniciarFrasesEscolha() {
  if (frasesEscolhaJaRodou) return;
  frasesEscolhaJaRodou = true;

  var frases = document.querySelectorAll('#frases-escolha .frase-escolha');
  var pergunta = document.getElementById('escolha-pergunta');
  if (!frases.length) return;

  // Encontra o maior delay para calcular quando mostrar a pergunta
  var maiorDelay = 0;

  frases.forEach(function (frase) {
    var atraso = parseInt(frase.getAttribute('data-delay')) || 0;
    if (atraso > maiorDelay) maiorDelay = atraso;

    delay(atraso + 600, function () {
      frase.classList.add('apareceu');
    });
  });

  // Pergunta aparece após todas as frases
  if (pergunta) {
    delay(maiorDelay + 1600, function () {
      pergunta.classList.add('apareceu');
    });
  }
}


/* ================================================
   8. OBSERVER EXTRA — para seções que não pegam
   pelo .reveal (alianca, etc.)
   ================================================ */
(function observarSecoesEspeciais() {
  var secoes = [
    document.getElementById('desafios'),
    document.querySelector('.capitulo--alianca'),
    document.getElementById('escolha')
  ];

  secoes.forEach(function (secao) {
    if (!secao) return;

    // Marca como 'reveal' se ainda não for, para consistência
    if (!secao.classList.contains('reveal')) return;

    // A lógica já é disparada via disparaLogicaSecao no observer principal
    // Este bloco é um fallback de segurança
  });
})();


/* ================================================
   9. MENSAGEM FINAL — botão "Sim"
   ================================================ */
(function iniciarBotaoSim() {
  var btnSim = document.getElementById('btn-sim');
  var mensagem = document.getElementById('mensagem-final');
  var btnContinuar = document.getElementById('btn-continuar');
  var secaoFinal = document.getElementById('final');

  if (!btnSim || !mensagem) return;

  // Abre o overlay
  btnSim.addEventListener('click', function () {
    mensagem.classList.add('ativa');
    mensagem.setAttribute('aria-hidden', 'false');
    // Bloqueia scroll do body enquanto overlay está aberto
    document.body.style.overflow = 'hidden';
    // Foco para acessibilidade
    if (btnContinuar) {
      delay(400, function () { btnContinuar.focus(); });
    }
  });

  // Fecha o overlay e rola para o final
  if (btnContinuar) {
    btnContinuar.addEventListener('click', function () {
      mensagem.classList.remove('ativa');
      document.body.style.overflow = '';

      delay(500, function () {
        mensagem.setAttribute('aria-hidden', 'true');
        if (secaoFinal) {
          secaoFinal.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Fecha também ao pressionar Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mensagem.classList.contains('ativa')) {
      mensagem.classList.remove('ativa');
      document.body.style.overflow = '';
      delay(500, function () {
        mensagem.setAttribute('aria-hidden', 'true');
        btnSim.focus();
      });
    }
  });
})();


/* ================================================
   10. OBSERVER EXPLÍCITO PARA ALIANÇA E DESAFIOS
   Garante disparo mesmo sem '.reveal' bem posicionado
   ================================================ */
(function observarSecoesDiretas() {
  if (prefereMovimentoReduzido()) {
    // Dispara tudo imediatamente
    iniciarFrasesDesafios();
    iniciarAlianca();
    iniciarFrasesEscolha();
    return;
  }

  var mapa = [
    { seletor: '.capitulo--desafios', callback: iniciarFrasesDesafios },
    { seletor: '.capitulo--alianca',  callback: iniciarAlianca },
    { seletor: '.capitulo--escolha',  callback: iniciarFrasesEscolha }
  ];

  mapa.forEach(function (item) {
    var el = document.querySelector(item.seletor);
    if (!el) return;

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          item.callback();
          obs.disconnect();
        }
      });
    }, { threshold: 0.15 });

    obs.observe(el);
  });
})();


/* ================================================
   11. INDICADOR DE SCROLL DA CAPA
   Desaparece ao rolar
   ================================================ */
(function esconderSetaScroll() {
  var seta = document.querySelector('.capa__scroll');
  if (!seta) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 80) {
      seta.style.opacity = '0';
    } else {
      seta.style.opacity = '1';
    }
  }, { passive: true });
})();
