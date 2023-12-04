const token = JSON.parse(localStorage.getItem("dados_login"))

//checaLogin()
colocaNomeNoBemVindo()
const containerRecados = document.getElementById("mostra_recados")

const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

const pegaDadosLogin = JSON.parse(localStorage.getItem("dados_login"))

function checaLogin() {
    console.log(token.accessToken);
    if (!token) {
        window.location.href = "./index.html"
    } else {
        window.location.href = "./home.html"
    }
}

//ADICONA NOME NO BEM VINDO
async function colocaNomeNoBemVindo() {
    const nomeNoBemVindo = document.getElementById("bem_vindo")
    nomeNoBemVindo.setAttribute('style', 'color: #1A4082; font-size: 40px')
    const dadosLogin = JSON.parse(localStorage.getItem("dados_login"))
    nomeNoBemVindo.innerHTML = dadosLogin.nome + "!"
}



//CADASTRAR RECADO
async function cadastrarRecado(event) {
    event.preventDefault()

    console.log(event);

    const titulo = event.srcElement.titulo.value
    const descricao = event.srcElement.descricao.value
    const accessToken = pegaDadosLogin.accessToken
    console.log(accessToken);

    try {
        const resposta = await instance.post('/usuario/recados/', {
            accessToken,
            titulo,
            descricao
        })
        //mostrarRecados()
    } catch (error) {
        console.log(error)
    }
}

// async function mostrarRecados() {

//     const id = pegaDadosLogin.id
//     try {
//         const resposta = await instance.get(`/usuario/${id}/recados/`)
//         console.log("resposta: " + resposta);
//         const mostraRecados = resposta.data.recados
//         console.log("REcado" + mostraRecados);
//         containerRecados.innerHTML = ""

//         mostraRecados.forEach(recado => {
//             const divRecadoEl = document.createElement("div")
//             const pRecadoEl = document.createElement("p")
//             pRecadoEl.innerHTML = `${recado.titulo} | ${recado.descricao}`
//         });
//     }


//     catch (error) {
//         console.log(error);
//     }
// }
