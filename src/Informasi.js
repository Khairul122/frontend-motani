// src/Informasi.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Grid,
  Paper,
  CardMedia,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Add, Edit, Delete, EventNote, TrendingUp } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "./Api";
import Sidebar from "./Layout/Sidebar";
import Navbar from "./Layout/Navbar";

function Informasi() {
  // States untuk informasi
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    judul: "",
    ket: "",
    tgl_post: "",
    foto: null,
  });

  // States untuk detail view
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // States untuk kalender panen
  const [kalenderOpen, setKalenderOpen] = useState(false);
  const [kalenderEditMode, setKalenderEditMode] = useState(false);
  const [selectedKalender, setSelectedKalender] = useState(null);
  const [kalenderForm, setKalenderForm] = useState({
    wilayah: "",
    awal_panen: "",
    akhir_panen: "",
    catatan: "",
  });

  // States untuk prediksi permintaan
  const [prediksiOpen, setPrediksiOpen] = useState(false);
  const [prediksiEditMode, setPrediksiEditMode] = useState(false);
  const [selectedPrediksi, setSelectedPrediksi] = useState(null);
  const [prediksiForm, setPrediksiForm] = useState({
    wilayah: "",
    periode: "",
    deskripsi: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fungsi fetch data
  const fetchData = () => {
    setLoading(true);
    fetch(API.INFORMASI)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Gagal mengambil data informasi");
        setLoading(false);
      });
  };

  const fetchDetailData = (id) => {
    setLoading(true);
    // Remove the slash before id to avoid double slash
    fetch(`${API.INFORMASI}${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("Detail data response:", res);
        setDetailData(res);
        setDetailOpen(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching details:", error);
        toast.error("Gagal mengambil detail informasi");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers untuk informasi
  const handleOpen = (item = null) => {
    if (item) {
      setEditMode(true);
      setSelected(item);
      setForm({
        judul: item.judul,
        ket: item.ket || "",
        tgl_post: item.tgl_post,
        foto: null,
      });
    } else {
      setEditMode(false);
      setForm({ judul: "", ket: "", tgl_post: "", foto: null });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm({ judul: "", ket: "", tgl_post: "", foto: null });
    setSelected(null);
    setEditMode(false);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setDetailData(null);
    setTabValue(0);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("judul", form.judul);
    formData.append("ket", form.ket);
    formData.append("tgl_post", form.tgl_post);
    if (form.foto) formData.append("foto", form.foto);

    const method = editMode ? "PUT" : "POST";
    const url = editMode
      ? API.INFORMASI_UPDATE(selected.id_informasi)
      : API.INFORMASI;

    fetch(url, { method, body: formData })
      .then((res) => res.json())
      .then(() => {
        toast.success(
          editMode ? "Berhasil diperbarui" : "Berhasil ditambahkan"
        );
        handleClose();
        fetchData();
      })
      .catch(() => toast.error("Gagal menyimpan data"));
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus informasi ini?")) {
      fetch(API.INFORMASI_DELETE(id), { method: "DELETE" })
        .then(() => {
          toast.success("Berhasil dihapus");
          fetchData();
        })
        .catch(() => toast.error("Gagal menghapus informasi"));
    }
  };

  // Handlers untuk tabs
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handlers untuk kalender panen
  const handleKalenderChange = (e) => {
    const { name, value } = e.target;
    setKalenderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleKalenderOpen = (item = null) => {
    if (item) {
      setKalenderEditMode(true);
      setSelectedKalender(item);
      setKalenderForm({
        wilayah: item.wilayah,
        awal_panen: item.awal_panen,
        akhir_panen: item.akhir_panen,
        catatan: item.catatan || "",
      });
    } else {
      setKalenderEditMode(false);
      setKalenderForm({
        wilayah: "",
        awal_panen: "",
        akhir_panen: "",
        catatan: "",
      });
    }
    setKalenderOpen(true);
  };

  const handleKalenderClose = () => {
    setKalenderOpen(false);
    setKalenderForm({
      wilayah: "",
      awal_panen: "",
      akhir_panen: "",
      catatan: "",
    });
    setSelectedKalender(null);
    setKalenderEditMode(false);
  };

  const handleKalenderSubmit = () => {
    const formData = new FormData();
    formData.append("wilayah", kalenderForm.wilayah);
    formData.append("awal_panen", kalenderForm.awal_panen);
    formData.append("akhir_panen", kalenderForm.akhir_panen);
    formData.append("catatan", kalenderForm.catatan);
    formData.append("id_informasi", detailData.id_informasi);

    const method = kalenderEditMode ? "PUT" : "POST";
    const url = kalenderEditMode
      ? API.KALENDER_PANEN_UPDATE(selectedKalender.id_kalender)
      : API.KALENDER_PANEN;

    fetch(url, { method, body: formData })
      .then((res) => res.json())
      .then(() => {
        toast.success(
          kalenderEditMode
            ? "Kalender berhasil diperbarui"
            : "Kalender berhasil ditambahkan"
        );
        handleKalenderClose();
        fetchDetailData(detailData.id_informasi);
      })
      .catch(() => toast.error("Gagal menyimpan data kalender"));
  };

  const handleKalenderDelete = (id) => {
    if (window.confirm("Hapus kalender panen ini?")) {
      fetch(API.KALENDER_PANEN_DELETE(id), { method: "DELETE" })
        .then(() => {
          toast.success("Kalender berhasil dihapus");
          fetchDetailData(detailData.id_informasi);
        })
        .catch(() => toast.error("Gagal menghapus kalender"));
    }
  };

  // Handlers untuk prediksi permintaan
  const handlePrediksiChange = (e) => {
    const { name, value } = e.target;
    setPrediksiForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrediksiOpen = (item = null) => {
    if (item) {
      setPrediksiEditMode(true);
      setSelectedPrediksi(item);
      setPrediksiForm({
        wilayah: item.wilayah,
        periode: item.periode,
        deskripsi: item.deskripsi || "",
      });
    } else {
      setPrediksiEditMode(false);
      setPrediksiForm({ wilayah: "", periode: "", deskripsi: "" });
    }
    setPrediksiOpen(true);
  };

  const handlePrediksiClose = () => {
    setPrediksiOpen(false);
    setPrediksiForm({ wilayah: "", periode: "", deskripsi: "" });
    setSelectedPrediksi(null);
    setPrediksiEditMode(false);
  };

  const handlePrediksiSubmit = () => {
    const formData = new FormData();
    formData.append("wilayah", prediksiForm.wilayah);
    formData.append("periode", prediksiForm.periode);
    formData.append("deskripsi", prediksiForm.deskripsi);
    formData.append("id_informasi", detailData.id_informasi);

    const method = prediksiEditMode ? "PUT" : "POST";
    const url = prediksiEditMode
      ? API.PREDIKSI_PERMINTAAN_UPDATE(selectedPrediksi.id_prediksi)
      : API.PREDIKSI_PERMINTAAN;

    fetch(url, { method, body: formData })
      .then((res) => res.json())
      .then(() => {
        toast.success(
          prediksiEditMode
            ? "Prediksi berhasil diperbarui"
            : "Prediksi berhasil ditambahkan"
        );
        handlePrediksiClose();
        fetchDetailData(detailData.id_informasi);
      })
      .catch(() => toast.error("Gagal menyimpan data prediksi"));
  };

  const handlePrediksiDelete = (id) => {
    if (window.confirm("Hapus prediksi permintaan ini?")) {
      fetch(API.PREDIKSI_PERMINTAAN_DELETE(id), { method: "DELETE" })
        .then(() => {
          toast.success("Prediksi berhasil dihapus");
          fetchDetailData(detailData.id_informasi);
        })
        .catch(() => toast.error("Gagal menghapus prediksi"));
    }
  };

  // Fungsi helper
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <Navbar />

        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={3}
          py={2}
          width="100%"
        >
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            Daftar Informasi
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            sx={{
              backgroundColor: "#4caf50",
              "&:hover": { backgroundColor: "#388e3c" },
            }}
          >
            Tambah
          </Button>
        </Box>

        {/* Daftar Informasi */}
        <Box sx={{ width: "100%", px: 2 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress color="success" />
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ width: "100%", m: 0 }}>
              {data.map((item) => (
                <Grid
                  item
                  xs={12}
                  key={item.id_informasi}
                  sx={{ width: "100%", p: 1 }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      width: "100%",
                      maxWidth: "100%",
                      mx: "auto",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      borderRadius: 2,
                      overflow: "hidden",
                      borderLeft: "0.25rem solid #4caf50",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.01)" },
                      cursor: "pointer",
                    }}
                    onClick={() => fetchDetailData(item.id_informasi)}
                  >
                    <Box display="flex" p={2}>
                      {item.foto && (
                        <CardMedia
                          component="img"
                          sx={{
                            width: "7.5rem",
                            height: "7.5rem",
                            objectFit: "cover",
                            borderRadius: 1,
                            mr: 2,
                            display: { xs: "none", sm: "block" },
                          }}
                          image={`${API.INFORMASI_FOTO}/${item.foto}`}
                          alt={item.judul}
                        />
                      )}
                      <Box sx={{ flex: 1, width: "100%" }}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {item.judul}
                          </Typography>
                          <Chip
                            label={formatDate(item.tgl_post)}
                            size="small"
                            sx={{
                              backgroundColor: "#e8f5e9",
                              color: "#2e7d32",
                              fontWeight: "bold",
                              ml: 1,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ whiteSpace: "pre-line", mb: 1 }}
                        >
                          {item.ket}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Box display="flex" justifyContent="flex-end">
                          <IconButton
                            aria-label="edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpen(item);
                            }}
                            sx={{ color: theme.palette.info.main }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id_informasi);
                            }}
                            sx={{ color: theme.palette.error.main }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Modal Tambah/Edit Informasi */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle
            sx={{
              backgroundColor: "#4caf50",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {editMode ? "Edit Informasi" : "Tambah Informasi"}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Judul"
              name="judul"
              value={form.judul}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Keterangan"
              name="ket"
              multiline
              rows={6}
              value={form.ket}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Tanggal Post"
              name="tgl_post"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={form.tgl_post}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                mt: 1,
                mb: 2,
                py: 1.5,
                borderStyle: "dashed",
                borderColor: "#4caf50",
                color: "#4caf50",
                "&:hover": {
                  borderColor: "#388e3c",
                  backgroundColor: "#e8f5e9",
                },
              }}
            >
              {form.foto ? form.foto.name : "Unggah Foto"}
              <input type="file" hidden name="foto" onChange={handleChange} />
            </Button>
            {form.foto && (
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {form.foto.name}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleClose}
              sx={{
                color: "text.secondary",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#4caf50",
                "&:hover": { backgroundColor: "#388e3c" },
              }}
            >
              {editMode ? "Update" : "Simpan"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal Detail Informasi */}
        <Dialog
          open={detailOpen}
          onClose={handleDetailClose}
          fullWidth
          maxWidth="lg"
        >
          {detailData && (
            <>
              <DialogTitle
                sx={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Detail Informasi: {detailData.judul}
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Box
                  display="flex"
                  flexDirection={isMobile ? "column" : "row"}
                  mb={3}
                >
                  {detailData.foto && (
                    <CardMedia
                      component="img"
                      sx={{
                        width: isMobile ? "100%" : "300px",
                        height: isMobile ? "200px" : "300px",
                        objectFit: "cover",
                        borderRadius: 1,
                        mr: isMobile ? 0 : 3,
                        mb: isMobile ? 2 : 0,
                      }}
                      image={`${API.INFORMASI_FOTO}/${detailData.foto}`}
                      alt={detailData.judul}
                    />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {detailData.judul}
                    </Typography>
                    <Chip
                      label={formatDate(detailData.tgl_post)}
                      size="small"
                      sx={{
                        backgroundColor: "#e8f5e9",
                        color: "#2e7d32",
                        fontWeight: "bold",
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ whiteSpace: "pre-line", mb: 3 }}
                    >
                      {detailData.ket}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{ mb: 3 }}
                >
                  <Tab
                    icon={<EventNote />}
                    label="Kalender Panen"
                    iconPosition="start"
                    sx={{
                      fontWeight: "bold",
                      color: tabValue === 0 ? "#4caf50" : "inherit",
                    }}
                  />
                  <Tab
                    icon={<TrendingUp />}
                    label="Prediksi Permintaan"
                    iconPosition="start"
                    sx={{
                      fontWeight: "bold",
                      color: tabValue === 1 ? "#4caf50" : "inherit",
                    }}
                  />
                </Tabs>

                {/* Tab Panel Kalender Panen */}
                {tabValue === 0 && (
                  <Box>
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleKalenderOpen()}
                        sx={{
                          backgroundColor: "#4caf50",
                          "&:hover": {
                            backgroundColor: "#388e3c",
                          },
                        }}
                      >
                        Tambah Kalender
                      </Button>
                    </Box>
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                      <Table>
                        <TableHead sx={{ backgroundColor: "#f1f8e9" }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Wilayah
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Awal Panen
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Akhir Panen
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Catatan
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Aksi
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* Cek struktur data dan pastikan properti kalender_panen tersedia */}
                          {detailData?.kalender_panen &&
                          detailData.kalender_panen.length > 0 ? (
                            detailData.kalender_panen.map((item) => (
                              <TableRow key={item.id_kalender}>
                                <TableCell>{item.wilayah}</TableCell>
                                <TableCell>
                                  {formatDate(item.awal_panen)}
                                </TableCell>
                                <TableCell>
                                  {formatDate(item.akhir_panen)}
                                </TableCell>
                                <TableCell>{item.catatan}</TableCell>
                                <TableCell>
                                  <IconButton
                                    aria-label="edit"
                                    onClick={() => handleKalenderOpen(item)}
                                    sx={{ color: theme.palette.info.main }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    aria-label="delete"
                                    onClick={() =>
                                      handleKalenderDelete(item.id_kalender)
                                    }
                                    sx={{ color: theme.palette.error.main }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} align="center">
                                Belum ada data kalender panen
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {tabValue === 1 && (
                  <Box>
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handlePrediksiOpen()}
                        sx={{
                          backgroundColor: "#4caf50",
                          "&:hover": {
                            backgroundColor: "#388e3c",
                          },
                        }}
                      >
                        Tambah Prediksi
                      </Button>
                    </Box>
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                      <Table>
                        <TableHead sx={{ backgroundColor: "#f1f8e9" }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Wilayah
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Periode
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Deskripsi
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Aksi
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* Cek struktur data dan pastikan properti prediksi_permintaan tersedia */}
                          {detailData?.prediksi_permintaan &&
                          detailData.prediksi_permintaan.length > 0 ? (
                            detailData.prediksi_permintaan.map((item) => (
                              <TableRow key={item.id_prediksi}>
                                <TableCell>{item.wilayah}</TableCell>
                                <TableCell>{item.periode}</TableCell>
                                <TableCell>{item.deskripsi}</TableCell>
                                <TableCell>
                                  <IconButton
                                    aria-label="edit"
                                    onClick={() => handlePrediksiOpen(item)}
                                    sx={{ color: theme.palette.info.main }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    aria-label="delete"
                                    onClick={() =>
                                      handlePrediksiDelete(item.id_prediksi)
                                    }
                                    sx={{ color: theme.palette.error.main }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                Belum ada data prediksi permintaan
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button
                  onClick={handleDetailClose}
                  sx={{
                    color: "text.secondary",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  Tutup
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Modal Tambah/Edit Kalender Panen */}
        <Dialog
          open={kalenderOpen}
          onClose={handleKalenderClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              backgroundColor: "#4caf50",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {kalenderEditMode ? "Edit Kalender Panen" : "Tambah Kalender Panen"}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Wilayah"
              name="wilayah"
              value={kalenderForm.wilayah}
              onChange={handleKalenderChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Awal Panen"
              name="awal_panen"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={kalenderForm.awal_panen}
              onChange={handleKalenderChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Akhir Panen"
              name="akhir_panen"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={kalenderForm.akhir_panen}
              onChange={handleKalenderChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Catatan"
              name="catatan"
              multiline
              rows={4}
              value={kalenderForm.catatan}
              onChange={handleKalenderChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleKalenderClose}
              sx={{
                color: "text.secondary",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={handleKalenderSubmit}
              sx={{
                backgroundColor: "#4caf50",
                "&:hover": { backgroundColor: "#388e3c" },
              }}
            >
              {kalenderEditMode ? "Update" : "Simpan"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal Tambah/Edit Prediksi Permintaan */}
        <Dialog
          open={prediksiOpen}
          onClose={handlePrediksiClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              backgroundColor: "#4caf50",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {prediksiEditMode
              ? "Edit Prediksi Permintaan"
              : "Tambah Prediksi Permintaan"}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Wilayah"
              name="wilayah"
              value={prediksiForm.wilayah}
              onChange={handlePrediksiChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Periode"
              name="periode"
              value={prediksiForm.periode}
              onChange={handlePrediksiChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Deskripsi"
              name="deskripsi"
              multiline
              rows={4}
              value={prediksiForm.deskripsi}
              onChange={handlePrediksiChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handlePrediksiClose}
              sx={{
                color: "text.secondary",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={handlePrediksiSubmit}
              sx={{
                backgroundColor: "#4caf50",
                "&:hover": { backgroundColor: "#388e3c" },
              }}
            >
              {prediksiEditMode ? "Update" : "Simpan"}
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </Box>
    </Box>
  );
}

export default Informasi;
