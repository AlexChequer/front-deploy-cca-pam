// src/components/DesligarAluno.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Container,
  IconButton
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const motivos = [
  'ABANDONO',
  'OBITO',
  'MUDANCA_DE_ENDERECO',
  'LIMITE_DE_IDADE'
];

export default function DesligarAluno() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nomeCrianca, setNomeCrianca] = useState('');
  const [dataDesligamento, setDataDesligamento] = useState('');
  const [motivoDesligamento, setMotivoDesligamento] = useState('');

  // Na montagem, busca o nome da criança pelo ID
  useEffect(() => {
    // Ajuste a URL conforme seu backend: /criancas/{id}
    fetch(`https://cca-pam.onrender.com/criancas/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Não foi possível carregar a criança');
        return res.json();
      })
      .then((data) => {
        setNomeCrianca(data.nome);
      })
      .catch((err) => {
        console.error(err);
        alert('Erro ao buscar dados da criança.');
      });

    // Preenche data de hoje no input de data
    const hoje = new Date();
    const yyyy = hoje.getFullYear();
    const mm = String(hoje.getMonth() + 1).padStart(2, '0');
    const dd = String(hoje.getDate()).padStart(2, '0');
    setDataDesligamento(`${yyyy}-${mm}-${dd}`);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!motivoDesligamento) {
      alert('Escolha um motivo para o desligamento.');
      return;
    }

    const payload = {
      dataDesligamento,
      motivoDesligamento
    };

    // Ajuste a URL para o endpoint de desligamento no seu backend
    fetch(`https://cca-pam.onrender.com/criancas/${id}/desligar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao registrar desligamento');
        alert('Desligamento registrado com sucesso.');
        navigate('/consultar');
      })
      .catch((err) => {
        console.error(err);
        alert('Falha ao registrar desligamento.');
      });
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" sx={{ backgroundColor: '#00249C' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/consultar')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
            Desligar Criança
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            startIcon={<LogoutIcon />}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#FFD700',
                transform: 'scale(1.05)'
              }
            }}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
          <form onSubmit={handleSubmit}>

            <Box sx={{ mb: 3 }}>
              <TextField
                label="Nome da Criança"
                value={nomeCrianca}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                label="Data de Desligamento"
                type="date"
                value={dataDesligamento}
                onChange={(e) => setDataDesligamento(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                label="Motivo do Desligamento"
                select
                value={motivoDesligamento}
                onChange={(e) => setMotivoDesligamento(e.target.value)}
                fullWidth
              >
                {motivos.map((motivo) => (
                  <MenuItem key={motivo} value={motivo}>
                    {motivo.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  background: 'linear-gradient(45deg, #8B0000 30%, #B22222 90%)',
                  borderRadius: 2,
                  fontWeight: 'bold',
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #7A0000 30%, #9E1E1E 90%)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Confirmar Desligamento
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
