// src/components/CartItem.jsx
import React from "react";
import { Box, Typography, IconButton, Card, Avatar } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const CartItem = ({ item, onUpdateQuantity }) => {
  const totalPrice = item.productId.price * item.quantity;

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        mb: 2,
        borderRadius: 3,
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Product Image */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          src={item.productId.image || ""}
          alt={item.productId.name}
          variant="rounded"
          sx={{ width: 80, height: 80 }}
        />

        {/* Product Name & Price */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {item.productId.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ₹{item.productId.price} x {item.quantity}
          </Typography>
        </Box>
      </Box>

      {/* Quantity Controls */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          onClick={() =>
            onUpdateQuantity(item.productId._id, item.quantity - 1)
          }
          sx={{
            backgroundColor: "#ffcc80",
            "&:hover": { backgroundColor: "#ffa726" },
          }}
        >
          <Remove />
        </IconButton>
        <Typography sx={{ minWidth: 24, textAlign: "center", fontWeight: 600 }}>
          {item.quantity}
        </Typography>
        <IconButton
          onClick={() =>
            onUpdateQuantity(item.productId._id, item.quantity + 1)
          }
          sx={{
            backgroundColor: "#ffcc80",
            "&:hover": { backgroundColor: "#ffa726" },
          }}
        >
          <Add />
        </IconButton>
      </Box>

      {/* Total Price */}
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, color: "#d32f2f" }}
      >
        ₹{totalPrice}
      </Typography>
    </Card>
  );
};

export default CartItem;
