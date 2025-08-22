const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { availabilities, users } = require('../data/store');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @openapi
 * /api/availability:
 *   post:
 *     summary: Registrar disponibilidade do médico
 *     description: Requer autenticação com Bearer Token de um usuário com role "doctor". Informe `start` e `end` em formato ISO 8601 (UTC).
 *     tags:
 *       - Disponibilidade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [start, end]
 *             properties:
 *               start:
 *                 type: string
 *                 format: date-time
 *               end:
 *                 type: string
 *                 format: date-time
 *           examples:
 *             exemplo:
 *               summary: Disponibilidade de 30 minutos
 *               value:
 *                 start: "2025-01-01T09:00:00.000Z"
 *                 end: "2025-01-01T09:30:00.000Z"
 *     responses:
 *       201:
 *         description: Disponibilidade criada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 doctorId:
 *                   type: string
 *                 start:
 *                   type: string
 *                   format: date-time
 *                 end:
 *                   type: string
 *                   format: date-time
 *             example:
 *               id: "8b5a2c5e-2e1d-4a7d-9b4f-1234567890ab"
 *               doctorId: "1b2c3d4e-5f6a-7b8c-9d0e-abcdefabcdef"
 *               start: "2025-01-01T09:00:00.000Z"
 *               end: "2025-01-01T09:30:00.000Z"
 */
router.post('/', authenticate, authorize(['doctor']), (req, res) => {
  const { start, end } = req.body;
  if (!start || !end) return res.status(400).json({ error: 'start e end são obrigatórios' });
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate) || isNaN(endDate) || endDate <= startDate) {
    return res.status(400).json({ error: 'Intervalo inválido' });
  }
  const entry = { id: uuidv4(), doctorId: req.user.id, start: startDate.toISOString(), end: endDate.toISOString() };
  availabilities.push(entry);
  return res.status(201).json(entry);
});

/**
 * @openapi
 * /api/availability:
 *   get:
 *     summary: Listar disponibilidades do médico autenticado (médico) ou de um médico específico (paciente)
 *     tags:
 *       - Disponibilidade
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *         description: Quando presente, lista disponibilidades do médico informado (paciente)
 *     responses:
 *       200:
 *         description: Lista de disponibilidades
 */
router.get('/', authenticate, (req, res) => {
  const { doctorId } = req.query;
  if (req.user.role === 'doctor') {
    const list = availabilities.filter(a => a.doctorId === req.user.id);
    return res.json(list);
  }
  if (doctorId) {
    const doctor = users.find(u => u.id === doctorId && u.role === 'doctor');
    if (!doctor) return res.status(404).json({ error: 'Médico não encontrado' });
    const list = availabilities.filter(a => a.doctorId === doctorId);
    return res.json(list);
  }
  return res.status(400).json({ error: 'doctorId é obrigatório para pacientes' });
});

/**
 * @openapi
 * /api/availability/{id}:
 *   put:
 *     summary: Editar disponibilidade (médico)
 *     tags:
 *       - Disponibilidade
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start:
 *                 type: string
 *                 format: date-time
 *               end:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Disponibilidade atualizada
 */
router.put('/:id', authenticate, authorize(['doctor']), (req, res) => {
  const { id } = req.params;
  const entry = availabilities.find(a => a.id === id && a.doctorId === req.user.id);
  if (!entry) return res.status(404).json({ error: 'Disponibilidade não encontrada' });
  const { start, end } = req.body;
  if (start) entry.start = new Date(start).toISOString();
  if (end) entry.end = new Date(end).toISOString();
  return res.json(entry);
});

/**
 * @openapi
 * /api/availability/{id}:
 *   delete:
 *     summary: Remover disponibilidade (médico)
 *     tags:
 *       - Disponibilidade
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Removida
 */
router.delete('/:id', authenticate, authorize(['doctor']), (req, res) => {
  const { id } = req.params;
  const idx = availabilities.findIndex(a => a.id === id && a.doctorId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Disponibilidade não encontrada' });
  availabilities.splice(idx, 1);
  return res.status(204).send();
});

module.exports = router;


