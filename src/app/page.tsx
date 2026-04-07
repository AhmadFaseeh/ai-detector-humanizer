import { InputForm } from "@/components/input-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Detector & Humanizer - Detect and Humanize AI Content",
  description:
    "Advanced AI content detection and humanization tool. Detect AI-generated text with high accuracy and humanize it using GPT-4o.",
};

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            AI Detector & Humanizer
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Detect AI-generated content with precision using perplexity and burstiness metrics. 
            Then humanize it with our advanced GPT-4o powered rewriting engine.
          </p>
          
          {/* Feature Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              Perplexity Analysis
            </span>
            <span className="rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700">
              Burstiness Detection
            </span>
            <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
              GPT-4o Humanizer
            </span>
          </div>
        </div>
      </section>

      {/* Main Input Section */}
      <section className="px-4 pb-16">
        <InputForm />
      </section>

      {/* How It Works Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            How It Works
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                1
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">Input Text or URL</h3>
              <p className="text-sm text-gray-600">
                Paste your text directly or enter a URL to scrape content for analysis.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-600">
                2
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">AI Detection</h3>
              <p className="text-sm text-gray-600">
                Our algorithm analyzes perplexity, burstiness, and sentence patterns.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
                3
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">Humanize (Optional)</h3>
              <p className="text-sm text-gray-600">
                Use GPT-4o to rewrite the text with natural human writing patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Technical Approach
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <article className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Perplexity (Vocabulary Variation)
              </h3>
              <p className="text-gray-600">
                AI-generated text typically has low perplexity, meaning it uses predictable 
                vocabulary patterns. We measure lexical diversity to identify these patterns.
              </p>
            </article>
            <article className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Burstiness (Sentence Variation)
              </h3>
              <p className="text-gray-600">
                Human writing has natural variation in sentence lengths. AI tends to produce 
                uniform sentence structures. We calculate variance to detect this.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm text-gray-500">
            Built with Next.js App Router, Tailwind CSS, and GPT-4o. 
            Optimized for performance and SEO.
          </p>
        </div>
      </footer>
    </main>
  );
}
