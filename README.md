# AI Detector & Humanizer

A high-performance, SEO-friendly AI content detection and humanization tool built with Next.js 14 (App Router), Tailwind CSS, and GPT-4o.

## Features

- **AI Detection**: Analyze text for AI generation patterns using perplexity and burstiness metrics
- **URL Scraping**: Automatically extract and analyze content from any webpage using Cheerio
- **AI Humanization**: Rewrite AI-generated text with natural human writing patterns using GPT-4o
- **Detailed Metrics**: Get perplexity (vocabulary variation) and burstiness (sentence length variation) scores
- **Sentence-Level Analysis**: See AI probability for individual sentences
- **SEO Optimized**: Full metadata, OpenGraph tags, semantic HTML, and server-side rendering

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **API Integration**: 
  - Google Gemini (free tier) via Vercel AI SDK
  - OpenAI GPT-4o (optional, paid) via Vercel AI SDK
  - Cheerio for fast web scraping
- **Validation**: Zod
- **Utilities**: clsx, tailwind-merge

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/      # AI detection endpoint (POST)
│   │   ├── humanize/     # GPT-4o humanization endpoint (POST)
│   │   └── scrape/       # Web scraping endpoint (POST)
│   ├── layout.tsx        # Root layout with SEO metadata
│   ├── page.tsx          # Main landing page (SSG)
│   └── globals.css       # Global styles with Tailwind v4
├── components/
│   ├── analysis-results.tsx   # Analysis display component
│   ├── humanize-results.tsx   # Humanization display component
│   ├── input-form.tsx         # Main input form with tabs
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── loading-spinner.tsx
│       └── textarea.tsx
├── lib/
│   ├── seo.ts            # SEO configuration & defaults
│   └── utils.ts          # Utility functions (perplexity, burstiness)
└── types/
    └── index.ts          # TypeScript type definitions
```

## Key Features & Architecture

### Performance (TBT Control)
- **Server-Side Processing**: All heavy computation happens in API routes, not on the client
- **Lightweight Frontend**: Only smooth loading spinners and UI updates on the main thread
- **Optimized Bundle**: Package imports optimized for faster loading
- **No Client-Side AI Processing**: Prevents browser freezing during analysis

### SEO Optimization
- **Dynamic Metadata**: Page-specific titles and descriptions with template
- **OpenGraph/Twitter Cards**: Full social media preview support with images
- **Semantic HTML**: Proper use of `<main>`, `<section>`, `<article>`, `<h1>`-`<h6>`
- **Static Generation**: Landing page is SSG for instant LCP
- **Canonical URLs**: Proper canonicalization for search engines
- **Robots Meta**: Configured for optimal indexing

### AI Detection Algorithm
The detection uses two primary metrics based on research from GPTZero and similar tools:

1. **Perplexity**: Measures vocabulary diversity
   - Low perplexity (< 3) = More predictable = Likely AI
   - High perplexity (> 5) = More varied = Likely human

2. **Burstiness**: Measures sentence length variation
   - Low burstiness (< 2) = Uniform lengths = Likely AI  
   - High burstiness (> 5) = Varied lengths = Likely human

### Humanizer Prompt Engineering
The GPT-4o humanizer uses a sophisticated system prompt that emphasizes:

- **Perplexity**: Varied vocabulary and natural expressions (synonyms, idioms)
- **Burstiness**: Mixed sentence lengths and structures (short + long)
- **Natural Elements**: Contractions, filler words, rhetorical questions
- **Pattern Breaking**: Varying sentence starts, removing formal transitions

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- OpenAI API key (for humanization feature)

### Installation

```bash
# Navigate to project
cd ai-detector-humanizer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create `.env.local` with ONE of the following options:

**Option 1: Google Gemini (FREE - Recommended)**
```env
# Get your free API key from: https://ai.google.dev/gemini-api/docs/api-key
# Free tier: 1,500 requests/day
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

**Option 2: OpenAI (Paid, higher quality)**
```env
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here
```

The app will automatically use **Gemini if available** (free tier), otherwise fall back to OpenAI. The AI Detector feature works without any API key - only the Humanizer requires AI access.

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## API Routes Documentation

### POST `/api/analyze`
Analyzes text for AI generation patterns using perplexity and burstiness.

**Request:**
```json
{
  "text": "Your text to analyze... (min 10 chars, max 10000)"
}
```

**Response:**
```json
{
  "isAiGenerated": true,
  "confidence": 85,
  "perplexity": 2.5,
  "burstiness": 1.8,
  "sentenceAnalysis": [
    {
      "text": "Example sentence",
      "aiProbability": 0.75,
      "issues": ["Formal transition detected"]
    }
  ],
  "suggestions": [
    "Text shows strong AI generation patterns",
    "Consider varying sentence lengths"
  ]
}
```

### POST `/api/scrape`
Scrapes content from a URL using Cheerio for fast server-side parsing.

**Request:**
```json
{
  "url": "https://example.com/article"
}
```

**Response:**
```json
{
  "title": "Article Title",
  "content": "Scraped content...",
  "url": "https://example.com/article",
  "wordCount": 500
}
```

### POST `/api/humanize`
Humanizes AI-generated text using Google Gemini (free) or OpenAI GPT-4o (if configured).

**Request:**
```json
{
  "text": "AI-generated text to humanize... (min 10 chars, max 8000)"
}
```

**Response:**
```json
{
  "humanizedText": "Rewritten natural text with varied patterns...",
  "improvements": [
    "Varied sentence openings with different structures",
    "Mixed short and long sentences for dynamic rhythm",
    "Added natural contractions for conversational tone"
  ],
  "detectedPatterns": [
    "Repetitive sentence beginnings",
    "Uniform sentence length (low burstiness)"
  ]
}
```

## Performance Optimizations

1. **Minimize TBT**: All analysis happens server-side; client only shows loading states with spinner
2. **Optimize LCP**: 
   - Inter font uses `display: swap` for fast text rendering
   - Images use AVIF/WebP formats
   - Static generation for landing page
3. **Reduce CLS**: 
   - Fixed dimensions on all components
   - Stable layout with proper spacing using Tailwind
4. **Enable Compression**: Gzip/Brotli enabled in next.config.ts
5. **Security Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy

## Security Features

- ✅ Input validation with Zod schemas
- ✅ Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- ✅ API key stored server-side only (never exposed to client)
- ✅ Rate limiting ready (add middleware in production)
- ✅ Content size limits (prevents abuse)

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set environment variable in Vercel dashboard (choose one):
- `GOOGLE_GENERATIVE_AI_API_KEY` (Free tier: 1,500 requests/day) - Get from [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
- `OPENAI_API_KEY` (Paid) - Get from [OpenAI Platform](https://platform.openai.com/api-keys)

### Environment Setup

Required environment variables for production (choose one):
```env
# Option 1: Google Gemini (Free)
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here

# Option 2: OpenAI (Paid)
OPENAI_API_KEY=sk-...
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use for personal or commercial projects.

## Credits

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- AI powered by [Google Gemini](https://ai.google.dev) (free tier) or [OpenAI GPT-4o](https://openai.com)
- Scraping powered by [Cheerio](https://cheerio.js.org)

---

Built with performance and SEO in mind. 🚀
#   a i - d e t e c t o r - h u m a n i z e r  
 