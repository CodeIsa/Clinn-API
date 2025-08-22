const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');

describe('Users API', () => {
    let patientToken;
    let doctorToken;
    let patientId;
    let doctorId;

    before(async () => {
        // Criar um paciente para os testes
        const patientResponse = await request(app)
            .post('/api/auth/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'Maria Paciente',
                email: 'maria.paciente@clinn.com',
                password: '123456',
                role: 'patient'
            });
        
        patientId = patientResponse.body.id;

        // Fazer login do paciente
        const patientLoginResponse = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'maria.paciente@clinn.com',
                password: '123456'
            });
        
        patientToken = patientLoginResponse.body.token;

        // Criar um médico para os testes
        const doctorResponse = await request(app)
            .post('/api/auth/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'Dr. Carlos',
                email: 'dr.carlos@clinn.com',
                password: '123456',
                role: 'doctor',
                specialty: 'Dermatologia'
            });
        
        doctorId = doctorResponse.body.id;

        // Fazer login do médico
        const doctorLoginResponse = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'dr.carlos@clinn.com',
                password: '123456'
            });
        
        doctorToken = doctorLoginResponse.body.token;
    });

    describe('GET /api/users/me', () => {
        it('Deve retornar dados do paciente autenticado', async () => {
            const response = await request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('id', patientId);
            expect(response.body).to.have.property('name', 'Maria Paciente');
            expect(response.body).to.have.property('email', 'maria.paciente@clinn.com');
            expect(response.body).to.have.property('role', 'patient');
        });

        it('Deve retornar dados do médico autenticado com especialidade', async () => {
            const response = await request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('id', doctorId);
            expect(response.body).to.have.property('name', 'Dr. Carlos');
            expect(response.body).to.have.property('email', 'dr.carlos@clinn.com');
            expect(response.body).to.have.property('role', 'doctor');
            expect(response.body).to.have.property('specialty', 'Dermatologia');
        });

        it('Deve retornar erro 401 quando não autenticado', async () => {
            const response = await request(app)
                .get('/api/users/me');

            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('error', 'Token ausente');
        });

        it('Deve retornar erro 401 quando token é inválido', async () => {
            const response = await request(app)
                .get('/api/users/me')
                .set('Authorization', 'Bearer token-invalido');

            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('error', 'Token inválido');
        });

        it('Deve retornar erro 401 quando formato do header é incorreto', async () => {
            const response = await request(app)
                .get('/api/users/me')
                .set('Authorization', 'token-sem-bearer');

            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('error', 'Token ausente');
        });

        it('Deve retornar erro 401 quando header Authorization está vazio', async () => {
            const response = await request(app)
                .get('/api/users/me')
                .set('Authorization', '');

            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('error', 'Token ausente');
        });

        it('Deve retornar erro 404 quando usuário não existe mais no sistema', async () => {
            // Criar um usuário temporário
            const tempUserResponse = await request(app)
                .post('/api/auth/register')
                .set('Content-Type', 'application/json')
                .send({
                    name: 'Usuário Temporário',
                    email: 'temp@clinn.com',
                    password: '123456',
                    role: 'patient'
                });

            const tempUserId = tempUserResponse.body.id;

            // Fazer login
            const tempLoginResponse = await request(app)
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: 'temp@clinn.com',
                    password: '123456'
                });

            const tempToken = tempLoginResponse.body.token;

            // Verificar que o endpoint funciona
            const response1 = await request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${tempToken}`);

            expect(response1.status).to.equal(200);
            expect(response1.body).to.have.property('id', tempUserId);

            // Remover o usuário do store (simulando exclusão)
            const { users } = require('../src/data/store');
            const userIndex = users.findIndex(u => u.id === tempUserId);
            if (userIndex !== -1) {
                users.splice(userIndex, 1);
            }

            // Tentar acessar novamente - deve retornar 404
            const response2 = await request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${tempToken}`);

            expect(response2.status).to.equal(404);
            expect(response2.body).to.have.property('error', 'Usuário não encontrado');
        });

        it('Deve retornar dados consistentes em múltiplas chamadas', async () => {
            // Fazer múltiplas chamadas para verificar consistência
            const response1 = await request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${patientToken}`);

            const response2 = await request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${patientToken}`);

            const response3 = await request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(response1.status).to.equal(200);
            expect(response2.status).to.equal(200);
            expect(response3.status).to.equal(200);

            // Verificar que os dados são consistentes
            expect(response1.body).to.deep.equal(response2.body);
            expect(response2.body).to.deep.equal(response3.body);
            expect(response1.body).to.deep.equal(response3.body);
        });
    });
});
