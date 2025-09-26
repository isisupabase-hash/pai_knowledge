import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Configura tus secrets
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Carpeta donde están los MDX
const knowledgePath = path.join(process.cwd(), 'knowledge/tomos');

async function processFiles() {
  const files = fs.readdirSync(knowledgePath).filter(f => f.endsWith('.mdx'));

  for (const file of files) {
    const filePath = path.join(knowledgePath, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data: metadata, content } = matter(raw);

    // Generar embedding
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small', // o 'text-embedding-ada-002'
      input: content,
    });

    const embedding = embeddingResponse.data[0].embedding;

    // Insertar en Supabase
    const { error } = await supabase.from('pai_documents').upsert({
      content,
      embedding,
      metadata,
    });

    if (error) {
      console.error('Error insertando:', file, error);
    } else {
      console.log('Insertado:', file);
    }
  }
}

processFiles().catch(console.error);
