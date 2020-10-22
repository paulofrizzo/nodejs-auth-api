const request = require('supertest')
const app = require('../server')
const db = require("../app/models")
const expect = require('chai').expect
const User = db.usuario

describe('Testes da API', function () {

    before(function(done) {
        User.deleteMany({}, function(error) {
            done();
        });
    });

    it('Responde 404 caso o endpoint não exista', async () => {
        const response = await request(app)
            .get('/api/usuarios')
            .set('Accept', 'application/json')
            .expect(404)
    })



    it('POST /api/auth/signin - Responde 401 caso o e-mail não exista', async () => {
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

    it('POST /api/auth/signin - Responde 401 caso o e-mail exista e a senha esteja incorreta', async () => {
        const response = await request(app)
        .post('/api/auth/signin')
        .send({
            "email": "paulo.frizzo01@terra.com.br",
            "senha": "development"
        })

        expect(response.statusCode).equal(401)
        expect(response.body.mensagem).equal('Usuário e/ou senha inválidos.')
    })

    it('GET /api/user/:id - Deve retornar não autorizado ao buscar usuário sem enviar o token', async () => {
        const response = await request(app)
        .get('/api/user/5f90faaa73b36fd249bcb2a5')

        expect(response.statusCode).equal(403)
        expect(response.body.mensagem).equal('Não autorizado.')
    })

    it('GET /api/user/:id - Deve retornar não autorizado ao buscar usuário enviando token inválido', async () => {
        const response = await request(app)
        .get('/api/user/5f90faaa73b36fd249bcb2a5')
        .set({ "Authorization": `Bearer woebfuoabrbfaoyrbgiaybryigbeirgbeirybgeyrib` })

        expect(response.statusCode).equal(401)
        expect(response.body.mensagem).equal('Não autorizado.')
    })

    it('GET /api/user/:id Deve retornar Sessão inválida se o último login foi efetuado há mais de 30 minutos', async () => {
        const response = await request(app)
        .get('/api/user/5f90faaa73b36fd249bcb2a5')
        .set({ "Authorization": `Bearer woebfuoabrbfaoyrbgiaybryigbeirgbeirybgeyrib` })

        expect(response.statusCode).equal(401)
        expect(response.body.mensagem).equal('Não autorizado.')
    })

    it('POST /api/auth/signup - Ao criar um usuário recebe o status code 201', (done) => {
        request(app)
        .post('/api/auth/signup')
        .set('Accept', 'application/json')
        .send({
            "nome": "Paulo Frizzo",
            "email": `paulo.frizzo.${Math.random()}@google.com`,
            "senha": "rhadamanthys",
            "telefones": [{"ddd":"11", "telefone": "995893072"}]
        })    
        .expect(201, done)
    })
})