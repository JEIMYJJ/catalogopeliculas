// src/pages/Register.jsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Error al registrar. Verifica los datos.');
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
          {/* Logo */}
          <Box display="flex" justifyContent="center" mb={2}>
            <img
              src="/src/assets/davivienda-logo.png"
              alt="Davivienda Logo"
              style={{ height: 60 }}
            />
          </Box>

          <Typography variant="h5" align="center" gutterBottom fontWeight={600}>
            Crear cuenta
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Correo"
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
                Registrarse
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/login')}
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
                ¿Ya tienes cuenta? Inicia sesión
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;
