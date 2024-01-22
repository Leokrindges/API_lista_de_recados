
const containerUsuarios = document.getElementById('usuarios')
const containerBotoes = document.getElementById('botoes')
const senhasDiferentes = document.getElementById("mensagem")
let pagina = 1
let quantidadeDePaginas

const instance = axios.create({
  baseURL: 'http://localhost:8080',
});


async function criarUsuario(event) {
  event.preventDefault()

  senhasDiferentes.innerHTML = ""
  console.log(event);

  const nome = event.srcElement.nome.value
  const email = event.srcElement.email.value
  const senha = event.srcElement.senha.value
  const confirmarSenha = event.srcElement.confirmar_senha.value

console.log(nome);
console.log(email);
console.log(senha);
console.log(confirmarSenha);

if(senha != confirmarSenha) {
  senhasDiferentes.innerHTML = `<span>Senhas não são iguais!</span>`
}

if(!nome || !email || !senha || !confirmarSenha) {
  senhasDiferentes.innerHTML += `<p>Todos os campos devem ser preenchidos!</p>`
}

try {
  const resposta = await instance.post('/usuario', {
    nome,
    email,
    senha,
    confirmarSenha
  })

  window.location.href = "http://127.0.0.1:5500/index.html"
  
} catch (error) {
  console.log(error);
}


}

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

    // containerBotoes.appendChild(botaoPaginaEl)
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
