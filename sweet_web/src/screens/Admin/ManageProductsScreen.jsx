import React, { useState, useEffect } from "react";

import {
  Box,
  TextField,
  Button,
  Collapse,
  Card,
  Stack,
  Typography,
} from "@mui/material";
import ProductCard from "../../components/ProductCard";
import api from "../../utils/api";
import { useLoadingStore } from "../../stores/loadingStore";
import { useNavigate } from "react-router-dom";

const ManageProductsScreen = () => {
  const setLoading = useLoadingStore((state) => state.setLoading);
  const user = useAuthStore((state) => state.user);
  const [products, setProducts] = useState([]);
  const [shopId, setShopId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const fetchShopAndProducts = async () => {
    try {
      setLoading(true);
      const shopRes = await api.get(`/shops/owner/${user.id}`);
      const sId = shopRes.data._id;
      setShopId(sId);

      const prodRes = await api.get(`/products?shopId=${sId}`);
      setProducts(prodRes.data);
    } catch (err) {
      console.error("Error fetching shop/products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchShopAndProducts();
  }, [user]);

  const addProduct = async () => {
    if (!name || !price || !quantity || !description || !image || !shopId) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/products", {
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        description,
        image,
        shopId: shopId
      });
      setName("");
      setPrice("");
      setQuantity("");
      setDescription("");
      setImage("");
      setShowAddForm(false);
      await fetchShopAndProducts();
    } catch (err) {
      console.error("Error adding product:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/products/${id}`);
      await fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        mb={3}
        sx={{ fontWeight: "bold", textAlign: "center" }}
      >
        Manage Products
      </Typography>

      <Button
        variant="contained"
        onClick={() => setShowAddForm(!showAddForm)}
        sx={{ mb: 3 }}
      >
        {showAddForm ? "Close Form" : "Add New Product"}
      </Button>

      <Collapse in={showAddForm}>
        <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Name*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Price*"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
            />
            <TextField
              label="Quantity*"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
            />
            <TextField
              label="Description*"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Image URL*"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={addProduct}>
              Add Product
            </Button>
          </Stack>
        </Card>
      </Collapse>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onDelete={deleteProduct}
            onViewDetails={(product) => navigate(`/product/${product._id}`)}
            sx={{ width: 280, minHeight: 350 }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ManageProductsScreen;
