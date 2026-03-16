import mongoose, { Schema, Document } from 'mongoose';

export interface IAgendamento extends Document {
    pacienteId: mongoose.Types.ObjectId;
    dataConsulta: Date;
    cep: string;
    endereco: string;
    previsaoChuva: boolean;
}

const AgendamentoSchema: Schema = new Schema(
    {
        pacienteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true
        },
        dataConsulta: {
            type: Date,
            required: true
        },
        cep: {
            type: String,
            required: true
        },
        endereco: {
            type: String,
            required: true
        },
        previsaoChuva: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IAgendamento>('Agendamento', AgendamentoSchema);
