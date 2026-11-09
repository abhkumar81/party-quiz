# Mihir Birthday Game

A small party quiz for 2–10 people or teams. Each team uses one phone. The host uses a separate browser/device. Internet access is required on every device, and the host should keep the host tab open.

## Categories and audio rounds

Use **Manage question bank** from a running game to edit questions for the next game without closing the current one. Use **Add 15 third-grade questions** once to append a pack covering math, science, English, and geography; duplicates from the pack are skipped. At lobby creation, choose all categories or a single category. Category names can be typed freely in the question editor.

Use **Add audio / video question**, then **Upload audio or video from computer**. Choose a short clip up to **5 MB**, preview it, fill in the question and four choices, select the correct answer, then click **Save question**. The file uploads on save and is stored privately under your host account. Refreshing or using the same host account on another device can load the saved clip. MP3 audio and MP4 video are recommended; browser codec support varies. Selecting a video automatically switches the question to video. Use **Remove clip** and save to detach a clip, or choose a replacement file. Old assets are retained so existing games can still load their saved clips.

Under **Or use a direct audio / video URL**, a direct HTTPS clip URL is also supported. If no file or URL is supplied, play the clip from another device. Exporting question JSON preserves uploaded file references, but does not export the binary files; references only work within the original host account.

Audio and video questions begin in a listening stage: answer buttons stay closed and no answer timer runs. Play the clip through the host's speakers (and screen for video), then click **Open answers & start timer**. The host can reveal and advance as usual. Test uploaded clips on the host's browser and speakers before the party. Media URLs, filenames, uploaded file references, and correct answers are excluded from player question data; the correct answer is published on reveal. Players watch or listen to the shared host screen rather than streaming clips on each phone.

Short uploads use the existing private Realtime Database as encoded media under `hosts/<uid>/media`, separate from question lists and live room data. The 5 MB source-file limit leaves room for encoding within Firebase's per-string and per-write limits. This avoids adding a storage service for small party clips. For larger files, use a direct hosted clip URL or add object storage separately.

## One-time Firebase setup

1. Open https://console.firebase.google.com/ and create a project named `party-quiz`. Google Analytics is optional; this game does not use it.
2. Open **Build → Authentication → Get started → Sign-in method**. Enable **Email/Password** and **Anonymous**.
3. Under Authentication → **Users**, click **Add user**. Create your host email and password. Keep the password private; do not put it in GitHub or send it in chat. Players do not need accounts.
4. Open **Build → Realtime Database → Create database**. Choose a region, then start in **locked mode**. This game uses Realtime Database, not Firestore.
5. On the database's **Rules** tab, replace the rules with the contents of `database.rules.json` and click **Publish**. Do not enable public test-mode rules.
6. Open **Project settings → General → Your apps → Web** (the `</>` icon). Register a web app; Firebase Hosting is not needed. Copy the `firebaseConfig` object's values into `config.js`. Include the database URL shown in Realtime Database. These values identify the public web app; they are not your host password.
7. Under **Authentication → Settings → Authorized domains**, add `abhkumar81.github.io`. For a local practice run also add `localhost`.

You can share the public web configuration object with the assistant to complete configuration. Do not share a service-account JSON file, private key, or host password.

## Publish on GitHub Pages

1. Create a repository called `party-quiz` under `abhkumar81`.
2. Upload the files in this folder to the repository root, including `.nojekyll`. Do not upload the enclosing folder itself.
3. Open repository **Settings → Pages**. Set the source to **Deploy from a branch**, then select **main** and **/(root)**. Save.
4. Once GitHub finishes deployment, the player URL should be `https://abhkumar81.github.io/party-quiz/`. The host URL is the same address with `#host` appended. The host still needs to sign in.

There is no package installation or build step for this app. To serve it locally with Python: `python -m http.server 8080`, then open `http://localhost:8080/`. Opening index.html directly as a file will not load JavaScript modules correctly.

## Host a game

1. Open the host URL and sign in with the account you added in Firebase.
2. Edit, add, or remove questions. Each needs four answers, one correct answer, and a 5–120 second timer. Five starter questions are included. Question banks can be imported/exported as JSON.
3. Choose a six-digit code and create a lobby. Each player opens the player URL, enters the code, and chooses a name. One phone per team works too.
4. Click **Start game**. Players submit once per question. At the end of the timer, or whenever you choose, click **Close answers & reveal**, then **Next question**. Correct answers earn 500–1,000 points based on response speed. Ranking is by total points first, then lowest combined correct-answer time for equal points. Wrong or missed answers add no points and give no timing advantage. The leaderboard shows correct-answer counts and total correct-answer time. An exact score/time tie shares a rank.
5. At the end, use **Play again / edit questions** to close the old room, change questions, and choose a new code. To change a code before starting, use **Change code / edit questions**; everyone must join the new lobby.

Refreshing the player tab restores the same game within the same browser session. Refreshing the host tab restores the current lobby/game and its saved question set. Do not clear browser storage or close all player tabs during a game; anonymous player identity is session based. If someone loses their identity midgame, they cannot rejoin a running game as a new player. The host manually advances rounds, so a temporary host disconnection does not advance the game.

Start a **new lobby** after installing the speed-points update. Existing games show a notice and retain their original scoring, so old scores are not compared using incomplete timing data. For new games, Firebase timestamps measure the interval from opening answers to the answer's arrival at Firebase; network delay therefore forms part of the measured time. Audio/video playback is excluded: timing starts at **Open answers & start timer**. For text questions, timing starts when the question opens. Correct-answer timings are stored separately from player-editable joining fields and can only be written by the host.

## Practice before the party

- Use a host browser plus two phones or separate private browser sessions. Different tabs in the same session share authentication; they are not separate players.
- Join two players, submit correct and wrong answers, reveal, and confirm scores. Check that a submitted answer cannot be replaced and that the timer stops new answers.
- Refresh host and player tabs during a question; verify recovery. Finish the game, make a new code, and join again.
- Try the game on the actual party Wi-Fi/mobile connection. Keep the host device awake.

## Implementation and verification limits

Firebase security rules protect host question banks and host controls, reject late/duplicate submissions, and prevent player score edits. The join screen checks the 10-player limit; that limit is not enforced by database rules. Correct answers are excluded from the public room until reveal. Authenticated clients with a code can read that room's public player names and scoreboard; use nicknames. The host is trusted to score games. This is a private-party app, not a competitive tournament service.

The local logic checks and live Firebase integration checks passed for the initial game. They covered two-player joins, host-only question access and score edits, duplicate/late submission rejection, and score publication. Browser playback of the user's audio clips still needs verification after clips are supplied.

Players may join an active game (up to 10 teams), starting at zero points. They can answer the current question if its timer is still open. Finished games reject new players.

## Speed-based points
New games award 500–1,000 points per correct answer: round(1000 × (1 − responseTime / questionDuration / 2)). Correct answers under 0.5 seconds earn 1,000. Wrong/missed answers earn zero. Total points determines ranking, with cumulative correct-answer response time breaking equal-point ties. Correct-answer counts are stored separately from points. Media playback time is excluded. Firebase timestamps include network delivery time. Existing lobbies switch when the updated host starts question 1; games already in progress retain their original rules and need a fresh game for speed points.
