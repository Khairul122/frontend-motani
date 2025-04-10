import React from 'react';
import { Box, Grid, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InfoIcon from '@mui/icons-material/Info';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Sidebar from './Layout/Sidebar';
import Navbar from './Layout/Navbar';

function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    { icon: <DashboardIcon fontSize={isMobile ? "medium" : "large"} />, label: 'Dashboard', bg: '#29b6f6' },
    { icon: <InfoIcon fontSize={isMobile ? "medium" : "large"} />, label: 'Informasi', bg: '#66bb6a' },
    { icon: <StoreIcon fontSize={isMobile ? "medium" : "large"} />, label: 'Produk', bg: '#ffb74d' },
    { icon: <ShoppingCartIcon fontSize={isMobile ? "medium" : "large"} />, label: 'Pesanan Masuk', bg: '#ef5350' },
    { icon: <AssessmentIcon fontSize={isMobile ? "medium" : "large"} />, label: 'Laporan', bg: '#5c6bc0' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Navbar />
        <Grid container spacing={2} sx={{ mb: 3, px: { xs: 1, sm: 2 }, mt:2 }}>
          {menuItems.map((item, index) => (
            <Grid key={index} item xs={6} sm={6} md={4} lg={2.4}>
              <Paper
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  textAlign: 'center',
                  backgroundColor: item.bg,
                  color: 'white',
                  borderRadius: 1,
                  boxShadow: 2,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 3,
                  },
                }}
              >
                {item.icon}
                <Typography mt={1} fontSize={{ xs: '0.8rem', sm: '0.9rem', md: '1rem' }}>
                  {item.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Paper
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderRadius: 1,
            boxShadow: 2,
            mx: { xs: 1, sm: 2 },
            mb: 2
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="medium">
            Site Analysis
          </Typography>
          <Box sx={{ overflow: 'hidden', borderRadius: 1 }}>
            <img
              src="/img/grafik.png"
              alt="Grafik"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Dashboard;