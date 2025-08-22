const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');

describe('Availability API', () => {
    let doctorToken;
    let patientToken;
    let doctorId;
    let availabilityId;

    before(async () => {
        // Criar um médico para os testes
        const doctorResponse = await request(app)
            .post('/api/auth/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'Dr. Silva',
                email: 'dr.silva@clinn.com',
                password: '123456',
                role: 'doctor',
                specialty: 'Cardiologia'
            });
        
        doctorId = doctorResponse.body.id;

        // Fazer login do médico
        const doctorLoginResponse = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'dr.silva@clinn.com',
                password: '123456'
            });
        
        doctorToken = doctorLoginResponse.body.token;

        // Criar um paciente para os testes
        await request(app)
            .post('/api/auth/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'João Paciente',
                email: 'joao.paciente@clinn.com',
                password: '123456',
                role: 'patient'
            });

        // Fazer login do paciente
        const patientLoginResponse = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'joao.paciente@clinn.com',
                password: '123456'
            });
        
        patientToken = patientLoginResponse.body.token;
    });

    describe('POST /api/availability', () => {
        it('Deve criar uma disponibilidade com sucesso quando médico autenticado', async () => {
            const availabilityData = {
                start: '2025-01-01T09:00:00.000Z',
                end: '2025-01-01T09:30:00.000Z'
            };

            const response = await request(app)
                .post('/api/availability')
                .set('Authorization', `Bearer ${doctorToken}`)
                .set('Content-Type', 'application/json')
                .send(availabilityData);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('doctorId', doctorId);
            expect(response.body).to.have.property('start', availabilityData.start);
            expect(response.body).to.have.property('end', availabilityData.end);

            availabilityId = response.body.id;
        });

        it('Deve retornar erro 400 quando start e end não são fornecidos', async () => {
            const response = await request(app)
                .post('/api/availability')
                .set('Authorization', `Bearer ${doctorToken}`)
                .set('Content-Type', 'application/json')
                .send({});

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'start e end são obrigatórios');
        });

        it('Deve retornar erro 400 quando start não é fornecido', async () => {
            const response = await request(app)
                .post('/api/availability')
                .set('Authorization', `Bearer ${doctorToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    end: '2025-01-01T09:30:00.000Z'
                });

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'start e end são obrigatórios');
        });

        it('Deve retornar erro 400 quando end não é fornecido', async () => {
            const response = await request(app)
                .post('/api/availability')
                .set('Authorization', `Bearer ${doctorToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    start: '2025-01-01T09:00:00.000Z'
                });

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'start e end são obrigatórios');
        });

        it('Deve retornar erro 400 quando end é menor ou igual a start', async () => {
            const response = await request(app)
                .post('/api/availability')
                .set('Authorization', `Bearer ${doctorToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    start: '2025-01-01T09:30:00.000Z',
                    end: '2025-01-01T09:00:00.000Z'
                });

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Intervalo inválido');
        });

        it('Deve retornar erro 400 quando end é igual a start', async () => {
            const response = await request(app)
                .post('/api/availability')
                .set('Authorization', `Bearer ${doctorToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    start: '2025-01-01T09:00:00.000Z',
                    end: '2025-01-01T09:00:00.000Z'
                });

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Intervalo inválido');
        });

        it('Deve retornar erro 400 quando datas são inválidas', async () => {
            const response = await request(app)
                .post('/api/availability')
                .set('Authorization', `Bearer ${doctorToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    start: 'data-invalida',
                    end: '2025-01-01T09:30:00.000Z'
                });

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Intervalo inválido');
        });

        it('Deve retornar erro 401 quando não autenticado', async () => {
            const response = await request(app)
                .post('/api/availability')
                .set('Content-Type', 'application/json')
                .send({
                    start: '2025-01-01T09:00:00.000Z',
                    end: '2025-01-01T09:30:00.000Z'
                });

            expect(response.status).to.equal(401);
        });

        it('Deve retornar erro 403 quando paciente tenta criar disponibilidade', async () => {
            const response = await request(app)
                .post('/api/availability')
                .set('Authorization', `Bearer ${patientToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    start: '2025-01-01T09:00:00.000Z',
                    end: '2025-01-01T09:30:00.000Z'
                });

            expect(response.status).to.equal(403);
        });
    });

    describe('GET /api/availability', () => {
        it('Deve listar disponibilidades do médico autenticado', async () => {
            const response = await request(app)
                .get('/api/availability')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
            expect(response.body[0]).to.have.property('doctorId', doctorId);
        });

        it('Deve listar disponibilidades de um médico específico quando paciente consulta', async () => {
            const response = await request(app)
                .get('/api/availability')
                .query({ doctorId: doctorId })
                .set('Authorization', `Bearer ${patientToken}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
            expect(response.body[0]).to.have.property('doctorId', doctorId);
        });

        it('Deve retornar erro 400 quando paciente não fornece doctorId', async () => {
            const response = await request(app)
                .get('/api/availability')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'doctorId é obrigatório para pacientes');
        });

        it('Deve retornar erro 404 quando médico não existe', async () => {
            const fakeDoctorId = 'fake-doctor-id';
            const response = await request(app)
                .get('/api/availability')
                .query({ doctorId: fakeDoctorId })
                .set('Authorization', `Bearer ${patientToken}`);

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('error', 'Médico não encontrado');
        });

        it('Deve retornar erro 401 quando não autenticado', async () => {
            const response = await request(app)
                .get('/api/availability');

            expect(response.status).to.equal(401);
        });
    });

    describe('PUT /api/availability/:id', () => {
        it('Deve atualizar uma disponibilidade com sucesso', async () => {
            const updateData = {
                start: '2025-01-01T10:00:00.000Z',
                end: '2025-01-01T10:30:00.000Z'
            };

            const response = await request(app)
                .put(`/api/availability/${availabilityId}`)
                .set('Authorization', `Bearer ${doctorToken}`)
                .set('Content-Type', 'application/json')
                .send(updateData);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('id', availabilityId);
            expect(response.body).to.have.property('start', updateData.start);
            expect(response.body).to.have.property('end', updateData.end);
        });

        it('Deve atualizar apenas o campo start', async () => {
            const updateData = {
                start: '2025-01-01T11:00:00.000Z'
            };

            const response = await request(app)
                .put(`/api/availability/${availabilityId}`)
                .set('Authorization', `Bearer ${doctorToken}`)
                .set('Content-Type', 'application/json')
                .send(updateData);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('start', updateData.start);
            // end deve permanecer o mesmo
            expect(response.body).to.have.property('end', '2025-01-01T10:30:00.000Z');
        });

        it('Deve atualizar apenas o campo end', async () => {
            const updateData = {
                end: '2025-01-01T11:30:00.000Z'
            };

            const response = await request(app)
                .put(`/api/availability/${availabilityId}`)
                .set('Authorization', `Bearer ${doctorToken}`)
                .set('Content-Type', 'application/json')
                .send(updateData);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('end', updateData.end);
            // start deve permanecer o mesmo
            expect(response.body).to.have.property('start', '2025-01-01T11:00:00.000Z');
        });

        it('Deve retornar erro 404 quando disponibilidade não existe', async () => {
            const fakeId = 'fake-availability-id';
            const response = await request(app)
                .put(`/api/availability/${fakeId}`)
                .set('Authorization', `Bearer ${doctorToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    start: '2025-01-01T12:00:00.000Z'
                });

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('error', 'Disponibilidade não encontrada');
        });

        it('Deve retornar erro 404 quando médico tenta atualizar disponibilidade de outro médico', async () => {
            // Criar outro médico
            const otherDoctorResponse = await request(app)
                .post('/api/auth/register')
                .set('Content-Type', 'application/json')
                .send({
                    name: 'Dr. Santos',
                    email: 'dr.santos@clinn.com',
                    password: '123456',
                    role: 'doctor',
                    specialty: 'Neurologia'
                });

            const otherDoctorLoginResponse = await request(app)
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: 'dr.santos@clinn.com',
                    password: '123456'
                });

            const otherDoctorToken = otherDoctorLoginResponse.body.token;

            const response = await request(app)
                .put(`/api/availability/${availabilityId}`)
                .set('Authorization', `Bearer ${otherDoctorToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    start: '2025-01-01T12:00:00.000Z'
                });

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('error', 'Disponibilidade não encontrada');
        });

        it('Deve retornar erro 401 quando não autenticado', async () => {
            const response = await request(app)
                .put(`/api/availability/${availabilityId}`)
                .set('Content-Type', 'application/json')
                .send({
                    start: '2025-01-01T12:00:00.000Z'
                });

            expect(response.status).to.equal(401);
        });

        it('Deve retornar erro 403 quando paciente tenta atualizar disponibilidade', async () => {
            const response = await request(app)
                .put(`/api/availability/${availabilityId}`)
                .set('Authorization', `Bearer ${patientToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    start: '2025-01-01T12:00:00.000Z'
                });

            expect(response.status).to.equal(403);
        });
    });

    describe('DELETE /api/availability/:id', () => {
        it('Deve deletar uma disponibilidade com sucesso', async () => {
            const response = await request(app)
                .delete(`/api/availability/${availabilityId}`)
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(response.status).to.equal(204);
        });

        it('Deve retornar erro 404 quando disponibilidade não existe', async () => {
            const response = await request(app)
                .delete(`/api/availability/${availabilityId}`)
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('error', 'Disponibilidade não encontrada');
        });

        it('Deve retornar erro 404 quando médico tenta deletar disponibilidade de outro médico', async () => {
            // Criar uma nova disponibilidade para o médico original
            const newAvailabilityResponse = await request(app)
                .post('/api/availability')
                .set('Authorization', `Bearer ${doctorToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    start: '2025-01-02T09:00:00.000Z',
                    end: '2025-01-02T09:30:00.000Z'
                });

            const newAvailabilityId = newAvailabilityResponse.body.id;

            // Criar outro médico
            const otherDoctorResponse = await request(app)
                .post('/api/auth/register')
                .set('Content-Type', 'application/json')
                .send({
                    name: 'Dr. Costa',
                    email: 'dr.costa@clinn.com',
                    password: '123456',
                    role: 'doctor',
                    specialty: 'Ortopedia'
                });

            const otherDoctorLoginResponse = await request(app)
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: 'dr.costa@clinn.com',
                    password: '123456'
                });

            const otherDoctorToken = otherDoctorLoginResponse.body.token;

            const response = await request(app)
                .delete(`/api/availability/${newAvailabilityId}`)
                .set('Authorization', `Bearer ${otherDoctorToken}`);

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('error', 'Disponibilidade não encontrada');
        });

        it('Deve retornar erro 401 quando não autenticado', async () => {
            const response = await request(app)
                .delete(`/api/availability/${availabilityId}`);

            expect(response.status).to.equal(401);
        });

        it('Deve retornar erro 403 quando paciente tenta deletar disponibilidade', async () => {
            const response = await request(app)
                .delete(`/api/availability/${availabilityId}`)
                .set('Authorization', `Bearer ${patientToken}`);

            expect(response.status).to.equal(403);
        });
    });
});
