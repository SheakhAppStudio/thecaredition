# The Car Edition Pro

A premium automotive website built with Next.js and Tailwind CSS, focusing on SEO optimization and fast performance.

## Features

- Modern, responsive design
- Server-side rendering for optimal SEO
- Fast page loads and transitions
- Interactive UI components
- Vehicle showcase and details pages

## Tech Stack

- **Frontend Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
/
├── public/            # Static files
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/     # Reusable components
│   └── styles/         # Global styles
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## Development

### Adding New Pages

Create new pages in the `src/app` directory. Next.js uses file-based routing, so the file structure determines the URL structure.

### Styling

This project uses Tailwind CSS for styling. Custom styles can be added in the `src/styles/globals.css` file.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License

MIT
