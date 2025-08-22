const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');

describe('Appointments', () => {
    let patientToken;
    let doctorToken;
    let doctorId;

    before(async () => {
        // Registrar um paciente para os testes
        await request(app)
            .post('/api/auth/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'Paciente Teste',
                email: 'paciente@teste.com',
                password: '123456',
                role: 'patient'
            });

        // Registrar um médico para os testes
        const doctorResponse = await request(app)
            .post('/api/auth/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'Dr. Teste',
                email: 'doutor@teste.com',
                password: '123456',
                role: 'doctor',
                specialty: 'Clínico Geral'
            });

        doctorId = doctorResponse.body.id;

        // Fazer login do paciente
        const patientLoginResponse = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'paciente@teste.com',
                password: '123456'
            });

        patientToken = patientLoginResponse.body.token;

        // Fazer login do médico
        const doctorLoginResponse = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'doutor@teste.com',
                password: '123456'
            });

        doctorToken = doctorLoginResponse.body.token;

        // Criar uma disponibilidade para o médico
        const availabilityResponse = await request(app)
            .post('/api/availability')
            .set('Authorization', `Bearer ${doctorToken}`)
            .set('Content-Type', 'application/json')
            .send({
                start: '2025-01-15T09:00:00.000Z',
                end: '2025-01-15T17:00:00.000Z'
            });

    });

    describe('POST /api/appointments', () => {
        it('Deve retornar 201 quando a consulta for criada com sucesso', async () => {
            const resposta = await request(app)
                .post('/api/appointments')
                .set('Authorization', `Bearer ${patientToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    doctorId: doctorId,
                    start: '2025-01-15T10:00:00.000Z',
                    end: '2025-01-15T10:30:00.000Z'
                });

            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.have.property('status', 'Agendada');
        });

        it('Deve retornar 400 com erro de disponibilidade quando agendar em horário indisponível', async () => {
            const resposta = await request(app)
                .post('/api/appointments')
                .set('Authorization', `Bearer ${patientToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    doctorId: doctorId,
                    start: '2025-01-16T09:00:00.000Z',
                    end: '2025-01-16T09:30:00.000Z'
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error');
            expect(resposta.body.error).to.equal('Horário indisponível');
        });

        it('Deve retornar 400 com erro de disponibilidade quando agendar em horário já ocupado', async () => {
            await request(app)
                .post('/api/appointments')
                .set('Authorization', `Bearer ${patientToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    doctorId: doctorId,
                    start: '2025-01-15T11:00:00.000Z',
                    end: '2025-01-15T11:30:00.000Z'
                });

            // Tentar agendar outra consulta no mesmo horário
            const resposta = await request(app)
                .post('/api/appointments')
                .set('Authorization', `Bearer ${patientToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    doctorId: doctorId,
                    start: '2025-01-15T11:00:00.000Z', 
                    end: '2025-01-15T11:30:00.000Z'
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error');
            expect(resposta.body.error).to.equal('Horário indisponível');
        });

        it('Deve retornar 400 quando campos obrigatórios estiverem ausentes', async () => {
            const resposta = await request(app)
                .post('/api/appointments')
                .set('Authorization', `Bearer ${patientToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    doctorId: doctorId
                    // start e end ausentes
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error');
            expect(resposta.body.error).to.equal('Campos obrigatórios ausentes');
        });

        it('Deve retornar 404 quando médico não for encontrado', async () => {
            const fakeDoctorId = '123e4567-e89b-12d3-a456-426614174000';
            const resposta = await request(app)
                .post('/api/appointments')
                .set('Authorization', `Bearer ${patientToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    doctorId: fakeDoctorId,
                    start: '2025-01-15T12:00:00.000Z',
                    end: '2025-01-15T12:30:00.000Z'
                });

            expect(resposta.status).to.equal(404);
            expect(resposta.body).to.have.property('error');
            expect(resposta.body.error).to.equal('Médico não encontrado');
        });
    });

    describe('GET /api/appointments', () => {
        it('Deve retornar 200 com lista de consultas do paciente', async () => {
            const resposta = await request(app)
                .get('/api/appointments')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.be.an('array');
            expect(resposta.body.length).to.be.greaterThan(0);
        });

        it('Deve retornar 200 com lista de consultas do médico', async () => {
            const resposta = await request(app)
                .get('/api/appointments')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.be.an('array');
        });
    });

    describe('PUT /api/appointments/:id', () => {
        let appointmentId;

        before(async () => {
            // Criar uma consulta para testar a remarcação
            const appointmentResponse = await request(app)
                .post('/api/appointments')
                .set('Authorization', `Bearer ${patientToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    doctorId: doctorId,
                    start: '2025-01-15T14:00:00.000Z',
                    end: '2025-01-15T14:30:00.000Z'
                });

            appointmentId = appointmentResponse.body.id;
        });

        it('Deve retornar 200 quando a consulta for remarcada com sucesso', async () => {
            const resposta = await request(app)
                .put(`/api/appointments/${appointmentId}`)
                .set('Authorization', `Bearer ${patientToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    start: '2025-01-15T15:00:00.000Z',
                    end: '2025-01-15T15:30:00.000Z'
                });

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.have.property('id', appointmentId);
            expect(resposta.body.start).to.equal('2025-01-15T15:00:00.000Z');
            expect(resposta.body.end).to.equal('2025-01-15T15:30:00.000Z');
        });

        it('Deve retornar 400 quando tentar remarcar para horário indisponível', async () => {
            const resposta = await request(app)
                .put(`/api/appointments/${appointmentId}`)
                .set('Authorization', `Bearer ${patientToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    start: '2025-01-16T09:00:00.000Z', // Horário fora da disponibilidade
                    end: '2025-01-16T09:30:00.000Z'
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error');
            expect(resposta.body.error).to.equal('Horário indisponível');
        });
    });

    describe('DELETE /api/appointments/:id', () => {
        let appointmentToCancelId;

        before(async () => {
            // Criar uma consulta para testar o cancelamento
            const appointmentResponse = await request(app)
                .post('/api/appointments')
                .set('Authorization', `Bearer ${patientToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    doctorId: doctorId,
                    start: '2025-01-15T16:00:00.000Z',
                    end: '2025-01-15T16:30:00.000Z'
                });

            appointmentToCancelId = appointmentResponse.body.id;
        });

        it('Deve retornar 200 quando a consulta for cancelada com sucesso', async () => {
            const resposta = await request(app)
                .delete(`/api/appointments/${appointmentToCancelId}`)
                .set('Authorization', `Bearer ${patientToken}`);

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.have.property('status', 'Cancelada');
        });
    });
});