import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario';

export const registrar = async (req: Request, res: Response): Promise<any> => {
    try {
        const { nome, email, senha, papel } = req.body;

        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ erro: 'Este e-mail já está registrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaEncriptada = await bcrypt.hash(senha, salt);

        const novoUsuario = new Usuario({
            nome,
            email,
            senha: senhaEncriptada,
            papel: papel || 'paciente'
        });

        await novoUsuario.save();

        return res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro interno no servidor ao registrar.' });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ erro: 'E-mail ou senha incorretos.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ erro: 'E-mail ou senha incorretos.' });
        }

        const segredo = process.env.JWT_SECRET as string;
        const token = jwt.sign(
            { id: usuario._id, papel: usuario.papel },
            segredo,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            token,
            papel: usuario.papel
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro interno no servidor ao fazer login.' });
    }
};
