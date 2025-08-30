import { NextResponse } from 'next/server';

const REPO = '0xAquaWolf/AquaKit';
const GITHUB_API = `https://api.github.com/repos/${REPO}`;

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'AquaKit-App',
    };

    // Optional token to raise rate limits
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(GITHUB_API, { headers, next: { revalidate: 300 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch repository data' },
        { status: res.status, headers: { 'Cache-Control': 's-maxage=120' } }
      );
    }

    const data = await res.json();
    const stars = typeof data?.stargazers_count === 'number' ? data.stargazers_count : 0;
    const html_url = typeof data?.html_url === 'string' ? data.html_url : `https://github.com/${REPO}`;

    return NextResponse.json(
      { stars, html_url },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400' } }
    );
  } catch {
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500, headers: { 'Cache-Control': 's-maxage=60' } }
    );
  }
}

