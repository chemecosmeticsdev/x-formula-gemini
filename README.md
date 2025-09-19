# X Formula Gemini - AI-Powered Cosmetics Research Platform

An AI-powered web application for generating cosmetics formulas and product mockups, built for ChemeCosmetics B2B platform.

## 🧪 Features

- **AI-Powered Formula Generation**: Uses Gemini API to create detailed cosmetics formulas
- **Product Mockup Generation**: AI-generated visual product mockups with professional styling
- **Comprehensive Ingredient Database**: Based on ChemeCosmetics ingredient catalog
- **Professional UI**: Clean, modern interface matching luxury cosmetics brands
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Deployment Ready**: Optimized for AWS Amplify, Vercel, and other platforms

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: Gemini 2.5 Flash API
- **Deployment**: AWS Amplify compatible

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- Yarn package manager
- PostgreSQL database
- Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chemecosmeticsdev/x-formula-gemini.git
   cd x-formula-gemini
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your configuration:
   ```env
   DATABASE_URL="your_postgresql_connection_string"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your_nextauth_secret"
   GEMINI_API_KEY="your_gemini_api_key"
   ```

4. **Set up the database**
   ```bash
   yarn prisma generate
   yarn prisma db push
   yarn prisma db seed
   ```

5. **Run the development server**
   ```bash
   yarn dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── form/             # Product description form
│   ├── results/          # Formula results display
│   └── layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   ├── landing/          # Landing page sections
│   └── results/          # Results display components
├── lib/                   # Utility libraries
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🌟 Key Features Demo

1. **Landing Page**: Professional cosmetics platform introduction
2. **Product Form**: Intuitive interface for describing desired products
3. **AI Processing**: Real-time formula generation with loading states
4. **Results Display**: Comprehensive formula with ingredients, instructions, and product mockup

## 🚀 Deployment

This project is optimized for deployment on:

- **AWS Amplify** (recommended)
- **Vercel** 
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

### AWS Amplify Deployment

1. Connect your GitHub repository to AWS Amplify
2. Set environment variables in the Amplify console
3. Deploy automatically on every push to main

## 🔐 Security

- Environment variables are excluded from version control
- API keys are stored securely
- Database connections use secure protocols
- Authentication handled by NextAuth.js

## 📝 License

This project is proprietary to ChemeCosmetics.

---

Built with ❤️ for the cosmetics industry
