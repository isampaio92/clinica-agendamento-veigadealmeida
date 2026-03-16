import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes)

const uri = process.env.MONGO_URI as string;

mongoose.connect(uri)
    .then(() => console.log('Conectado ao MongoDB com sucesso!'))
    .catch((erro) => console.error('Erro ao conectar ao MongoDB:', erro));

    app.get('/', (req, res) => {
        res.json({ mensagem: 'API da Clínica está online' });
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
