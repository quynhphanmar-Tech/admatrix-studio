import { NextResponse } from 'next/server';
import { GenerationConfig } from '@/types/core';
import { generate12Scripts } from '@/services/matrixEngine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const config: GenerationConfig = await req.json();
    const scripts = generate12Scripts(config);
    return NextResponse.json({ scripts });
  } catch (error) {
    console.error('Error in /api/generate-12-scripts:', error);
    return NextResponse.json({ error: 'Failed to generate scripts' }, { status: 500 });
  }
}
