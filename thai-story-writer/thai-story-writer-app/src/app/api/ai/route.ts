import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, context, request: userRequest } = body;

    // Get OpenAI API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured',
        content: 'AI Assistant ยังไม่ได้ตั้งค่า กรุณาใส่ OPENAI_API_KEY ใน environment variables'
      }, { status: 500 });
    }

    // Create appropriate prompt based on type
    let systemPrompt = '';
    switch (type) {
      case 'character':
        systemPrompt = `คุณเป็นผู้เชี่ยวชาญในการสร้างตัวละครสำหรับนิยาย ช่วยพัฒนาตัวละครให้มีมิติ น่าสนใจ และสมจริง ตอบเป็นภาษาไทยเสมอ`;
        break;
      case 'plot':
        systemPrompt = `คุณเป็นผู้เชี่ยวชาญในการวางโครงเรื่อง ช่วยคิดเหตุการณ์ ความขัดแย้ง และการพัฒนาเรื่อง ตอบเป็นภาษาไทยเสมอ`;
        break;
      case 'dialogue':
        systemPrompt = `คุณเป็นผู้เชี่ยวชาญในการเขียนบทสนทนา ช่วยสร้างบทพูดที่เป็นธรรมชาติและสอดคล้องกับตัวละคร ตอบเป็นภาษาไทยเสมอ`;
        break;
      case 'description':
        systemPrompt = `คุณเป็นผู้เชี่ยวชาญในการเขียนบรรยาย ช่วยสร้างการบรรยายที่สวยงามและมีภาพพจน์ ตอบเป็นภาษาไทยเสมอ`;
        break;
      case 'continue':
        systemPrompt = `คุณเป็นนักเขียนมืออาชีพ ช่วยต่อเนื้อเรื่องให้สมเหตุสมผลและน่าติดตาม ตอบเป็นภาษาไทยเสมอ`;
        break;
      default:
        systemPrompt = `คุณเป็นผู้ช่วยนักเขียน ช่วยเหลือในการเขียนนิยายภาษาไทย ตอบเป็นภาษาไทยเสมอ`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `บริบท: ${context}\n\nคำขอ: ${userRequest}`
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to call OpenAI API');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || 'ไม่สามารถสร้างคำตอบได้ กรุณาลองใหม่อีกครั้ง';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to get AI response',
      content: 'เกิดข้อผิดพลาดในการเรียกใช้ AI Assistant กรุณาลองใหม่อีกครั้ง'
    }, { status: 500 });
  }
}