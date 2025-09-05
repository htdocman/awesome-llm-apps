import { NextRequest, NextResponse } from 'next/server';
import { StatisticsDB } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('story_id');

    if (!storyId) {
      return NextResponse.json({ error: 'Story ID is required' }, { status: 400 });
    }

    const stats = StatisticsDB.getWritingStats(parseInt(storyId));
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch writing statistics' }, { status: 500 });
  }
}