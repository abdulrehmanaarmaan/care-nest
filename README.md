# CareNest

CareNest is a full-stack caregiving service platform designed to connect customers with caregiving services while providing dedicated workflows for caregivers and administrators.

The application includes authentication, caregiving services, caregiver applications, bookings, payments, caregiver availability, jobs, reviews, earnings, withdrawals, and administrative management.

---

## Features

### Authentication

- Credentials-based authentication
- Google authentication
- Protected routes
- Role-based access control
- Authentication-aware redirects
- Callback URL support
- Account status handling
- Deactivated account protection

### Customer

- Customer registration and authentication
- Google authentication
- Browse caregiving services
- View service information
- Book caregiving services
- Stripe Checkout payment flow
- Customer dashboard
- View booking information and status

### Caregiver

- Caregiver application workflow
- Caregiver experience and specialization information
- Caregiver document submission
- Caregiver profile information
- Availability schedule management
- Assigned jobs
- Accepted jobs
- Completed job tracking
- Caregiver reviews and ratings
- Earnings tracking
- Withdrawal tracking
- Caregiver dashboard

### Caregiver Applications

- Caregiver application submission
- Application status management
- Application review by administrators
- Caregiver experience and specialization information
- Supporting document handling
- Application approval workflow

### Administration

- Administrative dashboard
- Caregiver application management
- Caregiver registry
- Caregiver search
- Caregiver filtering
- Caregiver account activation
- Caregiver account deactivation
- Bulk caregiver status updates
- Caregiver availability monitoring
- Caregiver performance monitoring
- Caregiver rating monitoring
- Caregiver job statistics
- Caregiver earnings overview
- Caregiver detail view
- Recent caregiver activity
- Performance leaderboard
- Performance risk/watchlist

### Booking & Jobs

- Service booking workflow
- Booking status tracking
- Caregiver assignment
- Assigned job tracking
- Accepted job tracking
- Completed job tracking
- Caregiver-specific job statistics
- Monthly completed-job calculations

### Payments

- Stripe Checkout integration
- Booking payment flow
- Stripe webhook handling
- Payment-related booking updates
- Pending booking tracking during checkout

### Reviews & Ratings

- Caregiver reviews
- Caregiver rating aggregation
- Average caregiver rating calculation
- Rating-based caregiver filtering
- Caregiver performance monitoring

### Availability

- Caregiver availability schedules
- Active availability tracking
- Availability-based filtering
- Busy/on-assignment detection
- Availability information in the admin caregiver registry

### Withdrawals & Earnings

- Caregiver withdrawal records
- Pending withdrawal tracking
- Paid withdrawal tracking
- Caregiver earnings calculations
- Monthly earnings calculations
- Completed-job earnings calculations
- Administrative earnings overview

---

## User Roles

### Customer

Customers can:

- Register and authenticate
- Browse caregiving services
- Book services
- Complete payments
- View their bookings
- Access their dashboard

### Caregiver

Caregivers can:

- Apply to become caregivers
- Provide professional information
- Manage availability
- Handle assigned jobs
- Complete jobs
- Track earnings
- Manage withdrawal-related information
- Receive reviews and ratings
- Access their dashboard

### Admin

Administrators can:

- Review caregiver applications
- Approve caregiver applications
- Manage caregiver accounts
- Activate caregiver accounts
- Deactivate caregiver accounts
- Search and filter caregivers
- Monitor caregiver availability
- Monitor caregiver performance
- Monitor jobs
- Monitor ratings
- Monitor withdrawals and earnings
- Access caregiver operational information

---

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Icons
- TanStack Query
- SweetAlert2

### Authentication

- NextAuth
- Credentials Provider
- Google OAuth

### Backend & Server

- Next.js server-side functionality
- Next.js API routes
- Node.js
- Express.js

### Database

- MongoDB

### Payments

- Stripe
- Stripe Checkout
- Stripe Webhooks

### File & Image Management

- Cloudinary

---

## Authentication Flow

CareNest supports credentials-based authentication and Google authentication.

    Customer / Caregiver / Admin
                  |
                  v
           Authentication
                  |
           +------+------+
           |             |
       Credentials     Google
           |             |
           +------+------+
                  |
                  v
           Session Created
                  |
                  v
           Protected Routes
                  |
                  v
          Role-Based Access

Protected routes are handled through the application's authentication and proxy layer.

---

## Caregiver Application Flow

    Caregiver
        |
        v
    Submit Application
        |
        +-- Personal Information
        +-- Experience
        +-- Specialization
        +-- Description
        +-- Supporting Document
                |
                v
           Admin Review
                |
           +----+-----+
           |          |
           v          v
       Approved    Rejected
           |
           v
    Caregiver Account

---

## Booking & Payment Flow

    Customer
       |
       v
    Select Service
       |
       v
    Create Booking
       |
       v
    Create Stripe Checkout Session
       |
       v
    Stripe Checkout
       |
       +-- Payment Successful
       |         |
       |         v
       |      Webhook
       |         |
       |         v
       |   Update Booking
       |
       +-- Payment Not Completed
                 |
                 v
          Pending Booking

Stripe webhooks are used to process payment events from Stripe and update the application's booking/payment state.

---

## Administrative Caregiver Management

The administrative caregiver registry provides operational information including:

- Caregiver identity
- Service specialization
- Average rating
- Completed jobs
- Availability
- Account status
- Earnings
- Performance information

Caregivers can be filtered by:

- Account status
- Availability
- Service specialization
- Rating threshold
- Search terms

Administrators can also perform bulk caregiver account status updates.

---

## Caregiver Performance Monitoring

The administrative dashboard provides metrics including:

- Total active caregivers
- Available caregivers
- Caregivers currently on assignment
- Suspended caregivers
- Aggregate caregiver rating
- Caregivers active during the current month

Additional monitoring views include:

- Performance leaderboard
- Risk/watchlist monitoring
- Completed job counts
- Caregiver earnings
- Recent provider activity

---

## Database

CareNest uses MongoDB for application data.

The main application data includes:

- Users
- Caregiver Applications
- Services
- Bookings
- Jobs
- Availability Schedules
- Caregiver Reviews
- Withdrawals

### User Schema

    User
    ├── _id
    ├── name
    ├── email
    ├── profile_image
    ├── password
    ├── phone
    ├── emergency_contact
    ├── date_of_birth
    ├── gender
    ├── address
    ├── bio
    ├── medical_notes
    ├── is_verified
    ├── provider
    ├── role
    ├── account_status
    ├── created_at
    └── updated_at

### Caregiver Application Schema

    Caregiver Application
    ├── _id
    ├── userId
    ├── name
    ├── email
    ├── phone
    ├── experience
    ├── specialization
    ├── description
    ├── documentUrl
    ├── documentType
    ├── status
    ├── agreedToTerms
    └── createdAt

---

## Data Fetching

TanStack Query is used for client-side server-state management in interactive parts of the application.

It is used for data such as:

- Users
- Caregivers
- Availability schedules
- Jobs
- Reviews
- Withdrawals
- Services

This provides consistent handling of:

- Data fetching
- Loading states
- Caching
- Refetching
- Server-state synchronization

---

## UI & UX

The application uses a responsive dashboard-oriented interface with:

- KPI cards
- Data tables
- Search controls
- Filtering controls
- Detail views
- Modals
- Confirmation dialogs
- Empty states
- Loading states
- Status indicators
- Financial summaries
- Responsive layouts
- Contextual administrative actions

SweetAlert2 is used for confirmation and feedback interactions for important administrative actions.

---

## Responsive Design

CareNest is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

Dashboard layouts adapt to different screen sizes, while data-heavy interfaces use responsive overflow handling where required.

---

## Project Structure

    CareNest/
    │
    ├── app/
    │   ├── (auth)/
    │   ├── dashboard/
    │   │   ├── customer/
    │   │   ├── caregiver/
    │   │   └── admin/
    │   ├── booking/
    │   ├── api/
    │   └── ...
    │
    ├── components/
    │
    ├── hooks/
    │
    ├── lib/
    │
    ├── public/
    │
    ├── types/
    │
    ├── proxy.ts
    │
    ├── package.json
    └── README.md

---

## Environment Variables

Create the required environment variables for the application.

    MONGODB_URI=

    NEXTAUTH_SECRET=
    NEXTAUTH_URL=

    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=

    STRIPE_SECRET_KEY=
    STRIPE_WEBHOOK_SECRET=

    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=

> Never commit real credentials, API keys, secrets, or private configuration values to the repository.

---

## Getting Started

### Clone the Repository

    git clone <your-repository-url>

### Navigate to the Project

    cd <project-directory>

### Install Dependencies

    npm install

### Configure Environment Variables

Create the required environment file and add the appropriate credentials and configuration values.

### Start the Development Server

    npm run dev

The application will be available at the local development URL provided by Next.js.

---

## Production Build

Create a production build:

    npm run build

Start the production server:

    npm start

---

## Security

The application includes security-related measures such as:

- Protected routes
- Role-based access control
- Authentication sessions
- Secure authentication cookies
- Environment-based secret management
- Server-side database operations
- Password hashing for credentials-based accounts
- Stripe webhook verification
- Sensitive credentials excluded from source control

---

## Development Focus

CareNest was built as a practical full-stack application to work with real-world application concerns including:

- Authentication
- Authorization
- OAuth
- Database operations
- Booking workflows
- Payment processing
- Webhooks
- Role-based dashboards
- Caregiver onboarding
- Availability management
- Job management
- Reviews and ratings
- Earnings and withdrawals
- Administrative operations
- Client-side server-state management
- Responsive UI development

---

## Future Improvements

Potential areas for future development include:

- Further component modularization
- Expanded administrative controls
- Additional validation
- Improved notification workflows
- Additional analytics
- More comprehensive automated testing
- Further accessibility improvements
- Additional performance optimization
- Improved monitoring and observability

---

## License

This project is a personal full-stack development project.

---

## Author

**Abdul Rehman Aarmaan**

Full-Stack Web Developer

Interested in building modern web applications with React, Next.js, Node.js, databases, authentication, payment integrations, and production-oriented application architecture.