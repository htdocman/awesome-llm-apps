from openai import OpenAI
import os
from typing import Dict, List
import tiktoken

class ThaiStoryGenerator:
    def __init__(self):
        """Initialize the Thai Story Generator with OpenAI API."""
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.encoding = tiktoken.get_encoding("cl100k_base")
        
        # Define genres in Thai with English keys for internal use
        self.genres = {
            "romance": "โรแมนติก",
            "mystery": "สืบสวนสอบสวน",
            "fantasy": "แฟนตาซี",
            "horror": "สยองขวัญ",
            "adventure": "ผจญภัย",
            "comedy": "ตลกขบขัน",
            "drama": "ดราม่า",
            "sci_fi": "วิทยาศาสตร์",
            "historical": "ประวัติศาสตร์",
            "slice_of_life": "ชีวิตประจำวัน"
        }
        
        # Story length options
        self.story_lengths = {
            "short": {"name": "เรื่องสั้น", "words": "300-500", "description": "เรื่องสั้นกระชับ"},
            "medium": {"name": "เรื่องกลาง", "words": "800-1200", "description": "เรื่องความยาวปานกลาง"},
            "long": {"name": "เรื่องยาว", "words": "1500-2500", "description": "เรื่องยาวละเอียด"}
        }
        
        # Writing styles
        self.writing_styles = {
            "casual": "สไตล์สบายๆ เข้าใจง่าย",
            "formal": "สไตล์เป็นทางการ สุภาพ",
            "poetic": "สไตล์บทกวี มีความงาม",
            "modern": "สไตล์สมัยใหม่ ทันสมัย",
            "traditional": "สไตล์ดั้งเดิม คลาสสิก"
        }

    def count_tokens(self, text: str) -> int:
        """Count tokens in text."""
        return len(self.encoding.encode(text))

    def create_story_prompt(self, user_prompt: str, genre: str, length: str, style: str, 
                          character_names: str = "", setting: str = "") -> str:
        """Create a comprehensive prompt for story generation."""
        
        genre_thai = self.genres.get(genre, "ทั่วไป")
        length_info = self.story_lengths.get(length, self.story_lengths["medium"])
        style_info = self.writing_styles.get(style, "สไตล์สบายๆ เข้าใจง่าย")
        
        prompt = f"""คุณคือนักเขียนนิยายภาษาไทยที่มีความเชี่ยวชาญสูง โปรดเขียนเรื่องตามข้อมูลที่กำหนด:

หัวข้อเรื่อง/แนวคิด: {user_prompt}
ประเภท: {genre_thai}
ความยาว: {length_info['name']} ({length_info['words']} คำ)
สไตล์การเขียน: {style_info}
"""
        
        if character_names:
            prompt += f"ชื่อตัวละคร: {character_names}\n"
        
        if setting:
            prompt += f"ฉากหรือสถานที่: {setting}\n"
        
        prompt += """
กรุณาเขียนเรื่องที่:
1. มีโครงเรื่องที่สมบูรณ์ มีต้น กลาง จบ
2. ตัวละครมีมิติ น่าสนใจ
3. ใช้ภาษาไทยที่ถูกต้อง สวยงาม
4. เหมาะสมกับประเภทที่กำหนด
5. สร้างอารมณ์และความรู้สึกให้ผู้อ่าน
6. มีรายละเอียดที่ชัดเจนและน่าติดตาม

เริ่มเขียนเรื่องเลย ไม่ต้องมีคำอธิบายเพิ่มเติม:"""
        
        return prompt

    def generate_story(self, user_prompt: str, genre: str = "romance", 
                      length: str = "medium", style: str = "casual",
                      character_names: str = "", setting: str = "",
                      temperature: float = 0.8) -> Dict:
        """Generate a Thai story based on user input."""
        
        try:
            # Create the prompt
            system_prompt = self.create_story_prompt(
                user_prompt, genre, length, style, character_names, setting
            )
            
            # Determine max tokens based on length
            max_tokens_map = {
                "short": 800,
                "medium": 1500,
                "long": 2500
            }
            max_tokens = max_tokens_map.get(length, 1500)
            
            # Generate the story
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "คุณคือนักเขียนนิยายภาษาไทยมืออาชีพ เขียนเรื่องสั้นได้อย่างเชี่ยวชาญ"},
                    {"role": "user", "content": system_prompt}
                ],
                max_tokens=max_tokens,
                temperature=temperature,
                top_p=0.9,
                frequency_penalty=0.1,
                presence_penalty=0.1
            )
            
            story_content = response.choices[0].message.content
            
            # Calculate story statistics
            word_count = len(story_content.split())
            token_count = self.count_tokens(story_content)
            
            return {
                "success": True,
                "story": story_content,
                "metadata": {
                    "genre": self.genres.get(genre, "ทั่วไป"),
                    "length_type": self.story_lengths[length]["name"],
                    "style": self.writing_styles[style],
                    "word_count": word_count,
                    "token_count": token_count,
                    "characters": character_names if character_names else "ไม่ระบุ",
                    "setting": setting if setting else "ไม่ระบุ"
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"เกิดข้อผิดพลาด: {str(e)}",
                "story": None,
                "metadata": None
            }

    def get_story_suggestions(self, genre: str) -> List[str]:
        """Get story prompt suggestions based on genre."""
        suggestions = {
            "romance": [
                "เรื่องรักระหว่างเชฟหนุ่มกับนักเขียนสาว",
                "ความรักที่เกิดขึ้นในร้านหนังสือเก่า",
                "เรื่องรักข้ามเวลาระหว่างอดีตและปัจจุบัน",
                "ความรักในวัยเรียนที่กลับมาพบกันใหม่"
            ],
            "mystery": [
                "คดีฆาตกรรมในโรงแรมเก่าแก่",
                "การหายตัวไปของภาพวาดมีค่า",
                "ความลับที่ซ่อนอยู่ในบ้านเก่า",
                "คดีปริศนาในเมืองเก่า"
            ],
            "fantasy": [
                "การผจญภัยในดินแดนแห่งมนต์",
                "เรื่องราวของนักรบและมังกร",
                "ความลับของป่าเวทมนตร์",
                "การต่อสู้เพื่อปกป้องโลก"
            ],
            "horror": [
                "เรื่องผีในหอพักเก่า",
                "บ้านร้างที่มีความลับน่ากลัว",
                "วิญญาณแค้นในโรงพยาบาลเก่า",
                "คำสาปที่ตามหลอกหลอน"
            ],
            "adventure": [
                "การเดินทางค้นหาสมบัติที่สาบสูญ",
                "การผจญภัยในเกาะลึกลับ",
                "การเดินทางข้ามทวีป",
                "การสำรวจถ้ำลึกลับ"
            ],
            "comedy": [
                "เหตุการณ์ตลกในออฟฟิศ",
                "ความผิดพลาดที่นำมาซึ่งความสนุก",
                "เรื่องราวของครอบครีวงานใหญ่",
                "การเข้าใจผิดที่ตลกขบขัน"
            ],
            "drama": [
                "เรื่องราวของครอบครัวที่แตกแยก",
                "การต่อสู้เพื่อความฝัน",
                "ความสัมพันธ์ที่ซับซ้อน",
                "การเอาชนะอุปสรรคในชีวิต"
            ],
            "sci_fi": [
                "การเดินทางข้ามเวลา",
                "ชีวิตในอนาคตอันไกล",
                "การพบเจอกับมนุษย์ต่างดาว",
                "เทคโนโลยีที่เปลี่ยนโลก"
            ],
            "historical": [
                "เรื่องราวในสมัยอยุธยา",
                "ความรักในสงครามโลก",
                "การต่อสู้เพื่อเอกราช",
                "ชีวิตในอดีตกาล"
            ],
            "slice_of_life": [
                "เรื่องราวในชีวิตประจำวันของครอบครัว",
                "ความสัมพันธ์ระหว่างเพื่อนบ้าน",
                "การเติบโตของวัยรุ่น",
                "ชีวิตคนทำงานในเมืองใหญ่"
            ]
        }
        return suggestions.get(genre, ["เรื่องทั่วไปที่น่าสนใจ"])

    def get_available_genres(self) -> Dict[str, str]:
        """Get available genres."""
        return self.genres

    def get_available_lengths(self) -> Dict:
        """Get available story lengths."""
        return self.story_lengths

    def get_available_styles(self) -> Dict:
        """Get available writing styles."""
        return self.writing_styles