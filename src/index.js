import { randomUUID } from 'node:crypto';

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

const usuarios = [
    {
        id: randomUUID(),
        nome: "Leonardo Krindges",
        email: "leonardo@mail.com",
        senha: "$2a$06$oWaGUzjgm8wGpV8otyteyuuiLM3blA6ul2q.X3X6df33zLStZBwXK",
        recados: [
            {
                id: randomUUID(),
                titulo: "Passeio bob",
                descricao: "Levar no parque"
            }
        ]
    },
    {
        id: randomUUID(),
        nome: "Jéssica Stein",
        email: "jessica@mail.com",
        senha: "$2a$06$6aRs1GjmDyjTFUPzJWqx7OohIj74m4KNOhMoCE9LjLp6e/.BZgJOe",
        recados: [
            {
                id: randomUUID(),
                titulo: "Tomar remedio",
                descricao: "Tomar as 12h"
            }
        ]
    },
    {
        id: randomUUID(),
        nome: "Silvania Souza",
        email: "Silvania@mail.com",
        senha: "$2a$06$fyo17xUNtk0eHJt4ehjdku6a7DQpn.HChRhQfneBHMdH9XbvW75ha",
        recados: [
            {
                id: randomUUID(),
                titulo: "Mercado",
                descricao: "Comprar pão"
            }
        ]
    }

]

//configuro a rota; '/' é a mesma coisa que http://api.com, é como se fosse a toda principal da api
//request contem informações da requisição que o front-end faz pro back-end
//response contem informações da resposta que o back-end faz pro front-end 
app.get('/', (request, response) => {
    return response.json('OK');
});

//EXIBE USUARIOS E SEUS RECADOS
app.get('/usuario', (request, response) => {
    return response.json(usuarios)
})

//BUSCA USUARIOS E SEUS RECADOS PELO ID
app.get('/usuario/recados/:id', (request, response) => {
    const params = request.params


    const pegaUsuariosPeloIndice = usuarios.findIndex((usuario) => {
        return usuario.id == params.id
    })

    if(pegaUsuariosPeloIndice === -1) {
        return response.status(400).json("Usuario não encontrado")
    }
    
    return response.json(usuarios[pegaUsuariosPeloIndice]);

})


//CRIAR RECADO
app.post('/usuario/recado/:id', (request, response) => {
    const body = request.body
    const params = request.params.id

    const pegaIndice = usuarios.findIndex(usuario => {
        return params === usuario.id
    })

    if (pegaIndice == -1) {
        return response.status(400).json("Usuario não encontrado")
    }

    if (body.titulo == undefined) {
        return response.status(400).json("Titulo não informado!")
    }

    if (body.descricao == undefined) {
        return response.status(400).json("Descrição não informada!")
    }

    const recado = {
        idRecado: randomUUID(),
        titulo: body.titulo,
        descricao: body.descricao
    }

    usuarios[pegaIndice].recados.push(recado)

    return response.status(201).json("Recado criado com sucesso")
})

//ATUALIZA RECADOS
app.put('/usuario/recado/:idUsuario/:idRecado', (request, response) => {
    const body = request.body
    const idUsuario = request.params.idUsuario
    const idRecado = request.params.idRecado

    const pegaIndiceUsuario = usuarios.findIndex(usuario => {
        return usuario.id == idUsuario
    })
    console.log(pegaIndiceUsuario);
    if (pegaIndiceUsuario === -1) {
        return response.status(400).json("Usuário inválido")
    }

    const pegaIndiceRecado = usuarios[pegaIndiceUsuario].recados.findIndex(recado => {
        return recado.id === idRecado
    })

    if (pegaIndiceRecado === -1) {
        return response.status(400).json("Recado inválido")
    }

    const recado = {
        titulo: body.titulo,
        descricao: body.descricao
    }

    usuarios[pegaIndiceUsuario].recados[pegaIndiceRecado] = recado

    return response.status(201).json("Recado atualizado com sucesso!!")

})

//DELETA RECADO
app.delete('/usuario/recado/:idUsuario/:idRecado', (request, response) => {
    const body = request.body
    const idUsuario = request.params.idUsuario
    const idRecado = request.params.idRecado

    const pegaIndiceUsuario = usuarios.findIndex(usuario => {
        return usuario.id == idUsuario
    })
    console.log(pegaIndiceUsuario);
    if (pegaIndiceUsuario === -1) {
        return response.status(400).json("Usuário inválido")
    }

    const pegaIndiceRecado = usuarios[pegaIndiceUsuario].recados.findIndex(recado => {
        return recado.id === idRecado
    })

    if (pegaIndiceRecado === -1) {
        return response.status(400).json("Recado inválido")
    }

    const recado = {
        titulo: body.titulo,
        descricao: body.descricao
    }

    delete usuarios[pegaIndiceUsuario].recados[pegaIndiceRecado]
    return response.json("Recado deletado com sucesso!!")
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

    if (existeEmail != undefined) {
        return response.json("E-mail já cadastrado!!")
    }

    //transforma a senha que vem no corpo da requisição em sequencia de caracteres
    //o numero 6 indica a quantidade de rounds
    const hashedSenha = await bcrypt.hash(body.senha, 6)

    const usuario = {
        id: randomUUID(),
        nome: body.nome,
        email: body.email,
        senha: hashedSenha
    }
    usuarios.push(usuario)
    console.log(body);
    return response.json("Usuario cadastrado com sucesso!!")
})


//LOGIN USUARIO
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
        "growdev", { expiresIn: "1800s", }
    );
    //caso de tudo certo na validacão envia o token
    return response.status(201).json({
        accessToken,
    });
})

//listem quer dizer o que servidor vai estar ouvindo requisições, esperando, na porta 8080,
//e quando ele comecar a ouvir requisições ele vai dar uma mensagem de servidor iniciado
app.listen(8080, () => console.log("Servidor iniciado"));