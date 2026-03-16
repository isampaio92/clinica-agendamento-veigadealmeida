import { Router } from 'express';
import { criarAgendamento, listarAgendamentos } from '../controllers/AgendamentoController';
import { protegerRota } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', protegerRota, criarAgendamento);

router.get('/', protegerRota, listarAgendamentos)

export default router;
