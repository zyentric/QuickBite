import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Divider,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useCartStore } from "../../stores/cartStore";
import { useOrderStore } from "../../stores/orderStore";
import { useAuthStore } from "../../stores/authStore";
import { useLoadingStore } from "../../stores/loadingStore";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, ShoppingBag, Navigation } from "lucide-react";
import LocationDetector from "../../components/LocationDetector";

// Fix for default Leaflet marker icon
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Map component to handle clicks
const LocationPicker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
};

const CheckoutScreen = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default Delhi

  // Single shop config
  const shopLocation = {
    lat: 28.6139,
    lng: 77.2090,
  };

  const handleLocationDetected = (data) => {
    setLocationData(data);
    if (data.lat && data.lng) {
      setMapCenter([data.lat, data.lng]);
    }
  };

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleCheckout = async () => {
    if (!address || !items.length) {
      return alert("Please provide an address and add items to cart");
    }

    if (!locationData || !locationData.isWithinRange) {
      return alert("Delivery is not available at this location.");
    }

    setLoading(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) return alert("Razorpay SDK failed to load");

      const total = getTotal();

      // Create Payment Order
      const paymentRes = await api.post("/payments/create", {
        amount: Math.round(total * 100),
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: Math.round(total * 100),
        currency: "INR",
        name: "Sweet Shop Delights",
        description: "Delicious Mithai",
        order_id: paymentRes.data.id,
        prefill: { email: user.email, contact: user.phone },
        handler: async (response) => {
          const orderPayload = {
            items: items.map((i) => ({
              productId: i.productId._id,
              quantity: i.quantity,
              price: i.productId.price,
              name: i.productId.name
            })),
            total,
            address,
            location: {
              lat: locationData.lat,
              lng: locationData.lng
            },
            paymentId: response.razorpay_payment_id,
            paymentStatus: "paid"
          };

          await api.post("/orders", orderPayload);
          clearCart();
          navigate("/orders");
        },
        theme: { color: "#e91e63" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Checkout error:", err);
      const msg = err.response?.data?.error || "Payment failed. Try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Box sx={{ p: 8, textAlign: 'center' }}>
        <ShoppingBag size={64} color="#ddd" style={{ marginBottom: 16 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>Your cart is empty.</Typography>
        <Button variant="contained" onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Browse Sweets
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>

        {/* LEFT COLUMN - DETAILS */}
        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            {/* 1. LOCATION */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MapPin size={20} /> Delivery Location
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <LocationDetector
                shopLocation={shopLocation}
                onLocationDetected={handleLocationDetected}
              />

              {locationData?.lat && (
                <Box sx={{ height: 200, mt: 2, borderRadius: 2, overflow: 'hidden' }}>
                  <MapContainer center={mapCenter} zoom={15} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[locationData.lat, locationData.lng]} />
                  </MapContainer>
                </Box>
              )}

              <TextField
                fullWidth
                label="House / Flat / Block No."
                variant="outlined"
                multiline
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{ mt: 3 }}
                placeholder="e.g. Flat 302, Palm Grove Apartments"
              />
            </Paper>

            {/* 2. PAYMENT */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CreditCard size={20} /> Payment
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Alert severity="info" sx={{ mb: 2 }}>
                Secure payment via Razorpay. UPI, Cards, and Netbanking supported.
              </Alert>
            </Paper>
          </Stack>
        </Grid>


        {/* RIGHT COLUMN - SUMMARY */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" fontWeight={800} gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2} sx={{ mb: 3 }}>
              {items.map((item) => (
                <Box key={item.productId._id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ maxWidth: '70%' }}>
                    {item.productId.name} <span style={{ fontWeight: 600 }}>x {item.quantity}</span>
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ₹{item.productId.price * item.quantity}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Item Total</Typography>
              <Typography variant="body2">₹{getTotal()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Delivery Fee</Typography>
              <Typography variant="body2" color="success.main">FREE</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={800}>TO PAY</Typography>
              <Typography variant="h6" fontWeight={800} color="primary">
                ₹{getTotal()}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCheckout}
              disabled={!locationData?.isWithinRange || !address}
              sx={{ py: 2, fontSize: '1rem', fontWeight: 800, borderRadius: 2 }}
            >
              {!locationData ? 'DETECTING LOCATION...' :
                !locationData.isWithinRange ? 'LOCATION NOT SERVICEABLE' :
                  'PROCEED TO PAY'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckoutScreen;
