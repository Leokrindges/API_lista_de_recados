
//pega bliblioteca do 'express' e importa a funcionalidade chamada express
import express, { request, response } from 'express';

//importação do bcrypt para criar senhas com caracteres aleatórios
//comando para instalar yarn add bcrypt
import bcrypt from "bcrypt";

//biblioteca para criar token e deixar o usuario logado mais tempo
import jwt from "jsonwebtoken";



//o express usado acima é para criar uma aplcação, criar um servidor no back-end
const app = express();

//app.user é para aceitar requisições com json
app.use(express.json());

let verifyJwt = function (req, res, next) {
    const body = req.body;
  
    jwt.verify(body.accessToken, "growdev", (err, user) => {
     
      if (err) {
        return res.status(403).json("Access token invalido");
      }
  
      req.user = user;
  
      next();
    });
  };


let geraIdUsuario = 1
const listaRecados = []
const usuarios = [
    {
        id: geraIdUsuario++,
        nome: "Leonardo Krindges",
        email: "leonardo@mail.com",
        senha: "$2a$06$oWaGUzjgm8wGpV8otyteyuuiLM3blA6ul2q.X3X6df33zLStZBwXK"
    },
    {
        id: geraIdUsuario++,
        nome: "Jéssica Stein",
        email: "jessica@mail.com",
        senha: "$2a$06$6aRs1GjmDyjTFUPzJWqx7OohIj74m4KNOhMoCE9LjLp6e/.BZgJOe"
    },
    {
        id: geraIdUsuario++,
        nome: "Silvania Souza",
        email: "Silvania@mail.com",
        senha: "$2a$06$fyo17xUNtk0eHJt4ehjdku6a7DQpn.HChRhQfneBHMdH9XbvW75ha"
    }

]
let geraIdRecado = 1


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
        return response.status(400).json("Titulo não informado!")
    }

    if (body.descricao == undefined) {
        return response.status(400).json("Descrição não informada!")
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
        return response.status(400).json("Recado não encontrado")
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
app.delete('/listaRecados/:id', verifyJwt, (request, response) => {
    const params = request.params

    const apagaIndiceListaRecados = listaRecados.findIndex((recado) => {
        console.log(recado);
        return recado.id === Number(params.id)
    })
    if (apagaIndiceListaRecados == -1) {
        return response.status(400).json("Recado não encontrado!")
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
//async usa porque estamos usando await que é para esperar ate o bcrypt gerar a senha
app.post('/usuario', async (request, response) => {
    const body = request.body

    if (body.nome == undefined) {
        return response.status(400).json("Nome não informado!")
    }

    if (body.email == undefined) {
        return response.status(400).json("E-mail não informado!")
    }

    if (body.senha == undefined) {
        return response.status(400).json("Senha não informada!")
    }

    const existeEmail = usuarios.find(usuario => {
        return usuario.email === body.email
    })

    if(existeEmail != undefined) {
        return response.json("E-mail já cadastrado!!")
    }

    //transforma a senha que vem no corpo da requisição em sequencia de caracteres
    //o numero 6 indica a quantidade de rounds
    const hashedSenha = await bcrypt.hash(body.senha, 6)

    const usuario = {
        id: geraIdUsuario++,
        nome: body.nome,
        email: body.email,
        senha: hashedSenha
    }
    usuarios.push(usuario)
    console.log(body);
    return response.json("Usuario cadastrado com sucesso!!")
})

app.post('/usuario/login', async (request, response) => {
    const body = request.body

    if (body.email == undefined) {
        return response.status(400).json("E-mail não informado!")
    }

    if (body.senha == undefined) {
        return response.status(400).json("Senha não informada!")
    }

    const existeEmail = usuarios.find(usuario => {
        return usuario.email === body.email
    })

    if (existeEmail === undefined) {
        return response.status(401).json("Credenciais invalidas!")
    }

    //compara se a senha passada pelo usuario e igual a senha cadastrada usando a funcao compare
    const hashedSenha = await bcrypt.compare(body.senha, existeEmail.senha)

    if (hashedSenha === false) {
        return response.status(401).json("Credenciais invalidas!")
    }

    const accessToken = jwt.sign({ username: existeEmail.nome },
        "growdev", {expiresIn: "1800s",}
    );
    //caso de tudo certo na validacão envia o token
    return response.status(201).json({accessToken,
    });
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
app.delete('/usuario/:id', verifyJwt, (request, response) => {
    const params = request.params

    const apagaIndiceUsuario = usuarios.findIndex((usuario) => {
        return usuario.id === Number(params.id)
    })

    if(apagaIndiceUsuario === -1) {
        return response.status(400).json("ID inválido")
    }

    delete usuarios[apagaIndiceUsuario]

    return response.json("Usuario apagado com sucesso!")
})

//listem quer dizer o que servidor vai estar ouvindo requisições, esperando, na porta 8080,
//e quando ele comecar a ouvir requisições ele vai dar uma mensagem de servidor iniciado
app.listen(8080, () => console.log("Servidor iniciado"));