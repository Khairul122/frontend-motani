import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Avatar
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useLocation } from 'react-router-dom';

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const location = useLocation();

  const pageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/daftar-konsumen': return 'Daftar Konsumen';
      case '/data-user': return 'Data User';
      case '/informasi': return 'Informasi';
      case '/logistik': return 'Logistik';
      case '/produk': return 'Produk';
      default: return 'Halaman';
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#4caf50' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          {pageTitle()}
        </Typography>

        <Box>
          <IconButton
            size="medium"
            edge="end"
            color="inherit"
            onClick={handleMenu}
            sx={{ p: { xs: 0.5, sm: 1 } }}
          >
            <Avatar sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>{user.name || 'Guest'}</MenuItem>
            <MenuItem disabled>{user.email || 'guest@email.com'}</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

