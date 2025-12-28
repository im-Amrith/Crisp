import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

async function listModels() {
  if (!API_KEY) {
    console.error('API key not found');
    return;
  }
  const genAI = new GoogleGenerativeAI(API_KEY);
  try {
    // The SDK might not have a direct listModels on genAI, 
    // but we can try to fetch it or just use a known one.
    // Actually, let's just try a few common ones.
    console.log('Testing gemini-1.5-flash...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('test');
    console.log('gemini-1.5-flash works');
  } catch (e) {
    console.error('gemini-1.5-flash failed:', e.message);
  }
}

listModels();
