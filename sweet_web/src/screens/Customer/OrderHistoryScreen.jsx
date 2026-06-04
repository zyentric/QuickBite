import React, { useEffect } from "react";
import { Box, Typography, Container, CircularProgress } from "@mui/material";
import OrderItem from "../../components/OrderItem";
import { useOrderStore } from "../../stores/orderStore";
import { useAuthStore } from "../../stores/authStore";
import { useLoadingStore } from "../../stores/loadingStore";

const OrderHistoryScreen = () => {
  const { orders, fetchOrders } = useOrderStore();
  const user = useAuthStore((s) => s.user);
  const loading = useLoadingStore((s) => s.loading);

  useEffect(() => {
    if (user?.id) fetchOrders(user.id);
  }, [user]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={800} gutterBottom color="primary">
        Your Order History
      </Typography>

      {orders.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 4 }}>
          You haven't placed any orders yet. Start shopping to see them here!
        </Typography>
      ) : (
        <Box sx={{ mt: 4 }}>
          {orders.map((ord) => (
            <OrderItem key={ord._id} order={ord} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default OrderHistoryScreen;
