// src/components/DetalheAluno.jsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useParams, useNavigate } from 'react-router-dom';

// ———————————————
// Funções de formatação (mantidas sem alteração)
// ———————————————

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

const formatarRaca = (raca) => {
  if (!raca) return '';
  const lower = raca.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const formatarGenero = (sexo) => {
  if (sexo === 'F') return 'Feminino';
  if (sexo === 'M') return 'Masculino';
  return '';
};

const formatarHorario = (horario) => {
  if (horario === 'MANHA') return 'Manhã';
  if (horario === 'TARDE') return 'Tarde';
  return '';
};

const formatarGrauEnsino = (valorEnum) => {
  if (!valorEnum) return '';
  const v = valorEnum.toLowerCase();
  switch (v) {
    case 'completo':
      return 'Completo';
    case 'incompleto':
      return 'Incompleto';
    default:
      return valorEnum.charAt(0).toUpperCase() + valorEnum.slice(1).toLowerCase();
  }
};

const formatarEstadoCivil = (valorEnum) => {
  if (!valorEnum) return '';
  const v = valorEnum.toLowerCase();
  switch (v) {
    case 'solteiro':
      return 'Solteiro(a)';
    case 'casado':
      return 'Casado(a)';
    case 'separado':
      return 'Separado(a)';
    case 'divorciado':
      return 'Divorciado(a)';
    case 'viuvo':
      return 'Viúvo(a)';
    default:
      return valorEnum.charAt(0).toUpperCase() + valorEnum.slice(1).toLowerCase();
  }
};

const formatarEstadoEmprego = (valorEnum) => {
  if (!valorEnum) return '';
  const v = valorEnum.toLowerCase();
  switch (v) {
    case 'empregado':
      return 'Empregado';
    case 'desempregado':
      return 'Desempregado';
    case 'aposentado':
      return 'Aposentado';
    case 'pensionista':
      return 'Pensionista';
    default:
      return valorEnum.charAt(0).toUpperCase() + valorEnum.slice(1).toLowerCase();
  }
};

const formatarCondicaoMoradia = (valorEnum) => {
  if (!valorEnum) return '';
  const v = valorEnum.toLowerCase();
  switch (v) {
    case 'propria':
      return 'Própria';
    case 'alugada':
      return 'Alugada';
    case 'cedida':
      return 'Cedida';
    default:
      return valorEnum.charAt(0).toUpperCase() + valorEnum.slice(1).toLowerCase();
  }
};

const formatarTipoConstrucao = (valorEnum) => {
  if (!valorEnum) return '';
  const v = valorEnum.toLowerCase();
  switch (v) {
    case 'alvenaria':
      return 'Alvenaria';
    case 'madeira':
      return 'Madeira';
    case 'mista':
      return 'Mista';
    default:
      return valorEnum.charAt(0).toUpperCase() + valorEnum.slice(1).toLowerCase();
  }
};

const formatarSituacaoHabitacional = (valorEnum) => {
  if (!valorEnum) return '';
  const v = valorEnum.toLowerCase();
  switch (v) {
    case 'cortico':
      return 'Córtico';
    case 'favela':
      return 'Favela';
    case 'loteamento_irregular':
      return 'Loteamento Irregular';
    default:
      return valorEnum.charAt(0).toUpperCase() + valorEnum.slice(1).toLowerCase();
  }
};

const formatarRecebePTR = (valorEnum) => {
  if (!valorEnum) return '';
  const v = valorEnum.toLowerCase();
  switch (v) {
    case 'nao':
      return 'Não';
    case 'renda_minima':
      return 'Renda Mínima';
    case 'bolsa_familia':
      return 'Bolsa Família';
    case 'renda_cidada':
      return 'Renda Cidadã';
    case 'acao_jovem':
      return 'Ação Jovem';
    case 'peti':
      return 'PETI';
    default:
      return valorEnum.charAt(0).toUpperCase() + valorEnum.slice(1).toLowerCase();
  }
};

const formatarRecebeBPC = (valorEnum) => {
  if (!valorEnum) return '';
  const v = valorEnum.toLowerCase();
  switch (v) {
    case 'nao':
      return 'Não';
    case 'idoso':
      return 'Idoso';
    case 'pcd':
      return 'PCD';
    default:
      return valorEnum.charAt(0).toUpperCase() + valorEnum.slice(1).toLowerCase();
  }
};

const formatarParentesco = (parentescoEnum) => {
  if (!parentescoEnum) return '';
  const v = parentescoEnum.toLowerCase();
  switch (v) {
    case 'pai':
      return 'Pai';
    case 'mae':
      return 'Mãe';
    case 'irmao':
      return 'Irmão';
    case 'irma':
      return 'Irmã';
    case 'avo':
      return 'Avô';
    case 'ava':
      return 'Avó';
    case 'tio':
      return 'Tio';
    case 'tia':
      return 'Tia';
    case 'outro':
      return 'Outro';
    default:
      return parentescoEnum.charAt(0).toUpperCase() + parentescoEnum.slice(1).toLowerCase();
  }
};

const extrairIniciais = (nome) => {
  if (!nome) return '';
  return nome
    .trim()
    .split(' ')
    .map((parte) => parte.charAt(0))
    .join('')
    .toUpperCase();
};

const formatarDataExibicao = (valor) => {
  if (!valor) return '';

  const date = new Date(valor.trim());
  if (isNaN(date.getTime())) {
    return valor;
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// —————————————————————
// Componente DetalheAluno (com mais rounding e espaçamento)
// —————————————————————

const DetalheAluno = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aluno, setAluno] = useState(null);
  const [relatorios, setRelatorios] = useState([]);

  useEffect(() => {
    fetch(`https://cca-pam.onrender.com/criancas/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Aluno não encontrado');
        return res.json();
      })
      .then((data) => {
        setAluno(data);
        setRelatorios(Array.isArray(data.relatorios) ? data.relatorios : []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  if (!aluno) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="#00249C">
          ⏳ Carregando dados do aluno…
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: '#00249C', height: 64 }}>
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 20,
              borderLeft: '4px solid gold',
              pl: 2,
              mr: 2,
              height: 48,
            }}
          >
            <div>CCA</div>
            <div>PAM</div>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ textTransform: 'none', fontSize: 16 }}
          >
            SAIR
          </Button>
        </Toolbar>
      </AppBar>

      {/* Container principal */}
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 3, px: 3, pb: 4 }}>
        {/* Botão “Voltar” */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            variant="contained"
            color="primary"
            sx={{
              textTransform: 'none',
              borderRadius: 3,
              py: 1.5,
              px: 3,
            }}
          >
            Voltar
          </Button>
        </Box>

        {/* Header com avatar e nome */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            backgroundColor: '#ffffff',
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: '#1976d2',
              fontSize: 36,
            }}
          >
            {extrairIniciais(aluno.nome)}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 250 }}>
            <Typography variant="h4" gutterBottom>
              {aluno.nome}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 1 }}>
              <Chip
                label={`Idade: ${calcularIdade(aluno.dataNascimento)} anos`}
                color="primary"
                size="medium"
                sx={{ borderRadius: 2 }}
              />
              <Chip
                label={`Turma ${aluno.turma}`}
                size="medium"
                sx={{ borderRadius: 2 }}
              />
              <Chip
                label={formatarHorario(aluno.horario)}
                variant="outlined"
                size="medium"
                sx={{ borderRadius: 2 }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Seção 1: Informações Gerais */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: '#ffffff',
            mb: 5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ color: '#1976d2', mr: 1.5, fontSize: 28 }} />
            <Typography variant="h6">Informações Gerais</Typography>
          </Box>
          <Divider sx={{ mb: 4 }} />

          {/* Fundo levemente cinza englobando todos os campos */}
          <Box sx={{ backgroundColor: '#fafafa', borderRadius: 2, p: 3 }}>
            {/**
              Cada campo/hint é um Box branco com borderRadius maior, espaçamento interno (p:2)
              e margin externa (mb: 3) para separar bem um do outro.
            **/}
            {/* Mãe */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <PersonIcon fontSize="medium" sx={{ color: '#1976d2', mr: 2 }} />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                Mãe:
              </Typography>
              <Typography sx={{ width: '70%' }}>{aluno.mae}</Typography>
            </Box>

            {/* Pai */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <PersonIcon fontSize="medium" sx={{ color: '#1976d2', mr: 2 }} />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                Pai:
              </Typography>
              <Typography sx={{ width: '70%' }}>{aluno.pai || '—'}</Typography>
            </Box>

            {/* Sexo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <PersonIcon fontSize="medium" sx={{ color: '#1976d2', mr: 2 }} />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                Sexo:
              </Typography>
              <Typography sx={{ width: '70%' }}>
                {formatarGenero(aluno.sexo)}
              </Typography>
            </Box>

            {/* Data de Inscrição */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <CalendarTodayIcon
                fontSize="medium"
                sx={{ color: '#1976d2', mr: 2 }}
              />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                Data de Inscrição:
              </Typography>
              <Typography sx={{ width: '70%' }}>
                {formatarDataExibicao(aluno.dataInscricao)}
              </Typography>
            </Box>

            {/* Data de Matrícula */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <CalendarTodayIcon
                fontSize="medium"
                sx={{ color: '#1976d2', mr: 2 }}
              />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                Data de Matrícula:
              </Typography>
              <Typography sx={{ width: '70%' }}>
                {formatarDataExibicao(aluno.dataMatricula)}
              </Typography>
            </Box>

            {/* NIS */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <PersonIcon fontSize="medium" sx={{ color: '#1976d2', mr: 2 }} />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                NIS:
              </Typography>
              <Typography sx={{ width: '70%' }}>{aluno.numeroNIS}</Typography>
            </Box>

            {/* Data de Nascimento + Idade */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <CalendarTodayIcon
                fontSize="medium"
                sx={{ color: '#1976d2', mr: 2 }}
              />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                Data de Nascimento:
              </Typography>
              <Typography sx={{ width: '70%' }}>
                {formatarDataExibicao(aluno.dataNascimento)} (
                {calcularIdade(aluno.dataNascimento)} anos)
              </Typography>
            </Box>

            {/* Naturalidade */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <PersonIcon fontSize="medium" sx={{ color: '#1976d2', mr: 2 }} />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                Naturalidade:
              </Typography>
              <Typography sx={{ width: '70%' }}>{aluno.naturalidade}</Typography>
            </Box>

            {/* Cor / Raça */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <PersonIcon fontSize="medium" sx={{ color: '#1976d2', mr: 2 }} />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                Cor / Raça:
              </Typography>
              <Typography sx={{ width: '70%' }}>
                {formatarRaca(aluno.corRaca)}
              </Typography>
            </Box>

            {/* PCD */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <PersonIcon fontSize="medium" sx={{ color: '#1976d2', mr: 2 }} />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                PCD:
              </Typography>
              <Typography sx={{ width: '70%' }}>
                {aluno.pcd ? 'Sim' : 'Não'}
              </Typography>
            </Box>

            {/* CPF */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <PersonIcon fontSize="medium" sx={{ color: '#1976d2', mr: 2 }} />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                CPF:
              </Typography>
              <Typography sx={{ width: '70%' }}>{aluno.cpf}</Typography>
            </Box>

            {/* RG */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <PersonIcon fontSize="medium" sx={{ color: '#1976d2', mr: 2 }} />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                RG:
              </Typography>
              <Typography sx={{ width: '70%' }}>{aluno.rg}</Typography>
            </Box>

            {/* Data de Emissão (RG) */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <CalendarTodayIcon
                fontSize="medium"
                sx={{ color: '#1976d2', mr: 2 }}
              />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                Data de Emissão (RG):
              </Typography>
              <Typography sx={{ width: '70%' }}>
                {formatarDataExibicao(aluno.dataEmissao)}
              </Typography>
            </Box>

            {/* UF */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <PersonIcon fontSize="medium" sx={{ color: '#1976d2', mr: 2 }} />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                UF:
              </Typography>
              <Typography sx={{ width: '70%' }}>{aluno.uf}</Typography>
            </Box>

            {/* Série */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <PersonIcon fontSize="medium" sx={{ color: '#1976d2', mr: 2 }} />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                Série:
              </Typography>
              <Typography sx={{ width: '70%' }}>{aluno.serie}</Typography>
            </Box>

            {/* Faltas na Semana */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <PersonIcon fontSize="medium" sx={{ color: '#1976d2', mr: 2 }} />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                Faltas na Semana:
              </Typography>
              <Typography sx={{ width: '70%' }}>
                {aluno.faltasNaSemana}
              </Typography>
            </Box>

            {/* Nome da Escola */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <PersonIcon fontSize="medium" sx={{ color: '#1976d2', mr: 2 }} />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                Nome da Escola:
              </Typography>
              <Typography sx={{ width: '70%' }}>
                {aluno.nomeEscola || '—'}
              </Typography>
            </Box>

            {/* Turma */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2.5,
                borderRadius: 3,
              }}
            >
              <PersonIcon fontSize="medium" sx={{ color: '#1976d2', mr: 2 }} />
              <Typography fontWeight="bold" sx={{ width: '30%' }}>
                Turma:
              </Typography>
              <Typography sx={{ width: '70%' }}>{aluno.turma}</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Seção 2: Responsáveis */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: '#ffffff',
            mb: 5,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Responsáveis
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {Array.isArray(aluno.responsaveis) &&
            aluno.responsaveis.map((resp, idx) => (
              <Box
                key={idx}
                sx={{ mb: idx < aluno.responsaveis.length - 1 ? 3 : 0 }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: '#fafafa',
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '35% 65%',
                      rowGap: 2.5,
                      columnGap: 4,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Nome:</Typography>
                    </Box>
                    <Typography> {resp.nome} </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Grau de Parentesco:</Typography>
                    </Box>
                    <Typography>
                      {formatarParentesco(resp.grauDeParentesco)}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Estado Civil:</Typography>
                    </Box>
                    <Typography>
                      {formatarEstadoCivil(resp.estadoCivil)}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Ensino Fundamental:</Typography>
                    </Box>
                    <Typography>
                      {formatarGrauEnsino(resp.grauEnsinoFundamental)}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Ensino Médio:</Typography>
                    </Box>
                    <Typography>
                      {formatarGrauEnsino(resp.grauEnsinoMedio)}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Ensino Superior:</Typography>
                    </Box>
                    <Typography>
                      {formatarGrauEnsino(resp.grauEnsinoSuperior)}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Profissão:</Typography>
                    </Box>
                    <Typography>{resp.profissao || '—'}</Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Ocupação:</Typography>
                    </Box>
                    <Typography>{resp.ocupacao || '—'}</Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Estado de Emprego:</Typography>
                    </Box>
                    <Typography>
                      {formatarEstadoEmprego(resp.estadoEmprego)}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Renda:</Typography>
                    </Box>
                    <Typography>R$ {resp.renda.toLocaleString()}</Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Endereço:</Typography>
                    </Box>
                    <Typography>
                      {resp.endereco}, {resp.numeroEndereco}
                      {resp.complementoEndereco
                        ? `, ${resp.complementoEndereco}`
                        : ''}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Bairro:</Typography>
                    </Box>
                    <Typography>{resp.bairro}</Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Distrito:</Typography>
                    </Box>
                    <Typography>{resp.distrito}</Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">CEP:</Typography>
                    </Box>
                    <Typography>{resp.cep}</Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Telefone Celular:</Typography>
                    </Box>
                    <Typography>
                      {resp.telefoneCelular || '—'}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Telefone Residencial:</Typography>
                    </Box>
                    <Typography>
                      {resp.telefoneResidencial || '—'}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Telefone (outro):</Typography>
                    </Box>
                    <Typography>{resp.telefone || '—'}</Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Ponto de Referência:</Typography>
                    </Box>
                    <Typography>
                      {resp.pontoDeReferencia || '—'}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Condição de Moradia:</Typography>
                    </Box>
                    <Typography>
                      {formatarCondicaoMoradia(resp.condicaoMoradia)}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Qtd. Cômodos:</Typography>
                    </Box>
                    <Typography>{resp.numeroDeComodos}</Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">
                        Valor Aluguel/Financiamento:
                      </Typography>
                    </Box>
                    <Typography>
                      R$ {resp.valorAluguelOuFinanciamento.toLocaleString()}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Tipo de Construção:</Typography>
                    </Box>
                    <Typography>
                      {formatarTipoConstrucao(resp.tipoConstrucao)}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">
                        Situação Habitacional:
                      </Typography>
                    </Box>
                    <Typography>
                      {formatarSituacaoHabitacional(resp.situacaoHabitacional)}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Recebe PTR:</Typography>
                    </Box>
                    <Typography>{formatarRecebePTR(resp.recebePTR)}</Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Recebe BPC:</Typography>
                    </Box>
                    <Typography>{formatarRecebeBPC(resp.recebeBPC)}</Typography>
                  </Box>
                </Paper>
              </Box>
            ))}
        </Paper>

        {/* Seção 3: Familiares */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: '#ffffff',
            mb: 5,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Familiares
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {Array.isArray(aluno.familiares) &&
            aluno.familiares.map((fam, idx) => (
              <Box
                key={idx}
                sx={{ mb: idx < aluno.familiares.length - 1 ? 3 : 0 }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: '#fafafa',
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '35% 65%',
                      rowGap: 2.5,
                      columnGap: 4,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Nome:</Typography>
                    </Box>
                    <Typography>{fam.nome}</Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <CalendarTodayIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Data de Nascimento:</Typography>
                    </Box>
                    <Typography>
                      {formatarDataExibicao(fam.dataNascimento)}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Parentesco:</Typography>
                    </Box>
                    <Typography>{formatarParentesco(fam.parentesco)}</Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Profissão:</Typography>
                    </Box>
                    <Typography>{fam.profissao || '—'}</Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Ocupação:</Typography>
                    </Box>
                    <Typography>{fam.ocupacao || '—'}</Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Renda:</Typography>
                    </Box>
                    <Typography>R$ {fam.renda.toLocaleString()}</Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <PersonIcon
                        fontSize="medium"
                        sx={{ color: '#1976d2', mr: 1.5 }}
                      />
                      <Typography fontWeight="bold">Fator de Risco Social:</Typography>
                    </Box>
                    <Typography>{fam.fatorRiscoSocial}</Typography>
                  </Box>
                </Paper>
              </Box>
            ))}
        </Paper>

        {/* Seção 4: Relatórios */}
        <Box sx={{ mt: 4, mb: 6 }}>
          <Typography variant="h6" gutterBottom>
            Relatórios do Aluno
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {relatorios.length === 0 ? (
            <Typography color="textSecondary">
              Nenhum relatório registrado para este aluno.
            </Typography>
          ) : (
            <Stack spacing={3}>
              {relatorios.map((r, idx) => (
                <Card
                  key={idx}
                  elevation={2}
                  sx={{ borderRadius: 3, pt: 2, px: 2, pb: 2 }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        mb: 1.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="subtitle2" color="textSecondary">
                        {`Registrado em: ${formatarDataExibicao(
                          r.dataDeRegistro
                        )}`}
                      </Typography>
                    </Box>
                    <Typography variant="body1">{r.registro}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DetalheAluno;
