import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  ShoppingBag,
  IndianRupee,
  Users,
  TrendingUp,
  Map
} from "lucide-react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

const StatCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, height: '100%', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}>
    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}15`, color: color }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="body2" color="text.secondary" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={800}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const ShopkeeperDashboard = () => {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, customers: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mock stats for now or fetch real ones
        // const res = await api.get("/admin/stats");
        // setStats(res.data);
        setStats({ orders: 12, revenue: 15400, customers: 8 });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={900}>
            QuickBite Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Overview of your store performance
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Map size={20} />}
          onClick={() => navigate("/admin/orders")}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
        >
          Live Delivery Map
        </Button>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Orders" value={stats.orders} icon={<ShoppingBag />} color="#e91e63" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Revenue" value={`₹${stats.revenue}`} icon={<IndianRupee />} color="#4caf50" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Customers" value={stats.customers} icon={<Users />} color="#2196f3" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Growth" value="+12%" icon={<TrendingUp />} color="#ff9800" />
        </Grid>
      </Grid>

      {/* RECENT ORDERS PLACEHOLDER */}
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, bgcolor: '#f8f9fa', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Live Order Map Integration
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          View all active delivery locations on a real-time Google Map in the Orders section.
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/admin/orders")}>
          Go to Live Orders
        </Button>
      </Paper>
    </Box>
  );
};

export default ShopkeeperDashboard;
