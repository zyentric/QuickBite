import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import api from "../utils/api";

const AccountPage = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch logged-in user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users/me");
        setUser(res.data);
        setPreview(res.data.image || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Select image and create preview instantly
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Upload updated profile
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", user.name || "");
      formData.append("phone", user.phone || "");
      formData.append("address", user.address || "");
      if (imageFile) formData.append("image", imageFile);

      const res = await api.put("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      setPreview(res.data.image);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 8,
        px: 3,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          position: "relative",
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4, position: "relative" }}>
          <Avatar
            src={preview || user.image || "/default-avatar.png"}
            sx={{
              width: 140,
              height: 140,
              mx: "auto",
              border: "4px solid #1976d2",
            }}
          />

          <input
            accept="image/*"
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <label htmlFor="fileInput">
            <IconButton
              color="primary"
              component="span"
              sx={{
                position: "absolute",
                bottom: 0,
                right: "calc(50% - 60px)",
                bgcolor: "background.paper",
                border: "1px solid #000",
                "&:hover": { bgcolor: "grey.200" },
              }}
            >
              <EditIcon />
            </IconButton>
          </label>
          {preview && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              {imageFile?.name}
            </Typography>
          )}
        </Box>

        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Account Details
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Name"
            value={user.name || ""}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Phone"
            value={user.phone || ""}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            fullWidth
          />
          <TextField
            label="Address"
            value={user.address || ""}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />
        </Stack>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 4, py: 1.5, fontWeight: "bold", fontSize: 16 }}
          onClick={handleUpdate}
        >
          Save Changes
        </Button>
      </Paper>
    </Box>
  );
};

export default AccountPage;
