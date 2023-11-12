
//pega bliblioteca do 'express' e importa a funcionalidade chamada express
import express, { request, response } from 'express';

//o express usado acima é para criar uma aplcação, criar um servidor no back-end
const app = express();

//app.user é para aceitar requisições com json
app.use(express.json());

const listaRecados = []
const usuarios = []
let geraIdRecado = 1
let geraIdUsuario = 1

//configuro a rota; '/' é a mesma coisa que http://api.com, é como se fosse a toda principal da api
//request contem informações da requisição que o front-end faz pro back-end
//response contem informações da resposta que o back-end faz pro front-end 
app.get('/', (request, response) => {
    return response.json('OK');
});

//EXIBE LISTA DE RECADOS
app.get('/listaRecados', (request, response) => {
    return response.json(listaRecados)
})

//CRIA LISTA DE RECADOS
app.post('/listaRecados', (request, response) => {
    const body = request.body

    const recado = {
        id: geraIdRecado++,
        titulo: body.titulo,
        descricao: body.descricao
    }
    if (body.titulo == undefined) {
        return response.json("Digite um titulo!")
    }

    if (body.descricao == undefined) {
        return response.json("Digite uma descrição!")
    }

   
    listaRecados.push(recado)
    console.log(body);
    return response.json("Recado cadastrado com sucesso!!")
})

//ATUALIZA LISTA DE RECADOS
app.put('/listaRecados/:id', (request, response) => {
    const body = request.body
    const params = request.params

    const alteraIndiceListaRecados = listaRecados.findIndex((recado) => {
        return recado.id === Number(params.id)
    })

    if (alteraIndiceListaRecados === -1) {
        return response.json("Recado não encontrado")
    } else {
        for (let i = 0; i < listaRecados.length; i++) {
            if (listaRecados[i].id == Number(params.id)) {
                listaRecados[i].titulo = body.titulo
                listaRecados[i].descricao = body.descricao

                return response.json("Alterado com sucesso!!")
            }
        }
    }

})

//DELETA RECADO
app.delete('/listaRecados/:id', (request, response) => {
    const params = request.params

    const apagaIndiceListaRecados = listaRecados.findIndex((recado) => {
        console.log(recado);
        return recado.id === Number(params.id)
    })
    if (apagaIndiceListaRecados == -1) {
        return response.json("Recado não encontrado!")
    }

    console.log(apagaIndiceListaRecados);

    delete listaRecados[apagaIndiceListaRecados]

    return response.json("Recado apagado com sucesso!")
})


//BUSCA USUARIOS
app.get('/usuario:nome?', (request, response) => {
    const queryParams = request.query
    if (queryParams.nome != undefined) {
        const nomeDosUsuarios = usuarios.filter((usuario) => {
            return usuario.nome == queryParams.nome
        })
        return response.json(nomeDosUsuarios)
    } else {
        return response.json(usuarios);
    }
})


//CRIA USUARIO
app.post('/usuario', (request, response) => {
    const body = request.body

    // const existeEmail = usuarios.find(usuario => {
    //     return usuario.email === body.email
    // })

    // if(existeEmail) {
    //     return response.json("E-mail já cadastrado!!")
    // }

    if (body.nome == undefined) {
        return response.json("Digite um nome!")
    }

    if (body.email == undefined) {
        return response.json("Digite um email!")
    }

    if (body.senha == undefined) {
        return response.json("Digite uma senha")
    }

    const usuario = {
        id: geraIdUsuario++,
        nome: body.nome,
        email: body.email,
        senha: body.senha
    }
    usuarios.push(usuario)
    console.log(body);
    return response.json("Usuario cadastrado com sucesso!!")
})


//ATUALIZA USUARIO
app.put('/usuario/:id', (request, response) => {
    const params = request.params
    const body = request.body

    const alteraIndiceUsuario = usuarios.findIndex((usuario) => {
        return usuario.id === Number(params.id)
    })

    if (alteraIndiceUsuario === -1) {
        return response.json("Usuario não encontrado")
    }

    const usuario = {
        nome: body.nome,
        email: body.email,
        senha: body.senha
    }

    usuarios[alteraIndiceUsuario] = usuario

    return response.json("Usuario atualizado com sucesso!")

})


//DELETA USUARIO
app.delete('/usuario/:id', (request, response) => {
    const params = request.params

    const apagaIndiceUsuario = usuarios.findIndex((usuario) => {
        return usuario.id === Number(params.id)
    })


    delete usuarios[apagaIndiceUsuario]

    return response.json("Usuario apagado com sucesso!")
})

//listem quer dizer o que servidor vai estar ouvindo requisições, esperando, na porta 8080,
//e quando ele comecar a ouvir requisições ele vai dar uma mensagem de servidor iniciado
app.listen(8080, () => console.log("Servidor iniciado"));