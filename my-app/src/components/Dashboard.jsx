import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Fade
} from '@mui/material';
import {
  Logout as LogoutIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  EventBusy as EventBusyIcon,
  School as SchoolIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const menuItems = [
    {
      title: 'Consultar Alunos',
      description: 'Visualize e pesquise informações dos alunos cadastrados',
      icon: <PeopleIcon sx={{ fontSize: 32 }} />,
      route: '/consultar',
      color: '#1976d2'
    },
    {
      title: 'Cadastrar Aluno',
      description: 'Adicione novos alunos ao sistema',
      icon: <PersonAddIcon sx={{ fontSize: 32 }} />,
      route: '/cadastrar',
      color: '#388e3c'
    },
    {
      title: 'Registrar Faltas',
      description: 'Controle de frequência e faltas dos alunos',
      icon: <EventBusyIcon sx={{ fontSize: 32 }} />,
      route: '/frequencia',
      color: '#f57c00'
    }
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* AppBar no topo */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#00249C',
          boxShadow: 'none'
        }}
      >
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
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              transition: 'all 0.3s ease',
              borderRadius: 2,
              px: 1.5,
              py: 0.8,
              fontSize: 14,
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

      {/* Conteúdo principal */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 2,
          px: 2,
          overflowY: 'auto'
        }}
      >
        <Fade in={true} timeout={800}>
          <Paper
            elevation={8}
            sx={{
              width: '100%',
              maxWidth: 1100,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 2, sm: 3, md: 4 }
            }}
          >
            {/* Título e subtítulo centralizados */}
            <Box sx={{ textAlign: 'center', mb: { xs: 1.5, sm: 2.5, md: 3.5 } }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  mb: { xs: 0.5, sm: 1 },
                  background: 'linear-gradient(45deg, #00249C 30%, #667eea 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.5rem', sm: '1.7rem', md: '1.9rem' }
                }}
              >
                Bem-vindo ao Sistema CCA PAM
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#666',
                  fontWeight: 300,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                O que deseja fazer hoje?
              </Typography>
            </Box>

            {/* Foi aqui que aumentamos spacing para 4 e adicionamos justifyContent */}
            <Grid container spacing={4} justifyContent="center">
              {menuItems.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  key={item.title}
                >
                  <Fade in timeout={1000 + index * 200}>
                    <Card
                      onClick={() => navigate(item.route)}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.25s ease',
                        cursor: 'pointer',
                        borderRadius: 2,
                        overflow: 'hidden',
                        position: 'relative',
                        minHeight: 180,
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
                          '& .card-icon': {
                            transform: 'scale(1.1)',
                            color: item.color
                          }
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}aa 100%)`
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 2, pb: 1 }}>
                        <Box
                          className="card-icon"
                          sx={{
                            color: '#666',
                            mb: 1,
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 'bold',
                            color: '#333',
                            mb: 0.5,
                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            lineHeight: 1.3,
                            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' }
                          }}
                        >
                          {item.description}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'center', pb: 1 }}>
                        <Button
                          variant="contained"
                          sx={{
                            background: `linear-gradient(45deg, ${item.color} 30%, ${item.color}dd 90%)`,
                            borderRadius: 2,
                            px: { xs: 1.5, sm: 2 },
                            py: { xs: 0.6, sm: 0.8 },
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            boxShadow: `0 3px 10px ${item.color}30`,
                            '&:hover': {
                              background: `linear-gradient(45deg, ${item.color}dd 30%, ${item.color}bb 90%)`,
                              boxShadow: `0 5px 15px ${item.color}50`
                            }
                          }}
                        >
                          Acessar
                        </Button>
                      </CardActions>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>

            {/* Footer compacto */}
            <Box sx={{ mt: { xs: 1.5, sm: 2.5 }, pt: 1, borderTop: '1px solid #eee', textAlign: 'center' }}>
              <Typography
                variant="caption"
                sx={{ color: '#999', fontSize: '0.8rem' }}
              >
                Sistema de Gestão Acadêmica – CCA PAM
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#bbb', display: 'block', mt: 0.5, fontSize: '0.7rem' }}
              >
                Versão 1.0 – Acesso Autorizado
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
};

export default Dashboard;
