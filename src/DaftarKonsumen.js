// src/DaftarKonsumen.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Layout/Navbar";
import Sidebar from "./Layout/Sidebar";
import API from "./Api";

function DaftarKonsumen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState({});
  const [open, setOpen] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetch(API.PEMBELI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
        toast.error("Gagal mengambil data pembeli");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
  
    const bulanIndo = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
  
    const [day, month, year] = dateStr.split('-');
    
    const bulan = bulanIndo[parseInt(month, 10) - 1];
  
    return `${day} ${bulan} ${year}`;
  };
  
  const handleEditOpen = (item) => {
    if (!item.id_pembeli) {
      toast.error("ID Pembeli tidak valid atau tidak ditemukan");
      return;
    }
    
    fetch(API.PEMBELI_BY_ID(item.id_pembeli), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((detail) => {
        if (detail && detail.nama) {
          setSelected(detail);
          setOpen(true);
        } else {
          toast.error("Data kosong atau tidak valid.");
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil detail pembeli:", err);
        toast.error("Gagal memuat data pembeli");
      });
  };

  const handleEditClose = () => {
    setSelected({});
    setOpen(false);
  };

  const handleEditChange = (e) => {
    setSelected((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = () => {
    if (!selected.id_pembeli) {
      toast.error("ID Pembeli tidak valid. Tidak dapat mengupdate data.");
      return;
    }
    
    const { id_pembeli, ...bodyData } = selected;

    fetch(API.PEMBELI_UPDATE(id_pembeli), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update gagal");
        return res.json();
      })
      .then(() => {
        fetchData();
        handleEditClose();
        toast.success("Data berhasil diperbarui");
      })
      .catch((err) => {
        console.error("Error updating data:", err);
        toast.error("Gagal memperbarui data");
      });
  };

  const handleDelete = (id) => {
    if (!id) {
      toast.error("ID Pembeli tidak valid. Tidak dapat menghapus data.");
      return;
    }
    
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      fetch(API.PEMBELI_DELETE(id), {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Gagal hapus");
          fetchData();
          toast.success("Data berhasil dihapus");
        })
        .catch((err) => {
          console.error("Error deleting data:", err);
          toast.error("Gagal menghapus data");
        });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, backgroundColor: "#f5f5f5", minHeight: "100vh", width: "100%" }}>
        <Navbar />
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <Typography variant="h6" gutterBottom sx={{ mb: { xs: 1, sm: 2 } }}>
            Daftar Konsumen
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper sx={{ overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: { xs: 300, sm: 400, md: 600 } }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>Nama</TableCell>
                      <TableCell>No. Telepon</TableCell>
                      <TableCell>Kecamatan</TableCell>
                      <TableCell>Alamat</TableCell>
                      <TableCell>Kode Pos</TableCell>
                      <TableCell>Tgl. Lahir</TableCell>
                      <TableCell>Jenis Kelamin</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Tanggal Bergabung</TableCell>
                      <TableCell>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item, index) => (
                        <TableRow key={item.id_pembeli || index}>
                          <TableCell>
                            {page * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell>{item.nama || "-"}</TableCell>
                          <TableCell>{item.no_telp || "-"}</TableCell>
                          <TableCell>{item.kecamatan || "-"}</TableCell>
                          <TableCell>{item.alamat || "-"}</TableCell>
                          <TableCell>{item.kodepos || "-"}</TableCell>
                          <TableCell>{item.tgl_lahir || "-"}</TableCell>
                          <TableCell>{item.jk || "-"}</TableCell>
                          <TableCell>{item.email || "-"}</TableCell>
                          <TableCell>{formatDate(item.tgl_create)}</TableCell>
                          <TableCell>
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleEditOpen(item)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDelete(item.id_pembeli)}
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
          )}
        </Box>

        <Dialog open={open} onClose={handleEditClose} fullWidth maxWidth="sm">
          <DialogTitle>Edit Konsumen</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Nama"
              name="nama"
              value={selected.nama || ""}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="No. Telepon"
              name="no_telp"
              value={selected.no_telp || ""}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Kecamatan"
              name="kecamatan"
              value={selected.kecamatan || ""}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Alamat"
              name="alamat"
              value={selected.alamat || ""}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Kode Pos"
              name="kodepos"
              value={selected.kodepos || ""}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={selected.email || ""}
              onChange={handleEditChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Batal</Button>
            <Button variant="contained" onClick={handleEditSubmit}>
              Simpan
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Box>
    </Box>
  );
}

export default DaftarKonsumen;