import { NextRequest, NextResponse } from 'next/server';
import { StatisticsDB } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('story_id');
    const days = searchParams.get('days') || '30';

    if (!storyId) {
      return NextResponse.json({ error: 'Story ID is required' }, { status: 400 });
    }

    const sessions = StatisticsDB.getWritingSessions(parseInt(storyId), parseInt(days));
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch writing sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { story_id, words_written, session_duration, date } = body;

    if (!story_id || words_written === undefined || session_duration === undefined || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = StatisticsDB.addWritingSession({
      story_id,
      words_written,
      session_duration,
      date
    });

    return NextResponse.json({ message: 'Writing session recorded successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record writing session' }, { status: 500 });
  }
}