const nomeNoBemVindo = document.getElementById("bem_vindo")
nomeNoBemVindo.setAttribute('style', 'color: #293140; font-size: 40px')
colocaNomeNoBemVindo()

const instance = axios.create({
    baseURL: 'http://localhost:8080',
});



async function colocaNomeNoBemVindo() {
   const pegaNome =  localStorage.getItem("nome")
   console.log(pegaNome);
   nomeNoBemVindo.innerHTML = pegaNome + "!"
}