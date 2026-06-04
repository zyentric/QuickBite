/**
 * Distance Calculation Utilities
 * Uses Haversine formula to calculate distance between two coordinates
 */

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Check if customer location is within delivery radius
 * @param {Object} shopCoords - {lat, lng} of shop
 * @param {Object} customerCoords - {lat, lng} of customer
 * @param {number} maxRadiusKm - Maximum delivery radius in km
 * @returns {Object} {isWithinRange: boolean, distance: number}
 */
function checkWithinRadius(shopCoords, customerCoords, maxRadiusKm) {
    const distance = calculateDistance(
        shopCoords.lat,
        shopCoords.lng,
        customerCoords.lat,
        customerCoords.lng
    );

    return {
        isWithinRange: distance <= maxRadiusKm,
        distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
    };
}

module.exports = {
    calculateDistance,
    checkWithinRadius,
};
