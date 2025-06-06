import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  InputAdornment
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import SchoolIcon from '@mui/icons-material/School';

const Login = () => {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://cca-pam.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, senha })
      });
      if (!response.ok) {
        alert('Erro no servidor. Tente novamente.');
        return;
      }
      const data = await response.json();
      if (data.success) {
        navigate('/dashboard');
      } else {
        alert('Credenciais inválidas');
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor');
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Topo */}
      <AppBar position="static" sx={{ backgroundColor: '#00249C' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box
            sx={{
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'Montserrat',
              fontSize: 20,
              borderLeft: '4px solid gold',
              pl: 2
            }}
          >
            <div>CCA</div>
            <div>PAM</div>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Conteúdo */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Paper
          elevation={5}
          sx={{ p: 5, width: '100%', maxWidth: 420, borderRadius: 4, textAlign: 'center' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <LoginIcon sx={{ fontSize: 48, color: '#00249C' }} />
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Bem-vindo
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Faça login para acessar o sistema
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}
          >
            <TextField
              label="Nome de usuário"
              variant="outlined"
              fullWidth
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              variant="contained"
              startIcon={<LoginIcon />}
              fullWidth
              sx={{
                mt: 1,
                py: 1.4,
                fontWeight: 'bold',
                backgroundColor: '#00249C',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#001C7A',
                  transform: 'scale(1.03)',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              Entrar
            </Button>
          </Box>

          {/* Rodapé com texto “Acesso Restrito” e link “Sobre Nós” */}
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ mt: 4, display: 'block' }}
          >
            Sistema CCA PAM – Acesso Restrito
          </Typography>

          {/* Texto “Sobre Nós” menor, clicável */}
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: '#00249C',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
            onClick={() => navigate('/sobrenos')}
          >
            Sobre Nós
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
