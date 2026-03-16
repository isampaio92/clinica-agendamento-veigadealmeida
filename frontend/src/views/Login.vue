<template>
    <div class="login-container">
        <div class="card">
            <h2>Acesso da Clínica</h2>

            <form @submit.prevent="fazerLogin">
                <div class="input-group">
                    <label for="email">E-mail</label>
                    <input 
                        type="email"
                        id="email"
                        v-model="email"
                        required
                        placeholder="Digite seu e-mail"
                    />
                </div>

                <div class="input-group">
                    <label for="senha">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        v-model="senha"
                        required
                        placeholder="Digite sua senha"
                    />
                </div>

                <button type="submit" :disabled="carregando">
                    {{ carregando ? 'Autenticando...' : 'Entrar no Sistema' }}
                </button>

                <p v-if="mensagemErro" class="erro">{{ mensagemErro }}</p>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import axios from 'axios';

    const email = ref('');
    const senha = ref('');
    const mensagemErro = ref('');
    const carregando = ref(false);
    const router = useRouter();

    const fazerLogin = async () => {
        carregando.value = true;
        mensagemErro.value = '';

        try {
            const resposta = await axios.post('http://localhost:3000/api/auth/login', {
                email: email.value,
                senha: senha.value
            });

            localStorage.setItem('token', resposta.data.token);

            router.push('/painel');

        } catch(erro) {
            mensagemErro.value = erro.response?.data?.erro || 'Erro ao conectar com o servidor.';

        } finally {
            carregando.value = false;
        }
    };
</script>

<style scoped>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
    }

    .card {
        background: white;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        width: 100%;
        max-width: 400px;
    }

    h2 {
        text-align: center;
        margin-bottom: 20px;
        color: #2c3e50;
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
        transition: border-color 0.3s;
    }

    input:focus {
        border-color: #4CAF50;
        outline: none;
    }

    button {
        width: 100%;
        padding: 14px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button:hover:not(:disabled) {
        background-color: #45a049;
    }

    button:disabled {
        background-color: #a5d6a7;
        cursor: not-allowed;
    }

    .erro {
        color: #dc3545;
        text-align: center;
        margin-top: 15px;
        font-weight: bold;
    }
</style>