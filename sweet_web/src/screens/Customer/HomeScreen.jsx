import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Container,
  Stack,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Divider,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { Search as SearchIcon, Star, Clock, MapPin, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useCartStore } from "../../stores/cartStore";

const ProductCard = ({ product, onClick }) => {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find(i => i.productId._id === product._id);
  const qty = cartItem?.quantity || 0;

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 4, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: '0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' } }}>
      <Box sx={{ position: 'relative', pt: '65%', cursor: 'pointer' }} onClick={onClick}>
        <CardMedia
          component="img"
          image={product.image || "/placeholder-mithai.jpg"}
          alt={product.name}
          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box onClick={onClick} sx={{ cursor: 'pointer' }}>
          <Typography variant="h6" fontWeight={800} noWrap title={product.name}>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, height: 40, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.description}
          </Typography>
        </Box>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto' }}>
          <Typography variant="h6" fontWeight={700}>₹{product.price}</Typography>

          {qty === 0 ? (
            <Button
              variant="outlined"
              size="small"
              onClick={() => addItem(product, 1)}
              sx={{ borderRadius: 2, fontWeight: 800, textTransform: 'none', minWidth: 80 }}
            >
              ADD
            </Button>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <IconButton size="small" onClick={() => updateQuantity(product._id, qty - 1)} color="primary">
                <Minus size={14} />
              </IconButton>
              <Typography variant="body2" fontWeight={800} sx={{ mx: 1 }}>{qty}</Typography>
              <IconButton size="small" onClick={() => updateQuantity(product._id, qty + 1)} color="primary">
                <Plus size={14} />
              </IconButton>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopRes, prodRes] = await Promise.all([
          api.get("/shops/location"),
          api.get("/products"),
        ]);
        setShopInfo(shopRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(products.map(p => p.category || "Other"))];
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let res = products;
    if (selectedCategory !== "All") {
      res = res.filter(p => (p.category || "Other") === selectedCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(p => p.name.toLowerCase().includes(q));
    }
    return res;
  }, [products, selectedCategory, search]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>

      {/* HERO SECTION */}
      <Box sx={{ bgcolor: '#171a29', color: 'white', pt: 6, pb: 8, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" fontWeight={900} gutterBottom>
                {shopInfo?.name || "Sweet Shop Delights"}
              </Typography>
              <Typography variant="h6" color="grey.400" gutterBottom>
                Authentic Indian Sweets & Desserts
              </Typography>
              <Stack direction="row" spacing={3} sx={{ mt: 3 }} color="grey.400">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MapPin size={18} /> {shopInfo?.address?.split(',')[0] || "Connaught Place"}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Star size={18} fill="#f57c00" color="#f57c00" /> 4.8 Rating
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Clock size={18} /> 30-45 mins
                </Box>
              </Stack>
            </Box>
            <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Paper
                sx={{
                  p: 2,
                  display: 'inline-block',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  borderRadius: 3,
                  textAlign: 'center',
                  minWidth: 160
                }}
              >
                <Typography variant="h4" fontWeight={900}>OFFER</Typography>
                <Typography variant="body2">FLAT 20% OFF</Typography>
                <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Typography variant="caption">Use Code: SWEET20</Typography>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* CATALOG SECTION */}
      <Container maxWidth="lg" sx={{ mt: -4 }}>
        <Paper sx={{ p: 2, borderRadius: 3, mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <SearchIcon size={20} color="#666" style={{ marginLeft: 8 }} />
          <TextField
            variant="standard"
            placeholder="Search for laddoo, barfi, etc..."
            fullWidth
            InputProps={{ disableUnderline: true }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Paper>

        <Tabs
          value={selectedCategory}
          onChange={(e, v) => setSelectedCategory(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 4, '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '1rem' } }}
        >
          {categories.map(cat => (
            <Tab key={cat} label={cat} value={cat} />
          ))}
        </Tabs>

        <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>
          {selectedCategory} ({filteredProducts.length})
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {filteredProducts.map(product => (
            <Box 
              key={product._id} 
              sx={{ 
                flex: '1 1 calc(25% - 24px)', 
                minWidth: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)', lg: 'calc(25% - 24px)' },
                maxWidth: '100%'
              }}
            >
              <ProductCard product={product} onClick={() => navigate(`/product/${product._id}`)} />
            </Box>
          ))}
        </Box>

        {filteredProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">No items found.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HomeScreen;

