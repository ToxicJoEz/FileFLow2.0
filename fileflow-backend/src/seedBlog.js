import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from './models/Post.js';

dotenv.config();

const posts = [
  { 
    slug: 'fileflow-v0-9',
    category: 'product',
    title: 'FileFlow v0.9 — Regex search, faster engine, and new file formats',
    excerpt: 'Our biggest update since launch. Sub-100ms multi-folder search and native support for .epub and .ods files.',
    content: `Today we're shipping FileFlow v0.9 — our biggest update since launch. This release focuses on three things: more powerful search modes, a significantly faster engine, and broader file format support.

## What's new in v0.9

### Regex & Boolean search
You can now use regular expressions directly in the search bar. Wrap your query in forward slashes to activate regex mode:
\`\`\`
/quarterly.{0,20}revenue/i
\`\`\`

Boolean operators also work as expected. Use \`AND\`, \`OR\`, and \`NOT\` to build complex queries:
\`\`\`
"invoice" AND ("2024" OR "2025") NOT "draft"
\`\`\`

### 40% faster search engine
We rewrote the core file-reading pipeline in Cython and switched to parallel processing for multi-folder searches. On a test set of 50,000 mixed documents, average search time dropped from 140ms to 82ms.

> Our goal is sub-50ms on any consumer-grade Windows PC for collections up to 100,000 files. We're not there yet, but v0.9 gets us closer.

### 8 new file formats
FileFlow now reads inside: \`.epub\`, \`.ods\`, \`.odt\`, \`.odp\`, \`.pages\`, \`.numbers\`, \`.key\`, and \`.msg\` (Outlook email exports).

## How to update
If you have auto-update enabled, FileFlow will prompt you on next launch. Otherwise, download the installer from your dashboard or from the beta page. Your settings and search history are preserved.

As always, your files never leave your machine. The update is distributed as a signed Windows installer — no cloud sync, no telemetry changes.`,
    readTime: 7,
    status: 'published',
    views: 1204
  },
  { 
    slug: '5-search-habits',
    category: 'tutorial',
    title: '5 search habits that will save you hours every week',
    excerpt: 'Stop clicking through folders. Learn how to use exact matches and exclusion filters to find anything instantly.',
    content: 'Stop clicking through folders. Learn how to use exact matches and exclusion filters to find anything instantly.',
    readTime: 4,
    status: 'published',
    views: 890
  },
  { 
    slug: 'electron-python-stack',
    category: 'build',
    title: 'Why we chose Electron + Python for the desktop app',
    excerpt: 'A deep dive into our tech stack. The trade-offs of embedding a local Python engine inside an Electron shell.',
    content: 'A deep dive into our tech stack. The trade-offs of embedding a local Python engine inside an Electron shell.',
    readTime: 12,
    status: 'published',
    views: 1540
  },
  { 
    slug: 'offline-means-offline',
    category: 'product',
    title: 'What "100% offline" actually means in FileFlow',
    excerpt: 'We don\'t use cloud processing. We don\'t train AI on your documents. A breakdown of our local-first security model.',
    content: 'We don\'t use cloud processing. We don\'t train AI on your documents. A breakdown of our local-first security model.',
    readTime: 3,
    status: 'published',
    views: 2310
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await Post.deleteMany();
    await Post.insertMany(posts);
    console.log('Posts seeded successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
