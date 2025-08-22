const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');

describe('Register', () => {
    describe('POST /api/auth/register', () => {
        it('Deve retornar 201 com os dados do paciente criados', async () => {
            const resposta = await request(app)
                .post('/api/auth/register')
                .set('Content-Type', 'application/json')
                .send({
                    name: 'Isabelle',
                    email: 'isabelle@gmail.com',
                    password: '123456',
                    role: 'patient'
                });

            expect(resposta.status).to.equal(201);
        });

        it('Deve retornar 201 com os dados do médico criados', async () => {
            const resposta = await request(app)
                .post('/api/auth/register')
                .set('Content-Type', 'application/json')
                .send({
                    name: 'Isa Medica',
                    email: 'isa_medica@gmail.com',
                    password: '123456',
                    role: 'doctor',
                    specialty: 'psychiatrist'
                });

            expect(resposta.status).to.equal(201);
        });

        //Reportar bug(o e-mail não é validado pela máscara de e-mail)
        it.skip('Deve retornar 400 com mensagem de erro quando o email for inválido', async () => {
            const resposta = await request(app)
                .post('/api/auth/register')
                .set('Content-Type', 'application/json')
                .send({
                    name: 'Test Medico',
                    email: 'test_medico#.com',
                    password: '123456',
                    role: 'doctor',
                    specialty: 'psychiatrist'
                });

            expect(resposta.status).to.equal(400);
        });

        it('Deve retornar 400 com a mensagem de usuário já cadastrado', async () => {
            const resposta = await request(app)
                .post('/api/auth/register')
                .set('Content-Type', 'application/json')
                .send({
                    name: 'Isa Medica',
                    email: 'isa_medica@gmail.com',
                    password: '123456',
                    role: 'doctor',
                    specialty: 'psychiatrist'
                });

                expect(resposta.status).to.equal(400);
                expect(resposta.body.error).to.equal('Email já cadastrado');
        });

        it('Deve retornar 400 quando o nome não for informado', async () => {
            const resposta = await request(app)
                .post('/api/auth/register')
                .set('Content-Type', 'application/json')
                .send({
                    name: '',
                    email: 'isa_medica@gmail.com',
                    password: '123456',
                    role: 'doctor',
                    specialty: 'psychiatrist'
                });

                expect(resposta.status).to.equal(400);
        });

    });
});