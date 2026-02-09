# HotelOS Implementation Roadmap

This document outlines the prioritized roadmap for HotelOS, focusing first on the Booking Engine, then SaaS features, and finally the Channel Manager.

## 🚀 Phase 1: Booking Engine Refinement (Completed ✅)
**Goal:** Make the public booking pages production-ready, beautiful, and fully functional.

### 1.1 Dynamic Hotel & Room Data
- [x] **Database**: Add `amenities` (JSON/Array) and `images` (Array) to `Hotel` and `Room` models.
- [x] **Admin UI**: Allow Hotel Owners to select amenities and upload multiple images in the Dashboard.
- [x] **Public UI**: Display these amenities and images on the `[hotelId]` public page.

### 1.2 "Book Now" Flow & Validation
- [x] **Availability Check**: Before allowing a booking, strictly check if the room is available for the selected dates in `book/page.tsx` serverside.
- [x] **Date Validation**: Ensure Check-out is after Check-in and not in the past.
- [x] **Guest Form**: Add validation for email and phone number formats.

### 1.3 Online Payments & Confirmation
- [x] **Payment Gateway**: Integrate **Razorpay** for booking payments.
- [x] **New Payment Workflow**: Added "Pay Now" and "Pay at Hotel" options.
- [x] **Receipts**: Validated Razorpay flow and updated Success Page.

### 1.4 SEO & Branding
- [ ] **Meta Tags**: Use Next.js `generateMetadata` for dynamic titles (Will be done alongside Phase 2).

---

## 💼 Phase 2: SaaS Core & Subscription (Current Priority)
**Goal:** Enable business operations, billing, and multi-tenancy controls.

### 2.1 Database Schema updates
- [x] **SubscriptionPlan Model**: Define plans (Free, Basic, Premium) with limits (Rooms, Bookings).
- [x] **Subscription Model**: Track which plan a hotel is on, start date, end date, and status (ACTIVE/EXPIRED).
- [x] **Invoice Model**: Store payment history for subscriptions.

### 2.2 Super Admin Dashboard
- [x] **Route**: Create `/admin` (protected by special role or secret).
- [x] **Dashboard**: View all hotels, their plans, and status.
- [x] **Plan Management**: Create/Edit/Delete plans dynamically from UI.

### 2.3 Subscription Checkout
- [x] **Pricing Page**: A public `/pricing` page (in dashboard) for upgrades.
- [x] **Razorpay Integration**: Handle subscription payments (Monthly/Yearly).
- [ ] **Webhook**: Listen for successful payments to activate/renew subscriptions automatically.

### 2.4 Middleware & Access Control
- [ ] **Plan Limits**: Prevent adding more rooms if plan limit reached.
- [ ] **Expiration Check**: Middleware to redirect expired hotels to billing page.

---

## 🔗 Phase 3: Channel Manager (Future Roadmap)
**Goal:** Sync inventory with OTAs (Booking.com, Airbnb, etc.).

### 3.1 Architecture
- **Strategy**: Use an aggregator API (e.g., **Channex.io**, **RateGain**) instead of direct XML integration.

### 3.2 Database Schema
- [ ] **Channel Model**: Store connected channels and credentials.
- [ ] **Mapping Model**: Map internal `RoomID` to OTA `RoomID`.

### 3.3 Core Sync Features
- [ ] **Inventory Sync**: Update OTAs when a booking happens on HotelOS.
- [ ] **Webhook Listener**: Capture bookings from OTAs and create them in HotelOS.

---

## 🏁 Current Status: Ready to Start Phase 1
We will begin by adding **Dynamic Amenities & Images** to the database and UI.
