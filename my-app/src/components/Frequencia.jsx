// src/components/Frequencia.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Paper,
  TextField,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';

const Frequencia = () => {
  const navigate = useNavigate();

  // Período ("MANHA" ou "TARDE")
  const [periodo, setPeriodo] = useState('MANHA');
  // Turma (1, 2 ou 3)
  const [selectedTurma, setSelectedTurma] = useState(1);
  // Lista de alunos dessa turma/período
  const [alunosTurma, setAlunosTurma] = useState([]);
  // Carregamento geral
  const [loading, setLoading] = useState(false);
  // Estado local dos valores de faltas semanais: { [alunoId]: number }
  const [faltasSemana, setFaltasSemana] = useState({});
  // Armazena os valores originais (para resetar se quiser)
  const [initialFaltasSemana, setInitialFaltasSemana] = useState({});
  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Ao mudar período ou turma, buscar alunos e seus faltasNaSemana
  useEffect(() => {
    const fetchAlunosComFaltas = async () => {
      setLoading(true);
      try {
        // GET /criancas?turma={selectedTurma}&horario={periodo}
        const resp = await fetch(
          `https://cca-pam.onrender.com/criancas?turma=${selectedTurma}&horario=${periodo}`
        );
        const data = await resp.json();
        const lista = Array.isArray(data.content) ? data.content : [];

        // Montar estado inicial de faltasSemana
        const mapaFaltas = {};
        lista.forEach((aluno) => {
          mapaFaltas[aluno.id] = aluno.faltasNaSemana || 0;
        });

        setAlunosTurma(lista);
        setFaltasSemana({ ...mapaFaltas });
        setInitialFaltasSemana({ ...mapaFaltas });
      } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        setAlunosTurma([]);
        setFaltasSemana({});
        setInitialFaltasSemana({});
      } finally {
        setLoading(false);
      }
    };

    fetchAlunosComFaltas();
  }, [periodo, selectedTurma]);

  // Atualiza valor local quando usuário altera o número
  const handleChangeFalta = (alunoId, novoValor) => {
    const valor = Math.max(0, Number(novoValor));
    setFaltasSemana((prev) => ({
      ...prev,
      [alunoId]: valor,
    }));
  };

  // Ao clicar em “Salvar Frequência”, enviar todos os valores ao backend
  const handleSalvarFrequencia = async () => {
    setLoading(true);
    try {
      // Montar payload: lista de { alunoId, faltasNaSemana }
      const payload = alunosTurma.map((aluno) => ({
        alunoId: aluno.id,
        faltasNaSemana: faltasSemana[aluno.id] || 0,
      }));

      // Enviar ao backend no endpoint POST /frequencia/semana/turma/{turma}?horario={periodo}
      await fetch(
        `https://cca-pam.onrender.com/frequencia/semana/turma/${selectedTurma}?horario=${periodo}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dados: payload }),
        }
      );

      // Após salvar, atualizar initialFaltasSemana
      setInitialFaltasSemana({ ...faltasSemana });
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao salvar faltas:', error);
      alert('Não foi possível salvar as faltas. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Barra superior: Voltar e Sair */}
      <AppBar position="static" sx={{ backgroundColor: '#00249C' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Faltas Semanais –{' '}
              {periodo === 'MANHA' ? 'Manhã' : 'Tarde'} – Turma{' '}
              {selectedTurma}
            </Typography>
          </Box>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            startIcon={<LogoutIcon />}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      {/* Texto de instrução */}
      <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="subtitle1" align="center">
          Registre aqui as faltas de cada aluno:
        </Typography>
      </Box>

      {/* Seletor de PERÍODO (MANHÃ / TARDE) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          bgcolor: '#f0f0f0',
          p: 1,
        }}
      >
        {['MANHA', 'TARDE'].map((p) => (
          <Button
            key={p}
            variant={periodo === p ? 'contained' : 'outlined'}
            sx={{
              backgroundColor: periodo === p ? '#00249C' : 'white',
              color: periodo === p ? 'white' : 'black',
              '&:hover': {
                backgroundColor: periodo === p ? '#001a7a' : '#e0e0e0',
              },
            }}
            onClick={() => setPeriodo(p)}
            disabled={loading}
          >
            {p === 'MANHA' ? 'Manhã' : 'Tarde'}
          </Button>
        ))}
      </Box>

      {/* Seletor de TURMA (1, 2, 3) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          bgcolor: '#fafafa',
          p: 1,
          borderBottom: '1px solid #ccc',
        }}
      >
        {[1, 2, 3].map((turma) => (
          <Button
            key={turma}
            variant={selectedTurma === turma ? 'contained' : 'outlined'}
            sx={{
              backgroundColor:
                selectedTurma === turma ? '#00249C' : 'white',
              color: selectedTurma === turma ? 'white' : 'black',
              '&:hover': {
                backgroundColor:
                  selectedTurma === turma ? '#001a7a' : '#e0e0e0',
              },
            }}
            onClick={() => setSelectedTurma(turma)}
            disabled={loading}
          >
            Turma {turma}
          </Button>
        ))}
      </Box>

      {/* Lista de alunos com campo numérico para faltas semanais */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : alunosTurma.length === 0 ? (
          <Typography align="center" sx={{ mt: 4 }}>
            Nenhum aluno encontrado para{' '}
            {periodo === 'MANHA' ? 'manhã' : 'tarde'} – Turma{' '}
            {selectedTurma}.
          </Typography>
        ) : (
          alunosTurma.map((aluno) => {
            const faltas = faltasSemana[aluno.id] ?? 0;
            const isWarning = faltas >= 3;

            return (
              <Paper
                key={aluno.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  mb: 2,
                  bgcolor: isWarning ? '#FFFACD' : 'white'
                }}
                elevation={2}
              >
                <Box>
                  <Typography variant="subtitle1">{aluno.nome}</Typography>
                  {isWarning && (
                    <Typography variant="caption" color="error">
                      Atenção: muitas faltas esta semana
                    </Typography>
                  )}
                </Box>
                <TextField
                  label="Faltas Semanais"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  value={faltas}
                  onChange={(e) =>
                    handleChangeFalta(aluno.id, e.target.value)
                  }
                  sx={{ width: 120 }}
                  disabled={loading}
                />
              </Paper>
            );
          })
        )}
      </Box>

      {/* Botão para salvar todas as alterações */}
      <Box sx={{ p: 2, bgcolor: '#f0f0f0', textAlign: 'center' }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#00249C', borderRadius: '10px', px: 4, py: 1.5 }}
          onClick={handleSalvarFrequencia}
          disabled={loading}
        >
          Salvar Frequência
        </Button>
      </Box>

      {/* Snackbar de sucesso */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          As faltas semanais foram atualizadas com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Frequencia;
