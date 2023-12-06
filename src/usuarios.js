const containerUsuarios = document.getElementById('usuarios')
const containerBotoes = document.getElementById('botoes')
let pagina = 1
let quantidadeDePaginas

const instance = axios.create({
  baseURL: 'http://localhost:8080',
});

// axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;

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

    containerBotoes.appendChild(botaoPaginaEl)
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
    // location.href = 'http://127.0.0.1:5500/login.html'
  }
}

carregamentoInicialUsuarios()
