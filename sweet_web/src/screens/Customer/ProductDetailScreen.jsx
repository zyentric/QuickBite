import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Divider,
  Chip,
  Stack,
  Button,
  IconButton,
  Avatar,
  Rating,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import api from "../../utils/api";
import { useCartStore } from "../../stores/cartStore";
import { useAuthStore } from "../../stores/authStore";

/**
 * Product Detail (beautified)
 */
const ProductDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const addToCart = useCartStore((s) => s.addItem);
  const { user } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    api.get(`/products/${id}`).then((res) => {
      if (!mounted) return;
      setProduct(res.data);
    });
    return () => (mounted = false);
  }, [id]);

  if (!product) {
    return (
      <Box sx={{ p: 6 }}>
        <Typography>Loading…</Typography>
      </Box>
    );
  }

  const fmt = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(n || 0);

  return (
    <Box
      sx={{
        p: { xs: 0, md: 6 },
        bgcolor: { xs: '#f8f9fa', md: 'transparent' },
        background: { md: "linear-gradient(120deg,#fff8e1,#ffe6eb)" },
        minHeight: "100vh",
        pb: { xs: 12, md: 6 } // Space for mobile sticky footer
      }}
    >
      <Card
        sx={{
          maxWidth: 1100,
          mx: "auto",
          borderRadius: { xs: 0, md: 4 },
          overflow: "hidden",
          display: "flex",
          gap: 0,
          boxShadow: { xs: 'none', md: "0 24px 48px rgba(0,0,0,0.1)" },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left: Image */}
        <Box
          sx={{
            flex: 1,
            minHeight: { xs: 300, md: 400 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            position: 'relative'
          }}
        >
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{ 
              position: 'absolute', 
              top: 16, 
              left: 16, 
              bgcolor: 'rgba(255,255,255,0.8)', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: 'white' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <img
            src={product.image || "/placeholder-mithai.jpg"}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            loading="lazy"
          />
        </Box>

        {/* Right: details */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="start"
              sx={{ mb: 1 }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: "linear-gradient(90deg,#ff9800,#e91e63)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {product.name}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: "#757575" }}>
                  {product.category || "Traditional Mithai"}
                </Typography>
              </Box>

              <Stack alignItems="flex-end">
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, color: "#e64a19" }}
                >
                  {fmt(product.price)}
                </Typography>
                <Typography variant="caption" sx={{ color: "#9e9e9e" }}>
                  Incl. taxes & packaging
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="body1"
              sx={{ color: "#616161", mb: 2, lineHeight: 1.6 }}
            >
              {product.description ||
                "A lovingly prepared sweet — fresh, authentic and perfect for gifting."}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                label={`Available: ${product.quantity ?? "—"}`}
                color="success"
              />
              {product.tags &&
                product.tags.map((t) => (
                  <Chip key={t} label={t} variant="outlined" />
                ))}
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Rating value={product.rating || 4} readOnly />
              <Typography variant="body2" sx={{ color: "#757575" }}>
                {product.reviewsCount ?? 12} reviews
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Card>

      {/* Mobile Sticky Footer Call to action area */}
      <Box
        sx={{
          position: { xs: 'fixed', md: 'static' },
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'white',
          p: { xs: 2, md: 0 },
          px: { md: 4 },
          pb: { md: 4 },
          boxShadow: { xs: '0 -4px 16px rgba(0,0,0,0.05)', md: 'none' },
          borderTop: { xs: '1px solid #eee', md: 'none' },
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          zIndex: 1000
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <IconButton
            aria-label="seller"
            sx={{ bgcolor: "#fff", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            <Avatar sx={{ width: 32, height: 32 }}>QB</Avatar>
          </IconButton>
          <Box>
            <Typography variant="body2" sx={{ display: "block", fontWeight: 700, color: '#1f2937' }}>
              Freshly made at QuickBite
            </Typography>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Delivered in 30-45 mins
            </Typography>
          </Box>
        </Stack>

        {user?.role === "customer" ? (
          <Button
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={() => addToCart(product)}
            fullWidth={false}
            sx={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              py: { xs: 1.8, md: 1.5 },
              px: { xs: 2, md: 4 },
              borderRadius: 3,
              fontWeight: 800,
              fontSize: '1.1rem',
              textTransform: "none",
              boxShadow: "0 8px 20px rgba(234, 88, 12, 0.3)",
              flex: { xs: 1, md: 'none' },
              "&:hover": { 
                transform: "translateY(-2px)",
                background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                boxShadow: "0 12px 24px rgba(234, 88, 12, 0.4)",
              },
            }}
          >
            Add to Cart
          </Button>
        ) : (
          <Button 
            variant="contained" 
            onClick={() => navigate('/login')}
            sx={{ flex: { xs: 1, md: 'none' }, py: 1.5, borderRadius: 3 }}
          >
            Login to buy
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ProductDetailScreen;
