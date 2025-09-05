import { NextRequest, NextResponse } from 'next/server';
import { CharacterDB } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { story_id, name, description, appearance, personality, background, role } = body;

    if (!story_id || !name) {
      return NextResponse.json({ error: 'Story ID and name are required' }, { status: 400 });
    }

    const result = CharacterDB.createCharacter({
      story_id,
      name,
      description,
      appearance,
      personality,
      background,
      role
    });

    return NextResponse.json({ id: result.lastInsertRowid, message: 'Character created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create character' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('story_id');

    if (!storyId) {
      return NextResponse.json({ error: 'Story ID is required' }, { status: 400 });
    }

    const characters = CharacterDB.getCharactersByStoryId(parseInt(storyId));
    return NextResponse.json(characters);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch characters' }, { status: 500 });
  }
}