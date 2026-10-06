# Lead Quest

Leadership adventures and Bible reading for pre-teens and teens.

Developed by Dr. Arowolo Ayoola.

## What's inside

**Library**
- The Pilgrim's Progress, Part I (5 chapters)
- The Pilgrim's Progress, Part II (5 chapters)
- In His Steps (6 chapters)

**Bible Reading** (Bible in Basic English)
- All 66 books open for chapter-by-chapter reading, read aloud
- Genesis to Revelation: 616 illustrated story episodes across all 66 books, with puzzles, memory verses, 'Pointing to Jesus' and 'Promise kept' insights, and 224 character cards
- Jacob's twelve blessings, and a personal closing prayer for every book

Works offline and can be installed on phones and computers.

## Files

| File / folder | What it does |
|---|---|
| `index.html` | The game itself, kept small: menus, engine, library books, and a light index of the Bible stories |
| `story-<book>.js` | The Bible stories, one small file per book (slides, quizzes, puzzles). Each downloads the first time a child opens that book, then stays on the device. |
| `bible-<book>.js` | The Bible text (Bible in Basic English), one small file per book, downloaded when first opened and kept for offline reading. |
| `privacy.html` | Plain-language privacy page (also inside the app). Use this link in app-store listings. |
| `sw.js` | Offline support |
| `manifest.webmanifest` | Lets the game be installed like an app |
| `icon-*.png`, `favicon-64.png`, `apple-touch-icon.png`, `share.png` | App icons |
| `.nojekyll` | Tells GitHub Pages to serve the files exactly as they are |

## Updating

Replace the files in the repository with the new ones. Players get the new version the next time they open the game with internet. Downloaded Bible books are kept across updates.

## Note

Player progress is saved on each device. Clearing the browser's data, or switching to another phone, starts fresh.


## Uploading
All files sit side by side with no sub-folders. On GitHub: Add file → Upload files, select **all** the files in this folder, and commit. Uploading the same names again simply replaces them.
