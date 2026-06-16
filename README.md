# PricePoint

## Community-Driven In-Store Price Comparison

PricePoint is a mobile application that enables shoppers to share and compare in-store prices. Users can search for products, manually add prices they find, save items to a wishlist, earn trust points for accurate submissions, and receive 50 SAR vouchers at 100 trust points.

## Features

- **User Authentication**: Secure registration and login with JWT
- **Product Search**: Search with filters (price, rating, store count)
- **Manual Price Entry**: Add prices with up to 3 photos
- **Wishlist**: Save products with heart icon (persists across sessions)
- **Trust Score**: +10 for approved submissions, -10 for rejected
- **Voucher Rewards**: 50 SAR voucher at 100 trust points
- **Admin Panel**: Approve/reject submissions with priority queue

## Tech Stack

- **Frontend**: React Native + Expo 
- **Navigation**: React Navigation 
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL + Sequelize 
- **Authentication**: JWT + bcrypt 
- **File Upload**: Multer 
