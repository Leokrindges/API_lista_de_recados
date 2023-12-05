
colocaNomeNoBemVindo()

const containerRecados = document.getElementById("mostra_recados")

const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

carregarRecados()
//ADICONA NOME NO BEM VINDO
async function colocaNomeNoBemVindo() {
    const nomeNoBemVindo = document.getElementById("bem_vindo")
    nomeNoBemVindo.setAttribute('style', 'color: #1A4082; font-size: 40px')
    const nomeUsuario = localStorage.getItem("nome")
    nomeNoBemVindo.innerHTML = nomeUsuario + "!"
}

//ATUALIZA RECADO
async function atualizarRecado(id) {
    const accessToken = localStorage.getItem("access_token")

    try {
        const resposta = await instance.put(`/usuario/recados/${id}`, {
            accessToken,
            titulo: "Titulo atualizado",
            descricao: "descrição atualizada"
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        carregarRecados()
    } catch (error) {
        console.log(error);
    }
}

//APAGAR RECADOS
async function apagarRecado(id) {
    const accessToken = localStorage.getItem("access_token")

    try {
        const resposta = await instance.delete(`/usuario/recados/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        carregarRecados()
        console.log(resposta);

    } catch (error) {
        console.log(error);
    }

}

//CADASTRAR RECADO
async function cadastrarRecado(event) {
    event.preventDefault()
    const accessToken = localStorage.getItem("access_token")
    const titulo = event.srcElement.titulo.value
    const descricao = event.srcElement.descricao.value

    console.log(event);

    try {
        const resposta = await instance.post('/usuario/recados/', {
            accessToken,
            titulo,
            descricao
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        carregarRecados()
    } catch (error) {
        console.log(error)
        location.href = 'http://127.0.0.1:5500/index.html'
    }
}

//CAREGAR RECADOS
async function carregarRecados() {
    const accessToken = localStorage.getItem("access_token")
    try {
        const response = await instance.get(`/recados/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        console.log(response.data.recados);
        const mostraRecados = response.data.recados
        containerRecados.innerHTML = ''
        mostraRecados.forEach((recado) => {
            // Crio uma div pra ser o meu recado
            const recadoDivEl = document.createElement("div");
            recadoDivEl.setAttribute('style', 'margin-top: 20px; border-radius: 8px; width: 350px; border:3px solid #a6bce0; text-align: center; display: block;')

            // Crio um titulo com o titulo do recado e sua descricao
            const recadoHEl = document.createElement("h5")
            recadoHEl.setAttribute('style', 'font-size: 18px; font-weight: bold; color: #1A4082')
            recadoHEl.innerHTML = "Titulo | Descrição"
            // Crio um paragrafo com o nome do recado e sua descricao
            const recadoPEl = document.createElement("p");
            recadoPEl.innerHTML = `${recado.titulo} | ${recado.descricao}`

            // Crio um botão pra atualizar o recado
            const recadoAtualizarEl = document.createElement("button");
            recadoAtualizarEl.setAttribute('style', 'margin-right: 10px; margin-bottom: 10px;')
            recadoAtualizarEl.innerHTML = 'Atualizar'
            recadoAtualizarEl.classList.add('button')
            recadoAtualizarEl.addEventListener('click', () => { atualizarRecado(recado.id) })

            // Crio um botão pra apagar o recado
            const recadoApagarEl = document.createElement("button");
            recadoApagarEl.innerHTML = 'Apagar'
            recadoApagarEl.classList.add('button')
            recadoApagarEl.addEventListener('click', () => {
                apagarRecado(recado.id)
            })

            
            recadoDivEl.appendChild(recadoHEl) 
            recadoDivEl.appendChild(recadoPEl)
            recadoDivEl.appendChild(recadoAtualizarEl)
            recadoDivEl.appendChild(recadoApagarEl)

            containerRecados.appendChild(recadoDivEl)
        })
    } catch (error) {
        console.log(error)
        location.href = 'http://127.0.0.1:5500/index.html'
    }
}

