import { NextRequest, NextResponse } from 'next/server';
import { ChapterDB } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { story_id, title, content, order_index } = body;

    if (!story_id || !title || order_index === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = ChapterDB.createChapter({
      story_id,
      title,
      content,
      order_index
    });

    return NextResponse.json({ id: result.lastInsertRowid, message: 'Chapter created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create chapter' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('story_id');

    if (!storyId) {
      return NextResponse.json({ error: 'Story ID is required' }, { status: 400 });
    }

    const chapters = ChapterDB.getChaptersByStoryId(parseInt(storyId));
    return NextResponse.json(chapters);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 });
  }
}