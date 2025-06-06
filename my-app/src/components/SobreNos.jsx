// src/components/SobreNos.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  Avatar,
  CardActionArea
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';

const SobreNos = () => {
  const navigate = useNavigate();

  const integrantes = [
    {
      nome: 'Alex Chequer',
      funcao: 'Desenvolvedor Back-end e Scrum Master',
      foto: 'src/imgs/foto_alex.jpg', 
      linkedin: 'https://www.linkedin.com/in/alex-chequer-1b29a227b/'
    },
    {
      nome: 'Hélio Navarro',
      funcao: 'Desenvolvedor Full-Stack',
      foto: 'src/imgs/foto_helio.jpeg',
      linkedin: 'https://www.linkedin.com/in/heliohenrique-navarro/'
    },
    {
      nome: 'Matheus Vicco',
      funcao: 'Desenvolvedor Front-end',
      foto: 'src/imgs/foto_vicco.jpeg',
      linkedin: 'https://www.linkedin.com/in/matheusvicco/'
    },
    {
      nome: 'Raphael Lafer',
      funcao: 'Desenvolvedor Front-end',
      foto: 'src/imgs/foto_lafer.jpeg',
      linkedin: 'https://www.linkedin.com/in/raphael-lafer/'
    }
  ];

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* AppBar com botão Voltar */}
      <AppBar position="static" sx={{ backgroundColor: '#00249C' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box
            sx={{
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'Montserrat',
              fontSize: 20,
              borderLeft: '4px solid gold',
              pl: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box>
              <div>CCA</div>
              <div>PAM</div>
            </Box>
            <SchoolIcon />
          </Box>
          <Button
            color="inherit"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#FFD700',
                transform: 'scale(1.05)',
                backgroundColor: 'rgba(255, 215, 0, 0.1)'
              }
            }}
          >
            Voltar
          </Button>
        </Toolbar>
      </AppBar>

      {/* Conteúdo principal */}
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}
      >
        {/* Descrição do grupo */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #00249C 30%, #667eea 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Quem Somos
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Somos o grupo de desenvolvimento do projeto CCA PAM. Nosso objetivo é criar um sistema robusto
            e intuitivo para gestão de criaças em programas de assistência social. Cada integrante traz
            sua especialidade para entregar uma aplicação de qualidade, desde a interface amigável e intuitiva até
            o back-end escalável e o gerenciamento eficiente e preciso de dados.
          </Typography>
        </Box>

        {/* Cartões dos integrantes alinhados horizontalmente */}
        <Grid container spacing={3} justifyContent="center">
          {integrantes.map((pessoa) => (
            <Grid item xs={12} sm={6} md={3} key={pessoa.nome}>
              {/* CardActionArea faz o Card totalmente clicável */}
              <CardActionArea
                component="a"
                href={pessoa.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: 'none'
                }}
              >
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    boxShadow: '0 4px 15px rgba(0, 36, 156, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 25px rgba(0, 36, 156, 0.3)'
                    }
                  }}
                >
                  <Avatar
                    src={pessoa.foto}
                    alt={pessoa.nome}
                    sx={{ width: 80, height: 80, mb: 2, bgcolor: '#00249C', fontSize: 32 }}
                  >
                    {pessoa.nome.charAt(0)}
                  </Avatar>
                  <CardContent sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {pessoa.nome}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {pessoa.funcao}
                    </Typography>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid #ddd' }}>
            <Typography variant="caption" color="textSecondary">
              © 2025 CCA PAM. Todos os direitos reservados.
            </Typography>
          </Box>
      </Container>
    </Box>
  );
};

export default SobreNos;


<Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid #ddd' }}>
            <Typography variant="caption" color="textSecondary">
              © 2025 CCA PAM. Todos os direitos reservados.
            </Typography>
          </Box>