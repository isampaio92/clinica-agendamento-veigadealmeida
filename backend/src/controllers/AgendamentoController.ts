import { Response } from 'express';
import axios from 'axios';
import Agendamento from '../models/Agendamento';
import { AuthRequest } from '../middlewares/authMiddleware';

export const criarAgendamento = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { dataConsulta, cep } = req.body;
        const pacienteId = req.usuario?.id;

        if (!pacienteId) {
            return res.status(401).json({ erro: 'Usuário não autenticado' });
        }

        const horarioOcupado = await Agendamento.findOne({ dataConsulta });

        if (horarioOcupado) {
            return res.status(400).json({ erro: 'Este horário já está reservado. Por favor, escolha outro.' });
        }

        const cepLimpo = cep.replace(/\D/g, '');
        const respostaCep = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);

        if (respostaCep.data.erro) {
            return res.status(400).json({ erro: 'CEP inválido ou não encontrado.' });
        }

        const { logradouro, bairro, localidade, uf } = respostaCep.data;
        const enderecoCompleto = `${logradouro}, ${bairro} - ${localidade}/${uf}`;

        let vaiChover = false;
        const chaveClima = process.env.OPENWEATHER_KEY;

        try {
            const respostaClima = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${localidade},BR&appid=${chaveClima}&units=metric`
            );

            const dataAlvo = new Date(dataConsulta).toISOString().split('T')[0];

            const previsoesDoDia = respostaClima.data.list.filter((item: any) =>
                item.dt_txt.startsWith(dataAlvo)
            );

            vaiChover = previsoesDoDia.some((item: any) => item.weather[0].main === 'Rain');

        } catch (erroClima) {
            console.error('Erro ao buscar o clima, salvando agendamento sem previsão.')
        }

        const novoAgendamento = new Agendamento({
            pacienteId,
            dataConsulta,
            cep: cepLimpo,
            endereco: enderecoCompleto,
            previsaoChuva: vaiChover
        });

        await novoAgendamento.save();

        return res.status(201).json({
            mensagem: 'Consulta agendada com sucesso!',
            agendamento: {
                data: novoAgendamento.dataConsulta,
                endereco: novoAgendamento.endereco,
                alertaChuva: vaiChover ? 'Atenção: Previsão de chuva para o dia da consulta!' : 'Tempo limpo previsto.'
            }
        });
        
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro interno ao processar o agendamento.' });
    }
};

export const listarAgendamentos = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const pacienteId = req.usuario?.id;
        const papel = req.usuario?.papel;

        if (!pacienteId) {
            return res.status(401).json({ erro: 'Usuário não autenticado.' });
        }

        const filtro = papel === 'paciente' ? { pacienteId } : {};

        const agendamentos = await Agendamento
            .find(filtro)
            .populate('pacienteId', 'nome')
            .sort({ dataConsulta: 1 });

        return res.status(200).json(agendamentos);

    } catch(erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro interno ao buscar a lista de agendamentos.' });
    }
};
