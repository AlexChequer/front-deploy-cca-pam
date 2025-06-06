// src/components/CadastrarAluno.jsx

import React, { useState, useRef } from 'react';
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
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const DropZone = styled(Box)(({ theme }) => ({
  border: '2px dashed #aaa',
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: '#f5f5f5',
  cursor: 'pointer',
  marginBottom: theme.spacing(3),
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
}));

export default function CadastrarAluno() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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
      numeroEndereco: 0,
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

  const criancaObrigatorios = [
    'nome',
    'sexo',
    'mae',
    'dataInscricao',
    'dataMatricula',
    'numeroNIS',
    'dataNascimento',
    'cpf',
    'rg',
    'uf',
    'horario'
  ];
  const responsavelObrigatorios = [
    'nome',
    'endereco',
    'cep',
  ];

  const validaForm = () => {
    for (let campo of criancaObrigatorios) {
      const valor = form[campo];
      if (
        valor === '' ||
        valor === null ||
        valor === undefined ||
        (campo === 'numeroNIS' && Number.isNaN(Number(valor))) ||
        (campo === 'faltasNaSemana' && Number.isNaN(Number(valor))) ||
        (campo === 'turma' && Number.isNaN(Number(valor)))
      ) {
        alert(`Preencha o campo obrigatório: ${campo}`);
        return false;
      }
    }
    for (let campo of responsavelObrigatorios) {
      const valor = form.responsavel[campo];
      if (
        valor === '' ||
        valor === null ||
        valor === undefined ||
        (campo === 'renda' && Number.isNaN(Number(valor))) ||
        (campo === 'numeroEndereco' && Number.isNaN(Number(valor))) ||
        (campo === 'numeroDeComodos' && Number.isNaN(Number(valor))) ||
        (campo === 'valorAluguelOuFinanciamento' && Number.isNaN(Number(valor)))
      ) {
        alert(`Preencha o campo obrigatório (Responsável): ${campo}`);
        return false;
      }
    }
    return true;
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked
      : e.target.type === 'number' ? Number(e.target.value)
      : e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResponsavelChange = (field) => (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked
      : e.target.type === 'number' ? Number(e.target.value)
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
      e.target.type === 'checkbox' ? e.target.checked
      : e.target.type === 'number' ? Number(e.target.value)
      : e.target.value;
    setForm((prev) => {
      const novos = [...prev.familiares];
      novos[index] = { ...novos[index], [field]: value };
      return { ...prev, familiares: novos };
    });
  };

  const converterDataParaISO = (str) => {
    if (!str) return '';
    const [d, m, a] = str.split('/');
    if (!d || !m || !a) return '';
    const dd = d.padStart(2, '0');
    const mm = m.padStart(2, '0');
    return `${a}-${mm}-${dd}`;
  };

  const processarArquivo = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const primeiraAba = workbook.SheetNames[0];
      const sheet = workbook.Sheets[primeiraAba];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

      const novoForm = { ...form };
      novoForm.responsavel = { ...form.responsavel };

      rows.forEach((row) => {
        row.forEach((cell) => {
          if (typeof cell !== 'string') return;
          const texto = cell.trim();
          const txLower = texto.toLowerCase();

          if (txLower.startsWith('nome da cça') || txLower.startsWith('nome da cça/adol')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.nome = parte;
          }
          else if (txLower.startsWith('sexo:')) {
            const fragment = texto.split(':').slice(1).join(':').trim().toUpperCase();
            if (fragment.includes('X M')) novoForm.sexo = 'M';
            else if (fragment.includes('X F')) novoForm.sexo = 'F';
            else if (fragment.startsWith('M')) novoForm.sexo = 'M';
            else if (fragment.startsWith('F')) novoForm.sexo = 'F';
          }
          else if (txLower.startsWith('data de inscrição:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.dataInscricao = converterDataParaISO(parte);
          }
          else if (txLower.startsWith('data de matr') || txLower.startsWith('data de matrícula:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.dataMatricula = converterDataParaISO(parte);
          }
          else if (txLower.startsWith('nascimento:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.dataNascimento = converterDataParaISO(parte);
          }
          else if (txLower.startsWith('naturalidade')) {
            const pedaço = texto.includes(')')
              ? texto.split(')').slice(-1)[0].trim()
              : texto.split(':').slice(1).join(':').trim();
            novoForm.naturalidade = pedaço;
          }
          else if (txLower.startsWith('número nis') || txLower.startsWith('nº nis')) {
            const raw = texto.split('Nº NIS').slice(1).join(':').trim();
            novoForm.numeroNIS = raw.replace(/\D/g, '');
          }
          else if (
            txLower.startsWith('cor/raça') ||
            txLower.startsWith('cor/ raça') ||
            txLower.startsWith('cor raça')
          ) {
            const parte = texto.split(':').slice(1).join(':').trim();
            const raw = parte.toUpperCase().replace(/\s+/g, '');

            switch (raw) {
              case 'BRANCO':
                novoForm.corRaca = 'BRANCA';
                break;
              case 'PARDA':
                novoForm.corRaca = 'PARDO';
                break;
              case 'NEGRO':
                novoForm.corRaca = 'NEGRO';
                break;
              case 'AMARELA':
                novoForm.corRaca = 'AMARELO';
                break;
              case 'OUTRA':
                novoForm.corRaca = 'OUTRO';
                break;
              default:
                novoForm.corRaca = raw;
            }
          }
          else if (txLower.startsWith('cpf:')) {
            const raw = texto.split(':').slice(1).join(':').trim();
            novoForm.cpf = raw.replace(/\D/g, '');
          }
          else if (txLower.startsWith('rg:')) {
            const raw = texto.split(':').slice(1).join(':').trim();
            novoForm.rg = raw.replace(/\D/g, '');
          }
          else if (txLower.startsWith('emissão:') || txLower.startsWith('emissao:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.dataEmissao = converterDataParaISO(parte);
          }
          else if (txLower.startsWith('uf:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.uf = parte;
          }
          else if (txLower.startsWith('nome  da escola') || txLower.startsWith('nome da escola:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.nomeEscola = parte;
          }
          else if (txLower.startsWith('série') || txLower.startsWith('serie')) {
            const pedaço = texto.split(':').slice(1).join(':').trim();
            novoForm.serie = pedaço.replace('ª', '').trim();
          }
          else if (txLower.startsWith('horário:') || txLower.startsWith('horario:')) {
            let parte = texto.split(':').slice(1).join(':').trim().toUpperCase();
            parte = parte.replace(/ã/gi, 'A').replace(/é/gi, 'E');
            if (parte.includes('MANHÃ') || parte.startsWith('MAN')) novoForm.horario = 'MANHA';
            else if (parte.includes('TARDE') || parte.startsWith('TAR')) novoForm.horario = 'TARDE';
          }
          else if (txLower.startsWith('faltas na semana:') || txLower.startsWith('faltas na sem')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.faltasNaSemana = Number(parte) || 0;
          }
          else if (txLower.startsWith('mãe:') || txLower.startsWith('mae:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.mae = parte;
          }
          else if (txLower.startsWith('pai:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.pai = parte;
          }
          else if (txLower.startsWith('turma') || txLower.startsWith('turma (número)')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.turma = Number(parte) || 0;
          }

          else if (txLower.startsWith('nome do responsável:') || txLower.startsWith('nome do responsavel:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.responsavel.nome = parte;
          }
          else if (txLower.startsWith('grau de parentesco:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.responsavel.grauDeParentesco = parte.toUpperCase();
          }
          else if (txLower.startsWith('estado civil:')) {
            const fragment = texto.split(':').slice(1).join(':').trim().toUpperCase();
            if (fragment.includes('X SOLTEIRO')) novoForm.responsavel.estadoCivil = 'SOLTEIRO';
            else if (fragment.includes('X CASADO')) novoForm.responsavel.estadoCivil = 'CASADO';
            else if (fragment.includes('X SEPARADO')) novoForm.responsavel.estadoCivil = 'SEPARADO';
            else if (fragment.includes('X DIVORCIADO')) novoForm.responsavel.estadoCivil = 'DIVORCIADO';
            else if (fragment.includes('X VIÚVO') || fragment.includes('X VIUVO')) novoForm.responsavel.estadoCivil = 'VIUVO';
          }

          if (txLower.includes('ensino fundamental:') && txLower.includes('ensino medio:')) {
            const trechoFundOriginal = texto
              .slice(
                texto.toLowerCase().indexOf('ensino fundamental:') + 'ensino fundamental:'.length,
                texto.toLowerCase().indexOf('ensino medio:')
              )
              .trim();
            const trechoMedOriginal = texto
              .slice(texto.toLowerCase().indexOf('ensino medio:') + 'ensino medio:'.length)
              .trim();
            const fund = trechoFundOriginal.toUpperCase();
            const med = trechoMedOriginal.toUpperCase();

            if (fund.includes('X COMPLETO') || fund.startsWith('COMPLETO')) {
              novoForm.responsavel.grauEnsinoFundamental = 'COMPLETO';
            } else if (fund.includes('X INCOMPLETO') || fund.startsWith('INCOMPLETO')) {
              novoForm.responsavel.grauEnsinoFundamental = 'INCOMPLETO';
            }
            if (med.includes('X COMPLETO') || med.startsWith('COMPLETO')) {
              novoForm.responsavel.grauEnsinoMedio = 'COMPLETO';
            } else if (med.includes('X INCOMPLETO') || med.startsWith('INCOMPLETO')) {
              novoForm.responsavel.grauEnsinoMedio = 'INCOMPLETO';
            }
          }
          else if (txLower.startsWith('ensino fundamental:')) {
            const fragment = texto.split(':').slice(1).join(':').trim().toUpperCase();
            if (fragment.includes('X COMPLETO')) {
              novoForm.responsavel.grauEnsinoFundamental = 'COMPLETO';
            } else if (fragment.includes('X INCOMPLETO')) {
              novoForm.responsavel.grauEnsinoFundamental = 'INCOMPLETO';
            }
          }
          else if (txLower.startsWith('ensino médio:') || txLower.startsWith('ensino medio:')) {
            const fragment = texto.split(':').slice(1).join(':').trim().toUpperCase();
            if (fragment.includes('X COMPLETO')) {
              novoForm.responsavel.grauEnsinoMedio = 'COMPLETO';
            } else if (fragment.includes('X INCOMPLETO')) {
              novoForm.responsavel.grauEnsinoMedio = 'INCOMPLETO';
            }
          }
          else if (txLower.startsWith('ensino superior:')) {
            const fragment = texto.split(':').slice(1).join(':').trim().toUpperCase();
            if (fragment.includes('X COMPLETO')) novoForm.responsavel.grauEnsinoSuperior = 'COMPLETO';
            else if (fragment.includes('X INCOMPLETO')) novoForm.responsavel.grauEnsinoSuperior = 'INCOMPLETO';
          }
          else if (txLower.startsWith('profissão:') || txLower.startsWith('profissao:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.responsavel.profissao = parte;
          }
          else if (txLower.startsWith('ocupação:') || txLower.startsWith('ocupacao:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.responsavel.ocupacao = parte;
          }
          else if (txLower.includes('empregado') && txLower.includes('desempregado')) {
            const fragment = texto.toUpperCase();
            if (/EMPREGADO\s+X\s+DESEMPREGADO/.test(fragment)) {
              novoForm.responsavel.estadoEmprego = 'DESEMPREGADO';
            } else if (/\bX\s+EMPREGADO\b/.test(fragment)) {
              novoForm.responsavel.estadoEmprego = 'EMPREGADO';
            } else if (/DESEMPREGADO\s+X\s+APOSENTADO/.test(fragment)) {
              novoForm.responsavel.estadoEmprego = 'APOSENTADO';
            } else if (/APOSENTADO\s+X\s+PENSIONISTA/.test(fragment)) {
              novoForm.responsavel.estadoEmprego = 'PENSIONISTA';
            }
          }
          else if (txLower.startsWith('renda:')) {
            const raw = texto
              .split(':')
              .slice(1)
              .join(':')
              .trim()
              .replace(/[R$\s]/g, '');
            const normalized = raw.replace(/\./g, '').replace(',', '.');
            novoForm.responsavel.renda = Number(normalized) || 0;
          }

          else if (txLower.startsWith('endereço:') || txLower.startsWith('endereco:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.responsavel.endereco = parte;
          }
          else if (
            txLower.startsWith('N°') ||   
            txLower.startsWith('Nº') ||  
            txLower.startsWith('Nº')
          ) {
            const apenasDigitos = texto.replace(/\D/g, '');
            novoForm.responsavel.numeroEndereco = Number(apenasDigitos) || 0;
          }
          else if (txLower.startsWith('compl:') || txLower.startsWith('complemento:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.responsavel.complementoEndereco = parte;
          }
          else if (txLower.startsWith('bairro:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.responsavel.bairro = parte;
          }
          else if (txLower.startsWith('distrito:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.responsavel.distrito = parte;
          }
          else if (txLower.startsWith('cep:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.responsavel.cep = parte.replace(/\D/g, '');
          }
          else if (txLower.startsWith('telefone celular:') || txLower.startsWith('telefone:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.responsavel.telefoneCelular = parte.replace(/\D/g, '');
          }
          else if (txLower.startsWith('telefone residencial:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.responsavel.telefoneResidencial = parte.replace(/\D/g, '');
          }
          else if (txLower.startsWith('telefone (outro):') || txLower.startsWith('telefone outro:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.responsavel.telefone = parte.replace(/\D/g, '');
          }
          else if (txLower.startsWith('ponto de referência:') || txLower.startsWith('ponto de referencia:')) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.responsavel.pontoDeReferencia = parte;
          }
          else if (txLower.startsWith('condições de moradia:') || txLower.startsWith('condicao de moradia:')) {
            const fragment = texto.split(':').slice(1).join(':').trim().toUpperCase();
            if (fragment.includes('X PRÓPRIA') || fragment.includes('X PROPRIA')) novoForm.responsavel.condicaoMoradia = 'PROPRIA';
            else if (fragment.includes('X ALUGADA')) novoForm.responsavel.condicaoMoradia = 'ALUGADA';
            else if (fragment.includes('X CEDIDA')) novoForm.responsavel.condicaoMoradia = 'CEDIDA';
          }
          else if (txLower.startsWith('nº de cômodos:') || txLower.startsWith('nº de comodos:') || (txLower.includes('nº') && txLower.includes('cômodos'))) {
            const parte = texto.split(':').slice(1).join(':').trim();
            novoForm.responsavel.numeroDeComodos = Number(parte) || 0;
          }
          else if (
            txLower.startsWith('valor (aluguel') ||
            txLower.startsWith('valor aluguel') ||
            txLower.startsWith('valor (aluguel ou financiamento):')
          ) {
            const raw = texto.split(':').slice(1).join(':').trim().replace(/[R$\s]/g, '');
            const normalized = raw.includes(',')
              ? raw.replace(/\./g, '').replace(',', '.')
              : raw.replace(/,/g, '');
            novoForm.responsavel.valorAluguelOuFinanciamento = Number(normalized) || 0;
          }

          // Tipo de Construção
          else if (txLower.startsWith('tipo de construção:') || txLower.startsWith('tipo construcao:')) {
            const fragment = texto.split(':').slice(1).join(':').trim().toUpperCase();
            const semAcento = fragment.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const match = semAcento.match(/X\s+(ALVENARIA|MADEIRA|MISTA)/);
            if (match) {
              const opcao = match[1];
              novoForm.responsavel.tipoConstrucao = opcao;
            }
          }

          // Situação Habitacional
          else if (txLower.startsWith('situação habitacional:') || txLower.startsWith('situacao habitacional:')) {
            const fragment = texto.split(':').slice(1).join(':').trim().toUpperCase();
            const semAcento = fragment.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const match = semAcento.match(/X\s+(CÓRTICO|CORTICO|FAVELA|LOTEAMENTO IRREGULAR)/);
            if (match) {
              let opcao = match[1].replace('Ó', 'O');
              if (opcao === 'CORTICO') opcao = 'CORTICO';
              if (opcao === 'LOTEAMENTO IRREGULAR') opcao = 'LOTEAMENTO_IRREGULAR';
              novoForm.responsavel.situacaoHabitacional = opcao;
            }
          }

          // Recebe PTR?
          else if (txLower.startsWith('recebe programa de transferência de renda') || txLower.startsWith('recebe ptr:')) {
            const semAcento = texto.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const match = semAcento.match(
              /X\s+(NÃO RECEBE|NAO RECEBE|RENDA MÍNIMA|RENDA MINIMA|BOLSA FAMÍLIA|BOLSA FAMILIA|RENDA CIDADÃ|RENDA CIDADA|AÇÃO JOVEM|ACAO JOVEM|PETI)/
            );
            if (match) {
              let opc = match[1];
              opc = opc.replace('NÃO RECEBE', 'NAO RECEBE')
                       .replace('RENDA MINIMA', 'RENDA_MINIMA')
                       .replace('BOLSA FAMILIA', 'BOLSA_FAMILIA')
                       .replace('RENDA CIDADA', 'RENDA_CIDADA')
                       .replace('ACAO JOVEM', 'ACAO_JOVEM');
              if (opc === 'NAO RECEBE') novoForm.responsavel.recebePTR = 'NAO';
              else if (opc === 'RENDA_MINIMA') novoForm.responsavel.recebePTR = 'RENDA_MINIMA';
              else if (opc === 'BOLSA_FAMILIA') novoForm.responsavel.recebePTR = 'BOLSA_FAMILIA';
              else if (opc === 'RENDA_CIDADA') novoForm.responsavel.recebePTR = 'RENDA_CIDADA';
              else if (opc === 'ACAO_JOVEM') novoForm.responsavel.recebePTR = 'ACAO_JOVEM';
              else if (opc === 'PETI') novoForm.responsavel.recebePTR = 'PETI';
            }
          }

          // Recebe BPC?
          else if (txLower.startsWith('recebe benefício de prestação continuada') || txLower.startsWith('recebe bpc:')) {
            const semAcento = texto.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const match = semAcento.match(
              /X\s+(NÃO RECEBE|NAO RECEBE|IDOSO|PCD|PESSOA COM DEFICIENCIA)/
            );
            if (match) {
              let opc = match[1];
              if (opc === 'NÃO RECEBE' || opc === 'NAO RECEBE') {
                novoForm.responsavel.recebeBPC = 'NAO';
              } else if (opc === 'IDOSO') {
                novoForm.responsavel.recebeBPC = 'IDOSO';
              } else {
                novoForm.responsavel.recebeBPC = 'PCD';
              }
            }
          }
        });
      });

      setForm(novoForm);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    processarArquivo(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleFileSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    processarArquivo(e.target.files[0]);
    e.target.value = '';
  };
  const abrirExplorador = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!validaForm()) return;
    try {
      const response = await fetch('https://cca-pam.onrender.com/criancas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        alert('Criança cadastrada com sucesso!');
      } else {
        const err = await response.text();
        alert('Erro ao cadastrar criança: ' + err);
      }
    } catch (err) {
      console.error(err);
      alert('Erro na requisição: ' + err.message);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const asteriskStyle = { '& .MuiFormLabel-asterisk': { color: 'red' } };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" sx={{ backgroundColor: '#00249C' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Montserrat', fontSize: 20, borderLeft: '4px solid gold', pl: 2 }}>
            <div>CCA</div>
            <div>PAM</div>
          </Box>
          <Button
            color="inherit"
            onClick={handleLogout}
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

      <Box sx={{ mt: 2, ml: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{
            mb: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              color: '#001b73',
              transform: 'translateX(-2px)'
            }
          }}
        >
          Voltar
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
        <DropZone onDrop={handleFileDrop} onDragOver={handleDragOver} onClick={abrirExplorador}>
          <Typography>Arraste aqui a ficha de cadastro (XLSX)</Typography>
          <UploadIcon sx={{ fontSize: 50, mt: 1 }} />
        </DropZone>

        <Button variant="outlined" startIcon={<UploadIcon />} onClick={abrirExplorador} sx={{ mb: 3 }}>
          Selecionar Arquivo
        </Button>
        <input
          type="file"
          accept=".xlsx"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
          <Typography variant="h6" gutterBottom>Dados da Criança</Typography>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            }}
          >
            <TextField
              required
              label="Nome"
              value={form.nome}
              onChange={handleChange('nome')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              required
              select
              label="Sexo"
              value={form.sexo}
              onChange={handleChange('sexo')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            >
              <MenuItem value="F">Feminino</MenuItem>
              <MenuItem value="M">Masculino</MenuItem>
            </TextField>
            <TextField
              required
              label="Mãe"
              value={form.mae}
              onChange={handleChange('mae')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              label="Pai"
              value={form.pai}
              onChange={handleChange('pai')}
              fullWidth
            />
            <TextField
              required
              label="Data Inscrição"
              type="date"
              value={form.dataInscricao}
              onChange={handleChange('dataInscricao')}
              InputLabelProps={{ shrink: true, sx: asteriskStyle }}
              fullWidth
            />
            <TextField
              required
              label="Data Matrícula"
              type="date"
              value={form.dataMatricula}
              onChange={handleChange('dataMatricula')}
              InputLabelProps={{ shrink: true, sx: asteriskStyle }}
              fullWidth
            />
            <TextField
              required
              label="Número NIS"
              type="text"
              value={form.numeroNIS}
              onChange={handleChange('numeroNIS')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              required
              label="Data Nascimento"
              type="date"
              value={form.dataNascimento}
              onChange={handleChange('dataNascimento')}
              InputLabelProps={{ shrink: true, sx: asteriskStyle }}
              fullWidth
            />
            <TextField
              required
              label="Naturalidade"
              value={form.naturalidade}
              onChange={handleChange('naturalidade')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              required
              select
              label="Cor/Raça"
              value={form.corRaca}
              onChange={handleChange('corRaca')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            >
              <MenuItem value="BRANCA">Branca</MenuItem>
              <MenuItem value="PARDO">Parda</MenuItem>
              <MenuItem value="NEGRO">Negra</MenuItem>
              <MenuItem value="AMARELA">Amarela</MenuItem>
              <MenuItem value="INDIGENA">Indígena</MenuItem>
              <MenuItem value="OUTRA">Outra</MenuItem>
            </TextField>
            <FormControlLabel
              control={<Checkbox checked={form.pcd} onChange={handleChange('pcd')} />}
              label="Pessoa com deficiência?"
            />
            <TextField
              required
              label="CPF"
              value={form.cpf}
              onChange={handleChange('cpf')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              required
              label="RG"
              value={form.rg}
              onChange={handleChange('rg')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              required
              label="Data Emissão (RG)"
              type="date"
              value={form.dataEmissao}
              onChange={handleChange('dataEmissao')}
              InputLabelProps={{ shrink: true, sx: asteriskStyle }}
              fullWidth
            />
            <TextField
              required
              select
              label="UF"
              value={form.uf}
              onChange={handleChange('uf')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
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
            <TextField
              required
              label="Série"
              value={form.serie}
              onChange={handleChange('serie')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              required
              select
              label="Horário"
              value={form.horario}
              onChange={handleChange('horario')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            >
              <MenuItem value="MANHA">Manhã</MenuItem>
              <MenuItem value="TARDE">Tarde</MenuItem>
            </TextField>
            <TextField
              required
              label="Faltas na Semana"
              type="number"
              value={form.faltasNaSemana}
              onChange={handleChange('faltasNaSemana')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              label="Nome da Escola"
              value={form.nomeEscola}
              onChange={handleChange('nomeEscola')}
              fullWidth
            />
            <TextField
              required
              label="Turma (número)"
              type="number"
              value={form.turma}
              onChange={handleChange('turma')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
          </Box>
        </Paper>

        <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
          <Typography variant="h6" gutterBottom>Dados do Responsável</Typography>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            }}
          >
            <TextField
              required
              label="Nome"
              value={form.responsavel.nome}
              onChange={handleResponsavelChange('nome')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              required
              select
              label="Grau de Parentesco"
              value={form.responsavel.grauDeParentesco}
              onChange={handleResponsavelChange('grauDeParentesco')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            >
              <MenuItem value="PAI">Pai</MenuItem>
              <MenuItem value="MÃE">Mãe</MenuItem>
              <MenuItem value="RESPONSAVEL">Responsável</MenuItem>
              <MenuItem value="OUTRO">Outro</MenuItem>
            </TextField>
            <TextField
              required
              select
              label="Estado Civil"
              value={form.responsavel.estadoCivil}
              onChange={handleResponsavelChange('estadoCivil')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            >
              <MenuItem value="SOLTEIRO">Solteiro(a)</MenuItem>
              <MenuItem value="CASADO">Casado(a)</MenuItem>
              <MenuItem value="SEPARADO">Separado(a)</MenuItem>
              <MenuItem value="DIVORCIADO">Divorciado(a)</MenuItem>
              <MenuItem value="VIUVO">Viúvo(a)</MenuItem>
            </TextField>
            <TextField
              required
              select
              label="Ensino Fundamental"
              value={form.responsavel.grauEnsinoFundamental}
              onChange={handleResponsavelChange('grauEnsinoFundamental')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            >
              <MenuItem value="COMPLETO">Completo</MenuItem>
              <MenuItem value="INCOMPLETO">Incompleto</MenuItem>
            </TextField>
            <TextField
              required
              select
              label="Ensino Médio"
              value={form.responsavel.grauEnsinoMedio}
              onChange={handleResponsavelChange('grauEnsinoMedio')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            >
              <MenuItem value="COMPLETO">Completo</MenuItem>
              <MenuItem value="INCOMPLETO">Incompleto</MenuItem>
            </TextField>
            <TextField
              required
              select
              label="Ensino Superior"
              value={form.responsavel.grauEnsinoSuperior}
              onChange={handleResponsavelChange('grauEnsinoSuperior')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            >
              <MenuItem value="COMPLETO">Completo</MenuItem>
              <MenuItem value="INCOMPLETO">Incompleto</MenuItem>
            </TextField>
            <TextField
              label="Profissão"
              value={form.responsavel.profissao}
              onChange={handleResponsavelChange('profissao')}
              fullWidth
            />
            <TextField
              label="Ocupação"
              value={form.responsavel.ocupacao}
              onChange={handleResponsavelChange('ocupacao')}
              fullWidth
            />
            <TextField
              required
              select
              label="Estado de Emprego"
              value={form.responsavel.estadoEmprego}
              onChange={handleResponsavelChange('estadoEmprego')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            >
              <MenuItem value="EMPREGADO">Empregado</MenuItem>
              <MenuItem value="DESEMPREGADO">Desempregado</MenuItem>
              <MenuItem value="APOSENTADO">Aposentado</MenuItem>
              <MenuItem value="PENSIONISTA">Pensionista</MenuItem>
            </TextField>
            <TextField
              required
              label="Renda"
              type="number"
              value={form.responsavel.renda}
              onChange={handleResponsavelChange('renda')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              required
              label="Endereço"
              value={form.responsavel.endereco}
              onChange={handleResponsavelChange('endereco')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              required
              label="Número"
              type="number"
              value={form.responsavel.numeroEndereco}
              onChange={handleResponsavelChange('numeroEndereco')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              label="Complemento"
              value={form.responsavel.complementoEndereco}
              onChange={handleResponsavelChange('complementoEndereco')}
              fullWidth
            />
            <TextField
              required
              label="Bairro"
              value={form.responsavel.bairro}
              onChange={handleResponsavelChange('bairro')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              required
              label="Distrito"
              value={form.responsavel.distrito}
              onChange={handleResponsavelChange('distrito')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              required
              label="CEP"
              value={form.responsavel.cep}
              onChange={handleResponsavelChange('cep')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              label="Telefone Celular"
              value={form.responsavel.telefoneCelular}
              onChange={handleResponsavelChange('telefoneCelular')}
              fullWidth
            />
            <TextField
              label="Telefone Residencial"
              value={form.responsavel.telefoneResidencial}
              onChange={handleResponsavelChange('telefoneResidencial')}
              fullWidth
            />
            <TextField
              label="Telefone (outro)"
              value={form.responsavel.telefone}
              onChange={handleResponsavelChange('telefone')}
              fullWidth
            />
            <TextField
              label="Ponto de Referência"
              value={form.responsavel.pontoDeReferencia}
              onChange={handleResponsavelChange('pontoDeReferencia')}
              fullWidth
            />
            <TextField
              required
              select
              label="Condição de Moradia"
              value={form.responsavel.condicaoMoradia}
              onChange={handleResponsavelChange('condicaoMoradia')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            >
              <MenuItem value="PROPRIA">Própria</MenuItem>
              <MenuItem value="ALUGADA">Alugada</MenuItem>
              <MenuItem value="CEDIDA">Cedida</MenuItem>
            </TextField>
            <TextField
              required
              label="Nº de Cômodos"
              type="number"
              value={form.responsavel.numeroDeComodos}
              onChange={handleResponsavelChange('numeroDeComodos')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              required
              label="Valor (aluguel ou financiamento)"
              type="number"
              value={form.responsavel.valorAluguelOuFinanciamento}
              onChange={handleResponsavelChange('valorAluguelOuFinanciamento')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            />
            <TextField
              required
              select
              label="Tipo de Construção"
              value={form.responsavel.tipoConstrucao}
              onChange={handleResponsavelChange('tipoConstrucao')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            >
              <MenuItem value="ALVENARIA">Alvenaria</MenuItem>
              <MenuItem value="MADEIRA">Madeira</MenuItem>
              <MenuItem value="MISTA">Mista</MenuItem>
            </TextField>
            <TextField
              required
              select
              label="Situação Habitacional"
              value={form.responsavel.situacaoHabitacional}
              onChange={handleResponsavelChange('situacaoHabitacional')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            >
              <MenuItem value="CORTICO">Córtico</MenuItem>
              <MenuItem value="FAVELA">Favela</MenuItem>
              <MenuItem value="LOTEAMENTO_IRREGULAR">Loteamento Irregular</MenuItem>
            </TextField>
            <TextField
              required
              select
              label="Recebe PTR?"
              value={form.responsavel.recebePTR}
              onChange={handleResponsavelChange('recebePTR')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            >
              <MenuItem value="NAO">Não</MenuItem>
              <MenuItem value="RENDA_MINIMA">Renda Mínima</MenuItem>
              <MenuItem value="BOLSA_FAMILIA">Bolsa Família</MenuItem>
              <MenuItem value="RENDA_CIDADA">Renda Cidadã</MenuItem>
              <MenuItem value="ACAO_JOVEM">Ação Jovem</MenuItem>
              <MenuItem value="PETI">PETI</MenuItem>
            </TextField>
            <TextField
              required
              select
              label="Recebe BPC?"
              value={form.responsavel.recebeBPC}
              onChange={handleResponsavelChange('recebeBPC')}
              fullWidth
              InputLabelProps={{ sx: asteriskStyle }}
            >
              <MenuItem value="NAO">Não</MenuItem>
              <MenuItem value="IDOSO">Idoso</MenuItem>
              <MenuItem value="PCD">PCD</MenuItem>
            </TextField>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
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
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                }}
              >
                <TextField
                  label="Nome"
                  value={fam.nome}
                  onChange={handleFamiliarChange(idx, 'nome')}
                  fullWidth
                />
                <TextField
                  label="Data Nascimento"
                  type="date"
                  value={fam.dataNascimento}
                  onChange={handleFamiliarChange(idx, 'dataNascimento')}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
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
                <TextField
                  label="Profissão"
                  value={fam.profissao}
                  onChange={handleFamiliarChange(idx, 'profissao')}
                  fullWidth
                />
                <TextField
                  label="Ocupação"
                  value={fam.ocupacao}
                  onChange={handleFamiliarChange(idx, 'ocupacao')}
                  fullWidth
                />
                <TextField
                  label="Renda"
                  type="number"
                  value={fam.renda}
                  onChange={handleFamiliarChange(idx, 'renda')}
                  fullWidth
                />
                <TextField
                  select
                  label="Fator Risco Social"
                  value={fam.fatorRiscoSocial}
                  onChange={handleFamiliarChange(idx, 'fatorRiscoSocial')}
                  fullWidth
                >
                  <MenuItem value={1}>1. Alcoolismo</MenuItem>
                  <MenuItem value={2}>2. Deficiência auditiva</MenuItem>
                  <MenuItem value={3}>3. Deficiência física</MenuItem>
                  <MenuItem value={4}>4. Deficiência mental</MenuItem>
                  <MenuItem value={5}>5. Deficiência visual</MenuItem>
                  <MenuItem value={6}>6. Desemprego</MenuItem>
                  <MenuItem value={7}>7. Drogadição</MenuItem>
                  <MenuItem value={8}>8. DST (HIV+)</MenuItem>
                  <MenuItem value={9}>9. Problemas psiquiátricos</MenuItem>
                  <MenuItem value={10}>10. Situação de rua</MenuItem>
                  <MenuItem value={11}>11. Trabalho infantil</MenuItem>
                  <MenuItem value={12}>12. Violência doméstica</MenuItem>
                  <MenuItem value={13}>13. Medida Socioeducativa</MenuItem>
                  <MenuItem value={14}>14. Privação de liberdade</MenuItem>
                  <MenuItem value={15}>15. Acolhimento Institucional (abrigo/centro)</MenuItem>
                  <MenuItem value={16}>16. Outro</MenuItem>
                </TextField>
              </Box>
            </Box>
          ))}
        </Paper>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Cadastrar Criança
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
