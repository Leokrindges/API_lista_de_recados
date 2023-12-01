const containerlogin = document.getElementById('loginInvalido')
containerlogin.innerHTML = ""
containerlogin.setAttribute('style', 'color:red; padding-left: 80px; margin-top:8px; font-size: 20px;')


const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

async function login(event) {
    event.preventDefault()
    console.log(event);
    const email = event.srcElement.email.value
    const senha = event.srcElement.senha.value
    
    try {
        await instance.post(`/usuario/login`, {
            email,
            senha
        })
        window.location.href = "./home.html"

    } catch (error) {
        containerlogin.innerHTML = "Credenciais inválidas!!"
        console.log(error);
    }


}