# 3951 Halloween Bingo

A browser-only party bingo card, styled after the party's red vintage Halloween invitation. No backend, tracking, sign-in, or runtime dependencies.

## Play

Open https://kcgroulx.github.io/halloween-bingo/ after GitHub Pages deployment. Tap challenges to mark or unmark them. Five in a row, column, or diagonal earns bingo. The center is free. Progress saves only in the current browser; clearing site data removes it. There is no cross-device sync or shared scoreboard.

## Edit challenges

Edit `challenges.js` in GitHub and commit to `main`. Each challenge has one `text` instruction, displayed entirely inside its square. Keep instructions concise enough to fit on phones; there is no secondary description or detail panel. Keep exactly 24 entries and retain their IDs when changing wording so saved progress is preserved. Entries run left-to-right, top-to-bottom, with the free center inserted automatically. Edits publish through GitHub Pages. Changing an ID makes that challenge a new, unchecked challenge.

## Preview and test

Run `npm start` and open http://127.0.0.1:3951. No installation is required. Run `npm test` for game and persistence tests. Use an HTTP server: JavaScript modules do not run correctly from a `file://` URL.

## Hosting

Publish the root of `main` using Settings → Pages → Deploy from a branch. `.nojekyll` enables direct static-file publishing. All assets use relative paths. The share URL in `app.js` and QR assets must be updated together if the host or repository name changes.

## QR code

`assets/party-qr.svg` is the printable, high-contrast QR code. It contains only the public site URL, never player state. A PNG version is provided alongside the project deliverables.

## Browser data

The only stored record is `3951-halloween-bingo:v1` in localStorage: `{ "version": 1, "checked": ["challenge-id"] }`. Reset only clears this record. If storage is blocked, the game works in memory and displays a notice. The site requires internet for its initial page load; offline reloads are not guaranteed. GitHub serves the files, but gameplay never sends progress to a server.

## Artwork

The bat and corner ornaments are original inline-vector assets created for this project. The paper grain is an embedded SVG filter. No remote images or fonts are loaded.
