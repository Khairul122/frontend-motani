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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Layout/Navbar";
import Sidebar from "./Layout/Sidebar";
import API from "./Api";

function Produksi() {
  const [data, setData] = useState([]);
  const [produkOptions, setProdukOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState({});
  const [open, setOpen] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetch(API.PRODUKSI)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal fetch produksi:", err);
        toast.error("Gagal mengambil data produksi");
        setLoading(false);
      });
  };

  const fetchProdukOptions = () => {
    fetch(API.PRODUK)
      .then((res) => res.json())
      .then((res) => setProdukOptions(res))
      .catch(() => toast.error("Gagal mengambil daftar produk"));
  };

  useEffect(() => {
    fetchData();
    fetchProdukOptions();
  }, []);

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleEditOpen = (item) => {
    fetch(API.PRODUKSI_BY_ID(item.id_produksi))
      .then((res) => res.json())
      .then((res) => {
        setSelected(res);
        setOpen(true);
      })
      .catch(() => toast.error("Gagal mengambil detail produksi"));
  };

  const handleEditClose = () => {
    setSelected({});
    setOpen(false);
  };

  const handleEditChange = (e) => {
    setSelected((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = () => {
    const method = selected.id_produksi ? "PUT" : "POST";
    const url = selected.id_produksi
      ? API.PRODUKSI_UPDATE(selected.id_produksi)
      : API.PRODUKSI;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    })
      .then((res) => res.json())
      .then(() => {
        fetchData();
        handleEditClose();
        toast.success("Data berhasil disimpan");
      })
      .catch(() => toast.error("Gagal menyimpan data"));
  };

  const handleDelete = (id) => {
    if (!id || !window.confirm("Yakin hapus data ini?")) return;
    fetch(API.PRODUKSI_DELETE(id), { method: "DELETE" })
      .then(() => {
        fetchData();
        toast.success("Data berhasil dihapus");
      })
      .catch(() => toast.error("Gagal menghapus data"));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <Navbar />
        <Box sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Data Produksi
            </Typography>
            <Button variant="contained" sx={{ backgroundColor: 'green' }} onClick={() => setOpen(true)}>
              Tambah Produksi
            </Button>
          </Stack>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>ID Produk</TableCell>
                      <TableCell>Tanggal Panen</TableCell>
                      <TableCell>Tanggal Roasting</TableCell>
                      <TableCell>Jumlah</TableCell>
                      <TableCell>Varietas</TableCell>
                      <TableCell>Pemasok</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                      const produk = produkOptions.find(p => p.id_produk === row.id_produk);
                      return (
                        <TableRow key={row.id_produksi}>
                          <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                          <TableCell>{produk?.nama_produk || row.id_produk}</TableCell>
                          <TableCell>{row.tanggal_panen || '-'}</TableCell>
                          <TableCell>{row.tanggal_roasting || '-'}</TableCell>
                          <TableCell>{row.jumlah}</TableCell>
                          <TableCell>{row.jenis_varietas || '-'}</TableCell>
                          <TableCell>{row.nama_pemasok || '-'}</TableCell>
                          <TableCell>{row.status_produksi || '-'}</TableCell>
                          <TableCell>
                            <IconButton color="primary" onClick={() => handleEditOpen(row)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(row.id_produksi)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
              />
            </Paper>
          )}
        </Box>

        <Dialog open={open} onClose={handleEditClose} fullWidth maxWidth="sm">
          <DialogTitle>{selected.id_produksi ? "Edit Produksi" : "Tambah Produksi"}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel id="produk-label">Produk</InputLabel>
              <Select
                labelId="produk-label"
                name="id_produk"
                value={selected.id_produk || ""}
                onChange={handleEditChange}
                label="Produk"
              >
                {produkOptions.map((produk) => (
                  <MenuItem key={produk.id_produk} value={produk.id_produk}>
                    {produk.nama_produk}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField fullWidth margin="normal" type="date" label="Tanggal Panen" name="tanggal_panen" value={selected.tanggal_panen || ""} onChange={handleEditChange} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth margin="normal" type="date" label="Tanggal Roasting" name="tanggal_roasting" value={selected.tanggal_roasting || ""} onChange={handleEditChange} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth margin="normal" type="number" label="Jumlah" name="jumlah" value={selected.jumlah || ""} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Jenis Varietas" name="jenis_varietas" value={selected.jenis_varietas || ""} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Nama Pemasok" name="nama_pemasok" value={selected.nama_pemasok || ""} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Catatan" name="catatan" value={selected.catatan || ""} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Status Produksi" name="status_produksi" value={selected.status_produksi || ""} onChange={handleEditChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Batal</Button>
            <Button variant="contained" onClick={handleEditSubmit}>Simpan</Button>
          </DialogActions>
        </Dialog>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </Box>
    </Box>
  );
}

export default Produksi;
