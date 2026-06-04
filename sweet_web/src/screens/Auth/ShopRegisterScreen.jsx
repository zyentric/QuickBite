import React, { useState } from "react";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Alert,
    CircularProgress,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuthStore } from "../../stores/authStore";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

// Fix for default marker icon in leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position ? <Marker position={position} /> : null;
};

const ShopRegisterScreen = () => {
    const { user, login } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [position, setPosition] = useState({ lat: 28.6139, lng: 77.209 }); // Default Delhi
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        description: "",
        image: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/shops/register", {
                ...formData,
                lat: position.lat,
                lng: position.lng,
                userId: user.id,
            });

            // After registration, we might need to refresh user data to get the new role
            // For now, let's just navigate to admin
            alert("Shop Registered Successfully! Log in again to update your dashboard.");
            navigate("/admin");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to register shop");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, mt: 4, borderRadius: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
                    Register Your Shop
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
                    Join our marketplace and start selling your delicious sweets.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Shop Name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Address"
                                required
                                multiline
                                rows={2}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Shop Description"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                Pick Your Shop Location on Map
                            </Typography>
                            <Box sx={{ height: 300, width: "100%", borderRadius: 2, overflow: "hidden", border: "1px solid #ddd" }}>
                                <MapContainer center={[position.lat, position.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <LocationPicker position={position} setPosition={setPosition} />
                                </MapContainer>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                                Click on the map to set your shop's exact location for delivery calculation.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit"
                                disabled={loading}
                                sx={{ py: 1.5, fontSize: "1.1rem" }}
                            >
                                {loading ? <CircularProgress size={24} /> : "Complete Registration"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default ShopRegisterScreen;
