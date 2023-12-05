
const containerlogin = document.getElementById('loginInvalido')
containerlogin.innerHTML = ""
containerlogin.setAttribute('style', 'color:red; padding-left: 80px; margin-top:8px; font-size: 20px;')


const instance = axios.create({
    baseURL: 'http://localhost:8080',
});


async function login(event) {
    event.preventDefault()

    const email = event.srcElement.email.value
    const senha = event.srcElement.senha.value

    try {
        console.log(event);
        const resposta = await instance.post(`/usuario/login`, {
            email,
            senha
        })
        console.log(resposta);

        accessToken = resposta.data.dadosUsuarios.accessToken
        nome = resposta.data.dadosUsuarios.nome

       
        localStorage.setItem("access_token", accessToken)
        localStorage.setItem("nome", nome)

        window.location.href = "http://127.0.0.1:5500/home.html"

    } catch (error) {
        containerlogin.innerHTML = "Credenciais inválidas!!"
        console.log(error);
    }
}