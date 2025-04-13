import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton,
  TablePagination, useMediaQuery, useTheme,
  Card, CardContent, Stack, Chip, Divider
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from './Api';
import Sidebar from './Layout/Sidebar';
import Navbar from './Layout/Navbar';

function DataUser() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchUsers = useCallback(() => {
    setLoading(true);
    fetch(API.USERS)
      .then(res => res.json())
      .then(response => {
        const users = Array.isArray(response) ? response : [];
        setData(users);
        setLoading(false);
      })
      .catch(err => {
        toast.error('Gagal mengambil data user');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = (id_users) => {
    if (window.confirm('Yakin ingin menghapus user ini?')) {
      fetch(API.USER_DELETE(id_users), {
        method: 'DELETE'
      })
        .then(res => {
          if (!res.ok) throw new Error('Gagal hapus');
          toast.success('User berhasil dihapus');
          fetchUsers();
        })
        .catch(() => toast.error('Gagal menghapus user'));
    }
  };

  const renderTableView = () => (
    <Paper sx={{ overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: { xs: 'calc(100vh - 240px)', md: 'calc(100vh - 200px)' } }}>
        <Table stickyHeader size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Nama</TableCell>
              {!isMobile && <TableCell>Email</TableCell>}
              <TableCell>Username</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(data) && data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
              <TableRow key={user.id_users} hover>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                {!isMobile && <TableCell>{user.email}</TableCell>}
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {visiblePasswords[user.id_users] ? user.password : '••••••••'}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => togglePasswordVisibility(user.id_users)}
                    >
                      {visiblePasswords[user.id_users] ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.level} 
                    size="small" 
                    color={user.level === 'admin' ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="error" 
                    size="small" 
                    onClick={() => handleDelete(user.id_users)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );

  const renderCardView = () => (
    <Stack spacing={2}>
      {Array.isArray(data) && data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
        <Card key={user.id_users} sx={{ width: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6">{user.name}</Typography>
              <Chip 
                label={user.level} 
                size="small" 
                color={user.level === 'admin' ? 'primary' : 'default'}
              />
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" color="text.secondary">Username: {user.username}</Typography>
            <Typography variant="body2" color="text.secondary">Email: {user.email}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">Password: </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {visiblePasswords[user.id_users] ? user.password : '••••••••'}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => togglePasswordVisibility(user.id_users)}
                sx={{ ml: 1 }}
              >
                {visiblePasswords[user.id_users] ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </IconButton>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton 
                color="error" 
                size="small" 
                onClick={() => handleDelete(user.id_users)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Stack>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Navbar />
        <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Data User
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            isMobile ? renderCardView() : renderTableView()
          )}
          <ToastContainer position="bottom-right" autoClose={3000} />
        </Box>
      </Box>
    </Box>
  );
}

export default DataUser;