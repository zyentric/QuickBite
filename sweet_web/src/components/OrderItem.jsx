import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Divider,
  Collapse,
  Button,
  Stack,
} from "@mui/material";
import { Navigation as NavIcon } from "@mui/icons-material";

const OrderItem = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const addr = order.deliveryAddress;
  const customer = order.user;

  const openInMaps = (e) => {
    e.stopPropagation();
    if (addr?.lat && addr?.lng) {
      window.open(`https://www.google.com/maps?q=${addr.lat},${addr.lng}`, "_blank");
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr?.address || "")}`, "_blank");
    }
  };

  const formatOrderDate = (dateString) => {
    const orderDate = new Date(dateString);
    const now = new Date();
    const diffTime = now - orderDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today, ${orderDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${orderDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return `${diffDays}d ago, ${orderDate.toLocaleDateString()}`;
    }
  };

  const statusColors = {
    pending: "warning",
    confirmed: "info",
    preparing: "warning",
    out_for_delivery: "info",
    delivered: "success",
    cancelled: "error",
  };

  return (
    <Paper
      sx={{
        p: 3,
        mb: 2,
        borderRadius: 4,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        cursor: "pointer",
        "&:hover": { boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Order #{order._id.slice(-6).toUpperCase()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatOrderDate(order.createdAt)}
          </Typography>
        </Box>
        <Chip
          label={order.status.replace(/_/g, " ").toUpperCase()}
          color={statusColors[order.status] || "default"}
          size="small"
        />
      </Box>

      <Typography variant="body1" fontWeight={600} gutterBottom>
        ₹{order.totalAmount} • {order.items.length} Items
      </Typography>

      <Collapse in={expanded}>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5, fontWeight: 700 }}>
            CUSTOMER DETAILS
          </Typography>
          <Typography variant="body2">{customer?.name || "Customer"}</Typography>
          <Typography variant="body2">{customer?.phone}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5, fontWeight: 700 }}>
            DELIVERY ADDRESS
          </Typography>
          <Typography variant="body2" gutterBottom>
            {addr?.address}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={openInMaps}
            startIcon={<NavIcon />}
          >
            Open in Maps
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 700 }}>
          ITEMS
        </Typography>
        <Stack spacing={1}>
          {order.items.map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">{item.name} x {item.quantity}</Typography>
              <Typography variant="body2" fontWeight={600}>₹{item.price * item.quantity}</Typography>
            </Box>
          ))}
        </Stack>
      </Collapse>
    </Paper>
  );
};

export default OrderItem;
