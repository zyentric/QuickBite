import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Grid,
    CircularProgress,
    Container,
    Button,
    IconButton,
    Stack,
    Chip,
    Paper,
    Divider,
    Tab,
    Tabs,
} from "@mui/material";
import {
    ArrowLeft,
    Search,
    Star,
    Clock,
    Plus,
    Minus,
    Info as InfoIcon,
} from "lucide-react";
import api from "../../utils/api";
import { useCartStore } from "../../stores/cartStore";

const ProductItem = ({ product, shopId }) => {
    const { items, addItem, updateQuantity } = useCartStore();
    const cartItem = items.find(i => i.productId._id === product._id);
    const qty = cartItem?.quantity || 0;

    return (
        <Box sx={{ py: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1" fontWeight={800} sx={{ color: '#3e4152' }}>
                    {product.name}
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                    ₹{product.price}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.4, maxWidth: '90%' }}>
                    {product.description}
                </Typography>
            </Box>
            <Box sx={{ position: 'relative', width: 120, height: 120 }}>
                <img
                    src={product.image || "/placeholder-mithai.jpg"}
                    alt={product.name}
                    style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: 8 }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: '10%',
                        right: '10%',
                        bgcolor: 'white',
                        border: '1px solid #e9e9eb',
                        borderRadius: 2,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 3px 8px rgba(0,0,0,0.08)'
                    }}
                >
                    {qty === 0 ? (
                        <Button
                            fullWidth
                            onClick={() => addItem(product, 1)}
                            sx={{ color: '#60b246', fontWeight: 900, fontSize: '0.85rem' }}
                        >
                            ADD
                        </Button>
                    ) : (
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ color: '#60b246', width: '100%', px: 1 }}>
                            <IconButton size="small" onClick={() => updateQuantity(product._id, qty - 1)} sx={{ color: 'inherit' }}>
                                <Minus size={14} />
                            </IconButton>
                            <Typography fontWeight={900} variant="body2" sx={{ flexGrow: 1, textAlign: 'center' }}>{qty}</Typography>
                            <IconButton size="small" onClick={() => updateQuantity(product._id, qty + 1)} sx={{ color: 'inherit' }}>
                                <Plus size={14} />
                            </IconButton>
                        </Stack>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

const ShopDetailScreen = () => {
    const { id: shopId } = useParams();
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [shopRes, productsRes] = await Promise.all([
                    api.get(`/shops/${shopId}`),
                    api.get(`/products?shopId=${shopId}`),
                ]);
                setShop(shopRes.data);
                setProducts(productsRes.data);
            } catch (err) {
                console.error("Failed to fetch shop details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [shopId]);

    const categories = useMemo(() => {
        const map = {};
        products.forEach(p => {
            const cat = p.category || "Recommended";
            if (!map[cat]) map[cat] = [];
            map[cat].push(p);
        });
        return Object.entries(map);
    }, [products]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>;
    if (!shop) return <Typography sx={{ p: 4 }}>Shop not found.</Typography>;

    return (
        <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <IconButton onClick={() => navigate("/")} sx={{ mb: 2 }}>
                    <ArrowLeft />
                </IconButton>

                {/* SHOP HEADER */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" fontWeight={900} sx={{ mb: 1 }}>{shop.name}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" color="text.secondary" sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#48c479' }}>
                            <Star size={16} fill="#48c479" />
                            <Typography variant="body2" fontWeight={800} sx={{ ml: 0.5 }}>{shop.rating || "4.2"}</Typography>
                        </Box>
                        <Typography variant="body2">• {Math.floor(Math.random() * 20 + 20)} mins</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">{shop.address}</Typography>
                </Box>

                <Divider sx={{ mb: 1, borderStyle: 'dashed' }} />

                <Stack direction="row" spacing={2} sx={{ py: 2 }}>
                    <Chip
                        icon={<Clock size={14} />}
                        label="FREE DELIVERY"
                        variant="outlined"
                        sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.7rem' }}
                    />
                    <Chip
                        label="FLAT ₹100 OFF"
                        sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.7rem', bgcolor: '#ffe1e1', color: '#e91e63' }}
                    />
                </Stack>

                <Divider sx={{ mb: 4 }} />

                {/* CATEGORY TABS (MOCK) */}
                <Tabs
                    value={activeTab}
                    onChange={(e, v) => setActiveTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ mb: 3, '& .MuiTab-root': { fontWeight: 800, textTransform: 'none' } }}
                >
                    {categories.map(([name], i) => (
                        <Tab key={name} label={name} />
                    ))}
                </Tabs>

                {/* MENU LIST */}
                {categories.map(([name, items], i) => (
                    <Box key={name} sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
                            {name} ({items.length})
                        </Typography>
                        <Stack divider={<Divider sx={{ borderStyle: 'dotted' }} />}>
                            {items.map(product => (
                                <ProductItem key={product._id} product={product} shopId={shopId} />
                            ))}
                        </Stack>
                        {i < categories.length - 1 && <Box sx={{ height: 16, bgcolor: '#f1f1f6', mx: -20, my: 4 }} />}
                    </Box>
                ))}
            </Container>
        </Box>
    );
};

export default ShopDetailScreen;
