import mongoose, { Schema, Document } from 'mongoose';

export interface IUsuario extends Document {
    nome: string;
    email: string;
    senha: string;
    papel: 'paciente' | 'secretario';
}

const UsuarioSchema: Schema = new Schema(
    {
        nome: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        senha: {
            type: String,
            required: true
        },
        papel: {
            type: String,
            enum: ['paciente', 'secretario'],
            default: 'paciente'
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUsuario>('Usuario', UsuarioSchema);
