import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import heroSweetsImg from "../../assets/hero_sweets.png";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate("/menu");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${heroSweetsImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        p: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', 
          backdropFilter: 'blur(3px)'
        }
      }}
    >
      <Paper
        sx={{
          p: { xs: 4, md: 8 },
          maxWidth: 500,
          width: "100%",
          borderRadius: 6,
          textAlign: "center",
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(20px)",
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
          position: "relative",
          zIndex: 1
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ bgcolor: '#ea580c', color: 'white', p: 2, borderRadius: '50%', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.4)' }}>
            <Heart size={36} />
          </Box>
        </Box>
        <Typography
          variant="h3"
          sx={{
            mb: 4,
            fontWeight: 800,
            color: '#1f2937',
            letterSpacing: '-0.5px'
          }}
        >
          Welcome Back
        </Typography>

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          variant="outlined"
          InputProps={{ sx: { bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 2, fontSize: '1.1rem' } }}
          sx={{
            mb: 3,
            "& .MuiInputLabel-root": { fontSize: '1.1rem' },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(0,0,0,0.1)" },
              "&:hover fieldset": { borderColor: "#ea580c" },
              "&.Mui-focused fieldset": { borderColor: "#ea580c", borderWidth: 2 },
            },
          }}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          variant="outlined"
          InputProps={{ sx: { bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 2, fontSize: '1.1rem' } }}
          sx={{
            mb: 5,
            "& .MuiInputLabel-root": { fontSize: '1.1rem' },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(0,0,0,0.1)" },
              "&:hover fieldset": { borderColor: "#ea580c" },
              "&.Mui-focused fieldset": { borderColor: "#ea580c", borderWidth: 2 },
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleLogin}
          fullWidth
          sx={{
            mb: 4,
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            color: "white",
            fontWeight: 800,
            fontSize: '1.2rem',
            py: 2,
            borderRadius: 3,
            boxShadow: "0 8px 20px rgba(234, 88, 12, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 24px rgba(234, 88, 12, 0.4)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Sign In
        </Button>

        <Button
          onClick={() => navigate("/signup")}
          fullWidth
          variant="text"
          sx={{
            color: "#4b5563",
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1.1rem',
            "&:hover": { color: "#ea580c", bgcolor: 'transparent', transform: 'translateY(-1px)' },
            transition: "all 0.2s ease",
          }}
        >
          Don't have an account? <span style={{ color: '#ea580c', marginLeft: '6px' }}>Sign Up</span>
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginScreen;
