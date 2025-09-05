#!/usr/bin/env python3
"""Test OpenAI connection"""

from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

try:
    from openai import OpenAI
    
    # Initialize client without explicit api_key parameter
    client = OpenAI()
    
    # Test simple completion
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": "เขียนเรื่องสั้นๆ เรื่องรักในร้านกาแฟ 100 คำ"}
        ],
        max_tokens=200,
        temperature=0.8
    )
    
    print("✅ การเชื่อมต่อ OpenAI สำเร็จ!")
    print("\n📖 เรื่องที่สร้างได้:")
    print("-" * 40)
    print(response.choices[0].message.content)
    
except Exception as e:
    print(f"❌ ข้อผิดพลาด: {str(e)}")