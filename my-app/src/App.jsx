import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CadastrarAluno from './components/CadastrarAluno';
import ConsultarAlunos from './components/ConsultarAlunos';
import EditarAluno from './components/EditarAluno';
import DetalheAluno from './components/DetalheAluno';
import Frequencia from './components/Frequencia';
import SobreNos from './components/SobreNos';
import DesligarAluno from './components/DesligarAluno';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/cadastrar" element={<CadastrarAluno />} />
        <Route path="/consultar" element={<ConsultarAlunos />} />
        <Route path="/editar-aluno/:id" element={<EditarAluno />} />
        <Route path="/aluno/:id" element={<DetalheAluno />} />
        <Route path="/frequencia" element={<Frequencia />} />
        <Route path="/sobrenos" element={<SobreNos />} />
        <Route path="/desligar/:id" element={<DesligarAluno />} />
        {/* nova rota */}
      </Routes>
    </Router>
  );
}

export default App;
