#!/usr/bin/env python3
"""
CLI version of Thai Story Writer
Command-line interface for generating Thai stories
"""

import argparse
import os
import sys
from dotenv import load_dotenv
from story_generator import ThaiStoryGenerator
import json
import time

# Load environment variables
load_dotenv()

def print_header():
    """Print application header."""
    print("=" * 60)
    print("🤖 AI นักเขียนเรื่องไทย - Thai Story Writer CLI")
    print("=" * 60)

def print_genres(generator):
    """Print available genres."""
    genres = generator.get_available_genres()
    print("\n📚 ประเภทเรื่องที่มี:")
    for key, thai_name in genres.items():
        print(f"  {key}: {thai_name}")

def print_lengths(generator):
    """Print available story lengths."""
    lengths = generator.get_available_lengths()
    print("\n📏 ความยาวเรื่อง:")
    for key, info in lengths.items():
        print(f"  {key}: {info['name']} ({info['words']} คำ)")

def print_styles(generator):
    """Print available writing styles."""
    styles = generator.get_available_styles()
    print("\n✍️ สไตล์การเขียน:")
    for key, thai_name in styles.items():
        print(f"  {key}: {thai_name}")

def interactive_mode():
    """Run in interactive mode."""
    print_header()
    print("🎯 โหมดโต้ตอบ - ตอบคำถามเพื่อสร้างเรื่อง")
    print("-" * 60)
    
    # Check API key
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ ข้อผิดพลาด: ไม่พบ OpenAI API Key")
        print("กรุณาตั้งค่า OPENAI_API_KEY ใน environment หรือไฟล์ .env")
        return
    
    try:
        generator = ThaiStoryGenerator()
    except Exception as e:
        print(f"❌ ไม่สามารถเริ่มต้นระบบได้: {str(e)}")
        return
    
    print("\n📝 กรอกข้อมูลเรื่องที่ต้องการสร้าง:")
    
    # Get story prompt
    while True:
        story_prompt = input("\n💭 แนวคิดเรื่อง (บังคับ): ").strip()
        if story_prompt:
            break
        print("⚠️ กรุณากรอกแนวคิดเรื่อง")
    
    # Show and select genre
    print_genres(generator)
    while True:
        genre = input("\n🎭 เลือกประเภท (เช่น romance, mystery): ").strip().lower()
        if genre in generator.get_available_genres():
            break
        print("⚠️ ประเภทไม่ถูกต้อง กรุณาเลือกใหม่")
    
    # Show and select length
    print_lengths(generator)
    while True:
        length = input("\n📏 เลือกความยาว (เช่น short, medium, long): ").strip().lower()
        if length in generator.get_available_lengths():
            break
        print("⚠️ ความยาวไม่ถูกต้อง กรุณาเลือกใหม่")
    
    # Show and select style
    print_styles(generator)
    while True:
        style = input("\n✍️ เลือกสไตล์ (เช่น casual, formal): ").strip().lower()
        if style in generator.get_available_styles():
            break
        print("⚠️ สไตล์ไม่ถูกต้อง กรุณาเลือกใหม่")
    
    # Optional inputs
    character_names = input("\n👥 ชื่อตัวละคร (ไม่บังคับ): ").strip()
    setting = input("🏞️ สถานที่/ฉาก (ไม่บังคับ): ").strip()
    
    # Temperature setting
    while True:
        try:
            temp_input = input("\n🔧 ความคิดสร้างสรรค์ 0.1-1.0 (default: 0.8): ").strip()
            if not temp_input:
                temperature = 0.8
                break
            temperature = float(temp_input)
            if 0.1 <= temperature <= 1.0:
                break
            print("⚠️ กรุณากรอกค่าระหว่าง 0.1-1.0")
        except ValueError:
            print("⚠️ กรุณากรอกตัวเลข")
    
    # Generate story
    print("\n✨ กำลังสร้างเรื่อง...")
    print("⏰ กรุณารอสักครู่...")
    
    result = generator.generate_story(
        user_prompt=story_prompt,
        genre=genre,
        length=length,
        style=style,
        character_names=character_names,
        setting=setting,
        temperature=temperature
    )
    
    if result['success']:
        print("\n" + "="*60)
        print("🎉 เรื่องที่สร้างเสร็จแล้ว!")
        print("="*60)
        
        # Show metadata
        metadata = result['metadata']
        print(f"\n📊 ข้อมูลเรื่อง:")
        print(f"🎭 ประเภท: {metadata['genre']}")
        print(f"📏 ความยาว: {metadata['length_type']}")
        print(f"✍️ สไตล์: {metadata['style']}")
        print(f"📝 จำนวนคำ: {metadata['word_count']} คำ")
        print(f"👥 ตัวละคร: {metadata['characters']}")
        print(f"🏞️ สถานที่: {metadata['setting']}")
        
        print(f"\n📖 เรื่อง:")
        print("-" * 60)
        print(result['story'])
        print("-" * 60)
        
        # Ask to save
        save_choice = input("\n💾 ต้องการบันทึกเรื่องไหม? (y/n): ").strip().lower()
        if save_choice in ['y', 'yes', 'ใช่', '1']:
            filename = f"thai_story_{int(time.time())}.txt"
            story_content = f"""แนวคิด: {story_prompt}
ประเภท: {metadata['genre']}
ความยาว: {metadata['length_type']}
สไตล์: {metadata['style']}
จำนวนคำ: {metadata['word_count']} คำ
ตัวละคร: {metadata['characters']}
สถานที่: {metadata['setting']}
สร้างเมื่อ: {time.strftime("%Y-%m-%d %H:%M:%S")}

{result['story']}

---
สร้างโดย AI นักเขียนเรื่องไทย - Thai Story Writer CLI"""
            
            try:
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(story_content)
                print(f"✅ บันทึกเรื่องในไฟล์: {filename}")
            except Exception as e:
                print(f"❌ ไม่สามารถบันทึกไฟล์ได้: {str(e)}")
    else:
        print(f"\n❌ เกิดข้อผิดพลาด: {result['error']}")

def batch_mode(args):
    """Run in batch mode with command line arguments."""
    print_header()
    print("⚡ โหมดแบทช์ - สร้างเรื่องจากพารามิเตอร์")
    print("-" * 60)
    
    # Check API key
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ ข้อผิดพลาด: ไม่พบ OpenAI API Key")
        return
    
    try:
        generator = ThaiStoryGenerator()
    except Exception as e:
        print(f"❌ ไม่สามารถเริ่มต้นระบบได้: {str(e)}")
        return
    
    print(f"💭 แนวคิด: {args.prompt}")
    print(f"🎭 ประเภท: {args.genre}")
    print(f"📏 ความยาว: {args.length}")
    print(f"✍️ สไตล์: {args.style}")
    
    print("\n✨ กำลังสร้างเรื่อง...")
    
    result = generator.generate_story(
        user_prompt=args.prompt,
        genre=args.genre,
        length=args.length,
        style=args.style,
        character_names=args.characters or "",
        setting=args.setting or "",
        temperature=args.temperature
    )
    
    if result['success']:
        print("\n🎉 สร้างเรื่องสำเร็จ!")
        
        if args.output:
            # Save to file
            try:
                metadata = result['metadata']
                story_content = f"""แนวคิด: {args.prompt}
ประเภท: {metadata['genre']}
ความยาว: {metadata['length_type']}
สไตล์: {metadata['style']}
จำนวนคำ: {metadata['word_count']} คำ
ตัวละคร: {metadata['characters']}
สถานที่: {metadata['setting']}
สร้างเมื่อ: {time.strftime("%Y-%m-%d %H:%M:%S")}

{result['story']}

---
สร้างโดย AI นักเขียนเรื่องไทย - Thai Story Writer CLI"""
                
                with open(args.output, 'w', encoding='utf-8') as f:
                    f.write(story_content)
                print(f"✅ บันทึกเรื่องในไฟล์: {args.output}")
            except Exception as e:
                print(f"❌ ไม่สามารถบันทึกไฟล์ได้: {str(e)}")
        else:
            # Print to console
            print(f"\n📖 เรื่อง:")
            print("-" * 60)
            print(result['story'])
            print("-" * 60)
    else:
        print(f"\n❌ เกิดข้อผิดพลาด: {result['error']}")

def main():
    """Main CLI function."""
    # Load environment variables
    load_dotenv()
    
    parser = argparse.ArgumentParser(
        description='AI นักเขียนเรื่องไทย - Thai Story Writer CLI',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
ตัวอย่างการใช้งาน:

  # โหมดโต้ตอบ
  python cli_app.py

  # สร้างเรื่องด่วน
  python cli_app.py -p "เรื่องรักในร้านกาแฟ" -g romance -l short -s casual

  # บันทึกเป็นไฟล์
  python cli_app.py -p "ผจญภัยในป่าลึก" -g adventure -l long -o my_story.txt

  # ดูตัวเลือกทั้งหมด
  python cli_app.py --list

ประเภทเรื่อง: romance, mystery, fantasy, horror, adventure, comedy, drama, sci_fi, historical, slice_of_life
ความยาว: short, medium, long  
สไตล์: casual, formal, poetic, modern, traditional
        """
    )
    
    parser.add_argument('-p', '--prompt', help='แนวคิดเรื่อง')
    parser.add_argument('-g', '--genre', default='romance', 
                       choices=['romance', 'mystery', 'fantasy', 'horror', 'adventure', 
                               'comedy', 'drama', 'sci_fi', 'historical', 'slice_of_life'],
                       help='ประเภทเรื่อง (default: romance)')
    parser.add_argument('-l', '--length', default='medium',
                       choices=['short', 'medium', 'long'],
                       help='ความยาวเรื่อง (default: medium)')
    parser.add_argument('-s', '--style', default='casual',
                       choices=['casual', 'formal', 'poetic', 'modern', 'traditional'],
                       help='สไตล์การเขียน (default: casual)')
    parser.add_argument('-c', '--characters', help='ชื่อตัวละคร')
    parser.add_argument('-S', '--setting', help='สถานที่/ฉาก')
    parser.add_argument('-t', '--temperature', type=float, default=0.8,
                       help='ความคิดสร้างสรรค์ 0.1-1.0 (default: 0.8)')
    parser.add_argument('-o', '--output', help='ไฟล์สำหรับบันทึกเรื่อง')
    parser.add_argument('--list', action='store_true', help='แสดงตัวเลือกทั้งหมด')
    
    args = parser.parse_args()
    
    # Show options if requested
    if args.list:
        try:
            generator = ThaiStoryGenerator()
            print_header()
            print_genres(generator)
            print_lengths(generator)
            print_styles(generator)
        except:
            print("❌ ไม่สามารถแสดงตัวเลือกได้ - ตรวจสอบ API Key")
        return
    
    # Validate temperature
    if not 0.1 <= args.temperature <= 1.0:
        print("❌ ค่า temperature ต้องอยู่ระหว่าง 0.1-1.0")
        return
    
    # Run in appropriate mode
    if args.prompt:
        batch_mode(args)
    else:
        interactive_mode()

if __name__ == "__main__":
    main()