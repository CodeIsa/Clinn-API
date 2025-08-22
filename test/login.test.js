const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');

describe('Login', () => {
    before(async () => {
        await request(app)
            .post('/api/auth/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'Jonatas',
                email: 'jonatas@gmail.com',
                password: '1234',
                role: 'patient'
            });
    });

    describe('POST /api/auth/login', () => {
        it('Deve retornar 200 com um token em string quando usar credenciais validas', async () => {
            const resposta = await request(app)
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: 'jonatas@gmail.com',
                    password: '1234'
                });

            expect(resposta.status).to.equal(200);
            expect(resposta.body.token).to.be.a('string');
        });
    });

    it('Deve retornar o erro 401 quando usar senha incorreta', async () => {
        const resposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'jonatas@gmail.com',
                password: '0000'
            });

        expect(resposta.status).to.equal(401);
        expect(resposta.body).to.have.property('error');
        expect(resposta.body.error).to.equal('Credenciais inválidas');
    });

    it('Deve retornar o erro 401 quando usuário for inexistente', async () => {
        const resposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'test@gmail.com',
                password: '0000'
            });

        expect(resposta.status).to.equal(401);
        expect(resposta.body).to.have.property('error');
        expect(resposta.body.error).to.equal('Credenciais inválidas');
    });

    it('Deve retornar o erro 401 quando usuário for inválido', async () => {
        const resposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'jonatas$gmail.com',
                password: '1234'
            });

        expect(resposta.status).to.equal(401);
        expect(resposta.body).to.have.property('error');
        expect(resposta.body.error).to.equal('Credenciais inválidas');
    });
});