import { Box, TextField, Button, Typography, Paper, Stack, CircularProgress } from '@mui/material';
import { useAuthStore } from '../../stores/authStore';
import api from '../../utils/api';

const SettingsScreen = () => {
  const user = useAuthStore((state) => state.user);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await api.get(`/shops/owner/${user.id}`);
        setShop(res.data);
      } catch (err) {
        console.error("Failed to fetch shop settings", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchShop();
  }, [user]);

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/shops/${shop._id}`, shop);
      alert("Settings saved successfully!");
    } catch (err) {
      alert("Failed to save settings");
    }
  };

  if (loading) return <Box sx={{ p: 4 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={800} gutterBottom color="primary">
        Shop Settings
      </Typography>
      <Paper sx={{ p: 4, mt: 3, borderRadius: 4 }}>
        <form onSubmit={saveSettings}>
          <Stack spacing={3}>
            <TextField
              label="Shop Name"
              value={shop?.name || ''}
              onChange={(e) => setShop({ ...shop, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Address"
              value={shop?.address || ''}
              onChange={(e) => setShop({ ...shop, address: e.target.value })}
              fullWidth
              multiline
              rows={2}
              required
            />
            <TextField
              label="Delivery Radius (km)"
              type="number"
              value={shop?.radius || ''}
              onChange={(e) => setShop({ ...shop, radius: parseInt(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Opening Hours"
              value={shop?.openingHours || ''}
              onChange={(e) => setShop({ ...shop, openingHours: e.target.value })}
              fullWidth
              placeholder="e.g. 9 AM - 9 PM"
            />
            <Button
              variant="contained"
              size="large"
              type="submit"
              sx={{ py: 1.5 }}
            >
              Save Changes
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default SettingsScreen;