import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    usuario?: {
        id: string;
        papel: string;
    };
}

export const protegerRota = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const cabecalhoAuth = req.headers.authorization;

    if (!cabecalhoAuth || !cabecalhoAuth.startsWith('Bearer ')) {
        res.status(401).json({ erro: 'Acesso negado. Token não fornecido' });
        return;
    }

    const token = cabecalhoAuth.split(' ')[1]

    try {
        const segredo = process.env.JWT_SECRET as string;
        const decodificado = jwt.verify(token, segredo) as { id: string; papel: string};

        req.usuario = decodificado;

        next();
    } catch (erro) {
        res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
};
