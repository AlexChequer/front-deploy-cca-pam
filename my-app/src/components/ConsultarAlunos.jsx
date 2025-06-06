// src/components/ConsultarAlunos.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  InputAdornment,
  Pagination,
  ButtonBase,
  Container,
  Fade,
  Card,
  CardContent,
  Chip,
  Grid,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Logout as LogoutIcon,
  FilterList as FilterListIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

// Calcula idade a partir de "YYYY-MM-DD"
const calcularIdade = (dataNascimento) => {
  if (!dataNascimento) return '';
  const hoje = new Date();
  const nasc = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const mes = hoje.getMonth() - nasc.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
    idade--;
  }
  return idade;
};

// Extrai mês de aniversário (1-12) de "YYYY-MM-DD"
const extrairMes = (dataNascimento) => {
  if (!dataNascimento) return null;
  const nasc = new Date(dataNascimento);
  return nasc.getMonth() + 1; // Janeiro=1, Fevereiro=2, ...
};

// Formata texto de raça (capitaliza apenas a primeira letra)
const formatarRaca = (raca) => {
  if (!raca) return '';
  const lower = raca.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

// Formata gênero
const formatarGenero = (sexo) => {
  if (sexo === 'F') return 'Feminino';
  if (sexo === 'M') return 'Masculino';
  return '';
};

// Formata horário
const formatarHorario = (horario) => {
  if (horario === 'MANHA') return 'Manhã';
  if (horario === 'TARDE') return 'Tarde';
  return '';
};

const ConsultarAlunos = () => {
  const navigate = useNavigate();
  const [todosAlunos, setTodosAlunos] = useState([]); // lista completa do backend
  const [alunos, setAlunos] = useState([]);           // lista filtrada + paginada
  const [paginaAtual, setPaginaAtual] = useState(1);

  const [filtros, setFiltros] = useState({
    idade: '',
    genero: '',
    nis: '',
    turma: '',
    raca: '',
    horario: '',
    mes: '',    // mês de aniversário (1-12)
    busca: '',
    desligado: false // false = mostrar apenas ativos; true = mostrar apenas desligados
  });

  const handleFiltroChange = (field) => (e) => {
    setFiltros((prev) => ({ ...prev, [field]: e.target.value }));
  };
  const handleCheckboxChange = (e) => {
    setFiltros((prev) => ({ ...prev, desligado: e.target.checked }));
  };

  // Verifica se o aluno está desligado (dataDesligamento ou motivoDesligamento != null)
  const estaDesligado = (aluno) => {
    return Boolean(aluno.dataDesligamento) || Boolean(aluno.motivoDesligamento);
  };

  // Aplica TODOS os filtros sobre a lista e retorna os alunos filtrados
  const aplicarFiltrosEm = useCallback((lista, filtrosAtuais) => {
    return lista.filter((aluno) => {
      const deslig = estaDesligado(aluno);

      // 1) Filtrar por “desligado” ou “ativo”
      if (deslig !== filtrosAtuais.desligado) {
        return false;
      }

      // 2) Filtrar por idade
      if (filtrosAtuais.idade) {
        const idadeAluno = calcularIdade(aluno.dataNascimento);
        if (idadeAluno !== Number(filtrosAtuais.idade)) return false;
      }

      // 3) Filtrar por gênero
      if (filtrosAtuais.genero) {
        if (aluno.sexo !== filtrosAtuais.genero) return false;
      }

      // 4) Filtrar por NIS (sub-string)
      if (filtrosAtuais.nis) {
        if (!aluno.numeroNIS.toString().includes(filtrosAtuais.nis)) return false;
      }

      // 5) Filtrar por turma
      if (filtrosAtuais.turma) {
        if (aluno.turma.toString() !== filtrosAtuais.turma) return false;
      }

      // 6) Filtrar por raça
      if (filtrosAtuais.raca) {
        if (aluno.corRaca !== filtrosAtuais.raca) return false;
      }

      // 7) Filtrar por horário
      if (filtrosAtuais.horario) {
        if (aluno.horario !== filtrosAtuais.horario) return false;
      }

      // 8) Filtrar por mês de aniversário
      if (filtrosAtuais.mes) {
        const mesAluno = extrairMes(aluno.dataNascimento);
        if (mesAluno !== Number(filtrosAtuais.mes)) return false;
      }

      // 9) Filtrar por busca "nome ou NIS"
      if (filtrosAtuais.busca) {
        const termo = filtrosAtuais.busca.toLowerCase();
        const nomeLower = aluno.nome.toLowerCase();
        const nisLower = aluno.numeroNIS.toString().toLowerCase();
        if (!nomeLower.includes(termo) && !nisLower.includes(termo)) return false;
      }

      return true;
    });
  }, []);

  // Busca todos os alunos no backend
  const carregarTodosAlunos = async () => {
    try {
      const response = await fetch(`https://cca-pam.onrender.com/criancas`);
      const data = await response.json();
      const lista = Array.isArray(data.content) ? data.content : [];
      setTodosAlunos(lista);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      setTodosAlunos([]);
    }
  };

  // Ao montar o componente, traz a lista inicial
  useEffect(() => {
    carregarTodosAlunos();
  }, []);

  // Sempre que 'todosAlunos' ou 'filtros' mudarem, reaplica filtros
  useEffect(() => {
    const filtrados = aplicarFiltrosEm(todosAlunos, filtros);
    setAlunos(filtrados);
    setPaginaAtual(1); // volta para a página 1 sempre que filtrar
  }, [todosAlunos, filtros, aplicarFiltrosEm]);

  // Disparado ao clicar em “Buscar Alunos” (refiltra manualmente)
  const buscarAlunos = () => {
    const filtrados = aplicarFiltrosEm(todosAlunos, filtros);
    setAlunos(filtrados);
    setPaginaAtual(1);
  };

  // Ao “desligar” o aluno, navegamos para a rota de desligamento
  const desligarAluno = (id) => {
    navigate(`/desligar/${id}`);
  };

  const ativarAluno = async (id) => {
    try {
      await fetch(`https://cca-pam.onrender.com/criancas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        dataDesligamento: null,
        motivoDesligamento: null,
        nome: form.nome,
        sexo: form.sexo,
        mae: form.mae,
        pai: form.pai,
        dataInscricao: form.dataInscricao,
        dataMatricula: form.dataMatricula,
        numeroNIS: form.numeroNIS,
        dataNascimento: form.dataNascimento,
        naturalidade: form.naturalidade,
        corRaca: form.corRaca,
        pcd: form.pcd,
        cpf: form.cpf,
        rg: form.rg,
        dataEmissao: form.dataEmissao,
        uf: form.uf,
        serie: form.serie,
        horario: form.horario,
        faltasNaSemana: form.faltasNaSemana,
        nomeEscola: form.nomeEscola,
        turma: form.turma,
        responsaveis: [
          {
            nome: form.responsavel.nome,
            grauDeParentesco: form.responsavel.grauDeParentesco,
            estadoCivil: form.responsavel.estadoCivil,
            grauEnsinoFundamental: form.responsavel.grauEnsinoFundamental,
            grauEnsinoMedio: form.responsavel.grauEnsinoMedio,
            grauEnsinoSuperior: form.responsavel.grauEnsinoSuperior,
            profissao: form.responsavel.profissao,
            ocupacao: form.responsavel.ocupacao,
            estadoEmprego: form.responsavel.estadoEmprego,
            renda: form.responsavel.renda,
            endereco: form.responsavel.endereco,
            numeroEndereco: form.responsavel.numeroEndereco,
            complementoEndereco: form.responsavel.complementoEndereco,
            bairro: form.responsavel.bairro,
            distrito: form.responsavel.distrito,
            cep: form.responsavel.cep,
            telefoneCelular: form.responsavel.telefoneCelular,
            telefoneResidencial: form.responsavel.telefoneResidencial,
            telefone: form.responsavel.telefone,
            pontoDeReferencia: form.responsavel.pontoDeReferencia,
            condicaoMoradia: form.responsavel.condicaoMoradia,
            numeroDeComodos: form.responsavel.numeroDeComodos,
            valorAluguelOuFinanciamento: form.responsavel.valorAluguelOuFinanciamento,
            tipoConstrucao: form.responsavel.tipoConstrucao,
            situacaoHabitacional: form.responsavel.situacaoHabitacional,
            recebePTR: form.responsavel.recebePTR,
            recebeBPC: form.responsavel.recebeBPC,
          },
        ],
        familiares: form.familiares.map((f) => ({
          nome: f.nome,
          dataNascimento: f.dataNascimento,
          parentesco: f.parentesco,
          profissao: f.profissao,
          ocupacao: f.ocupacao,
          renda: f.renda,
          fatorRiscoSocial: f.fatorRiscoSocial,
        })),
      }),
    });

      // 1) Limpamos o checkbox “Mostrar somente desligados” para false
      setFiltros((prev) => ({ ...prev, desligado: false }));

      // 2) Recarregamos todos os alunos (já com o registro atualizado)
      await carregarTodosAlunos();
    } catch (error) {
      console.error('Erro ao ativar aluno:', error);
      alert('Falha ao reativar o aluno.');
    }
  };

  // Pega somente os alunos da página atual
  const alunosPaginados = alunos.slice(
    (paginaAtual - 1) * ITEMS_PER_PAGE,
    paginaAtual * ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" sx={{ 
        backgroundColor: '#00249C',
        boxShadow: '0 4px 20px rgba(0, 36, 156, 0.3)'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box
            sx={{
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'Montserrat',
              fontSize: 20,
              borderLeft: '4px solid #FFD700',
              pl: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box>
              <div>CCA</div>
              <div>PAM</div>
            </Box>
            <SchoolIcon sx={{ ml: 1 }} />
          </Box>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            startIcon={<LogoutIcon />}
            sx={{
              transition: 'all 0.3s ease',
              borderRadius: 2,
              px: 2,
              py: 1,
              '&:hover': {
                color: '#FFD700',
                transform: 'scale(1.05)',
                backgroundColor: 'rgba(255, 215, 0, 0.1)'
              }
            }}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flex: 1, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        {/* Sidebar de Filtros */}
        <Paper
          elevation={8}
          sx={{
            width: 320,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 0,
            borderRight: '1px solid rgba(0, 36, 156, 0.1)'
          }}
        >
          <Box sx={{ p: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{
                mb: 3,
                color: '#00249C',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0, 36, 156, 0.1)',
                  transform: 'translateX(-3px)'
                }
              }}
            >
              Voltar
            </Button>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 3,
              pb: 2,
              borderBottom: '2px solid #FFD700'
            }}>
              <FilterListIcon sx={{ color: '#00249C' }} />
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: '#00249C', 
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                Filtros de Busca
              </Typography>
            </Box>

            {/* Campo de busca */}
            <TextField
              fullWidth
              placeholder="Buscar por nome, NIS..."
              value={filtros.busca}
              onChange={handleFiltroChange('busca')}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 36, 156, 0.15)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 12px rgba(0, 36, 156, 0.25)'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#00249C' }} />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label="Idade"
              type="number"
              fullWidth
              value={filtros.idade}
              onChange={handleFiltroChange('idade')}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              inputProps={{ min: 0 }}
            />

            <TextField
              label="Gênero"
              select
              fullWidth
              value={filtros.genero}
              onChange={handleFiltroChange('genero')}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="F">Feminino</MenuItem>
              <MenuItem value="M">Masculino</MenuItem>
            </TextField>

            <TextField
              label="NIS"
              fullWidth
              value={filtros.nis}
              onChange={handleFiltroChange('nis')}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              label="Turma"
              select
              fullWidth
              value={filtros.turma}
              onChange={handleFiltroChange('turma')}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="1">Turma 1</MenuItem>
              <MenuItem value="2">Turma 2</MenuItem>
              <MenuItem value="3">Turma 3</MenuItem>
            </TextField>

            <TextField
              label="Horário"
              select
              fullWidth
              value={filtros.horario}
              onChange={handleFiltroChange('horario')}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="MANHA">Manhã</MenuItem>
              <MenuItem value="TARDE">Tarde</MenuItem>
            </TextField>

            <TextField
              label="Raça"
              select
              fullWidth
              value={filtros.raca}
              onChange={handleFiltroChange('raca')}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="BRANCA">Branca</MenuItem>
              <MenuItem value="PARDA">Parda</MenuItem>
              <MenuItem value="PRETA">Preta</MenuItem>
              <MenuItem value="AMARELA">Amarela</MenuItem>
              <MenuItem value="INDIGENA">Indígena</MenuItem>
            </TextField>

            <TextField
              label="Mês de Aniversário"
              select
              fullWidth
              value={filtros.mes}
              onChange={handleFiltroChange('mes')}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="1">Janeiro</MenuItem>
              <MenuItem value="2">Fevereiro</MenuItem>
              <MenuItem value="3">Março</MenuItem>
              <MenuItem value="4">Abril</MenuItem>
              <MenuItem value="5">Maio</MenuItem>
              <MenuItem value="6">Junho</MenuItem>
              <MenuItem value="7">Julho</MenuItem>
              <MenuItem value="8">Agosto</MenuItem>
              <MenuItem value="9">Setembro</MenuItem>
              <MenuItem value="10">Outubro</MenuItem>
              <MenuItem value="11">Novembro</MenuItem>
              <MenuItem value="12">Dezembro</MenuItem>
            </TextField>

            {/* Checkbox: Mostrar somente desligados */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={filtros.desligado}
                  onChange={handleCheckboxChange}
                  color="primary"
                />
              }
              label="Mostrar somente desligados"
              sx={{ mb: 3, '& .MuiTypography-root': { fontWeight: 'bold', color: '#00249C' } }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={buscarAlunos}
              sx={{
                background: 'linear-gradient(45deg, #00249C 30%, #0039CB 90%)',
                borderRadius: 2,
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(0, 36, 156, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(45deg, #001973 30%, #002DA6 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 36, 156, 0.6)'
                }
              }}
            >
              <SearchIcon sx={{ mr: 1 }} />
              Buscar Alunos
            </Button>
          </Box>
        </Paper>

        {/* Lista de Alunos */}
        <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
          <Container maxWidth="lg">
            <Fade in timeout={800}>
              <Paper 
                elevation={8} 
                sx={{ 
                  p: 4, 
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  mb: 3
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 3,
                  pb: 2,
                  borderBottom: '2px solid #FFD700'
                }}>
                  <PersonIcon sx={{ color: '#00249C', fontSize: 30 }} />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#00249C'
                    }}
                  >
                    Lista de Alunos
                  </Typography>
                  <Chip 
                    label={`${alunos.length} encontrados`}
                    sx={{ 
                      background: 'linear-gradient(45deg, #00249C 30%, #0039CB 90%)',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>

                {alunosPaginados.map((aluno, index) => (
                  <Fade in timeout={600 + index * 100} key={aluno.id}>
                    <ButtonBase
                      onClick={() => {
                        // se aluno estiver desligado, não navegamos para detalhes
                        if (!estaDesligado(aluno)) {
                          navigate(`/aluno/${aluno.id}`);
                        }
                      }}
                      sx={{ display: 'block', width: '100%', textAlign: 'left', mb: 2 }}
                    >
                      <Card
                        sx={{
                          transition: 'all 0.3s ease',
                          cursor: estaDesligado(aluno) ? 'default' : 'pointer',
                          borderRadius: 3,
                          background: aluno.faltasNaSemana >= 3 
                            ? 'linear-gradient(135deg, #FFF8DC 0%, #FFFACD 100%)' 
                            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                          border: aluno.faltasNaSemana >= 3 ? '2px solid #FFD700' : '1px solid #e0e0e0',
                          opacity: estaDesligado(aluno) ? 0.6 : 1,
                          '&:hover': estaDesligado(aluno)
                            ? {}
                            : {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 25px rgba(0, 36, 156, 0.15)',
                                background: aluno.faltasNaSemana >= 3 
                                  ? 'linear-gradient(135deg, #FFF5B0 0%, #FFE55C 100%)' 
                                  : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                              }
                        }}
                        elevation={2}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: 'bold',
                                  color: '#00249C',
                                  mb: 2
                                }}
                              >
                                {aluno.nome} {estaDesligado(aluno) && '(Desligado)'}
                              </Typography>
                              
                              <Grid container spacing={2}>
                                <Grid item xs={6} sm={4}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <CalendarIcon sx={{ fontSize: 16, color: '#666' }} />
                                    <Typography variant="body2" color="textSecondary">
                                      Idade: <strong>{calcularIdade(aluno.dataNascimento)}</strong>
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <PersonIcon sx={{ fontSize: 16, color: '#666' }} />
                                    <Typography variant="body2" color="textSecondary">
                                      Gênero: <strong>{formatarGenero(aluno.sexo)}</strong>
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography variant="body2" color="textSecondary">
                                      NIS: <strong>{aluno.numeroNIS}</strong>
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <SchoolIcon sx={{ fontSize: 16, color: '#666' }} />
                                    <Typography variant="body2" color="textSecondary">
                                      Turma: <strong>{aluno.turma}</strong>
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography variant="body2" color="textSecondary">
                                      Raça: <strong>{formatarRaca(aluno.corRaca)}</strong>
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <TimeIcon sx={{ fontSize: 16, color: '#666' }} />
                                    <Typography variant="body2" color="textSecondary">
                                      Horário: <strong>{formatarHorario(aluno.horario)}</strong>
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>

                              {aluno.faltasNaSemana >= 3 && (
                                <Chip 
                                  label="Muitas faltas"
                                  size="small"
                                  sx={{ 
                                    mt: 1,
                                    backgroundColor: '#FF6B35',
                                    color: 'white',
                                    fontWeight: 'bold'
                                  }}
                                />
                              )}
                            </Box>

                            {/* Botões Editar / Desligar / Ligar */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                size="small"
                                disabled={estaDesligado(aluno)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/editar-aluno/${aluno.id}`);
                                }}
                                sx={{
                                  background: estaDesligado(aluno)
                                    ? 'rgba(40, 167, 69, 0.3)'
                                    : 'linear-gradient(45deg, #28a745 30%, #34ce57 90%)',
                                  borderRadius: 2,
                                  fontWeight: 'bold',
                                  boxShadow: estaDesligado(aluno) 
                                    ? 'none' 
                                    : '0 4px 12px rgba(40, 167, 69, 0.4)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': estaDesligado(aluno)
                                    ? {}
                                    : {
                                        background: 'linear-gradient(45deg, #218838 30%, #28a745 90%)',
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 6px 16px rgba(40, 167, 69, 0.6)'
                                      }
                                }}
                              >
                                Editar
                              </Button>

                              {/* Se não estiver desligado, mostra botão “Desligar” */}
                              {!estaDesligado(aluno) && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    desligarAluno(aluno.id);
                                  }}
                                  sx={{
                                    borderRadius: 2,
                                    fontWeight: 'bold',
                                    borderColor: '#8B0000',
                                    color: '#8B0000',
                                    '&:hover': {
                                      backgroundColor: 'rgba(139, 0, 0, 0.1)',
                                      transform: 'scale(1.02)',
                                      borderColor: '#8B0000'
                                    }
                                  }}
                                >
                                  Desligar
                                </Button>
                              )}

                              {/* Se estiver desligado, mostra botão “Ligar” */}
                              {estaDesligado(aluno) && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    ativarAluno(aluno.id);
                                  }}
                                  sx={{
                                    background: 'linear-gradient(45deg, #1E90FF 30%, #00BFFF 90%)',
                                    borderRadius: 2,
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 12px rgba(30, 144, 255, 0.4)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      background: 'linear-gradient(45deg, #187bcd 30%, #009acd 90%)',
                                      transform: 'scale(1.05)',
                                      boxShadow: '0 6px 16px rgba(30, 144, 255, 0.6)'
                                    }
                                  }}
                                >
                                  Ligar
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </ButtonBase>
                  </Fade>
                ))}

                {alunosPaginados.length === 0 && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    borderRadius: 3,
                    border: '2px dashed #dee2e0'
                  }}>
                    <PersonIcon sx={{ fontSize: 60, color: '#dee2e0', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                      Nenhum aluno encontrado
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Ajuste os filtros de busca.
                    </Typography>
                  </Box>
                )}

                {alunos.length > ITEMS_PER_PAGE && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 4,
                    pt: 3,
                    borderTop: '1px solid #e0e0e0'
                  }}>
                    <Pagination
                      count={Math.ceil(alunos.length / ITEMS_PER_PAGE)}
                      page={paginaAtual}
                      onChange={(e, page) => setPaginaAtual(page)}
                      color="primary"
                      size="large"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          borderRadius: 2,
                          fontWeight: 'bold',
                          '&.Mui-selected': {
                            background: 'linear-gradient(45deg, #00249C 30%, #0039CB 90%)',
                            color: 'white'
                          }
                        }
                      }}
                    />
                  </Box>
                )}
              </Paper>
            </Fade>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default ConsultarAlunos;
