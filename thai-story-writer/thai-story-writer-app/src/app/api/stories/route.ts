import { NextRequest, NextResponse } from 'next/server';
import { StoryDB } from '@/lib/database';

export async function GET() {
  try {
    const stories = StoryDB.getAllStories();
    return NextResponse.json(stories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, genre, target_word_count } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const result = StoryDB.createStory({
      title,
      description,
      genre,
      target_word_count
    });

    return NextResponse.json({ id: result.lastInsertRowid, message: 'Story created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 });
  }
}