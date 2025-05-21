# Lust66 - Next.js Frontend for Classified Listings

This is the frontend application for Lust66, a classified listings platform built with Next.js, connected to a Strapi backend.

## Features

- **Public Pages**
  - Homepage with featured listings, city/category navigation
  - Listing directory with pagination and filters
  - Listing detail pages with image gallery and contact info
  - SEO-optimized pages with metadata

- **Advertiser Portal**
  - User authentication (register/login)
  - Dashboard to manage listings
  - Create and edit listing forms with image uploads
  - Protected routes for authenticated users

## Tech Stack

- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Communication**: Axios
- **Authentication**: JWT-based auth with secure storage
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18.x or later
- A running Strapi backend (see below)

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-key
```

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/lust66-frontend.git
   cd lust66-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Connecting to Strapi Backend

This frontend is designed to work with a Strapi backend that has the following content types:
- Listings
- Categories
- Cities
- Tags
- Promotions

The Strapi backend should be running at `http://localhost:1337` by default.

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── (public)/           # Public-facing pages
│   │   ├── [city]/         # City-specific pages
│   │   │   └── [category]/ # Category-specific pages
│   │   ├── auth/           # Authentication pages
│   │   └── dashboard/      # Protected dashboard pages
│   ├── components/         # React components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components
│   │   ├── listings/       # Listing-related components
│   │   └── ui/             # UI components
│   ├── lib/                # Utility functions
│   │   ├── api/            # API client and services
│   │   ├── auth/           # Auth utilities
│   │   ├── store/          # Zustand stores
│   │   └── utils/          # Helper functions
│   ├── public/             # Static assets
│   └── types/              # TypeScript type definitions
└── README.md               # This README file
```

## Deployment

This Next.js application can be deployed to Vercel with minimal configuration:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

## License

MIT
