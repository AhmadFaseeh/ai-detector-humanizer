import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import * as cheerio from 'cheerio';
import { ScrapeResult } from '@/types';

const scrapeSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { url } = scrapeSchema.parse(body);

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch webpage', code: 'FETCH_ERROR' },
        { status: 502 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script and style elements
    $('script, style, nav, footer, header, aside, .advertisement, .ads').remove();

    // Extract title
    const title = $('title').text() || $('h1').first().text() || 'Untitled';

    // Extract main content
    let content = '';
    
    // Try to find main content areas
    const mainContent = $('main, article, [role="main"], .content, .post-content, .entry-content').first();
    if (mainContent.length > 0) {
      content = mainContent.text();
    } else {
      // Fallback to body content
      content = $('body').text();
    }

    // Clean up the content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim();

    // Limit content length
    const maxLength = 5000;
    if (content.length > maxLength) {
      content = content.substring(0, maxLength) + '...';
    }

    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;

    const result: ScrapeResult = {
      title: title.trim(),
      content,
      url,
      wordCount,
    };

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    console.error('Scrape error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape webpage', code: 'SCRAPE_ERROR' },
      { status: 500 }
    );
  }
}
