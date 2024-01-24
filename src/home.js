
// colocaNomeNoBemVindo()

const containerRecados = document.getElementById("mostra_recados")

//CONEXÃO DA API COM O FRONT
const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

carregarRecados()

//ADICONA NOME NO BEM VINDO
// async function colocaNomeNoBemVindo() {
//     const nomeNoBemVindo = document.getElementById("bem_vindo")
//     nomeNoBemVindo.setAttribute('style', 'color: #1A4082; font-size: 40px')
//     const nomeUsuario = localStorage.getItem("nome")
//     nomeNoBemVindo.innerHTML = nomeUsuario + "!"
// }

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

//CAPTURO OS DADOS DO FORM DE CADASTRO DE RECADOS
const capturaDados = document.getElementById("formCadastroRecados")
capturaDados.addEventListener('submit', async (evento) => {
    evento.preventDefault()

    const titulo = evento.target.titulo.value
    const descricao = evento.target.descricao.value

    const dados = {
        titulo: titulo,
        descricao: descricao
    }

    await cadastrarRecado(dados)

    //reseta o form
    if (cadastrarRecado) {
        evento.target.reset()
        criarAlerta("Recado cadastrado com sucesso!!")

    }
})

//CADASTRAR RECADO
async function cadastrarRecado(dados) {
    const accessToken = localStorage.getItem("access_token")

    try {

        if (!dados.titulo || !dados.descricao) {
            criarAlerta(`<p>Todos os campos devem ser preenchidos!</p>`)
        }

        const resposta = await instance.post('/usuario/recados/', {
            accessToken,
            titulo: dados.titulo,
            descricao: dados.descricao
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })

        carregarRecados()
        return true
    } catch (error) {
        console.log(error.response)
        return false
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
            //crio uma col
            const divCol = document.createElement("div")
            divCol.classList.add("col-12", "col-sm-6", "col-xl-4", "d-flex", "justify-content-center")

            // Crio uma div para o card
            const divCard = document.createElement("div");
            divCard.classList.add("card", "mt-4")
            divCard.setAttribute('style', 'width: 18rem;')

            const divCardBody = document.createElement("div")
            divCardBody.classList.add("card-body")


            // Crio um titulo com o titulo do recado no card
            const recadoHEl = document.createElement("h5")
            recadoHEl.classList.add("card-title")
            recadoHEl.innerHTML = `${recado.titulo}`

            // Crio um paragrafo com descricao
            const recadoPEl = document.createElement("p");
            recadoPEl.classList.add("card-text")
            recadoPEl.innerHTML = `${recado.descricao}`

            //crio uma nova linha para os meus botões
            const divRow = document.createElement("div")
            divRow.classList.add("row",)

            //crio uma nova coluna para os botões
            const divCol1 = document.createElement("div")
            divCol1.classList.add("col")

            //crio uma ancora para atualizar o recado
            const recadoAtualizarEl = document.createElement("a");
            recadoAtualizarEl.innerHTML = 'Atualizar'
            recadoAtualizarEl.classList.add('btn', "btn-primary")
            recadoAtualizarEl.addEventListener('click', () => { atualizarRecado(recado.id) })

            //crio outra coluna para o botão apagar
            const divCol2 = document.createElement("div")
            divCol2.classList.add("col")

            // Crio uma ancora pra apagar o recado
            const recadoApagarEl = document.createElement("a");
            recadoApagarEl.innerHTML = 'Apagar'
            recadoApagarEl.classList.add('btn', "btn-secondary")
            recadoApagarEl.addEventListener('click', () => {
                apagarRecado(recado.id)
            })

            divCardBody.appendChild(recadoHEl)
            divCardBody.appendChild(recadoPEl)
            divCol1.appendChild(recadoAtualizarEl)
            divCol2.appendChild(recadoApagarEl)
            divRow.appendChild(divCol1)
            divRow.appendChild(divCol2)
            divCardBody.appendChild(divRow)
            divCard.appendChild(divCardBody)
            divCol.appendChild(divCard)



            containerRecados.appendChild(divCol)
        })
    } catch (error) {
        console.log(error)
    }
}


//CRIO UM ALERT
const containerFeedbck = document.getElementById('container-feedback')

function criarAlerta(mensagem, tipo) {
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="alert alert-${tipo} alert-success alert-dismissible" role="alert">
       <div>${mensagem}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `;

    containerFeedbck.append(div)

}
