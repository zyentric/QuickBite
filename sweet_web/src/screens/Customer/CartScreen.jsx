// src/screens/CartScreen.jsx
import React, { useEffect } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import CartItem from "../../components/CartItem";
import { useCartStore } from "../../stores/cartStore";
import { useNavigate } from "react-router-dom";

const CartScreen = () => {
  const { items, fetchCart, updateQuantity, getTotal, clearCart } =
    useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <Box sx={{ p: 4, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Your Cart
      </Typography>

      <Stack spacing={2}>
        {items.length > 0 ? (
          items.map((item) => (
            <CartItem
              key={item.productId._id}
              item={item}
              onUpdateQuantity={updateQuantity}
            />
          ))
        ) : (
          <Typography>No items in the cart.</Typography>
        )}
      </Stack>

      {items.length > 0 && (
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Total: ₹{getTotal()}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/checkout")}
            >
              Checkout
            </Button>
            <Button variant="outlined" color="error" onClick={clearCart}>
              Clear Cart
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CartScreen;
