import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Navigation } from "lucide-react";
import api from "../../utils/api";

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

const defaultCenter = [28.6139, 77.2090]; // Delhi

const ManageOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Fetch all orders for the store (simplified endpoint)
      const res = await api.get("/orders/admin/all");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll for new orders every 30s
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const openNavigation = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  const statusColors = {
    pending: "warning",
    confirmed: "info",
    preparing: "secondary",
    ready_for_pickup: "primary",
    out_for_delivery: "primary",
    delivered: "success",
    cancelled: "error",
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Live Orders & Delivery Map
      </Typography>

      <Grid container spacing={3}>
        {/* MAP SECTION */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, borderRadius: 3, mb: 3, height: 500, overflow: 'hidden' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <MapPin size={20} /> Active Deliveries (Leaflet Open Map)
            </Typography>

            <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%", borderRadius: 12 }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Shop Marker */}
              <Marker position={defaultCenter}>
                <Popup>
                  <strong>Sweet Shop Delights</strong><br />
                  Main Hub
                </Popup>
              </Marker>

              {/* Order Markers */}
              {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').map(order => (
                order.deliveryAddress?.lat && (
                  <Marker
                    key={order._id}
                    position={[order.deliveryAddress.lat, order.deliveryAddress.lng]}
                  >
                    <Popup>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>Order #{order._id.slice(-6)}</Typography>
                        <Typography variant="caption" display="block">{order.items.length} items • ₹{order.totalAmount}</Typography>
                        <Typography variant="caption" display="block" sx={{ mb: 1 }}>{order.status}</Typography>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<Navigation size={12} />}
                          onClick={() => openNavigation(order.deliveryAddress.lat, order.deliveryAddress.lng)}
                          sx={{ fontSize: '0.7rem' }}
                        >
                          Navigate
                        </Button>
                      </Box>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </Paper>
        </Grid>

        {/* ORDER LIST SECTION */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={2} sx={{ maxHeight: '80vh', overflowY: 'auto', pr: 1 }}>
            {orders.map((order) => (
              <Card key={order._id} sx={{ borderRadius: 3, border: selectedOrder?._id === order._id ? '2px solid #e91e63' : 'none' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800}>
                        #{order._id.slice(-6).toUpperCase()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(order.createdAt).toLocaleTimeString()} • {order.items.length} Items
                      </Typography>
                    </Box>
                    <Chip
                      label={order.status.replace(/_/g, ' ')}
                      size="small"
                      color={statusColors[order.status] || 'default'}
                      sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem' }}
                    />
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2 }}>{order.deliveryAddress?.address}</Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {['confirmed', 'preparing', 'out_for_delivery', 'delivered'].map((st) => (
                      <Button
                        key={st}
                        variant={order.status === st ? "contained" : "outlined"}
                        size="small"
                        color={statusColors[st]}
                        sx={{ fontSize: '0.7rem', minWidth: 'auto', px: 1 }}
                        onClick={() => updateStatus(order._id, st)}
                        disabled={order.status === 'delivered' || order.status === 'cancelled'}
                      >
                        {st.replace(/_/g, ' ')}
                      </Button>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
            {orders.length === 0 && (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                No active orders found.
              </Typography>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManageOrdersScreen;
