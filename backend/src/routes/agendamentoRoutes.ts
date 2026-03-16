import { Router } from 'express';
import { criarAgendamento } from '../controllers/AgendamentoController';
import { protegerRota } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', protegerRota, criarAgendamento);

export default router;
