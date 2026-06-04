import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Stack,
  Divider,
  Grid,
} from "@mui/material";
import {
  Info,
  MapPin,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  Star
} from "lucide-react";
import api from "../../utils/api";

const AboutShopScreen = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true); // Local loading state

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // Fallback for settings or just generic info
        const res = await api.get("/settings").catch(() => ({ data: {} }));
        setSettings(res.data);
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={900} color="primary" gutterBottom>
          About Our Marketplace
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6, fontWeight: 500 }}>
          Connecting you with the finest mithai makers across the city.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
                The Mithai Mission
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Sweet Shop is more than just a delivery app. We are a platform dedicated to preserving the rich heritage of Indian sweets. We partner with local artisans and famous traditional shops to ensure every box contains the true taste of tradition.
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8 }}>
                From the slow-cooked Halwas to the delicate textures of traditional Laddus, we ensure hygiene, quality, and lightning-fast delivery so your celebrations never wait.
              </Typography>
            </Box>

            <Stack spacing={2} sx={{ mb: 4 }}>
              {[
                "Standard Hygiene Guaranteed",
                "Direct from Local Artisans",
                "Real-time Tracking",
                "Premium Eco-friendly Packaging"
              ].map((text) => (
                <Stack key={text} direction="row" spacing={2} alignItems="center">
                  <CheckCircle size={20} color="#60b246" />
                  <Typography variant="body1" fontWeight={600}>{text}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: 4, bgcolor: '#f1f1f6', border: 'none', boxShadow: 'none', p: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
                  Contact Us
                </Typography>

                <Stack spacing={3}>
                  <Stack direction="row" spacing={2}>
                    <Phone size={20} color="#e91e63" />
                    <Box>
                      <Typography variant="body2" fontWeight={700}>Phone</Typography>
                      <Typography variant="body2" color="text.secondary">+91 98765 43210</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Mail size={20} color="#e91e63" />
                    <Box>
                      <Typography variant="body2" fontWeight={700}>Email</Typography>
                      <Typography variant="body2" color="text.secondary">festive@sweetshop.in</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <MapPin size={20} color="#e91e63" />
                    <Box>
                      <Typography variant="body2" fontWeight={700}>Main Office</Typography>
                      <Typography variant="body2" color="text.secondary">Connaught Place, New Delhi</Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 8 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={900} gutterBottom>
            Happiness Delivered.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join thousands of happy customers spreading sweetness.
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2, color: '#ff9800' }}>
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} fill="#ff9800" />)}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutShopScreen;
