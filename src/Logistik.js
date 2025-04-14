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

function Logistik() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState({});
  const [open, setOpen] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetch(API.LOGISTIK)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Gagal mengambil data logistik");
        setLoading(false);
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

  const handleEditOpen = (item) => {
    fetch(API.LOGISTIK_BY_ID(item.id))
      .then((res) => res.json())
      .then((detail) => {
        setSelected(detail);
        setOpen(true);
      })
      .catch(() => toast.error("Gagal mengambil detail logistik"));
  };

  const handleEditClose = () => {
    setOpen(false);
    setSelected({});
  };

  const handleEditChange = (e) => {
    setSelected({ ...selected, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = () => {
    const { id, ...payload } = selected;

    fetch(API.LOGISTIK_UPDATE(id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        fetchData();
        handleEditClose();
        toast.success("Data berhasil diperbarui");
      })
      .catch(() => toast.error("Gagal memperbarui data logistik"));
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      fetch(API.LOGISTIK_DELETE(id), {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          fetchData();
          toast.success("Data berhasil dihapus");
        })
        .catch(() => toast.error("Gagal menghapus data logistik"));
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <Navbar />
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <Typography variant="h6" gutterBottom>
            Data Logistik
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>Nama</TableCell>
                      <TableCell>No HP</TableCell>
                      <TableCell>Alamat</TableCell>
                      <TableCell>Nama Toko</TableCell>
                      <TableCell>Latitude</TableCell>
                      <TableCell>Longitude</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                          <TableCell>{item.nama}</TableCell>
                          <TableCell>{item.no_hp}</TableCell>
                          <TableCell>{item.alamat}</TableCell>
                          <TableCell>{item.nama_toko || "-"}</TableCell>
                          <TableCell>{item.lat}</TableCell>
                          <TableCell>{item.lng}</TableCell>
                          <TableCell>{item.status}</TableCell>
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
                              onClick={() => handleDelete(item.id)}
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
              />
            </Paper>
          )}
        </Box>

        <Dialog open={open} onClose={handleEditClose} fullWidth maxWidth="sm">
          <DialogTitle>Edit Logistik</DialogTitle>
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
              label="No HP"
              name="no_hp"
              value={selected.no_hp || ""}
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
              label="Nama Toko"
              name="nama_toko"
              value={selected.nama_toko || ""}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Latitude"
              name="lat"
              value={selected.lat || ""}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Longitude"
              name="lng"
              value={selected.lng || ""}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Status"
              name="status"
              value={selected.status || ""}
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

export default Logistik;