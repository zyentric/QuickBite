import React, { useEffect, useState, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  CssBaseline,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
  Backdrop,
  CircularProgress,
  Collapse,
  Fade,
  Paper,
  Badge,
  Stack,
} from "@mui/material";
import {
  MapPin as LocationIcon,
  ChevronDown,
  ShoppingBag,
  Search as SearchIcon,
} from "lucide-react";
import {
  Menu as MenuIcon,
  ExitToApp as ExitToAppIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
import api from "../utils/api";

const DRAWER_WIDTH = 260;
const MINI_WIDTH = 72;

const Layout = ({ children, links = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { items, getTotal } = useCartStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = getTotal();

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
  };

  const isAdminPath = location.pathname.startsWith("/admin");

  // Filter links for mobile drawer
  const navLinks = links.filter(l => l.path !== '/account');

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      <CssBaseline />

      {/* TOP NAVIGATION */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid #eee",
          color: "text.primary",
          px: { xs: 1, md: 4 }
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", height: 70 }}>
          {/* LOGO & LOCATION */}
          <Stack direction="row" spacing={3} alignItems="center">
            <Typography
              variant="h5"
              fontWeight={900}
              color="primary"
              sx={{ cursor: 'pointer', letterSpacing: -1 }}
              onClick={() => navigate("/")}
            >
              QuickBite
            </Typography>

            {!isAdminPath && (
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <LocationIcon size={18} style={{ marginRight: 4, color: '#e91e63' }} />
                <Typography variant="body2" fontWeight={700} sx={{ borderBottom: '2px solid black' }}>
                  Home
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                  Delhi, India
                </Typography>
                <ChevronDown size={16} style={{ marginLeft: 4 }} />
              </Box>
            )}
          </Stack>

          {/* DESKTOP NAV LINKS */}
          <Stack direction="row" spacing={4} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
            {links.filter(l => !l.path.startsWith('/admin') || isAdminPath).map((link) => (
              <Box
                key={link.path}
                onClick={() => navigate(link.path)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: location.pathname === link.path ? 'primary.main' : 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <Box sx={{ mr: 1, display: 'flex' }}>{link.icon}</Box>
                <Typography variant="body2" fontWeight={600}>{link.text}</Typography>
              </Box>
            ))}

            {user && (
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar src={user.image} sx={{ width: 32, height: 32 }}>{user.name?.[0]}</Avatar>
              </IconButton>
            )}
          </Stack>

          {/* MOBILE MENU TOGGLE */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
            {user && (
              <IconButton onClick={() => navigate("/cart")}>
                <Badge badgeContent={cartCount} color="primary">
                  <ShoppingBag size={24} />
                </Badge>
              </IconButton>
            )}
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* USER MENU DROPDOWN */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { mt: 1, width: 200, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
      >
        <MenuItem onClick={() => { setAnchorEl(null); navigate("/account"); }}>Profile</MenuItem>
        <MenuItem onClick={() => { setAnchorEl(null); navigate("/orders"); }}>Orders</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, p: 2 }}>
          <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>Menu</Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {links.map((link) => (
              <ListItem button key={link.path} onClick={() => { navigate(link.path); setDrawerOpen(false); }}>
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.text} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box component="main" sx={{ flexGrow: 1, mt: '70px', pb: cartCount > 0 ? 10 : 0 }}>
        <Fade in timeout={400}>
          <Box sx={{ width: '100%' }}>
            {children}
          </Box>
        </Fade>
      </Box>

      {/* FLOATING BOTTOM CART BAR (SWIGGY STYLE) */}
      {cartCount > 0 && !location.pathname.includes('/cart') && !location.pathname.includes('/checkout') && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: '90%', sm: '500px' },
            bgcolor: '#60b246', // Swiggy Green
            color: 'white',
            p: 2,
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: 1000,
            cursor: 'pointer',
            '&:hover': { bgcolor: '#539c3d' }
          }}
          onClick={() => navigate("/cart")}
        >
          <Box>
            <Typography variant="body2" fontWeight={800}>
              {cartCount} ITEM{cartCount > 1 ? 'S' : ''} ADDED
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body1" fontWeight={900}>
              VIEW CART
            </Typography>
            <ShoppingBag size={20} />
          </Stack>
        </Box>
      )}

      {/* FOOTER */}
      <Box sx={{ p: 4, bgcolor: 'black', color: 'white', textAlign: 'center', mt: 'auto' }}>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>QuickBite</Typography>
        <Typography variant="caption" color="grey.500">© 2026 QuickBite — Happiness in every box.</Typography>
      </Box>
    </Box>
  );
};

export default Layout;
