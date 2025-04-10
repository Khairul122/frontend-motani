import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "./Api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdScreen = useMediaQuery(theme.breakpoints.between("md", "lg"));

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login gagal");
      }

      toast.success(`Selamat datang, ${data.name}`);
      localStorage.setItem("user", JSON.stringify(data));

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url(/img/bg_login.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: { xs: 2, sm: 3, md: 4 },
        overflow: "auto",
      }}
    >
      <Container 
        component="main" 
        maxWidth="xs"
        sx={{
          width: "100%",
          my: { xs: 2, sm: 4 },
        }}
      >
        <ToastContainer position={isXsScreen ? "bottom-center" : "top-right"} />
        <Paper
          elevation={6}
          sx={{
            padding: { xs: 2, sm: 3, md: 4 },
            width: "100%",
            borderRadius: { xs: 2, sm: 3 },
            backgroundColor: "white",
            transition: "all 0.3s ease",
          }}
        >
          <Grid container direction="column" alignItems="center" spacing={1}>
            <Grid item>
              <Avatar
                sx={{ 
                  m: { xs: 1, sm: 1.5 }, 
                  width: { xs: "4rem", sm: "5rem" }, 
                  height: { xs: "4rem", sm: "5rem" } 
                }}
                src="/img/logo.png"
              />
            </Grid>
            <Grid item>
              <Typography 
                component="h1" 
                variant={isXsScreen ? "h5" : "h4"} 
                gutterBottom
                align="center"
                sx={{ fontWeight: { xs: 500, sm: 600 } }}
              >
                Login
              </Typography>
            </Grid>
          </Grid>
          <Box 
            component="form" 
            onSubmit={handleLogin} 
            sx={{ 
              mt: { xs: 1, sm: 2 },
              '& .MuiTextField-root': { mb: { xs: 1.5, sm: 2 } }
            }}
          >
            <TextField
              label="Username"
              fullWidth
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              size={isXsScreen ? "small" : "medium"}
              InputProps={{
                sx: { borderRadius: { xs: 1, sm: 1.5 } }
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size={isXsScreen ? "small" : "medium"}
              InputProps={{
                sx: { borderRadius: { xs: 1, sm: 1.5 } }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: { xs: 2, sm: 3 }, 
                mb: { xs: 1, sm: 2 }, 
                py: { xs: 1, sm: 1.5 }, 
                fontWeight: "bold",
                borderRadius: { xs: 1, sm: 2 },
                fontSize: { xs: "0.9rem", sm: "1rem" }
              }}
            >
              Masuk
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;