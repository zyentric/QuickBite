# Mithai Shop Mobile App

A production-ready mobile application built with React Native for a local mithai (sweet shop). The app allows customers to browse products, place orders within a 10-15 km radius, and includes an admin panel for shop management. It follows Material Design principles using React Native Paper.

## Overview
- **Platforms**: Android and iOS (single codebase via React Native CLI)
- **UI/UX**: Material Design with React Native Paper
- **State Management**: Zustand
- **Location**: Geolocation check using `@react-native-community/geolocation`
- **Payments**: Razorpay integration (placeholder; requires server-side verification)
- **Backend**: Node.js + Express + MongoDB
- **Notifications**: Firebase Cloud Messaging (via `@react-native-firebase/messaging`)

## Prerequisites
- Node.js (v14.x or later)
- npm or yarn
- Android Studio or Xcode (for mobile emulation)
- MongoDB Atlas account (for database)
- Razorpay account (for payment testing)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/sarthak/mithai-shop.git
cd mithai-shop