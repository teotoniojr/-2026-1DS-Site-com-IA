document.addEventListener('DOMContentLoaded', () => {
    inicializarReacoes();
    inicializarFiltros();
    inicializarModal();
});

// 1. Sistema de Curtidas e "Amei" com salvamento no navegador (localStorage)
function inicializarReacoes() {
    const CHAVE_STORAGE = 'ciencia_em_foco_reacoes';
    const estadoSalvo = JSON.parse(localStorage.getItem(CHAVE_STORAGE)) || {};

    const botoesReacao = document.querySelectorAll('.botao-reacao');

    botoesReacao.forEach((botao) => {
        const containerNoticia = botao.closest('[data-id]');
        if (!containerNoticia) return;

        const idNoticia = containerNoticia.dataset.id;
        const tipoReacao = botao.dataset.tipo;
        const chaveUnica = `${idNoticia}_${tipoReacao}`;
        const contadorSpan = botao.querySelector('span');

        // Restaura estado salvo caso o usuário já tenha interagido antes
        if (estadoSalvo[chaveUnica]) {
            contadorSpan.textContent = estadoSalvo[chaveUnica].total;
            if (estadoSalvo[chaveUnica].ativo) {
                botao.classList.add('curtido');
            }
        }

        // Evento de clique para marcar ou desmarcar reação
        botao.addEventListener('click', () => {
            let totalAtual = parseInt(contadorSpan.textContent, 10) || 0;
            const jaAtivo = botao.classList.contains('curtido');

            if (jaAtivo) {
                totalAtual = Math.max(0, totalAtual - 1);
                botao.classList.remove('curtido');
            } else {
                totalAtual += 1;
                botao.classList.add('curtido');
            }

            contadorSpan.textContent = totalAtual;

            // Salva a atualização no localStorage
            estadoSalvo[chaveUnica] = {
                total: totalAtual,
                ativo: !jaAtivo
            };
            localStorage.setItem(CHAVE_STORAGE, JSON.stringify(estadoSalvo));
        });
    });
}

// 2. Busca por texto e filtro por categoria na página inicial
function inicializarFiltros() {
    const campoBusca = document.getElementById('campo-busca');
    const botoesFiltro = document.querySelectorAll('.btn-filtro');
    const cards = document.querySelectorAll('.noticias .card');
    const mensagemVazia = document.getElementById('mensagem-vazia');

    if (!campoBusca || cards.length === 0) return;

    let categoriaSelecionada = 'todas';

    function filtrarNoticias() {
        const termoBusca = campoBusca.value.toLowerCase().trim();
        let visiveis = 0;

        cards.forEach((card) => {
            const titulo = card.querySelector('h3').textContent.toLowerCase();
            const resumo = card.querySelector('p').textContent.toLowerCase();
            const categoriaCard = card.dataset.categoria;

            const correspondeTexto = titulo.includes(termoBusca) || resumo.includes(termoBusca);
            const correspondeCategoria = categoriaSelecionada === 'todas' || categoriaCard === categoriaSelecionada;

            if (correspondeTexto && correspondeCategoria) {
                card.style.display = 'flex';
                visiveis++;
            } else {
                card.style.display = 'none';
            }
        });

        if (mensagemVazia) {
            mensagemVazia.hidden = visiveis > 0;
        }
    }

    campoBusca.addEventListener('input', filtrarNoticias);

    botoesFiltro.forEach((botao) => {
        botao.addEventListener('click', () => {
            botoesFiltro.forEach((b) => b.classList.remove('ativo'));
            botao.classList.add('ativo');
            categoriaSelecionada = botao.dataset.categoria;
            filtrarNoticias();
        });
    });
}

// 3. Modal de leitura rápida para notícias secundárias
function inicializarModal() {
    const modal = document.getElementById('modal-noticia');
    const botoesAbrir = document.querySelectorAll('.btn-modal');
    const botaoFechar = document.getElementById('fechar-modal');

    if (!modal) return;

    botoesAbrir.forEach((botao) => {
        botao.addEventListener('click', () => {
            document.getElementById('modal-titulo').textContent = botao.dataset.titulo;
            document.getElementById('modal-categoria').textContent = botao.dataset.categoria;
            document.getElementById('modal-texto').textContent = botao.dataset.texto;
            modal.showModal();
        });
    });

    botaoFechar.addEventListener('click', () => modal.close());

    // Fecha o modal ao clicar fora da caixa de conteúdo
    modal.addEventListener('click', (evento) => {
        if (evento.target === modal) {
            modal.close();
        }
    });
}