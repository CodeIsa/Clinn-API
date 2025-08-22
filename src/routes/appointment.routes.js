const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticate, authorize } = require('../middlewares/auth');
const { appointments, availabilities, users } = require('../data/store');
const calendar = require('../services/calendar.service');

const router = express.Router();

function isWithinAvailability(doctorId, startISO, endISO, excludeAppointmentId) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const doctorSlots = availabilities.filter(a => a.doctorId === doctorId);
  // Check if the interval fits any availability slot and does not overlap existing appointments
  const fitsSlot = doctorSlots.some(slot => new Date(slot.start) <= start && new Date(slot.end) >= end);
  if (!fitsSlot) return false;
  const overlaps = appointments.some(ap => ap.doctorId === doctorId && ap.status === 'Agendada' && ap.id !== excludeAppointmentId && !(new Date(ap.end) <= start || new Date(ap.start) >= end));
  return !overlaps;
}

/**
 * @openapi
 * /api/appointments:
 *   post:
 *     summary: Criar consulta (paciente)
 *     tags:
 *       - Consultas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctorId, start, end]
 *             properties:
 *               doctorId:
 *                 type: string
 *               start:
 *                 type: string
 *                 format: date-time
 *               end:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Consulta criada
 */
router.post('/', authenticate, authorize(['patient']), async (req, res) => {
  const { doctorId, start, end } = req.body;
  if (!doctorId || !start || !end) return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  const doctor = users.find(u => u.id === doctorId && u.role === 'doctor');
  if (!doctor) return res.status(404).json({ error: 'Médico não encontrado' });
  if (!isWithinAvailability(doctorId, start, end)) {
    return res.status(400).json({ error: 'Horário indisponível' });
  }
  const appointment = {
    id: uuidv4(),
    patientId: req.user.id,
    doctorId,
    start: new Date(start).toISOString(),
    end: new Date(end).toISOString(),
    status: 'Agendada',
  };
  appointments.push(appointment);
  await calendar.syncEvent({
    summary: 'Consulta Clinn',
    description: `Paciente: ${req.user.name} | Médico: ${doctor.name}`,
    start: appointment.start,
    end: appointment.end,
    attendees: [req.user.email, doctor.email].filter(Boolean),
  });
  return res.status(201).json(appointment);
});

/**
 * @openapi
 * /api/appointments/{id}:
 *   put:
 *     summary: Remarcar consulta (paciente)
 *     tags:
 *       - Consultas
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
 *             required: [start, end]
 *             properties:
 *               start:
 *                 type: string
 *                 format: date-time
 *               end:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Consulta remarcada
 */
router.put('/:id', authenticate, authorize(['patient']), async (req, res) => {
  const { id } = req.params;
  const { start, end } = req.body;
  const ap = appointments.find(a => a.id === id && a.patientId === req.user.id);
  if (!ap) return res.status(404).json({ error: 'Consulta não encontrada' });
  if (ap.status !== 'Agendada') return res.status(400).json({ error: 'Somente consultas agendadas podem ser remarcadas' });
  if (!isWithinAvailability(ap.doctorId, start, end, ap.id)) {
    return res.status(400).json({ error: 'Horário indisponível' });
  }
  ap.start = new Date(start).toISOString();
  ap.end = new Date(end).toISOString();
  await calendar.syncEvent({
    summary: 'Consulta Clinn (remarcada)',
    description: `Paciente: ${req.user.name}`,
    start: ap.start,
    end: ap.end,
    attendees: [],
  });
  return res.json(ap);
});

/**
 * @openapi
 * /api/appointments/{id}:
 *   delete:
 *     summary: Cancelar consulta (paciente)
 *     tags:
 *       - Consultas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consulta cancelada
 */
router.delete('/:id', authenticate, authorize(['patient']), async (req, res) => {
  const { id } = req.params;
  const ap = appointments.find(a => a.id === id && a.patientId === req.user.id);
  if (!ap) return res.status(404).json({ error: 'Consulta não encontrada' });
  if (ap.status !== 'Agendada') return res.status(400).json({ error: 'Já cancelada' });
  ap.status = 'Cancelada';
  await calendar.deleteEvent({ eventId: id });
  return res.json(ap);
});

/**
 * @openapi
 * /api/appointments:
 *   get:
 *     summary: Listar consultas do usuário (paciente ou médico)
 *     tags:
 *       - Consultas
 *     responses:
 *       200:
 *         description: Lista de consultas
 */
router.get('/', authenticate, (req, res) => {
  if (req.user.role === 'patient') {
    const list = appointments.filter(a => a.patientId === req.user.id);
    return res.json(list);
  }
  if (req.user.role === 'doctor') {
    const list = appointments.filter(a => a.doctorId === req.user.id);
    return res.json(list);
  }
  return res.status(403).json({ error: 'Acesso negado' });
});

module.exports = router;


