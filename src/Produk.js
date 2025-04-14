import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Chip,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Visibility,
  Close,
} from "@mui/icons-material";
import API from "./Api";
import Sidebar from "./Layout/Sidebar";
import Navbar from "./Layout/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialFormState = {
  nama_produk: "",
  keterangan: "",
  stok: 0,
  deskripsi: "",
  status_produk: "aktif",
  id_logistik: "",
  harga: 0,
  diskon: 0,
  foto: null,
};

function Produk() {
  const [produkList, setProdukList] = useState([]);
  const [logistikList, setLogistikList] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFotos, setSelectedFotos] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [multiplePhotos, setMultiplePhotos] = useState([]);
  const [loading, setLoading] = useState({
    produk: false,
    logistik: false,
    submit: false,
  });

  const fetchProduk = async () => {
    setLoading((prev) => ({ ...prev, produk: true }));
    try {
      const res = await fetch(API.PRODUK);
      if (!res.ok) throw new Error("Gagal memuat produk");
      const data = await res.json();
      setProdukList(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, produk: false }));
    }
  };

  const fetchLogistik = async () => {
    setLoading((prev) => ({ ...prev, logistik: true }));
    try {
      const res = await fetch(API.LOGISTIK);
      if (!res.ok) throw new Error("Gagal memuat data logistik");
      const data = await res.json();
      setLogistikList(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, logistik: false }));
    }
  };

  useEffect(() => {
    fetchProduk();
    fetchLogistik();
  }, []);

  const handleOpen = (item = null) => {
    setEditMode(!!item);
    setSelected(item);
    setForm(item ? { ...item, foto: null } : initialFormState);
    setMultiplePhotos([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleOpenDetail = (item) => {
    setSelected(item);

    let fotos = [];

    if (Array.isArray(item.produk_foto) && item.produk_foto.length > 0) {
      fotos = item.produk_foto.map(
        (foto) => `${API.BASE_URL}/produk/view_image/${foto.url_foto}`
      );
    } else if (item.produk_foto?.url_foto) {
      fotos = [
        `${API.BASE_URL}/produk/view_image/${item.produk_foto.url_foto}`,
      ];
    } else if (item.url_foto) {
      fotos = [`${API.BASE_URL}/produk/view_image/${item.url_foto}`];
    } else {
      fotos = [`${API.BASE_URL}/produk/view_image/default.jpg`];
    }

    setSelectedFotos(fotos);
    setActiveStep(0);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelected(null);
    setSelectedFotos([]);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "id_logistik"
          ? parseInt(value) || ""
          : files
          ? files[0]
          : value,
    }));
  };

  const handleMultiplePhotoChange = (e) => {
    if (e.target.files) {
      setMultiplePhotos(Array.from(e.target.files));
    }
  };

  const handleRemovePhoto = (index) => {
    setMultiplePhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, selectedFotos.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setLoading((prev) => ({ ...prev, submit: true }));

    const formData = new FormData();

    Object.entries(form).forEach(([key, val]) => {
      if (key === "foto" && val) {
        formData.append("foto", val);
      } else if (key !== "produk_foto" && key !== "id_produk" && val !== null) {
        formData.append(key, val);
      }
    });

    multiplePhotos.forEach((photo) => {
      formData.append("additional_photos", photo);
    });

    try {
      const url = editMode
        ? `${API.PRODUK.replace(/\/$/, "")}/${selected.id_produk}`
        : API.PRODUK;
      const method = editMode ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      toast.success(
        `Produk berhasil ${editMode ? "diperbarui" : "ditambahkan"}`
      );
      await fetchProduk();
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Gagal menyimpan produk: ${error.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus produk ini?")) return;

    try {
      const url = `${API.PRODUK.replace(/\/$/, "")}/${id}`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      toast.success("Produk berhasil dihapus");
      await fetchProduk();
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Gagal menghapus produk: ${error.message}`);
    }
  };

  const handleDeleteFoto = async (fotoId) => {
    if (!window.confirm("Hapus foto ini?")) return;

    try {
      const url = `${API.PRODUK.replace(/\/$/, "")}/${
        selected.id_produk
      }/foto/${fotoId}`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      toast.success("Foto berhasil dihapus");
      await fetchProduk();

      if (selected) {
        const updatedSelected = {
          ...selected,
          produk_foto: selected.produk_foto.filter(
            (foto) => foto.id_foto !== fotoId
          ),
        };
        setSelected(updatedSelected);
        setSelectedFotos(
          updatedSelected.produk_foto.map(
            (foto) => `${API.BASE_URL}/produk/view_image/${foto.url_foto}`
          )
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Gagal menghapus foto: ${error.message}`);
    }
  };

  const renderProductCard = (item) => (
    <Card
    sx={{
      height: "100%",
      width: "300px", 
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.3s, box-shadow 0.3s",
      "&:hover": {
        transform: "translateY(-10px)",
        boxShadow: "0 16px 32px rgba(0, 0, 0, 0.2)",
      },
    }}
    >
      <CardMedia
        component="img"
        height="350"
        image={`${API.BASE_URL}/produk/view_image/${
          item.produk_foto?.[0]?.url_foto || "default.jpg"
        }`}
        alt={item.nama_produk}
        sx={{ objectFit: "cover", }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/placeholder-image.jpg";
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" noWrap gutterBottom>
          {item.nama_produk}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.keterangan}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography fontWeight="bold">
            {item.diskon > 0 ? (
              <>
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "#999",
                    fontSize: "0.8em",
                  }}
                >
                  Rp {item.harga.toLocaleString()}
                </span>{" "}
                <span style={{ color: "#d32f2f" }}>
                  Rp{" "}
                  {(
                    item.harga -
                    (item.harga * item.diskon) / 100
                  ).toLocaleString()}
                </span>
              </>
            ) : (
              `Rp ${item.harga.toLocaleString()}`
            )}
          </Typography>
          {item.diskon > 0 && (
            <Chip
              label={`${item.diskon}% OFF`}
              size="small"
              color="error"
              sx={{ fontWeight: "bold" }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Chip
            label={`Stok: ${item.stok}`}
            size="small"
            color={item.stok > 0 ? "success" : "error"}
            variant="outlined"
          />
          <Box>
            <IconButton
              size="small"
              color="info"
              onClick={() => handleOpenDetail(item)}
              sx={{ backgroundColor: "rgba(2, 136, 209, 0.08)" }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderFormDialog = () => (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {editMode ? "Edit Produk" : "Tambah Produk"}
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Nama Produk"
              name="nama_produk"
              value={form.nama_produk}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Keterangan"
              name="keterangan"
              value={form.keterangan}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              type="number"
              label="Stok"
              name="stok"
              value={form.stok}
              onChange={handleChange}
              required
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Deskripsi"
              name="deskripsi"
              value={form.deskripsi || ""}
              onChange={handleChange}
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Harga"
              name="harga"
              type="number"
              value={form.harga}
              onChange={handleChange}
              required
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Diskon (%)"
              name="diskon"
              type="number"
              value={form.diskon}
              onChange={handleChange}
              inputProps={{ min: 0, max: 100 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              margin="normal"
              required
              label="Status Produk"
              name="status_produk"
              value={form.status_produk}
              onChange={handleChange}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Logistik</InputLabel>
              <Select
                name="id_logistik"
                value={form.id_logistik}
                label="Logistik"
                onChange={handleChange}
              >
                {logistikList.map((log) => (
                  <MenuItem key={log.id} value={log.id}>
                    {log.nama} - {log.nama_toko || "(Toko Tidak Ada)"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Paper variant="outlined" sx={{ p: 2, mt: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Foto Utama
              </Typography>
              <input
                type="file"
                name="foto"
                accept="image/*"
                onChange={handleChange}
                style={{ marginTop: "8px" }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mt={1}
              >
                {editMode
                  ? "Upload foto baru akan menggantikan foto utama"
                  : "Foto utama produk"}
              </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, mt: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Foto Tambahan
              </Typography>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleMultiplePhotoChange}
                style={{ marginTop: "8px" }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mt={1}
              >
                Pilih beberapa foto sekaligus untuk ditambahkan
              </Typography>

              {multiplePhotos.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {multiplePhotos.length} Foto Dipilih:
                  </Typography>
                  <Grid container spacing={1}>
                    {multiplePhotos.map((photo, index) => (
                      <Grid item key={index} xs={4} sm={3} md={2}>
                        <Box sx={{ position: "relative" }}>
                          <Box
                            component="img"
                            src={URL.createObjectURL(photo)}
                            alt={`Preview ${index}`}
                            sx={{
                              width: "100%",
                              height: 80,
                              objectFit: "cover",
                              borderRadius: 1,
                            }}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            sx={{
                              position: "absolute",
                              top: -8,
                              right: -8,
                              backgroundColor: "rgba(255,255,255,0.8)",
                              "&:hover": {
                                backgroundColor: "rgba(255,200,200,0.9)",
                              },
                            }}
                            onClick={() => handleRemovePhoto(index)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Paper>

            {editMode && selected?.produk_foto?.length > 0 && (
              <Paper variant="outlined" sx={{ p: 2, mt: 2, borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Foto Saat Ini
                </Typography>
                <Grid container spacing={1}>
                  {selected.produk_foto.map((foto, index) => (
                    <Grid item key={index} xs={4} sm={3} md={2}>
                      <Box sx={{ position: "relative" }}>
                        <Box
                          component="img"
                          src={`${API.BASE_URL}/produk/view_image/${foto.url_foto}`}
                          alt={`Foto ${index}`}
                          sx={{
                            width: "100%",
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 1,
                          }}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            backgroundColor: "rgba(255,255,255,0.8)",
                            "&:hover": {
                              backgroundColor: "rgba(255,200,200,0.9)",
                            },
                          }}
                          onClick={() => handleDeleteFoto(foto.id_foto)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Batal
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading.submit}
          startIcon={loading.submit ? <CircularProgress size={20} /> : null}
        >
          {loading.submit ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderDetailDialog = () => (
    <Dialog
      open={openDetail}
      onClose={handleCloseDetail}
      fullWidth
      maxWidth="md"
    >
      {selected && (
        <>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="h6">{selected.nama_produk}</Typography>
              <Chip
                label={selected.status_produk}
                color={
                  selected.status_produk === "aktif"
                    ? "success"
                    : selected.status_produk === "tidak_aktif"
                    ? "default"
                    : "warning"
                }
                size="small"
                sx={{ ml: 2, textTransform: "capitalize" }}
              />
            </Box>

            <IconButton onClick={handleCloseDetail}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 300,
                      backgroundColor: "#f8f8f8",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectedFotos.length > 0 ? (
                      <Box
                        component="img"
                        src={selectedFotos[activeStep]}
                        alt={`Foto produk ${activeStep + 1}`}
                        sx={{
                          maxHeight: 300,
                          maxWidth: "100%",
                          objectFit: "contain",
                          transition: "all 0.3s ease",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                    ) : (
                      <Typography color="text.secondary">
                        Tidak ada foto
                      </Typography>
                    )}
                  </Box>

                  {selectedFotos.length > 1 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Button
                        size="small"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        startIcon={<KeyboardArrowLeft />}
                      >
                        Sebelumnya
                      </Button>

                      <Typography variant="body2" color="text.secondary">
                        {activeStep + 1} / {selectedFotos.length}
                      </Typography>

                      <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === selectedFotos.length - 1}
                        endIcon={<KeyboardArrowRight />}
                      >
                        Selanjutnya
                      </Button>
                    </Box>
                  )}
                </Paper>

                {selectedFotos.length > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mt: 2,
                      justifyContent: "center",
                    }}
                  >
                    {selectedFotos.map((foto, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={foto}
                        onClick={() => setActiveStep(index)}
                        sx={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          cursor: "pointer",
                          border:
                            activeStep === index
                              ? "2px solid #1976d2"
                              : "1px solid #ddd",
                          borderRadius: 1,
                          "&:hover": {
                            opacity: 0.8,
                            borderColor: "#1976d2",
                          },
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    fontWeight="bold"
                  >
                    Keterangan
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selected.keterangan}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    fontWeight="bold"
                  >
                    Deskripsi
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ whiteSpace: "pre-line" }}
                  >
                    {selected.deskripsi || "Tidak ada deskripsi"}
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3, pb: 4 }}>
                  <Grid item xs={6}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 1.5, textAlign: "center", height: "100%" }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Stok
                      </Typography>
                      <Typography
                        variant="h6"
                        color={selected.stok > 0 ? "text.primary" : "error"}
                      >
                        {selected.stok}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 1.5, textAlign: "center", height: "100%" }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Diskon
                      </Typography>
                      <Typography
                        variant="h6"
                        color={selected.diskon > 0 ? "error" : "text.primary"}
                      >
                        {selected.diskon}%
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 3,
                    borderColor: "#1976d2",
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Harga
                  </Typography>
                  {selected.diskon > 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ textDecoration: "line-through", color: "#999" }}
                        >
                          Rp {selected.harga.toLocaleString()}
                        </Typography>
                        <Typography
                          variant="h5"
                          color="primary"
                          fontWeight="bold"
                        >
                          Rp{" "}
                          {(
                            selected.harga -
                            (selected.harga * selected.diskon) / 100
                          ).toLocaleString()}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${selected.diskon}% OFF`}
                        color="error"
                        sx={{ fontWeight: "bold" }}
                      />
                    </Box>
                  ) : (
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      Rp {selected.harga.toLocaleString()}
                    </Typography>
                  )}
                </Paper>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<Delete />}
                    onClick={() => {
                      handleCloseDetail();
                      handleDelete(selected.id_produk);
                    }}
                    sx={{ py: 1.5 }}
                  >
                    Hapus
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Edit />}
                    onClick={() => {
                      handleCloseDetail();
                      handleOpen(selected);
                    }}
                    sx={{ py: 1.5 }}
                  >
                    Edit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </>
      )}
    </Dialog>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" color="black">
            Katalog Produk
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            sx={{
              backgroundColor: "white",
              color: "#4CAF50",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            Tambah Produk
          </Button>
        </Box>

        <Box sx={{ p: 3 }}>
          {loading.produk ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {produkList.length > 0 ? (
                produkList.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id_produk}>
                    {renderProductCard(item)}
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="h6" color="text.secondary">
                      Tidak ada produk yang tersedia
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </Box>

        {renderFormDialog()}
        {renderDetailDialog()}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
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

export default Produk;
