import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Paper,
    Stack,
} from "@mui/material";
import { MapPin, Navigation, AlertCircle } from "lucide-react";

/**
 * Location Detector Component
 * Automatically detects user's location using browser geolocation
 * Shows distance from shop and validates delivery area
 */
const LocationDetector = ({ onLocationDetected, shopLocation, maxRadius = 10 }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);
    const [distance, setDistance] = useState(null);

    // Calculate distance using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const detectLocation = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                const dist = calculateDistance(
                    shopLocation.lat,
                    shopLocation.lng,
                    userLat,
                    userLng
                );

                const roundedDistance = Math.round(dist * 100) / 100;
                setDistance(roundedDistance);

                const locationData = {
                    lat: userLat,
                    lng: userLng,
                    distance: roundedDistance,
                    isWithinRange: roundedDistance <= maxRadius,
                };

                setLocation(locationData);
                setLoading(false);

                if (onLocationDetected) {
                    onLocationDetected(locationData);
                }
            },
            (err) => {
                setLoading(false);
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError("Location permission denied. Please enable location access.");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError("Location information unavailable.");
                        break;
                    case err.TIMEOUT:
                        setError("Location request timed out.");
                        break;
                    default:
                        setError("An error occurred while detecting location.");
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    // Auto-detect on mount
    useEffect(() => {
        if (shopLocation) {
            detectLocation();
        }
    }, [shopLocation]);

    return (
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f9f9f9' }}>
            <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Navigation size={20} color="#e91e63" />
                    <Typography variant="h6" fontWeight={700}>
                        Delivery Location
                    </Typography>
                </Box>

                {loading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={24} />
                        <Typography variant="body2">Detecting your location...</Typography>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" icon={<AlertCircle size={20} />}>
                        {error}
                        <Button size="small" onClick={detectLocation} sx={{ ml: 2 }}>
                            Try Again
                        </Button>
                    </Alert>
                )}

                {location && !loading && (
                    <Box>
                        {location.isWithinRange ? (
                            <Alert severity="success" sx={{ bgcolor: '#e8f5e9' }}>
                                <Typography variant="body2" fontWeight={600}>
                                    ✓ Great! You're within our delivery area
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                    Distance from shop: {distance} km (Max: {maxRadius} km)
                                </Typography>
                            </Alert>
                        ) : (
                            <Alert severity="warning" sx={{ bgcolor: '#fff3e0' }}>
                                <Typography variant="body2" fontWeight={600}>
                                    Sorry, you're outside our delivery area
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                    You're {distance} km away (We deliver within {maxRadius} km)
                                </Typography>
                            </Alert>
                        )}

                        <Button
                            size="small"
                            startIcon={<MapPin size={16} />}
                            onClick={detectLocation}
                            sx={{ mt: 1 }}
                        >
                            Refresh Location
                        </Button>
                    </Box>
                )}
            </Stack>
        </Paper>
    );
};

export default LocationDetector;
