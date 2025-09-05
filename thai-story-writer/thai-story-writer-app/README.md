# Thai Story Writer

แอปพลิเคชันเขียนนิยายภาษาไทยที่สมบูรณ์แบบ พร้อมฟีเจอร์ช่วยเขียนด้วย AI, การจัดการตัวละคร, และสถิติการเขียน

## ✨ ฟีเจอร์หลัก

### 🖋️ Editor หลัก
- **Rich Text Editor** ด้วย Quill.js รองรับภาษาไทยเต็มรูปแบบ
- **Auto-save** ทุก 30 วินาที
- **Word count และ Character count** แบบ real-time
- **แบ่งตอน** จัดการ chapters ได้ง่าย
- **Keyboard shortcuts** (Ctrl+S เพื่อบันทึก)

### 👥 จัดการตัวละคร
- **สร้างตัวละคร** พร้อมรายละเอียดครบถ้วน (ชื่อ, รูปลักษณ์, บุคลิกภาพ, ประวัติ)
- **จำแนกบทบาท** (ตัวหลัก, ตัวประกอบ, ตัวร้าย)
- **แก้ไขและลบ** ตัวละครได้
- **UI ที่เป็นมิตร** ง่ายต่อการใช้งาน

### 🤖 AI Assistant
- **ช่วยต่อเรื่อง** ด้วย AI
- **พัฒนาตัวละคร** ให้มีมิติมากขึ้น
- **คิดโครงเรื่อง** และเหตุการณ์ใหม่ๆ
- **เขียนบทสนทนา** ที่เป็นธรรมชาติ
- **บรรยายฉาก** และบรรยากาศ
- **แทรกข้อความ** จาก AI เข้าในเรื่องได้ทันที

### 📊 สถิติการเขียน
- **ติดตามความก้าวหน้า** จำนวนคำเทียบกับเป้าหมาย
- **กราฟการเขียน** รายวัน
- **สถิติรวม** เวลาเขียน, จำนวนคำ
- **Writing streak** นับวันที่เขียนต่อเนื่อง

### 🎯 การจัดการเรื่อง
- **Dashboard** แสดงเรื่องทั้งหมด
- **Progress bar** แสดงความก้าวหน้า
- **สถานะเรื่อง** (ฉบับร่าง, กำลังเขียน, เสร็จสิ้น)
- **หมวดหมู่** จำแนกประเภทเรื่อง

## 🚀 การติดตั้งและใช้งาน

### ความต้องการระบบ
- Node.js 18.0+
- npm หรือ yarn

### การติดตั้ง

1. **Clone repository**
```bash
git clone <repository-url>
cd thai-story-writer-app
```

2. **ติดตั้ง dependencies**
```bash
npm install
```

3. **ตั้งค่า Environment Variables**
```bash
cp .env.example .env.local
```

แก้ไขไฟล์ `.env.local`:
```env
# OpenAI API Key สำหรับ AI Assistant
OPENAI_API_KEY=sk-your-openai-key-here

# Database URL
DATABASE_URL=./database.sqlite
```

4. **รันแอปพลิเคชัน**
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Quill** - Rich Text Editor
- **Recharts** - Charts และกราฟ

### Backend
- **Next.js API Routes** - API Endpoints
- **Better SQLite3** - Database
- **OpenAI API** - AI Assistant

### Database Schema
- **stories** - ข้อมูลเรื่อง
- **chapters** - ตอนต่างๆ ของเรื่อง
- **characters** - ตัวละคร
- **plot_points** - จุดโครงเรื่อง
- **writing_sessions** - เซสชันการเขียน
- **templates** - เทมเพลตเรื่อง

## 📝 การใช้งาน

### 1. สร้างเรื่องใหม่
- คลิก "สร้างเรื่องใหม่" ในหน้าแรก
- ใส่ชื่อเรื่อง, คำอธิบาย, หมวดหมู่, และเป้าหมายจำนวนคำ
- คลิก "สร้างเรื่อง"

### 2. เขียนเรื่อง
- เข้าไปในเรื่องที่สร้างไว้
- สร้างตอนใหม่ด้วยการคลิก "+" ข้าง "ตอน"
- เลือกตอนที่ต้องการเขียน
- ใช้ Rich Text Editor ในการเขียน
- ระบบจะ auto-save ทุก 30 วินาที

### 3. จัดการตัวละคร
- ไปที่แท็บ "ตัวละคร"
- คลิก "เพิ่มตัวละคร"
- ใส่รายละเอียดตัวละครครบถ้วน
- สามารถแก้ไขหรือลบทีหลังได้

### 4. ใช้ AI Assistant
- ไปที่แท็บ "AI Assistant"
- เลือกประเภทความช่วยเหลือ
- พิมพ์คำขอที่ต้องการ
- AI จะตอบและสามารถแทรกในเรื่องได้

### 5. ดูสถิติ
- ไปที่แท็บ "สถิติ"
- ดูความก้าวหน้าการเขียน
- ติดตามจำนวนคำและเวลาเขียนรายวัน

## 🎨 ฟอนต์ภาษาไทย

แอปพลิเคชันรองรับฟอนต์ภาษาไทยจาก Google Fonts:
- **Sarabun** - ฟอนต์หลัก
- **Kanit** - ฟอนต์รอง

## 🔧 การพัฒนาเพิ่มเติม

### เพิ่มฟีเจอร์ Export
```bash
npm install html2canvas jspdf epub-gen-memory file-saver
```

### เพิ่มการตรวจสอบไวยากรณ์
สามารถเชื่อมต่อกับ API ตรวจสอบไวยากรณ์ภาษาไทยได้

### เพิ่ม Database อื่น
ปรับเปลี่ยนจาก SQLite เป็น PostgreSQL, MySQL หรือ MongoDB ได้

## 🤝 การมีส่วนร่วม

1. Fork project นี้
2. สร้าง feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. เปิด Pull Request

## 📋 TODO List

- [ ] Export เป็น PDF, EPUB, DOC
- [ ] Share ออนไลน์
- [ ] Template เรื่องเพิ่มเติม
- [ ] การตรวจสอบไวยากรณ์
- [ ] Dark mode
- [ ] Mobile responsive สมบูรณ์
- [ ] Collaborative writing
- [ ] Version control สำหรับเรื่อง

## 🐛 รายงานปัญหา

หากพบปัญหาการใช้งาน กรุณา:
1. ตรวจสอบ Console สำหรับ error messages
2. ตรวจสอบการตั้งค่า environment variables
3. ลองล้าง browser cache
4. เปิด issue ใหม่พร้อมรายละเอียดปัญหา

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ

## 👨‍💻 ผู้พัฒนา

พัฒนาโดย Claude Code สำหรับนักเขียนภาษาไทย

---

**Happy Writing! 📚✨**

เริ่มต้นเขียนนิยายภาษาไทยของคุณกับ Thai Story Writer ได้เลย!