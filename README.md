# Synapsys Website V2

Enterprise-grade EUDI wallet relying party dashboard built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn/ui.

## 🎯 Overview

Synapsys Website V2 is a production-ready dashboard for EUDI wallet verification and management. It integrates with the synapsys-verifier backend (OpenID4VP) and is designed to meet the highest standards of security and compliance.

## ✨ Features

- **OpenID4VP Integration**: Seamless integration with synapsys-verifier for credential verification
- **eIDAS 2.0 Compliant**: Full compliance with European Digital Identity standards
- **Security First**: GDPR, NIS2, and ISO 27001 compliant architecture
- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS, Shadcn/ui
- **Enterprise Ready**: Production-grade setup with security headers, middleware, and best practices

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Fonts**: Geist Sans & Geist Mono

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/cuentalowai-ops/synapsys-website-v2.git
cd synapsys-website-v2
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local` and configure your environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_VERIFIER_API_URL=http://localhost:8080
NEXT_PUBLIC_CLIENT_ID=your-client-id
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/callback
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
synapsys-website-v2/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── ui/          # Shadcn/ui components
│   │   └── layout/      # Layout components
│   ├── lib/             # Utility libraries
│   │   ├── api/         # API clients
│   │   └── utils/       # Utility functions
│   ├── hooks/           # React hooks
│   ├── types/           # TypeScript type definitions
│   ├── config/          # Configuration files
│   └── middleware.ts    # Next.js middleware
├── public/              # Static assets
└── ...config files
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Security

This project includes:

- Security headers (HSTS, X-Frame-Options, CSP, etc.)
- Middleware for request handling
- Environment variable validation
- Type-safe API clients

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

This is a private repository. For contributions, please contact the maintainers.

## 📄 License

Proprietary - All rights reserved

## 🔗 Related Projects

- [synapsys-verifier](https://github.com/cuentalowai-ops/synapsys-verifier) - OpenID4VP verifier backend

## 📞 Support

For support and questions, please contact the development team.
