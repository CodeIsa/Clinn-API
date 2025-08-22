const express = require('express');
const { users } = require('../data/store');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     summary: Dados do usuário autenticado
 *     tags:
 *       - Usuários
 *     responses:
 *       200:
 *         description: Dados do usuário
 */
router.get('/me', authenticate, (req, res) => {
  const me = users.find(u => u.id === req.user.id);
  if (!me) return res.status(404).json({ error: 'Usuário não encontrado' });
  return res.json({ id: me.id, name: me.name, email: me.email, role: me.role, specialty: me.specialty });
});

module.exports = router;


