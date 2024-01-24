
const containerUsuarios = document.getElementById('usuarios')
const containerBotoes = document.getElementById('botoes')
let pagina = 1
let quantidadeDePaginas

//CONEXÃO DA API COM O FRONT
const instance = axios.create({
  baseURL: 'http://localhost:8080',
});

//CAPTURA FORM DE CRIAÇÃO DE USUÁRIOS
const capturaDados = document.getElementById("criar-usuario")
capturaDados.addEventListener('submit', async (evento) => {
  evento.preventDefault()

  const confirmarSenha = evento.target.confirmar_senha.value
  const nome = evento.target.nome.value
  const email = evento.target.email.value
  const senha = evento.target.senha.value

  senhasDiferentes.innerHTML = ""

  const dados = {
    nome,
    email,
    senha,
    confirmarSenha
  }
  await criarUsuario(dados)

})

//CRIAR USUARIO
async function criarUsuario(dados) {

  if (dados.senha != dados.confirmarSenha) {
    criarAlerta(`<span>Senhas não são iguais!</span>`)
  }

  if (!dados.nome || !dados.email || !dados.senha || !dados.confirmarSenha) {
    senhasDiferentes.innerHTML += `<p>Todos os campos devem ser preenchidos!</p>`
  }

  try {
    const resposta = await instance.post('/usuario', {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha
    })

    window.location.href = "http://127.0.0.1:5500/index.html"

    return true;

  } catch (error) {
    console.log(error);
    criarAlerta(`${error.response.data}`)
    return false
  }
}


//DAQUI PARA BAIXO VAI SER REFATORADO, COLOCADO DENTRO DE UM JS DE PAGINAÇÃO, ASSIM COMO O CARREGAMENTO
//DOS RECADOS VAI SER REFATORADO DENTRO DO ARQUIVO BUSCA_RECADOS.JS QUE VAI SER CRIADO
function aumentarPagina() {
  if (pagina !== quantidadeDePaginas) {
    pagina++
    carregarUsuarios()
  }
}

function diminuirPagina() {
  if (pagina > 1) {
    pagina--
    carregarUsuarios()
  }
}

function selecionarPagina(novaPagina) {
  pagina = novaPagina
  carregarUsuarios()
}

async function carregamentoInicialUsuarios() {
  await carregarUsuarios()

  for (let i = 0; i < quantidadeDePaginas; i++) {
    const botaoPaginaEl = document.createElement("button");
    botaoPaginaEl.innerHTML = i + 1
    botaoPaginaEl.addEventListener('click', () => { selecionarPagina(i + 1) })

  }
}

async function carregarUsuarios() {
  try {
    const response = await instance.get(`/usuarios?page=${pagina}`)
    const usuarios = response.data.usuarios
    console.log(response);
    quantidadeDePaginas = response.data.quantidadeDePaginas
    containerUsuarios.innerHTML = ''
    usuarios.forEach((usuario) => {
      // Crio uma div pra ser o meu recado
      const usuarioDivEl = document.createElement("div");

      // Crio um paragrafo com o nome do usuario e seu email
      const usuarioPEl = document.createElement("p");
      usuarioPEl.innerHTML = `${usuario.nome} | ${usuario.email}`

      usuarioDivEl.appendChild(usuarioPEl)

      containerUsuarios.appendChild(usuarioDivEl)
    })
  } catch (error) {
    console.log(error)
  }
}

carregamentoInicialUsuarios()

//CRIO UM ALERT
const containerFeedbck = document.getElementById('container-feedback')

function criarAlerta(mensagem, tipo) {
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="alert alert-${tipo} alert-danger alert-dismissible" role="alert">
       <div>${mensagem}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `;

  containerFeedbck.append(div)

}