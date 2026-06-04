import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Box,
} from "@mui/material";

const ProductCard = ({ product, onDelete, onAddToCart, onViewDetails }) => (
  <Card
    sx={{
      width: 280,
      borderRadius: 3,
      boxShadow: 3,
      transition: "transform 0.3s, box-shadow 0.3s",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: 6,
      },
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <CardMedia
      component="img"
      height="180"
      image={product.image || "https://via.placeholder.com/280x180"}
      alt={product.name}
      sx={{
        objectFit: "cover",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}
    />
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        {product.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {product.description?.length > 60
          ? product.description.substring(0, 60) + "..."
          : product.description}
      </Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        ₹{product.price} | Qty: {product.quantity}
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
      {onViewDetails && (
        <Button
          size="small"
          variant="outlined"
          onClick={() => onViewDetails(product)}
        >
          Details
        </Button>
      )}
      <Box>
        {onAddToCart && (
          <Button
            size="small"
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
            onClick={() => onAddToCart(product)}
          >
            Add
          </Button>
        )}
        {onDelete && (
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => onDelete(product._id)}
          >
            Delete
          </Button>
        )}
      </Box>
    </CardActions>
  </Card>
);

export default ProductCard;
