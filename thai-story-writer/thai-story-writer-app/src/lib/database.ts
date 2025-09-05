import Database from 'better-sqlite3';
import path from 'path';

// Initialize database
const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    genre TEXT,
    target_word_count INTEGER DEFAULT 0,
    current_word_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    word_count INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    appearance TEXT,
    personality TEXT,
    background TEXT,
    role TEXT DEFAULT 'supporting',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS plot_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'event',
    order_index INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS writing_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER NOT NULL,
    words_written INTEGER DEFAULT 0,
    session_duration INTEGER DEFAULT 0,
    date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert default templates
const insertTemplate = db.prepare(`
  INSERT OR IGNORE INTO templates (name, description, category, content)
  VALUES (?, ?, ?, ?)
`);

const templates = [
  {
    name: 'เรื่องสั้นโรแมนติก',
    description: 'เทมเพลตสำหรับเขียนเรื่องสั้นแนวโรแมนติก',
    category: 'romance',
    content: `บทที่ 1: การพบกัน
- แนะนำตัวละครหลัก
- สถานการณ์ที่พาให้พบกัน
- ความประทับใจแรกพบ

บทที่ 2: การรู้จักกัน
- การสื่อสารและเรียนรู้ซึ่งกันและกัน
- อุปสรรคเบื้องต้น
- ความรู้สึกที่เริ่มเปลี่ยนแปลง

บทที่ 3: ความรัก
- การยอมรับความรู้สึก
- การแก้ไขปัญหาร่วมกัน
- จบลงด้วยความสุข`
  },
  {
    name: 'นิยายผจญภัย',
    description: 'เทมเพลตสำหรับนิยายแนวผจญภัย',
    category: 'adventure',
    content: `บทที่ 1: จุดเริ่มต้น
- แนะนำโลกและตัวละคร
- เหตุการณ์ที่เรียกให้เดินทาง
- การเตรียมพร้อม

บทที่ 2: การเดินทาง
- อุปสรรคแรก
- การเรียนรู้ทักษะใหม่
- พบเพื่อนร่วมทาง

บทที่ 3: วิกฤต
- ความท้าทายใหญ่
- การสูญเสีย
- การเติบโตของตัวละคร

บทที่ 4: การกลับ
- การเอาชนะอุปสรรคสุดท้าย
- การเปลี่ยนแปลงของตัวละคร
- การกลับสู่บ้าน`
  }
];

templates.forEach(template => {
  insertTemplate.run(template.name, template.description, template.category, template.content);
});

export default db;

// Database helper functions
export class StoryDB {
  static getAllStories() {
    return db.prepare('SELECT * FROM stories ORDER BY updated_at DESC').all();
  }

  static getStoryById(id: number) {
    return db.prepare('SELECT * FROM stories WHERE id = ?').get(id);
  }

  static createStory(data: { title: string; description?: string; genre?: string; target_word_count?: number }) {
    const stmt = db.prepare(`
      INSERT INTO stories (title, description, genre, target_word_count)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(data.title, data.description || '', data.genre || '', data.target_word_count || 0);
  }

  static updateStory(id: number, data: any) {
    const fields = Object.keys(data).filter(key => key !== 'id');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => data[field]);
    
    const stmt = db.prepare(`
      UPDATE stories SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(...values, id);
  }

  static deleteStory(id: number) {
    return db.prepare('DELETE FROM stories WHERE id = ?').run(id);
  }
}

export class ChapterDB {
  static getChaptersByStoryId(storyId: number) {
    return db.prepare('SELECT * FROM chapters WHERE story_id = ? ORDER BY order_index').all(storyId);
  }

  static getChapterById(id: number) {
    return db.prepare('SELECT * FROM chapters WHERE id = ?').get(id);
  }

  static createChapter(data: { story_id: number; title: string; content?: string; order_index: number }) {
    const stmt = db.prepare(`
      INSERT INTO chapters (story_id, title, content, order_index, word_count)
      VALUES (?, ?, ?, ?, ?)
    `);
    const wordCount = data.content ? data.content.split(/\s+/).length : 0;
    return stmt.run(data.story_id, data.title, data.content || '', data.order_index, wordCount);
  }

  static updateChapter(id: number, data: any) {
    if (data.content) {
      data.word_count = data.content.split(/\s+/).length;
    }
    
    const fields = Object.keys(data).filter(key => key !== 'id');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => data[field]);
    
    const stmt = db.prepare(`
      UPDATE chapters SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(...values, id);
  }

  static deleteChapter(id: number) {
    return db.prepare('DELETE FROM chapters WHERE id = ?').run(id);
  }
}

export class CharacterDB {
  static getCharactersByStoryId(storyId: number) {
    return db.prepare('SELECT * FROM characters WHERE story_id = ? ORDER BY created_at').all(storyId);
  }

  static createCharacter(data: { 
    story_id: number; 
    name: string; 
    description?: string;
    appearance?: string;
    personality?: string;
    background?: string;
    role?: string;
  }) {
    const stmt = db.prepare(`
      INSERT INTO characters (story_id, name, description, appearance, personality, background, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.story_id, 
      data.name, 
      data.description || '', 
      data.appearance || '',
      data.personality || '',
      data.background || '',
      data.role || 'supporting'
    );
  }

  static updateCharacter(id: number, data: any) {
    const fields = Object.keys(data).filter(key => key !== 'id');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => data[field]);
    
    const stmt = db.prepare(`
      UPDATE characters SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(...values, id);
  }

  static deleteCharacter(id: number) {
    return db.prepare('DELETE FROM characters WHERE id = ?').run(id);
  }
}

export class PlotDB {
  static getPlotPointsByStoryId(storyId: number) {
    return db.prepare('SELECT * FROM plot_points WHERE story_id = ? ORDER BY order_index').all(storyId);
  }

  static createPlotPoint(data: {
    story_id: number;
    title: string;
    description?: string;
    type?: string;
    order_index: number;
  }) {
    const stmt = db.prepare(`
      INSERT INTO plot_points (story_id, title, description, type, order_index)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(data.story_id, data.title, data.description || '', data.type || 'event', data.order_index);
  }

  static updatePlotPoint(id: number, data: any) {
    const fields = Object.keys(data).filter(key => key !== 'id');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => data[field]);
    
    const stmt = db.prepare(`
      UPDATE plot_points SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(...values, id);
  }

  static deletePlotPoint(id: number) {
    return db.prepare('DELETE FROM plot_points WHERE id = ?').run(id);
  }
}

export class StatisticsDB {
  static addWritingSession(data: { story_id: number; words_written: number; session_duration: number; date: string }) {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO writing_sessions (story_id, words_written, session_duration, date)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(data.story_id, data.words_written, data.session_duration, data.date);
  }

  static getWritingSessions(storyId: number, days: number = 30) {
    return db.prepare(`
      SELECT * FROM writing_sessions 
      WHERE story_id = ? AND date >= date('now', '-${days} days')
      ORDER BY date DESC
    `).all(storyId);
  }

  static getWritingStats(storyId: number) {
    return db.prepare(`
      SELECT 
        SUM(words_written) as total_words,
        SUM(session_duration) as total_time,
        COUNT(*) as session_count,
        AVG(words_written) as avg_words_per_session
      FROM writing_sessions 
      WHERE story_id = ?
    `).get(storyId);
  }
}

export class TemplateDB {
  static getAllTemplates() {
    return db.prepare('SELECT * FROM templates ORDER BY category, name').all();
  }

  static getTemplatesByCategory(category: string) {
    return db.prepare('SELECT * FROM templates WHERE category = ?').all(category);
  }
}