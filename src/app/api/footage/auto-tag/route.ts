import { NextResponse } from 'next/server';
import { FootageTag } from '@/types/core';

export async function POST(req: Request) {
  try {
    const { imageUrl, fileName } = await req.json();

    if (!imageUrl && !fileName) {
      return NextResponse.json({ error: 'Missing imageUrl or fileName' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback logic
    const guessTags = (): FootageTag[] => {
      const lowerName = (fileName || imageUrl || '').toLowerCase();
      if (lowerName.includes('product') || lowerName.includes('box')) return ['PRODUCT_HERO'];
      if (lowerName.includes('use') || lowerName.includes('hand')) return ['PRODUCT_IN_USE'];
      if (lowerName.includes('face') || lowerName.includes('before')) return ['BEFORE_AFTER'];
      if (lowerName.includes('pet') || lowerName.includes('dog') || lowerName.includes('cat')) return ['PET_CUTE'];
      if (lowerName.includes('nature') || lowerName.includes('leaf') || lowerName.includes('plant')) return ['NATURE_INGREDIENT'];
      return ['LIFESTYLE_AMBIENT'];
    };

    const fallbackResponse = {
      tags: guessTags(),
      detectedObjects: ['Mặt hàng không xác định'],
      detectedMood: 'Bình thường',
      detectedScene: 'Chung'
    };

    const hasValidKey = apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.length > 10;

    if (!hasValidKey || !imageUrl) {
      return NextResponse.json(fallbackResponse);
    }

    try {
      // Try to fetch image and convert to base64
      const imageRes = await fetch(imageUrl);
      if (!imageRes.ok) throw new Error('Failed to fetch image for analysis');
      const arrayBuffer = await imageRes.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const mimeType = imageRes.headers.get('content-type') || 'image/jpeg';

      const prompt = `Analyze this image for TikTok ad production. Return a JSON object with:
- tags: array of applicable FootageTag values from this list: PRODUCT_HERO, PRODUCT_IN_USE, PRODUCT_PACKSHOT, TEXTURE_MACRO, BEFORE_AFTER, PERSON_FRUSTRATED, PERSON_HAPPY, HANDS_UNBOX, LIFESTYLE_AMBIENT, EXPERT_AUTHORITY, UGC_TESTIMONIAL, PET_CUTE, PET_BATH, NATURE_INGREDIENT
- detectedObjects: array of objects visible in the image (in Vietnamese)
- detectedMood: one word describing the mood (in Vietnamese)
- detectedScene: one word describing the scene/location (in Vietnamese)`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType,
                    data: base64
                  }
                }
              ]
            }
          ],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (!response.ok) throw new Error('Gemini API error');

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rawText) throw new Error('No text returned from Gemini');

      const parsed = JSON.parse(rawText);
      return NextResponse.json(parsed);
    } catch (err) {
      console.error('Gemini vision error:', err);
      return NextResponse.json(fallbackResponse);
    }
  } catch (error) {
    console.error('Error in /api/footage/auto-tag:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
