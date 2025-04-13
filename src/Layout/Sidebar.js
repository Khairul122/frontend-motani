import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Drawer, 
  IconButton, 
  useMediaQuery, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InfoIcon from '@mui/icons-material/Info';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';

function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Daftar Konsumen', icon: <PeopleIcon />, path: '/daftar-konsumen' },
    { text: 'Data User', icon: <PersonIcon />, path: '/data-user' },
    { text: 'Informasi', icon: <InfoIcon />, path: '/informasi' },
    { text: 'Produk', icon: <StoreIcon />, path: '/produk' },
    { text: 'Pesanan Masuk', icon: <ShoppingCartIcon />, path: '/pesanan-masuk' },
    { text: 'Laporan', icon: <AssessmentIcon />, path: '/laporan' },
  ];

  const sidebarContent = (
    <>
      <Box sx={{ textAlign: 'center', mb: 4, mt: isMobile ? 2 : 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
            <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        <img src="/img/logo.png" alt="Logo" width={isMobile ? 100 : 120} style={{ marginBottom: 8 }} />
        <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 'bold' }}>COFFLOW</Typography>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }} />

      <List sx={{ px: isMobile ? 1 : 0 }}>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
            <Button 
              component={Link}
              to={item.path}
              fullWidth 
              sx={{ 
                justifyContent: 'flex-start', 
                color: 'white', 
                py: 1,
                px: 2,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
              startIcon={item.icon}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: isMobile ? '0.875rem' : '0.9rem' }}>
                {item.text}
              </Typography>
            </Button>
          </ListItem>
        ))}
      </List>
    </>
  );

  if (isMobile) {
    return (
      <>
        <IconButton 
          onClick={toggleDrawer} 
          sx={{ 
            position: 'fixed', 
            top: 16, 
            left: 16, 
            color: '#1e2a38',
            bgcolor: 'white',
            zIndex: 1000,
            boxShadow: 2,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.9)'
            }
          }}
        >
          <MenuIcon />
        </IconButton>
        
        <Drawer
          anchor="left"
          open={open}
          onClose={toggleDrawer}
          PaperProps={{
            sx: {
              width: 240,
              backgroundColor: '#1e2a38',
              color: 'white',
              p: 2
            }
          }}
        >
          {sidebarContent}
        </Drawer>
      </>
    );
  }

  return (
    <Box
      sx={{
        width: 240,
        minHeight: '100vh',
        backgroundColor: '#1e2a38',
        color: 'white',
        p: 2,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {sidebarContent}
    </Box>
  );
}

export default Sidebar;
