// src/components/EditarAluno.jsx
import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  Grid,
  Container,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate, useParams } from 'react-router-dom';

// --- Definição de SectionButton (igual ao seu) ---
const SectionButton = styled(Button)(({ theme, active }) => ({
  flex: 1,
  borderRadius: theme.spacing(0.5),
  fontWeight: 'bold',
  textTransform: 'none',
  backgroundColor: active ? '#00249C' : '#E0E0E0',
  color: active ? '#FFF' : '#333',
  '&:hover': {
    backgroundColor: active ? '#001973' : '#D5D5D5',
  },
}));

const EditarAluno = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Tab atual: 'dados' ou 'novoRelatorio'
  const [activeTab, setActiveTab] = useState('dados');

  // Estado para o formulário (dados e responsável)
  const [form, setForm] = useState({
    nome: '',
    sexo: '',
    mae: '',
    pai: '',
    dataInscricao: '',
    dataMatricula: '',
    numeroNIS: '',
    dataNascimento: '',
    naturalidade: '',
    corRaca: '',
    pcd: false,
    cpf: '',
    rg: '',
    dataEmissao: '',
    uf: '',
    serie: '',
    horario: '',
    faltasNaSemana: 0,
    nomeEscola: '',
    turma: 0,
    responsavel: {
      nome: '',
      grauDeParentesco: '',
      estadoCivil: '',
      grauEnsinoFundamental: '',
      grauEnsinoMedio: '',
      grauEnsinoSuperior: '',
      profissao: '',
      ocupacao: '',
      estadoEmprego: '',
      renda: 0,
      endereco: '',
      numeroEndereco: '',
      complementoEndereco: '',
      bairro: '',
      distrito: '',
      cep: '',
      telefoneCelular: '',
      telefoneResidencial: '',
      telefone: '',
      pontoDeReferencia: '',
      condicaoMoradia: '',
      numeroDeComodos: 0,
      valorAluguelOuFinanciamento: 0,
      tipoConstrucao: '',
      situacaoHabitacional: '',
      recebePTR: '',
      recebeBPC: '',
    },
    familiares: [],
  });

  // Estado para texto do novo relatório
  const [relatorioTexto, setRelatorioTexto] = useState('');

  // Carrega dados do aluno via API
  useEffect(() => {
    fetch(`https://cca-pam.onrender.com/criancas/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Aluno não encontrado');
        return res.json();
      })
      .then((data) => {
        // Assumindo que a API retorna o mesmo formato de campos
        const respArray = Array.isArray(data.responsaveis) ? data.responsaveis : [];
        const respData = respArray.length > 0 ? respArray[0] : {};

        const famArray = Array.isArray(data.familiares) ? data.familiares : [];
        const fams = famArray.map((fam) => ({
          nome: fam.nome || '',
          dataNascimento: fam.dataNascimento || '',
          parentesco: fam.parentesco || '',
          profissao: fam.profissao || '',
          ocupacao: fam.ocupacao || '',
          renda: fam.renda || 0,
          fatorRiscoSocial: fam.fatorRiscoSocial || 0,
        }));

        setForm({
          nome: data.nome || '',
          sexo: data.sexo || '',
          mae: data.mae || '',
          pai: data.pai || '',
          dataInscricao: data.dataInscricao || '',
          dataMatricula: data.dataMatricula || '',
          numeroNIS: data.numeroNIS || '',
          dataNascimento: data.dataNascimento || '',
          naturalidade: data.naturalidade || '',
          corRaca: data.corRaca || '',
          pcd: data.pcd || false,
          cpf: data.cpf || '',
          rg: data.rg || '',
          dataEmissao: data.dataEmissao || '',
          uf: data.uf || '',
          serie: data.serie || '',
          horario: data.horario || '',
          faltasNaSemana: data.faltasNaSemana || 0,
          nomeEscola: data.nomeEscola || '',
          turma: data.turma || 0,
          responsavel: {
            nome: respData.nome || '',
            grauDeParentesco: respData.grauDeParentesco || '',
            estadoCivil: respData.estadoCivil || '',
            grauEnsinoFundamental: respData.grauEnsinoFundamental || '',
            grauEnsinoMedio: respData.grauEnsinoMedio || '',
            grauEnsinoSuperior: respData.grauEnsinoSuperior || '',
            profissao: respData.profissao || '',
            ocupacao: respData.ocupacao || '',
            estadoEmprego: respData.estadoEmprego || '',
            renda: respData.renda || 0,
            endereco: respData.endereco || '',
            numeroEndereco: respData.numeroEndereco || '',
            complementoEndereco: respData.complementoEndereco || '',
            bairro: respData.bairro || '',
            distrito: respData.distrito || '',
            cep: respData.cep || '',
            telefoneCelular: respData.telefoneCelular || '',
            telefoneResidencial: respData.telefoneResidencial || '',
            telefone: respData.telefone || '',
            pontoDeReferencia: respData.pontoDeReferencia || '',
            condicaoMoradia: respData.condicaoMoradia || '',
            numeroDeComodos: respData.numeroDeComodos || 0,
            valorAluguelOuFinanciamento: respData.valorAluguelOuFinanciamento || 0,
            tipoConstrucao: respData.tipoConstrucao || '',
            situacaoHabitacional: respData.situacaoHabitacional || '',
            recebePTR: respData.recebePTR || '',
            recebeBPC: respData.recebeBPC || '',
          },
          familiares: fams,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  // Handlers para formulário
  const handleChange = (field) => (e) => {
    const value =
      e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.type === 'number'
        ? Number(e.target.value)
        : e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResponsavelChange = (field) => (e) => {
    const value =
      e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.type === 'number'
        ? Number(e.target.value)
        : e.target.value;
    setForm((prev) => ({
      ...prev,
      responsavel: {
        ...prev.responsavel,
        [field]: value,
      },
    }));
  };

  const handleAddFamiliar = () => {
    setForm((prev) => ({
      ...prev,
      familiares: [
        ...prev.familiares,
        {
          nome: '',
          dataNascimento: '',
          parentesco: '',
          profissao: '',
          ocupacao: '',
          renda: 0,
          fatorRiscoSocial: 0,
        },
      ],
    }));
  };

  const handleRemoveFamiliar = (index) => {
    setForm((prev) => {
      const novos = [...prev.familiares];
      novos.splice(index, 1);
      return { ...prev, familiares: novos };
    });
  };

  const handleFamiliarChange = (index, field) => (e) => {
    const value =
      e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.type === 'number'
        ? Number(e.target.value)
        : e.target.value;
    setForm((prev) => {
      const novos = [...prev.familiares];
      novos[index] = { ...novos[index], [field]: value };
      return { ...prev, familiares: novos };
    });
  };

  // Salvar alterações (Dados da Criança)
  const salvarEdicao = () => {
    fetch(`https://cca-pam.onrender.com/criancas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao atualizar');
        return res.json();
      })
      .then(() => {
        alert('Dados atualizados com sucesso!');
        navigate('/consultar');
      })
      .catch((err) => {
        console.error(err);
        alert('Falha ao atualizar os dados. Tente novamente.');
      });
  };

  // Salvar novo relatório
  const salvarRelatorio = () => {
    fetch(`https://cca-pam.onrender.com/criancas/${id}/relatorio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alunoId: Number(id),
        relatorio: relatorioTexto,
        dataRelatorio: new Date()
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao salvar relatório');
        setRelatorioTexto('');
        alert('Relatório salvo com sucesso!');
      })
      .catch((err) => {
        console.error(err);
        alert('Falha ao salvar relatório. Tente novamente.');
      });
  };

  // Data atual para exibição (pt-BR)
  const dataFormatadaAtual = new Date().toLocaleDateString('pt-BR');

  // Enquanto aguarda nome carregar, exibe mensagem de carregando
  if (!form.nome && activeTab === 'dados') {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="#00249C">
          ⏳ Carregando dados do aluno…
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: '#00249C' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            CCA PAM – Edição de Aluno
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      {/* Botão Voltar */}
      <Box sx={{ mt: 2, ml: 3 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/consultar')}
        >
          Voltar
        </Button>
      </Box>

      {/* Conteúdo Principal */}
      <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        {/* Botões de Aba */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <SectionButton
            active={activeTab === 'dados'}
            onClick={() => setActiveTab('dados')}
          >
            Dados da Criança
          </SectionButton>
          <SectionButton
            active={activeTab === 'novoRelatorio'}
            onClick={() => setActiveTab('novoRelatorio')}
          >
            Novo Relatório
          </SectionButton>
        </Box>

        {/* Aba "Dados da Criança" */}
        {activeTab === 'dados' && (
          <Box>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Dados Pessoais e Escolares
              </Typography>
              <Grid container spacing={2}>
                {/* Linha 1 */}
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Nome"
                    value={form.nome}
                    onChange={handleChange('nome')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    label="Sexo"
                    value={form.sexo}
                    onChange={handleChange('sexo')}
                    fullWidth
                  >
                    <MenuItem value="F">Feminino</MenuItem>
                    <MenuItem value="M">Masculino</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.pcd}
                        onChange={handleChange('pcd')}
                      />
                    }
                    label="PCD"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Nome da Mãe"
                    value={form.mae}
                    onChange={handleChange('mae')}
                    fullWidth
                  />
                </Grid>

                {/* Linha 2 */}
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Nome do Pai"
                    value={form.pai}
                    onChange={handleChange('pai')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Data de Inscrição"
                    type="date"
                    value={form.dataInscricao}
                    onChange={handleChange('dataInscricao')}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Data de Matrícula"
                    type="date"
                    value={form.dataMatricula}
                    onChange={handleChange('dataMatricula')}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>

                {/* Linha 3 */}
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Data de Nascimento"
                    type="date"
                    value={form.dataNascimento}
                    onChange={handleChange('dataNascimento')}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Naturalidade"
                    value={form.naturalidade}
                    onChange={handleChange('naturalidade')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="Cor/Raça"
                    value={form.corRaca}
                    onChange={handleChange('corRaca')}
                    fullWidth
                  >
                    <MenuItem value="BRANCA">Branca</MenuItem>
                    <MenuItem value="PARDA">Parda</MenuItem>
                    <MenuItem value="PRETA">Preta</MenuItem>
                    <MenuItem value="AMARELA">Amarela</MenuItem>
                    <MenuItem value="INDIGENA">Indígena</MenuItem>
                    <MenuItem value="OUTRA">Outra</MenuItem>
                  </TextField>
                </Grid>

                {/* Linha 4 */}
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Número NIS"
                    type="number"
                    value={form.numeroNIS}
                    onChange={handleChange('numeroNIS')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="CPF"
                    value={form.cpf}
                    onChange={handleChange('cpf')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="RG"
                    value={form.rg}
                    onChange={handleChange('rg')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Emissão (RG)"
                    type="date"
                    value={form.dataEmissao}
                    onChange={handleChange('dataEmissao')}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>

                {/* Linha 5 */}
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    label="UF"
                    value={form.uf}
                    onChange={handleChange('uf')}
                    fullWidth
                  >
                    <MenuItem value="AC">AC</MenuItem>
                    <MenuItem value="AL">AL</MenuItem>
                    <MenuItem value="AP">AP</MenuItem>
                    <MenuItem value="AM">AM</MenuItem>
                    <MenuItem value="BA">BA</MenuItem>
                    <MenuItem value="CE">CE</MenuItem>
                    <MenuItem value="DF">DF</MenuItem>
                    <MenuItem value="ES">ES</MenuItem>
                    <MenuItem value="GO">GO</MenuItem>
                    <MenuItem value="MA">MA</MenuItem>
                    <MenuItem value="MT">MT</MenuItem>
                    <MenuItem value="MS">MS</MenuItem>
                    <MenuItem value="MG">MG</MenuItem>
                    <MenuItem value="PA">PA</MenuItem>
                    <MenuItem value="PB">PB</MenuItem>
                    <MenuItem value="PR">PR</MenuItem>
                    <MenuItem value="PE">PE</MenuItem>
                    <MenuItem value="PI">PI</MenuItem>
                    <MenuItem value="RJ">RJ</MenuItem>
                    <MenuItem value="RN">RN</MenuItem>
                    <MenuItem value="RS">RS</MenuItem>
                    <MenuItem value="RO">RO</MenuItem>
                    <MenuItem value="RR">RR</MenuItem>
                    <MenuItem value="SC">SC</MenuItem>
                    <MenuItem value="SP">SP</MenuItem>
                    <MenuItem value="SE">SE</MenuItem>
                    <MenuItem value="TO">TO</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Série"
                    value={form.serie}
                    onChange={handleChange('serie')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    label="Horário"
                    value={form.horario}
                    onChange={handleChange('horario')}
                    fullWidth
                  >
                    <MenuItem value="MANHA">Manhã</MenuItem>
                    <MenuItem value="TARDE">Tarde</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Faltas na Semana"
                    type="number"
                    value={form.faltasNaSemana}
                    onChange={handleChange('faltasNaSemana')}
                    fullWidth
                  />
                </Grid>

                {/* Linha 6 */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nome da Escola"
                    value={form.nomeEscola}
                    onChange={handleChange('nomeEscola')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Turma (número)"
                    type="number"
                    value={form.turma}
                    onChange={handleChange('turma')}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Dados do Responsável */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                mt: 3,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Dados do Responsável
              </Typography>
              <Grid container spacing={2}>
                {/* Linha 1 */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nome"
                    value={form.responsavel.nome}
                    onChange={handleResponsavelChange('nome')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    label="Grau de Parentesco"
                    value={form.responsavel.grauDeParentesco}
                    onChange={handleResponsavelChange('grauDeParentesco')}
                    fullWidth
                  >
                    <MenuItem value="PAI">Pai</MenuItem>
                    <MenuItem value="MAE">Mãe</MenuItem>
                    <MenuItem value="RESPONSAVEL">Responsável</MenuItem>
                    <MenuItem value="OUTRO">Outro</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    label="Estado Civil"
                    value={form.responsavel.estadoCivil}
                    onChange={handleResponsavelChange('estadoCivil')}
                    fullWidth
                  >
                    <MenuItem value="SOLTEIRO">Solteiro(a)</MenuItem>
                    <MenuItem value="CASADO">Casado(a)</MenuItem>
                    <MenuItem value="SEPARADO">Separado(a)</MenuItem>
                    <MenuItem value="DIVORCIADO">Divorciado(a)</MenuItem>
                    <MenuItem value="VIUVO">Viúvo(a)</MenuItem>
                  </TextField>
                </Grid>

                {/* Linha 2 */}
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="Ensino Fundamental"
                    value={form.responsavel.grauEnsinoFundamental}
                    onChange={handleResponsavelChange('grauEnsinoFundamental')}
                    fullWidth
                  >
                    <MenuItem value="COMPLETO">Completo</MenuItem>
                    <MenuItem value="INCOMPLETO">Incompleto</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="Ensino Médio"
                    value={form.responsavel.grauEnsinoMedio}
                    onChange={handleResponsavelChange('grauEnsinoMedio')}
                    fullWidth
                  >
                    <MenuItem value="COMPLETO">Completo</MenuItem>
                    <MenuItem value="INCOMPLETO">Incompleto</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="Ensino Superior"
                    value={form.responsavel.grauEnsinoSuperior}
                    onChange={handleResponsavelChange('grauEnsinoSuperior')}
                    fullWidth
                  >
                    <MenuItem value="COMPLETO">Completo</MenuItem>
                    <MenuItem value="INCOMPLETO">Incompleto</MenuItem>
                  </TextField>
                </Grid>

                {/* Linha 3 */}
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Profissão"
                    value={form.responsavel.profissao}
                    onChange={handleResponsavelChange('profissao')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Ocupação"
                    value={form.responsavel.ocupacao}
                    onChange={handleResponsavelChange('ocupacao')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="Estado de Emprego"
                    value={form.responsavel.estadoEmprego}
                    onChange={handleResponsavelChange('estadoEmprego')}
                    fullWidth
                  >
                    <MenuItem value="EMPREGADO">Empregado</MenuItem>
                    <MenuItem value="DESEMPREGADO">Desempregado</MenuItem>
                    <MenuItem value="APOSENTADO">Aposentado</MenuItem>
                    <MenuItem value="PENSIONISTA">Pensionista</MenuItem>
                  </TextField>
                </Grid>

                {/* Linha 4 */}
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Renda"
                    type="number"
                    value={form.responsavel.renda}
                    onChange={handleResponsavelChange('renda')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    label="Endereço"
                    value={form.responsavel.endereco}
                    onChange={handleResponsavelChange('endereco')}
                    fullWidth
                  />
                </Grid>

                {/* Linha 5 */}
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Número"
                    type="number"
                    value={form.responsavel.numeroEndereco}
                    onChange={handleResponsavelChange('numeroEndereco')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Complemento"
                    value={form.responsavel.complementoEndereco}
                    onChange={handleResponsavelChange('complementoEndereco')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Bairro"
                    value={form.responsavel.bairro}
                    onChange={handleResponsavelChange('bairro')}
                    fullWidth
                  />
                </Grid>

                {/* Linha 6 */}
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Distrito"
                    value={form.responsavel.distrito}
                    onChange={handleResponsavelChange('distrito')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="CEP"
                    value={form.responsavel.cep}
                    onChange={handleResponsavelChange('cep')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Telefone Celular"
                    value={form.responsavel.telefoneCelular}
                    onChange={handleResponsavelChange('telefoneCelular')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Telefone Residencial"
                    value={form.responsavel.telefoneResidencial}
                    onChange={handleResponsavelChange('telefoneResidencial')}
                    fullWidth
                  />
                </Grid>

                {/* Linha 7 */}
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Telefone (outro)"
                    value={form.responsavel.telefone}
                    onChange={handleResponsavelChange('telefone')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Ponto de Referência"
                    value={form.responsavel.pontoDeReferencia}
                    onChange={handleResponsavelChange('pontoDeReferencia')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    label="Condição de Moradia"
                    value={form.responsavel.condicaoMoradia}
                    onChange={handleResponsavelChange('condicaoMoradia')}
                    fullWidth
                  >
                    <MenuItem value="PROPRIA">Própria</MenuItem>
                    <MenuItem value="ALUGADA">Alugada</MenuItem>
                    <MenuItem value="CEDIDA">Cedida</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Nº de Cômodos"
                    type="number"
                    value={form.responsavel.numeroDeComodos}
                    onChange={handleResponsavelChange('numeroDeComodos')}
                    fullWidth
                  />
                </Grid>

                {/* Linha 8 */}
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Valor (aluguel ou financiamento)"
                    type="number"
                    value={form.responsavel.valorAluguelOuFinanciamento}
                    onChange={handleResponsavelChange('valorAluguelOuFinanciamento')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="Tipo de Construção"
                    value={form.responsavel.tipoConstrucao}
                    onChange={handleResponsavelChange('tipoConstrucao')}
                    fullWidth
                  >
                    <MenuItem value="ALVENARIA">Alvenaria</MenuItem>
                    <MenuItem value="MADEIRA">Madeira</MenuItem>
                    <MenuItem value="MISTA">Mista</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="Situação Habitacional"
                    value={form.responsavel.situacaoHabitacional}
                    onChange={handleResponsavelChange('situacaoHabitacional')}
                    fullWidth
                  >
                    <MenuItem value="CORTICO">Córtico</MenuItem>
                    <MenuItem value="FAVELA">Favela</MenuItem>
                    <MenuItem value="LOTEAMENTO_IRREGULAR">Loteamento Irregular</MenuItem>
                  </TextField>
                </Grid>

                {/* Linha 9 */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Recebe PTR?"
                    value={form.responsavel.recebePTR}
                    onChange={handleResponsavelChange('recebePTR')}
                    fullWidth
                  >
                    <MenuItem value="NAO">Não</MenuItem>
                    <MenuItem value="RENDA_MINIMA">Renda Mínima</MenuItem>
                    <MenuItem value="BOLSA_FAMILIA">Bolsa Família</MenuItem>
                    <MenuItem value="RENDA_CIDADA">Renda Cidadã</MenuItem>
                    <MenuItem value="ACAO_JOVEM">Ação Jovem</MenuItem>
                    <MenuItem value="PETI">PETI</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Recebe BPC?"
                    value={form.responsavel.recebeBPC}
                    onChange={handleResponsavelChange('recebeBPC')}
                    fullWidth
                  >
                    <MenuItem value="NAO">Não</MenuItem>
                    <MenuItem value="IDOSO">Idoso</MenuItem>
                    <MenuItem value="PCD">PCD</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Paper>

            {/* Familiares */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                mt: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Familiares</Typography>
                <IconButton color="primary" onClick={handleAddFamiliar}>
                  <AddIcon />
                </IconButton>
              </Box>

              {form.familiares.length === 0 && (
                <Typography color="textSecondary">
                  Clique no botão “+” para adicionar um familiar.
                </Typography>
              )}

              {form.familiares.map((fam, idx) => (
                <Box
                  key={idx}
                  sx={{
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    p: 2,
                    mb: 2,
                    position: 'relative',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFamiliar(idx)}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Nome"
                        value={fam.nome}
                        onChange={handleFamiliarChange(idx, 'nome')}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Data Nascimento"
                        type="date"
                        value={fam.dataNascimento}
                        onChange={handleFamiliarChange(idx, 'dataNascimento')}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        select
                        label="Parentesco"
                        value={fam.parentesco}
                        onChange={handleFamiliarChange(idx, 'parentesco')}
                        fullWidth
                      >
                        <MenuItem value="PAI">Pai</MenuItem>
                        <MenuItem value="MAE">Mãe</MenuItem>
                        <MenuItem value="IRMAO">Irmão</MenuItem>
                        <MenuItem value="IRMA">Irmã</MenuItem>
                        <MenuItem value="AVO">Avô</MenuItem>
                        <MenuItem value="AVA">Avó</MenuItem>
                        <MenuItem value="TIO">Tio</MenuItem>
                        <MenuItem value="TIA">Tia</MenuItem>
                        <MenuItem value="OUTRO">Outro</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Profissão"
                        value={fam.profissao}
                        onChange={handleFamiliarChange(idx, 'profissao')}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Ocupação"
                        value={fam.ocupacao}
                        onChange={handleFamiliarChange(idx, 'ocupacao')}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Renda"
                        type="number"
                        value={fam.renda}
                        onChange={handleFamiliarChange(idx, 'renda')}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Fator Risco Social"
                        type="number"
                        value={fam.fatorRiscoSocial}
                        onChange={handleFamiliarChange(idx, 'fatorRiscoSocial')}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Paper>

            {/* Botão Salvar */}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: 'right', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={salvarEdicao}
              >
                Salvar Alterações
              </Button>
            </Box>
          </Box>
        )}

        {/* Aba "Novo Relatório" */}
        {activeTab === 'novoRelatorio' && (
          <Box>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Novo Relatório
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <Chip
                  label={`Data: ${dataFormatadaAtual}`}
                  color="primary"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
              <TextField
                label="Escreva o relatório aqui..."
                value={relatorioTexto}
                onChange={(e) => setRelatorioTexto(e.target.value)}
                multiline
                rows={6}
                fullWidth
              />
              <Box sx={{ textAlign: 'right', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={salvarRelatorio}
                >
                  Salvar Relatório
                </Button>
              </Box>
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default EditarAluno;
