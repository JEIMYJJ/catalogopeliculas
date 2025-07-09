// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Alert,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/dashboard');
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas. Intenta de nuevo.');
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card sx={{ width: '100%', boxShadow: 4, borderRadius: 3 }}>
        <CardContent sx={{ px: 4, py: 5 }}>
          {/* Logo de Davivienda */}
          <Box display="flex" justifyContent="center" mb={2}>
            <img
              src="/src/assets/davivienda-logo.png"
              alt="Davivienda Logo"
              style={{ height: 60 }}
            />
          </Box>

          <Typography variant="h5" align="center" gutterBottom fontWeight={600}>
            Inicio de sesión
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              sx={{ borderRadius: 2 }}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              sx={{ borderRadius: 2 }}
            />

            <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#d21f04',
                  borderRadius: 2,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#b91b03',
                  },
                }}
              >
                Iniciar Sesión
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/register')}
                sx={{
                  borderRadius: 2,
                  borderColor: '#d21f04',
                  color: '#d21f04',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#fce6e4',
                    borderColor: '#b91b03',
                  },
                }}
              >
                ¿No tienes cuenta? Regístrate
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
