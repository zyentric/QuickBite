import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Container,
    Stack,
    Avatar,
    Divider,
    CircularProgress,
    IconButton,
    Button,
} from "@mui/material";
import { Search as SearchIcon, ArrowLeft, Star, ChevronRight, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useCartStore } from "../../stores/cartStore";

const SearchScreen = () => {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { items, addItem, updateQuantity } = useCartStore();

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim()) {
                fetchResults();
            } else {
                setProducts([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            // Using existing global search but likely ignoring shops part
            const res = await api.get(`/shops/global/search?q=${query}`);
            setProducts(res.data.products || []);
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setLoading(false);
        }
    };

    const getQty = (p) => items.find(i => i.productId._id === p._id)?.quantity || 0;

    return (
        <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                    <IconButton onClick={() => navigate("/")}>
                        <ArrowLeft />
                    </IconButton>
                    <TextField
                        fullWidth
                        autoFocus
                        placeholder="Search for sweets..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        sx={{ bgcolor: '#f2f2f3', borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {loading ? <CircularProgress size={20} /> : <SearchIcon size={20} color="#686b78" />}
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>

                {query && !loading && products.length === 0 && (
                    <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mt: 8 }}>
                        We couldn't find any results for "{query}"
                    </Typography>
                )}

                {/* PRODUCTS RESULTS */}
                {products.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary' }}>SWEETS</Typography>
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            {products.map(p => (
                                <Box
                                    key={p._id}
                                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, '&:hover': { bgcolor: '#f9f9f9', borderRadius: 2 } }}
                                >
                                    <Box>
                                        <Typography variant="body1" fontWeight={800}>{p.name}</Typography>
                                        <Typography variant="caption" sx={{ color: '#686b78', display: 'block', maxWidth: 300 }} noWrap>
                                            {p.description}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600} sx={{ mt: 1 }}>₹{p.price}</Typography>
                                    </Box>

                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        {getQty(p) === 0 ? (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => addItem(p, 1)}
                                                sx={{ borderRadius: 2, fontWeight: 800, textTransform: 'none' }}
                                            >
                                                ADD
                                            </Button>
                                        ) : (
                                            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', border: '1px solid #e0e0e0', borderRadius: 2 }}>
                                                <IconButton size="small" onClick={() => updateQuantity(p._id, getQty(p) - 1)} color="primary">
                                                    <Minus size={14} />
                                                </IconButton>
                                                <Typography variant="body2" fontWeight={800} sx={{ mx: 1 }}>{getQty(p)}</Typography>
                                                <IconButton size="small" onClick={() => updateQuantity(p._id, getQty(p) + 1)} color="primary">
                                                    <Plus size={14} />
                                                </IconButton>
                                            </Box>
                                        )}
                                        <Avatar src={p.image} variant="rounded" sx={{ width: 64, height: 64 }} />
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default SearchScreen;
