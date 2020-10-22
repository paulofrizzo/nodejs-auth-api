const request = require('supertest')
const app = require('../server')
const db = require("../app/models")
const expect = require('chai').expect
const User = db.usuario

async function createFakeUser() {
    const user = new User([{
        "id":"5f90faaa73b36fd249bcb2a5",
        "nome":"Paulo Frizzo",
        "email":"paulo.frizzo01@terra.com.br",
        "data_criacao":"2020-10-22T03:21:14.181Z",
        "data_atualizacao":"2020-10-22T03:21:14.181Z",
        "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmOTBmYWFhNzNiMzZmZDI0OWJjYjJhNSIsImlhdCI6MTYwMzMzNjg3NH0.iuM89Q43Nc9QKbiN7PIpgotDXtDP6bg2iHY_497LFE0"
    },{
        "id":"5f90faaa73b36fd249bcb2b3",
        "nome":"Paulo Frizzo",
        "email":"paulo.frizzo01@terra.com.br",
        "data_criacao":"2020-10-22T03:21:14.181Z",
        "data_atualizacao":"2020-10-22T03:21:14.181Z",
        "ultimo_login": Date.now,
        "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmOTBmYWFhNzNiMzZmZDI0OWJjYjJhNSIsImlhdCI6MTYwMzMzNjg3NH0.iuM89Q43Nc9QKbiN7PIpgotDXtDP6bg2iHY_497MNT5"
    }])
    await user.save()
}

describe('Testes da API', function () {
    
    beforeEach(() => {createFakeUser()})
    afterEach(() => {User.deleteMany; app.close()})

    it('Responde 404 caso o endpoint não exista', async () => {
        const response = await request(app)
            .get('/api/usuarios')
            .set('Accept', 'application/json')
        
        expect(response.statusCode).equal(404)    
    })

    it('Ao criar um usuário recebe o status code 201', (done) => {
            request(app)
            .post('/api/auth/signup')
            .set('Accept', 'application/json')
            .send({
                "nome": "Paulo Frizzo",
                "email": "paulo.frizzo@terra.com.br",
                "senha": "rhadamanthys",
                "telefones": [{"ddd":"11", "telefone": "995893072"}]
            })    
            .expect(201, done)
    })

    it('Responde 401 caso o e-mail não exista', async () => {
        const response = await request(app)
        .post('/api/auth/signin')
        .set('Accept', 'application/json')
        .send({
            "email": "desenvolvimento@gmail.com",
            "senha": "rhadamanthys"
        })

        expect(response.statusCode).equal(401)
        expect(response.body.mensagem).equal('Usuário e/ou senha inválidos.')
    })

    it('Responde 401 caso o e-mail exista e a senha esteja incorreta', async () => {
        const response = await request(app)
        .post('/api/auth/signin')
        .send({
            "email": "paulo.frizzo01@terra.com.br",
            "senha": "development"
        })

        expect(response.statusCode).equal(401)
        expect(response.body.mensagem).equal('Usuário e/ou senha inválidos.')
    })

    it('Deve retornar não autorizado ao buscar usuário sem enviar o token', async () => {
        const response = await request(app)
        .get('/api/user/5f90faaa73b36fd249bcb2a5')

        expect(response.statusCode).equal(403)
        expect(response.body.mensagem).equal('Não autorizado.')
    })

    it('Deve retornar não autorizado ao buscar usuário enviando token inválido', async () => {
        const response = await request(app)
        .get('/api/user/5f90faaa73b36fd249bcb2a5')
        .set({ "Authorization": `Bearer woebfuoabrbfaoyrbgiaybryigbeirgbeirybgeyrib` })

        expect(response.statusCode).equal(401)
        expect(response.body.mensagem).equal('Não autorizado.')
    })

    it('Deve retornar Sessão inválida se o último login foi efetuado há mais de 30 minutos', async () => {
        const response = await request(app)
        .get('/api/user/5f90faaa73b36fd249bcb2a5')
        .set({ "Authorization": `Bearer woebfuoabrbfaoyrbgiaybryigbeirgbeirybgeyrib` })

        expect(response.statusCode).equal(401)
        expect(response.body.mensagem).equal('Não autorizado.')
    })
})