<template>
  <div class="login-container">
    <div class="card">
      <h2>Criar Nova Conta</h2>
      
      <form @submit.prevent="fazerCadastro">
        <div class="input-group">
          <label for="nome">Nome Completo</label>
          <input type="text" id="nome" v-model="nome" required placeholder="Digite seu nome" />
        </div>

        <div class="input-group">
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model="email" required placeholder="Digite seu e-mail" />
        </div>

        <div class="input-group">
          <label for="senha">Senha</label>
          <input type="password" id="senha" v-model="senha" required placeholder="Digite sua senha" />
        </div>

        <button type="submit" :disabled="carregando">
          {{ carregando ? 'Cadastrando...' : 'Criar Conta' }}
        </button>

        <p v-if="mensagemErro" class="erro">{{ mensagemErro }}</p>
        <p v-if="mensagemSucesso" class="sucesso">{{ mensagemSucesso }}</p>
      </form>

      <div class="rodape-link">
        <p>Já tem uma conta? <router-link to="/">Faça Login</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const nome = ref('');
const email = ref('');
const senha = ref('');
const mensagemErro = ref('');
const mensagemSucesso = ref('');
const carregando = ref(false);
const router = useRouter();

async function fazerCadastro() {
  carregando.value = true;
  mensagemErro.value = '';
  mensagemSucesso.value = '';

  try {
    await axios.post('http://localhost:3000/api/auth/registrar', {
      nome: nome.value,
      email: email.value,
      senha: senha.value,
      papel: 'paciente' // Todo cadastro via tela será de paciente por padrão
    });
    
    mensagemSucesso.value = 'Conta criada com sucesso! Redirecionando para o login...';
    
    // Aguarda 2 segundos e manda o usuário para a tela de login
    setTimeout(() => {
      router.push('/');
    }, 2000);
    
  } catch (erro) {
    mensagemErro.value = erro.response?.data?.erro || 'Erro ao criar conta. Tente novamente.';
  } finally {
    carregando.value = false;
  }
}
</script>

<style scoped>
/* Aproveitando o mesmo estilo clean da tela de Login */
.login-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.card { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
h2 { text-align: center; margin-bottom: 20px; color: #2c3e50; }
.input-group { margin-bottom: 20px; display: flex; flex-direction: column; }
label { margin-bottom: 8px; font-weight: 600; color: #333; }
input { padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; transition: border-color 0.3s; }
input:focus { border-color: #4CAF50; outline: none; }
button { width: 100%; padding: 14px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer; transition: background-color 0.3s; }
button:hover:not(:disabled) { background-color: #45a049; }
button:disabled { background-color: #a5d6a7; cursor: not-allowed; }
.erro { color: #dc3545; text-align: center; margin-top: 15px; font-weight: bold; }
.sucesso { color: #2ecc71; text-align: center; margin-top: 15px; font-weight: bold; }
.rodape-link { margin-top: 20px; text-align: center; font-size: 14px; }
.rodape-link a { color: #3498db; text-decoration: none; font-weight: bold; }
.rodape-link a:hover { text-decoration: underline; }
</style>