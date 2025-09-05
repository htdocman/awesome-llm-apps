import streamlit as st
import os
from dotenv import load_dotenv
from story_generator import ThaiStoryGenerator
import time

# Load environment variables
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="AI นักเขียนเรื่องไทย - Thai Story Writer",
    page_icon="📚",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Thai fonts and better styling
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
    
    .main-title {
        font-family: 'Sarabun', sans-serif;
        color: #2E86AB;
        text-align: center;
        font-size: 3em;
        font-weight: 700;
        margin-bottom: 0.5em;
    }
    
    .subtitle {
        font-family: 'Sarabun', sans-serif;
        text-align: center;
        color: #666;
        font-size: 1.2em;
        margin-bottom: 2em;
    }
    
    .story-container {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 2rem;
        border-radius: 15px;
        margin: 1rem 0;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .story-text {
        font-family: 'Sarabun', sans-serif;
        font-size: 1.1em;
        line-height: 1.8;
        color: #333;
        text-align: justify;
        text-indent: 2em;
    }
    
    .metadata-container {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 10px;
        border-left: 4px solid #2E86AB;
        margin: 1rem 0;
    }
    
    .stTextArea textarea {
        font-family: 'Sarabun', sans-serif;
        font-size: 1em;
    }
    
    .stSelectbox label, .stTextInput label {
        font-family: 'Sarabun', sans-serif;
        font-weight: 500;
    }
</style>
""", unsafe_allow_html=True)

def initialize_session_state():
    """Initialize session state variables."""
    if 'story_generator' not in st.session_state:
        st.session_state.story_generator = None
    if 'generated_story' not in st.session_state:
        st.session_state.generated_story = None
    if 'story_history' not in st.session_state:
        st.session_state.story_history = []

def check_api_key():
    """Check if OpenAI API key is configured."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        st.error("🔑 กรุณากำหนด OpenAI API Key ใน environment variables หรือไฟล์ .env")
        st.info("วิธีการตั้งค่า API Key:\n1. สร้างไฟล์ .env ในโฟลเดอร์โปรเจค\n2. เพิ่ม OPENAI_API_KEY=your_api_key_here")
        return False
    return True

def main():
    """Main application function."""
    
    # Initialize session state
    initialize_session_state()
    
    # Main title
    st.markdown('<h1 class="main-title">📚 AI นักเขียนเรื่องไทย</h1>', unsafe_allow_html=True)
    st.markdown('<p class="subtitle">สร้างสรรค์เรื่องราวภาษาไทยด้วย AI 🤖</p>', unsafe_allow_html=True)
    
    # Check API key
    if not check_api_key():
        return
    
    # Initialize story generator
    if st.session_state.story_generator is None:
        try:
            st.session_state.story_generator = ThaiStoryGenerator()
        except Exception as e:
            st.error(f"ไม่สามารถเริ่มต้นระบบได้: {str(e)}")
            return
    
    generator = st.session_state.story_generator
    
    # Sidebar for settings
    with st.sidebar:
        st.header("⚙️ การตั้งค่า")
        
        # Genre selection
        st.subheader("🎭 ประเภทเรื่อง")
        genres = generator.get_available_genres()
        selected_genre = st.selectbox(
            "เลือกประเภทเรื่อง:",
            options=list(genres.keys()),
            format_func=lambda x: genres[x],
            key="genre_select"
        )
        
        # Show suggestions for selected genre
        with st.expander("💡 ไอเดียเรื่องสำหรับประเภทนี้"):
            suggestions = generator.get_story_suggestions(selected_genre)
            for i, suggestion in enumerate(suggestions, 1):
                st.write(f"{i}. {suggestion}")
        
        st.divider()
        
        # Story length
        st.subheader("📏 ความยาวเรื่อง")
        lengths = generator.get_available_lengths()
        selected_length = st.selectbox(
            "เลือกความยาว:",
            options=list(lengths.keys()),
            format_func=lambda x: f"{lengths[x]['name']} ({lengths[x]['words']} คำ)",
            key="length_select"
        )
        
        st.divider()
        
        # Writing style
        st.subheader("✍️ สไตล์การเขียน")
        styles = generator.get_available_styles()
        selected_style = st.selectbox(
            "เลือกสไตล์:",
            options=list(styles.keys()),
            format_func=lambda x: styles[x],
            key="style_select"
        )
        
        st.divider()
        
        # Advanced settings
        with st.expander("🔧 การตั้งค่าขั้นสูง"):
            temperature = st.slider(
                "ความคิดสร้างสรรค์ (Temperature):",
                min_value=0.1,
                max_value=1.0,
                value=0.8,
                step=0.1,
                help="ค่าสูง = เรื่องแปลกใหม่มาก, ค่าต่ำ = เรื่องปกติธรรมดา"
            )
    
    # Main content area
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.subheader("📝 เขียนเรื่องของคุณ")
        
        # Story prompt input
        story_prompt = st.text_area(
            "บอกเล่าแนวคิดเรื่องของคุณ:",
            height=150,
            placeholder="ตัวอย่าง: เรื่องราวของเด็กสาวที่ได้พบกับหนังสือวิเศษในห้องสมุดเก่า...",
            help="ใส่แนวคิด หัวข้อ หรือเค้าโครงเรื่องที่คุณต้องการให้ AI เขียน"
        )
        
        # Optional inputs
        col_char, col_setting = st.columns(2)
        
        with col_char:
            character_names = st.text_input(
                "ชื่อตัวละคร (ไม่บังคับ):",
                placeholder="เช่น นิรา, สมชาย",
                help="ระบุชื่อตัวละครที่ต้องการให้ใช้ในเรื่อง"
            )
        
        with col_setting:
            setting = st.text_input(
                "สถานที่/ฉาก (ไม่บังคับ):",
                placeholder="เช่น กรุงเทพฯ, โรงเรียนเก่า",
                help="ระบุสถานที่หรือฉากที่ต้องการ"
            )
        
        # Generate button
        col_btn, col_clear = st.columns([1, 1])
        
        with col_btn:
            if st.button("🎨 สร้างเรื่อง", type="primary", use_container_width=True):
                if story_prompt.strip():
                    with st.spinner("กำลังเขียนเรื่อง... ✨"):
                        result = generator.generate_story(
                            user_prompt=story_prompt,
                            genre=selected_genre,
                            length=selected_length,
                            style=selected_style,
                            character_names=character_names,
                            setting=setting,
                            temperature=temperature
                        )
                        
                        st.session_state.generated_story = result
                        
                        # Add to history
                        if result['success']:
                            st.session_state.story_history.append({
                                'prompt': story_prompt[:100] + "..." if len(story_prompt) > 100 else story_prompt,
                                'genre': genres[selected_genre],
                                'timestamp': time.strftime("%Y-%m-%d %H:%M:%S"),
                                'story': result['story'],
                                'metadata': result['metadata']
                            })
                else:
                    st.warning("กรุณากรอกแนวคิดเรื่องก่อนสร้าง")
        
        with col_clear:
            if st.button("🗑️ ล้างข้อมูล", use_container_width=True):
                st.session_state.generated_story = None
                st.rerun()
    
    with col2:
        st.subheader("📊 สถิติการใช้งาน")
        
        # Display usage statistics
        story_count = len(st.session_state.story_history)
        st.metric("เรื่องที่สร้างแล้ว", story_count)
        
        if story_count > 0:
            # Genre distribution
            genre_counts = {}
            for story in st.session_state.story_history:
                genre = story['genre']
                genre_counts[genre] = genre_counts.get(genre, 0) + 1
            
            st.write("**ประเภทเรื่องที่นิยม:**")
            for genre, count in sorted(genre_counts.items(), key=lambda x: x[1], reverse=True):
                st.write(f"• {genre}: {count} เรื่อง")
        
        st.divider()
        
        # Story history
        if st.session_state.story_history:
            st.subheader("📚 ประวัติเรื่องที่สร้าง")
            for i, story in enumerate(reversed(st.session_state.story_history[-5:]), 1):
                with st.expander(f"{story['genre']} - {story['timestamp'][:10]}"):
                    st.write(f"**แนวคิด:** {story['prompt']}")
                    if st.button(f"ดูเรื่องนี้", key=f"view_story_{len(st.session_state.story_history)-i}"):
                        st.session_state.generated_story = {
                            'success': True,
                            'story': story['story'],
                            'metadata': story['metadata']
                        }
                        st.rerun()
    
    # Display generated story
    if st.session_state.generated_story:
        result = st.session_state.generated_story
        
        if result['success']:
            st.markdown("---")
            st.subheader("📖 เรื่องที่สร้างใหม่")
            
            # Story metadata
            metadata = result['metadata']
            st.markdown(f"""
            <div class="metadata-container">
                <strong>📊 ข้อมูลเรื่อง:</strong><br>
                🎭 ประเภท: {metadata['genre']}<br>
                📏 ความยาว: {metadata['length_type']}<br>
                ✍️ สไตล์: {metadata['style']}<br>
                📝 จำนวนคำ: {metadata['word_count']} คำ<br>
                👥 ตัวละคร: {metadata['characters']}<br>
                🏞️ สถานที่: {metadata['setting']}
            </div>
            """, unsafe_allow_html=True)
            
            # The story itself
            st.markdown(f"""
            <div class="story-container">
                <div class="story-text">
                    {result['story'].replace('\n\n', '</p><p>').replace('\n', '<br>')}
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            # Action buttons
            col1, col2, col3 = st.columns(3)
            
            with col1:
                if st.button("📋 คัดลอกเรื่อง", use_container_width=True):
                    st.code(result['story'], language=None)
                    st.success("คัดลอกเรื่องได้จากกล่องด้านบน")
            
            with col2:
                # Download as text file
                story_text = f"""เรื่อง: {story_prompt[:50]}...
ประเภท: {metadata['genre']}
ความยาว: {metadata['length_type']}
สไตล์: {metadata['style']}
สร้างเมื่อ: {time.strftime("%Y-%m-%d %H:%M:%S")}

{result['story']}

---
สร้างโดย AI นักเขียนเรื่องไทย"""
                
                st.download_button(
                    label="💾 ดาวน์โหลดเรื่อง",
                    data=story_text,
                    file_name=f"thai_story_{int(time.time())}.txt",
                    mime="text/plain",
                    use_container_width=True
                )
            
            with col3:
                if st.button("🔄 สร้างเรื่องใหม่", use_container_width=True):
                    if story_prompt.strip():
                        with st.spinner("กำลังสร้างเรื่องใหม่... ✨"):
                            new_result = generator.generate_story(
                                user_prompt=story_prompt,
                                genre=selected_genre,
                                length=selected_length,
                                style=selected_style,
                                character_names=character_names,
                                setting=setting,
                                temperature=temperature
                            )
                            st.session_state.generated_story = new_result
                            st.rerun()
        else:
            st.error(f"❌ {result['error']}")
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style='text-align: center; color: #666; font-family: Sarabun;'>
        <p>🤖 AI นักเขียนเรื่องไทย - สร้างด้วย OpenAI GPT-4o และ Streamlit</p>
        <p>💡 เคล็ดลับ: ลองใช้แนวคิดที่แตกต่างกันและปรับการตั้งค่าเพื่อผลลัพธ์ที่หลากหลาย</p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()