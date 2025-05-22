// Seletores e variáveis globais
const btnEdit = document.querySelector("#editButton");
const cartaoCrud = document.querySelector("#cartaoCRUD");
const btnSubmit = document.getElementById('btnSubmit');
const btnDelete = document.querySelector("#btnDelete");
const btnUpdate = document.querySelector("#btnUpdate");
let noticiaID = ''; // ID tratado como string
let selectedNoticia = false;
const apiUrl = 'http://localhost:3000/noticias'; // URL base da API

// Alternar exibição do formulário CRUD
btnEdit.addEventListener("click", function () {
    cartaoCrud.classList.toggle("d-none");
});

// Função para criar uma nova notícia
btnSubmit.addEventListener('click', function (event) {
    event.preventDefault();

    const noticiaObject = getNoticiaObject();

    if (!noticiaObject) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    createNoticia(noticiaObject, listaNoticias);
});

// Função para atualizar uma notícia existente
btnUpdate.addEventListener('click', function (event) {
    event.preventDefault();

    if (!selectedNoticia) {
        alert("Nenhuma notícia selecionada para atualização.");
        return;
    }

    const noticiaObject = getNoticiaObject();

    if (!noticiaObject) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    updateNoticia(noticiaID, noticiaObject, listaNoticias);
});

// Função para excluir uma notícia
btnDelete.addEventListener("click", function () {
    if (!selectedNoticia) {
        alert("Nenhuma notícia selecionada para exclusão.");
        return;
    }

    deleteNoticia(noticiaID, listaNoticias);
    resetForm();
});

// Função para criar uma notícia
function createNoticia(noticiaObject, refreshFunction) {
    // Garante que o ID seja uma string
    noticiaObject.id = String(Date.now());

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(noticiaObject),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao inserir notícia");
            }
            return response.json();
        })
        .then(() => {
            alert("Notícia inserida com sucesso!");
            resetForm();
            if (refreshFunction) refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao inserir notícia:', error);
            alert("Erro ao inserir notícia");
        });
}

// Função para atualizar uma notícia
function updateNoticia(id, noticiaObject, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(noticiaObject),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao atualizar notícia");
            }
            return response.json();
        })
        .then(() => {
            alert("Notícia atualizada com sucesso!");
            resetForm();
            if (refreshFunction) refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao atualizar notícia:', error);
            alert("Erro ao atualizar notícia");
        });
}

// Função para excluir uma notícia
function deleteNoticia(id, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao excluir notícia");
            }
            alert("Notícia excluída com sucesso!");
            resetForm();
            if (refreshFunction) refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao excluir notícia:', error);
            alert("Erro ao excluir notícia");
        });
}

// Função para selecionar uma notícia e preencher o formulário
function selecionaNoticia(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar notícia");
            }
            return response.json();
        })
        .then(data => {
            if (!data) {
                alert("Notícia não encontrada.");
                return;
            }

            // Preenche os campos do formulário com os dados da notícia
            document.getElementById('tituloNoticia').value = data.titulo;
            document.getElementById('conteudoNoticia').value = data.conteudo;
            document.getElementById('autorNoticia').value = data.autor;
            document.getElementById('imagemNoticia').value = data.imagem;
            document.getElementById('fonteNoticia').value = data.fonte;

            noticiaID = String(id); // Garante que o ID seja uma string
            selectedNoticia = true;
        })
        .catch(error => {
            console.error('Erro ao buscar notícia:', error);
            alert("Erro ao buscar notícia");
        });
}

// Função para obter os dados do formulário como um objeto
function getNoticiaObject() {
    const tituloNoticia = document.getElementById('tituloNoticia').value.trim();
    const conteudoNoticia = document.getElementById('conteudoNoticia').value.trim();
    const autorNoticia = document.getElementById('autorNoticia').value.trim();
    const imagemNoticia = document.getElementById('imagemNoticia').value.trim();
    const fonteNoticia = document.getElementById('fonteNoticia').value.trim();
    const date = new Date();
    const tempoPostagem = `${Math.floor((Date.now() - date.getTime()) / (1000 * 60))} minutos atrás`;

    if (!tituloNoticia || !conteudoNoticia || !autorNoticia || !imagemNoticia || !fonteNoticia) {
        return null; // Retorna null se algum campo obrigatório estiver vazio
    }

    return {
        id: noticiaID, // Garante que o ID seja uma string
        titulo: tituloNoticia,
        conteudo: conteudoNoticia,
        autor: autorNoticia,
        data: date.toLocaleDateString('pt-BR'),
        imagem: imagemNoticia,
        tempo: tempoPostagem,
        fonte: fonteNoticia,
    };
}

// Função para resetar o formulário
function resetForm() {
    document.getElementById('tituloNoticia').value = '';
    document.getElementById('conteudoNoticia').value = '';
    document.getElementById('autorNoticia').value = '';
    document.getElementById('imagemNoticia').value = '';
    document.getElementById('fonteNoticia').value = '';
    noticiaID = '';
    selectedNoticia = false;
}

// Função para listar as notícias cadastradas
function listaNoticias() {
    const cardNoticias = document.getElementById('noticiasCadastradas');
    cardNoticias.innerHTML = ''; // Limpa o container antes de adicionar novas notícias

    fetch(apiUrl)
        .then(response => response.json())
        .then(noticias => {
            noticias.forEach(noticia => {
                cardNoticias.innerHTML += `
                    <div class="noticia-card card m-4 bg-light text-dark" data-id="${noticia.id}">
                        <h5 class="text-dark">${noticia.titulo}</h5>
                        <h6 class="text-dark">${noticia.fonte} - ${noticia.autor}</h6>
                        <p class="text-dark">${noticia.tempo}</p>
                        <p class="text-dark">${noticia.conteudo.substring(0, 100)}...</p>
                        <img src="${noticia.imagem}" alt="${noticia.titulo}" class="img-fluid">
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error('Erro ao carregar as notícias:', error);
            cardNoticias.innerHTML = '<p class="text-danger">Erro ao carregar as notícias.</p>';
        });
}

// Evento para selecionar notícias criadas dinamicamente
document.getElementById('noticiasCadastradas').addEventListener('click', function (event) {
    const target = event.target.closest('.noticia-card');
    if (target) {
        const noticiaId = target.dataset.id;
        if (noticiaId) {
            selecionaNoticia(noticiaId);
        }
    }
});