
const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

const capturaDados = document.getElementById("login")
capturaDados.addEventListener('submit', async (evento) => {
    evento.preventDefault()

    const email = evento.target.email.value
    const senha = evento.target.senha.value

    await login(email, senha)

})

async function login(email, senha) {
    try {
        const resposta = await instance.post(`/usuario/login`, {
            email,
            senha
        })

        accessToken = resposta.data.dadosUsuarios.accessToken
        nome = resposta.data.dadosUsuarios.nome

        localStorage.setItem("access_token", accessToken)
        localStorage.setItem("nome", nome)


        window.location.href = "http://127.0.0.1:5500/home.html"
        return true;

    } catch (error) {
        criarAlerta("Crendeciais inválidas!")
        console.log(error);
        return false;
    }
}

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
