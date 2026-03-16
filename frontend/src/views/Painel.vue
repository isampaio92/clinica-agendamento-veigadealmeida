<template>
    <div class="painel-container">
        <header class="cabecalho">
            <h2>Painel de Agendamento</h2>
            <button @click="sair" class="btn-sair">Sair</button>
        </header>

        <main class="conteudo">
            <div class="card agendamento-form">
                <h3>Nova Consulta</h3>
                <form @submit.prevent="agendarConsulta">
                    <div class="input-group">
                        <label for="data">Data e Hora da Consulta</label>
                        <input
                            type="datetime-local"
                            id="data"
                            v-model="dataConsulta"
                            required
                        />
                    </div>

                    <div class="input-group">
                        <label for="cep">CEP do Paciente</label>
                        <input
                            type="text"
                            id="cep"
                            v-model="cep"
                            maxlength="8"
                            required
                        />
                    </div>

                    <button type="submit" :disabled="carregando">
                        {{ carregando ? 'Processando...' : 'Confirmar Agendamento' }}
                    </button>
                </form>
                <p v-if="mensagemErro" class="erro">{{ mensagemErro }}</p>
            </div>

            <div v-if="resultado" class="card resultado-sucesso">
                <h3>Consulta Confirmada!</h3>
                <p><strong>Data</strong>: {{ formatarData(resultado.data) }}</p>
                <p><strong>Endereço Localizado</strong>: {{ resultado.endereco }}</p>
                <div class="alerta-clima" :class="{'chuva': resultado.alertaChuva.includes('chuva')}">
                    <strong>Previsão do Tempo</strong>: {{ resultado.alertaChuva }}
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import axios from 'axios';

    const dataConsulta = ref('');
    const cep = ref('');
    const carregando = ref(false);
    const mensagemErro = ref('');
    const resultado = ref(null);
    const router = useRouter();

    const agendarConsulta = async () => {
        carregando.value = true;
        mensagemErro.value = '';
        resultado.value = null;

        try {
            const token = localStorage.getItem('token');

            const resposta = await axios.post(
                'http://localhost:3000/api/agendamentos',
                {
                    dataConsulta: dataConsulta.value,
                    cep: cep.value
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            resultado.value = resposta.data.agendamento;

            dataConsulta.value = '';
            cep.value = '';

        } catch(erro) {
            if (erro.response?.status === 401) {
                mensagemErro.value = 'Sua sessão expirou. Faça login novamente.';
                sair();
            } else {
                mensagemErro.value = erro.response?.data?.erro || 'Erro ao agendar consulta.';
            }
        } finally {
            carregando.value = false;
        }
    };

    function sair() {
        localStorage.removeItem('token');
        router.push('/');
    };

    function formatarData(dataIso) {
        if (!dataIso) return '';
        return new Date(dataIso).toLocaleString('pt-BR');
    };
</script>

<style scoped>
    .painel-container {
        min-height: 100vh;
        background-color: #f4f7f6;
    }

    .cabecalho {
        background-color: #2c3e50;
        color: white;
        padding: 20px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .btn-sair {
        background-color: #e74c3c;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }

    .btn-sair:hover {
        background-color: #c0392b;
    }

    .conteudo {
        padding: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .card {
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        width: 100%;
        max-width: 600px;
    }

    .input-group {
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
    }

    label {
        margin-bottom: 8px;
        font-weight: 600;
        color: #333;
    }

    input {
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
    }

    button[type="submit"] {
        width: 100%;
        padding: 14px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button[type="submit"]:hover:not(:disabled) {
        background-color: #2980b9;
    }

    .erro {
        color: #e74c3c; margin-top: 15px; text-align: center;
    }

    .resultado-sucesso {
        border-left: 5px solid #2ecc71;
    }

    .alerta-clima {
        margin-top: 15px;
        padding: 15px;
        background-color: #e8f8f5;
        border-radius: 4px;
        color: #16a085;
    }

    .alerta-clima.chuva {
        background-color: #fcf3cf;
        color: #d35400;
    }
</style>