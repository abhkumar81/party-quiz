# Party Quiz

A small party quiz for 2–10 people or teams. Each team uses one phone. The host uses a separate browser/device. Internet access is required on every device, and the host should keep the host tab open.

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
4. Click **Start game**. Players submit once per question. At the end of the timer, or whenever you choose, click **Close answers & reveal**, then **Next question**. Correct answers earn 1,000 points; there is no speed bonus. Tied scores share the same score; alphabetical order is used only for display.
5. At the end, use **Play again / edit questions** to close the old room, change questions, and choose a new code. To change a code before starting, use **Change code / edit questions**; everyone must join the new lobby.

Refreshing the player tab restores the same game within the same browser session. Refreshing the host tab restores the current lobby/game and its saved question set. Do not clear browser storage or close all player tabs during a game; anonymous player identity is session based. If someone loses their identity midgame, they cannot rejoin a running game as a new player. The host manually advances rounds, so a temporary host disconnection does not advance the game.

## Practice before the party

- Use a host browser plus two phones or separate private browser sessions. Different tabs in the same session share authentication; they are not separate players.
- Join two players, submit correct and wrong answers, reveal, and confirm scores. Check that a submitted answer cannot be replaced and that the timer stops new answers.
- Refresh host and player tabs during a question; verify recovery. Finish the game, make a new code, and join again.
- Try the game on the actual party Wi-Fi/mobile connection. Keep the host device awake.

## Implementation and verification limits

Firebase security rules protect host question banks and host controls, reject late/duplicate submissions, and prevent player score edits. The join screen checks the 10-player limit; that limit is not enforced by database rules. Correct answers are excluded from the public room until reveal. Authenticated clients with a code can read that room's public player names and scoreboard; use nicknames. The host is trusted to score games. This is a private-party app, not a competitive tournament service.

The code can be checked locally without Firebase; end-to-end multiplayer and deployed database-rule verification require the configured project. No live Firebase or deployed multiplayer verification has been completed in this starter package.
