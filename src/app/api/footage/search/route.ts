export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { FootageAsset, FootageTag } from '@/types/core';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || 'nature';
    const type = searchParams.get('type') || 'video';
    const per_page = searchParams.get('per_page') || '12';

    const apiKey = process.env.PEXELS_API_KEY;
    const hasValidKey = apiKey && apiKey !== 'your_pexels_api_key_here' && apiKey.length > 10;

    if (!hasValidKey) {
      // Mock results
      const mockResults: FootageAsset[] = Array.from({ length: parseInt(per_page) }).map((_, idx) => ({
        id: `mock-${type}-${idx}`,
        type: type === 'video' ? 'VIDEO' : 'IMAGE',
        source: 'PEXELS',
        url: type === 'video' 
          ? 'https://www.w3schools.com/html/mov_bbb.mp4' 
          : `https://picsum.photos/seed/${q}${idx}/400/710`,
        thumbnailUrl: `https://picsum.photos/seed/${q}${idx}/400/710`,
        tags: ['LIFESTYLE_AMBIENT'] as FootageTag[],
        durationSec: type === 'video' ? 15 : undefined,
        width: 1080,
        height: 1920,
        license: 'Pexels License (Free for commercial use)',
      }));
      return NextResponse.json(mockResults);
    }

    let results: FootageAsset[] = [];
    const headers = { Authorization: apiKey };

    if (type === 'video') {
      const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&orientation=portrait&per_page=${per_page}`, { headers });
      if (!response.ok) throw new Error('Pexels video API error');
      const data = await response.json();
      
      results = data.videos.map((v: any) => {
        const hdFile = v.video_files.find((f: any) => f.quality === 'hd') || v.video_files[0];
        return {
          id: `pexels-vid-${v.id}`,
          type: 'VIDEO',
          source: 'PEXELS',
          url: hdFile?.link || '',
          thumbnailUrl: v.video_pictures?.[0]?.picture || '',
          tags: ['LIFESTYLE_AMBIENT'], // Basic auto-tag
          durationSec: v.duration,
          width: hdFile?.width || 1080,
          height: hdFile?.height || 1920,
          license: 'Pexels License (Free for commercial use)',
        };
      });
    } else {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&orientation=portrait&per_page=${per_page}`, { headers });
      if (!response.ok) throw new Error('Pexels photo API error');
      const data = await response.json();

      results = data.photos.map((p: any) => {
        return {
          id: `pexels-pic-${p.id}`,
          type: 'IMAGE',
          source: 'PEXELS',
          url: p.src.portrait,
          thumbnailUrl: p.src.small,
          tags: ['LIFESTYLE_AMBIENT'], // Basic auto-tag
          width: p.width,
          height: p.height,
          license: 'Pexels License (Free for commercial use)',
        };
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching from Pexels:', error);
    return NextResponse.json({ error: 'Failed to fetch footage' }, { status: 500 });
  }
}
