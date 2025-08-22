const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { users } = require('../data/store');

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Cadastro de usuário (paciente ou médico)
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [patient, doctor]
 *               specialty:
 *                 type: string
 *                 description: Obrigatório para médicos
 *     responses:
 *       201:
 *         description: Usuário criado
 *       400:
 *         description: Dados inválidos
 */
router.post('/register', async (req, res) => {
  const { name, email, password, role, specialty } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }
  if (!['patient', 'doctor'].includes(role)) {
    return res.status(400).json({ error: 'Role inválida' });
  }
  if (role === 'doctor' && !specialty) {
    return res.status(400).json({ error: 'Especialidade é obrigatória para médicos' });
  }
  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(400).json({ error: 'Email já cadastrado' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    name,
    email,
    passwordHash,
    role,
    specialty: role === 'doctor' ? specialty : undefined,
  };
  users.push(user);
  return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role, specialty: user.specialty });
});

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login de usuário
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '8h' });
  return res.json({ token });
});

module.exports = router;


