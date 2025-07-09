// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" color="default" sx={{ boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: 'center', gap: 2 }}>
        <Box
          component="img"
          src="/src/assets/davivienda-logo.png"
          alt="Davivienda"
          sx={{ height: 40 }}
        />
        <Typography variant="h6" fontWeight={600}>
          Catálogo de Películas
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
