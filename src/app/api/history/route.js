import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const HISTORY_FILE = path.join(process.cwd(), 'src', 'data', 'history.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'history');

// Helper to save base64 image to file
async function saveBase64Image(base64Data, id) {
  if (!base64Data || typeof base64Data !== 'string' || !base64Data.startsWith('data:image')) {
    return base64Data;
  }

  try {
    // Ensure directory exists
    try {
      await fs.access(UPLOADS_DIR);
    } catch {
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
    }

    const matches = base64Data.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64Data;
    }

    const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const data = Buffer.from(matches[2], 'base64');
    const filename = `ref-${id}-${Date.now()}-${Math.floor(Math.random() * 1000)}.${extension}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    await fs.writeFile(filePath, data);
    return `/uploads/history/${filename}`;
  } catch (error) {
    console.error('Failed to save base64 image:', error);
    return base64Data;
  }
}

export async function GET() {
  try {
    const data = await fs.readFile(HISTORY_FILE, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Failed to read history file:', error);
    return NextResponse.json([], { status: 200 }); // Return empty if error (e.g. file missing)
  }
}

export async function POST(request) {
  try {
    const newItem = await request.json();

    // Process reference images if they are base64
    if (newItem.referenceImages && Array.isArray(newItem.referenceImages)) {
      const processedRefs = await Promise.all(
        newItem.referenceImages.map((ref, idx) =>
          typeof ref === 'string' ? saveBase64Image(ref, `${newItem.id}-${idx}`) : ref
        )
      );
      newItem.referenceImages = processedRefs;
    }

    // Read existing
    let history = [];
    try {
      const data = await fs.readFile(HISTORY_FILE, 'utf8');
      history = JSON.parse(data);
    } catch (e) {
      // File might not exist yet
    }

    // Append at the beginning (newest first)
    history.unshift(newItem);

    // Write back
    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Failed to save history item:', error);
    return NextResponse.json({ error: 'Failed to save history' }, { status: 500 });
  }
}
