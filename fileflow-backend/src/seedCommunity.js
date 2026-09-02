import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Topic from './models/Topic.js';
import Reply from './models/Reply.js';
import User from './models/User.js';

dotenv.config({ path: './.env' });

const topicsData = [
  {
    title: 'Welcome to the FileFlow Community! Start here 👋',
    content: 'Welcome to the official FileFlow community forums!\n\nThis is the place to share tips, report bugs, ask for help, and request new features.\n\n**Quick Rules:**\n1. Use the search bar before posting to avoid duplicates.\n2. Be respectful to everyone.\n3. Include your OS version if you are reporting a bug.\n\nHappy searching!',
    category: 'general',
    isPinned: true,
    views: 4520,
    upvoteCount: 4,
    replies: [
      { content: 'Glad to be here! Looking forward to the updates.', upvotes: 2 },
      { content: 'Great platform! FileFlow changed my life.', upvotes: 1 }
    ]
  },
  {
    title: 'FileFlow 2.0 Roadmap & Upcoming Features',
    content: 'Here is what we are working on for the upcoming v2.0 release:\n\n- Full OCR for scanned PDFs (finally!)\n- Exporting search results to CSV/JSON\n- Custom UI themes\n- EPUB and Markdown syntax highlighting\n\nLet us know what you want prioritized!',
    category: 'general',
    isPinned: true,
    views: 8900,
    upvoteCount: 5,
    replies: [
      { content: 'Please prioritize CSV export! I need it for auditing.', upvotes: 3 },
      { content: 'OCR is a game changer. Cannot wait!', upvotes: 4 },
      { content: 'Will the custom themes support AMOLED black?', upvotes: 0 }
    ]
  },
  {
    title: 'Cheat Sheet: Useful Regex Patterns for FileFlow',
    content: 'I compiled a list of regex patterns I use daily. Hope it helps someone!\n\n- **Emails**: `/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/`\n- **IP Addresses**: `/\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b/`\n- **Dates (YYYY-MM-DD)**: `/\\d{4}-\\d{2}-\\d{2}/`\n- **Credit Cards**: `/\\b(?:\\d[ -]*?){13,16}\\b/`\n\nDrop your favorites below!',
    category: 'tips',
    views: 1205,
    upvoteCount: 5,
    replies: [
      { content: 'Awesome list. I use the email one all the time.', upvotes: 1 },
      { content: 'Here is one for UUIDs: `/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/`', upvotes: 3 }
    ]
  },
  {
    title: 'Bug: High CPU usage during initial indexing on Windows 11',
    content: 'I just installed FileFlow on a fresh Windows 11 machine. Added my 150GB documents folder, and FileFlow is sitting at 99% CPU for the last 20 minutes. Is this normal? Fans are spinning like crazy.',
    category: 'bugs',
    views: 412,
    upvoteCount: 2,
    replies: [
      { content: 'It is normal for the first run if you have 150GB of PDFs. It creates a local index.', upvotes: 1 },
      { content: 'Actually, check if you have a lot of large zip files. Sometimes the extractor gets stuck.', upvotes: 2 },
      { content: 'I had the same issue. It calmed down after 30 mins and now searches are instant.', upvotes: 0 }
    ]
  },
  {
    title: 'Feature Request: Export search results to CSV / Excel',
    content: 'I often need to send audit reports to my manager showing exactly which files contain certain keywords. Right now I am taking screenshots of FileFlow. Can we get a button to export the results table to CSV?',
    category: 'features',
    views: 890,
    upvoteCount: 4,
    replies: [
      { content: 'I need this too! Upvoted.', upvotes: 1 },
      { content: 'This is planned for v2.0! See the roadmap post.', upvotes: 3 }
    ]
  },
  {
    title: 'How do I exclude node_modules from my searches?',
    content: 'I am a developer and I pointed FileFlow at my workspace. Now my results are flooded with `.js` files from `node_modules`. How do I globally ignore this folder?',
    category: 'help',
    views: 334,
    upvoteCount: 2,
    replies: [
      { content: 'Go to Settings -> Search Filters -> Add Excluded Path, and type `**/node_modules/**`', upvotes: 4 },
      { content: 'Thank you!! This saved my sanity.', upvotes: 0 }
    ]
  },
  {
    title: 'FileFlow saved me 4 hours of manual auditing today',
    content: 'Just wanted to drop some appreciation. We had to find every contract referencing a specific legacy vendor across 12 years of scattered network drives. Windows search failed. FileFlow found 142 documents in 8 seconds. You guys rock.',
    category: 'general',
    views: 1560,
    upvoteCount: 5,
    replies: [
      { content: 'Love hearing this! Stories like this are why we built it.', upvotes: 5 },
      { content: 'Yup, Windows search is basically useless for contents of PDFs.', upvotes: 2 }
    ]
  },
  {
    title: 'Is there a way to search ONLY by filename?',
    content: 'Sometimes I know the exact name of the file but I don\'t care about the contents. Searching the content returns too many matches. How do I restrict it to just the filename?',
    category: 'help',
    views: 215,
    upvoteCount: 1,
    replies: [
      { content: 'Prefix your query with `file:` -- e.g., `file:budget_2024.xlsx`', upvotes: 3 }
    ]
  },
  {
    title: 'Bug: App crashes when opening password-protected PDFs',
    content: 'If FileFlow tries to index a PDF that requires a password, the app throws a silent error in the background and sometimes freezes the whole indexing queue. Has anyone else experienced this?',
    category: 'bugs',
    views: 188,
    upvoteCount: 3,
    replies: [
      { content: 'Yes, this is a known bug in v1.0.5. We are pushing a hotfix tomorrow that skips encrypted PDFs and logs them in a separate tab.', upvotes: 4 }
    ]
  },
  {
    title: 'Tips for Boolean Searching (AND, OR, NOT)',
    content: 'Don\'t forget you can use boolean logic to narrow down results!\n\n- `contract AND signed` - Both must exist\n- `invoice OR receipt` - Either can exist\n- `budget NOT draft` - Exclude drafts\n\nYou can also group them using parentheses: `(invoice OR receipt) AND 2024 NOT void`',
    category: 'tips',
    views: 2904,
    upvoteCount: 5,
    replies: [
      { content: 'I didn\'t know you could use parentheses! Game changer.', upvotes: 2 }
    ]
  },
  {
    title: 'Dark Mode contrast is too low on my monitor',
    content: 'The dark theme uses a lot of dark greys `#1a1a1a` on slightly darker greys `#111111`. On a cheap IPS panel it all bleeds together. Could we get a high-contrast dark mode or a true AMOLED black mode?',
    category: 'features',
    views: 450,
    upvoteCount: 3,
    replies: [
      { content: 'I agree, the borders are very faint.', upvotes: 1 },
      { content: 'We are adding custom theme support soon, which will include a High Contrast preset.', upvotes: 2 }
    ]
  },
  {
    title: 'Does this app send any of my data to the cloud?',
    content: 'I work with highly sensitive legal documents. I need a 100% guarantee that no file contents, filenames, or search queries ever leave my machine. Can a dev confirm?',
    category: 'general',
    views: 3100,
    upvoteCount: 4,
    replies: [
      { content: 'Dev here: 100% offline. We don\'t even have a cloud database for search. The only telemetry sent (if you opt-in) is anonymous crash reports.', upvotes: 5 },
      { content: 'You can verify this by checking the network traffic with Wireshark. It is completely silent.', upvotes: 3 }
    ]
  }
];

const seedCommunity = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fileflow');
    console.log('Connected to DB');

    // Get all users
    const users = await User.find();
    if (users.length === 0) {
      console.log('No users found in the database. Please create users first.');
      process.exit(1);
    }

    const admin = users.find(u => u.role === 'admin') || users[0];
    const normalUsers = users.filter(u => u.role !== 'admin');
    
    // Fallback if no normal users
    if (normalUsers.length === 0) normalUsers.push(admin);

    console.log(`Found ${users.length} users. Clearing old community data...`);
    await Topic.deleteMany({});
    await Reply.deleteMany({});

    console.log('Seeding topics and replies...');

    for (const data of topicsData) {
      // Pick author (Pinned / Announcements usually by Admin, others random)
      const isOfficial = data.isPinned || data.title.includes('Dev here');
      const author = isOfficial ? admin : normalUsers[Math.floor(Math.random() * normalUsers.length)];

      // Generate random upvoters
      const upvoters = [];
      const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
      for (let i = 0; i < Math.min(data.upvoteCount, shuffledUsers.length); i++) {
        upvoters.push(shuffledUsers[i]._id);
      }

      // Slightly randomize views
      const views = Math.floor(data.views * (0.8 + Math.random() * 0.4));

      // Create Topic
      const topic = await Topic.create({
        title: data.title,
        content: data.content,
        category: data.category,
        author: author._id,
        isPinned: data.isPinned || false,
        views: views,
        upvotes: upvoters,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
      });

      // Create Replies
      if (data.replies && data.replies.length > 0) {
        for (let i = 0; i < data.replies.length; i++) {
          const replyData = data.replies[i];
          
          // Reply author shouldn't usually be the topic author, pick random
          let replyAuthor = normalUsers[Math.floor(Math.random() * normalUsers.length)];
          if (replyData.content.includes('Dev here') || replyData.content.includes('planned for v2.0')) {
             replyAuthor = admin;
          }

          // Reply upvoters
          const replyUpvoters = [];
          const rShuffled = [...users].sort(() => 0.5 - Math.random());
          for (let j = 0; j < Math.min(replyData.upvotes, rShuffled.length); j++) {
            replyUpvoters.push(rShuffled[j]._id);
          }

          await Reply.create({
            topic: topic._id,
            author: replyAuthor._id,
            content: replyData.content,
            upvotes: replyUpvoters,
            createdAt: new Date(topic.createdAt.getTime() + Math.random() * 48 * 60 * 60 * 1000) // 0-48h after topic
          });
        }
      }
    }

    console.log('Community data seeded successfully! Created ' + topicsData.length + ' threads.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding community data:', error);
    process.exit(1);
  }
};

seedCommunity();
