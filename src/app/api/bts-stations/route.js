// File: app/api/bts-stations/route.js

import { NextResponse } from 'next/server';

export async function GET() {
  const btsApiUrl = 'https://my-bts-api.vercel.app/api/station-list';

  try {
    const response = await fetch(btsApiUrl, {
      // Important for Vercel caching
      next: { revalidate: 3600 }, // Cache the response for 1 hour
    });

    if (!response.ok) {
      // If the external API fails, we pass the error through
      throw new Error(`Failed to fetch from BTS API: ${response.statusText}`);
    }

    const data = await response.json();

    // Return the successful response to our client
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in BTS proxy API route:', error);
    // Return an error response to our client
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}