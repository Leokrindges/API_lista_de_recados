let pagina = 1
let quantidadeDePaginas
const containerRecados = document.getElementById("recados")
const containerBotoes = document.getElementById("botoes")

const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

function aumentarPagina() {
    if (pagina !== quantidadeDePaginas) {
        pagina++
        carregarRecados()
    }
}

function diminuirPagina() {
    if (pagina > 1) {
        pagina--
        carregarRecados()
    }
}

function selecionarPagina(novaPagina) {
    pagina = novaPagina
    carregarRecados()
}

async function carregamentoInicialRecados() {
    await carregarRecados()

    for (let i = 0; i < quantidadeDePaginas; i++) {
        const botaoPaginaEl = document.createElement("button");
        botaoPaginaEl.innerHTML = i + 1
        botaoPaginaEl.addEventListener('click', () => { selecionarPagina(i + 1) })

        containerBotoes.appendChild(botaoPaginaEl)
    }
}

async function carregarRecados() {
    const accessToken = localStorage.getItem("access_token")
    try {
        const resposta = await instance.get(`/recados/listagem?page=${pagina}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })

        const recados = resposta.data.recados
        quantidadeDePaginas = resposta.data.quantidadeDePaginas

        containerRecados.innerHTML = ""
        recados.forEach(recado => {
            //crio uma div para ser o meu recado
            const divRecadoEl = document.createElement("div")

            //crio um paragráfo com o titulo e a descrição do recado
            const recadoPel = document.createElement("p")
            recadoPel.innerHTML = `${recado.titulo} | ${recado.descricao}`

            divRecadoEl.appendChild(recadoPel)

            containerRecados.appendChild(divRecadoEl)

        });

        console.log(resposta);
    } catch (error) {
        console.log(error);
    }
}

carregamentoInicialRecados()