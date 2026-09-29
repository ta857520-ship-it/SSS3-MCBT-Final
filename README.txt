SSS3 MCBT - CLASSROOM READY BUILD

WHAT IS INCLUDED
- 19 subjects with 500-question JSON banks each
- Random 30-question exam selection
- 20-minute timer with automatic submission at 00:00
- 3-2-1 countdown
- Review before final submission
- ALL DONE animation
- Checking and collating result animation
- Student result: attempted, correct, wrong, score and percentage
- Supabase online score storage
- Subject-specific live leaderboard
- Current student's leaderboard row highlighted as YOU
- Warning before accidentally closing/reloading an active exam
- Responsive mobile/tablet layout

RUN LOCALLY
1. Extract the ZIP.
2. Open the SSS3-MCBT-Fixed folder in VS Code.
3. Install the Live Server extension by Ritwick Dey if needed.
4. Right-click index.html -> Open with Live Server.
5. Test the app in the browser.

SUPABASE
The app uses the project's browser-safe publishable key. Never put a Supabase secret/service_role key in the browser.

Before testing a fresh database, make sure the results table exists and run:

grant usage, select on sequence public.results_id_seq to anon;

FREE HOSTING
For a static free deployment, GitHub Pages can host this website. Because the question banks are JSON files and Supabase handles the online leaderboard, no paid server is required for the app's basic operation.

GitHub Pages setup:
1. Create/sign into a GitHub account.
2. Create a new repository, e.g. sss3-mcbt.
3. Upload the contents of this SSS3-MCBT-Fixed folder to the repository root.
4. Open Settings -> Pages.
5. Choose Deploy from a branch, select the main branch and / (root), then Save.
6. Wait for GitHub to publish the site and open the generated Pages link.

IMPORTANT
The question banks in this project are original practice questions generated for the app. They are not official WAEC past questions.


GITHUB UPLOAD NOTE
------------------
This GitHub-ready version keeps all 19 subject question banks in ONE file: question-banks.json.
Upload index.html, script.js, style.css, README.txt, and question-banks.json to the repository root.
No Questions folder is required.
