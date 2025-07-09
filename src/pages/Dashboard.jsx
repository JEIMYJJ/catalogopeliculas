// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Paper,
  Divider
} from '@mui/material';
import { auth, db } from '../services/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [search, setSearch] = useState('');
  const [movie, setMovie] = useState(null);
  const [myMovies, setMyMovies] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const fetchMovie = async () => {
    if (!search) return;
    const res = await fetch(`https://www.omdbapi.com/?t=${search}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`);
    const data = await res.json();
    if (data.Response === 'True') {
      setMovie({
        title: data.Title,
        year: data.Year,
        director: data.Director,
        genre: data.Genre,
        poster: data.Poster,
      });
    } else {
      setMovie(null);
      alert('Película no encontrada');
    }
  };

  const saveMovie = async () => {
    if (!movie || !user) return;
  const { title, year, director, genre } = movie;
    if (!title || !year || !director || !genre || isNaN(year) || year.length !== 4) {
  alert('Todos los campos son obligatorios y el año debe ser un número de 4 dígitos.');
  return;
}

    await addDoc(collection(db, 'peliculas'), {
      ...movie,
      uid: user.uid,
      createdAt: new Date()
    });
    fetchSavedMovies();
    setMovie(null);
    setSearch('');
  };

  const fetchSavedMovies = async () => {
    const q = query(collection(db, 'peliculas'), where('uid', '==', user.uid));
    const snapshot = await getDocs(q);
    const saved = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMyMovies(saved);
  };

  const deleteMovie = async (id) => {
    await deleteDoc(doc(db, 'peliculas', id));
    fetchSavedMovies();
  };

 const updateMovie = async (id, field, value) => {
  const trimmed = value.trim();

  if (!trimmed) {
    alert(`El campo "${field}" no puede estar vacío.`);
    return;
  }

  if (field === 'year' && (isNaN(trimmed) || trimmed.length !== 4)) {
    alert('El año debe ser un número de 4 dígitos.');
    return;
  }

  await updateDoc(doc(db, 'peliculas', id), { [field]: trimmed });
};
  useEffect(() => {
    if (user) {
      fetchSavedMovies();
    }
  }, [user]);

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight={600}>🎬 Catálogo de Películas</Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight={500}>Agregar nueva película</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="Buscar película por título"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={fetchMovie}
            sx={{ backgroundColor: '#d21f04', '&:hover': { backgroundColor: '#b91b03' } }}
          >
            Buscar
          </Button>
        </Box>

        {movie && (
          <Card sx={{ display: 'flex', mt: 3 }}>
            <CardMedia component="img" image={movie.poster} sx={{ width: 150 }} />
            <CardContent>
              <Typography variant="h6">{movie.title} ({movie.year})</Typography>
              <Typography>🎬 Director: {movie.director}</Typography>
              <Typography>🎞️ Género: {movie.genre}</Typography>
              <Button
                variant="contained"
                onClick={saveMovie}
                sx={{ mt: 2, backgroundColor: '#d21f04', '&:hover': { backgroundColor: '#b91b03' } }}
              >
                Guardar en favoritos
              </Button>
            </CardContent>
          </Card>
        )}
      </Paper>

      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom fontWeight={600}>📁 Películas Guardadas</Typography>
      <Grid container spacing={2}>
        {myMovies.map((m) => (
          <Grid item xs={12} sm={6} md={4} key={m.id}>
            <Card>
              <CardMedia component="img" image={m.poster} height="300" />
              <CardContent>
                <TextField
                  label="Título"
                  fullWidth
                  defaultValue={m.title}
                  onBlur={(e) => updateMovie(m.id, 'title', e.target.value)}
                  margin="dense"
                />
                <TextField
                  label="Año"
                  fullWidth
                  defaultValue={m.year}
                  onBlur={(e) => updateMovie(m.id, 'year', e.target.value)}
                  margin="dense"
                />
                <TextField
                  label="Director"
                  fullWidth
                  defaultValue={m.director}
                  onBlur={(e) => updateMovie(m.id, 'director', e.target.value)}
                  margin="dense"
                />
                <TextField
                  label="Género"
                  fullWidth
                  defaultValue={m.genre}
                  onBlur={(e) => updateMovie(m.id, 'genre', e.target.value)}
                  margin="dense"
                />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => deleteMovie(m.id)}
                >
                  Eliminar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
