# Shesha 1.0.1

An Expo Android app and private Cloudflare Worker API for turning GitHub projects into LinkedIn posts. Uses five floating tabs, three onboarding screens, and settings inspired by Bible Diaries and exégeomai.

## What works in this version

- Sync a public GitHub user's repositories; optionally authenticate reads. Enable projects and assign screenshot URLs, phone/laptop layouts and Canva reference links.
- Rotate projects, read README evidence, request an editable caption from OpenAI. No emojis or hashtags; validate again before publishing.
- Render a real screenshot inside a device frame, save/reopen drafts, publish a single PNG to a personal LinkedIn profile using official APIs.
- Track drafts, in-progress, published and uncertain deliveries. Do not automatically retry an uncertain submission; verify LinkedIn first.
- Configure providers through Settings. Provider secrets encrypted with AES-GCM in D1; only the backend URL and dashboard token are stored in device SecureStore. Provider secrets are never compiled into the APK.
- Check/download compatible OTA updates from Settings.

## Initial infrastructure setup

Cloudflare and Expo project creation are one-time infrastructure steps, not provider settings. The initial backend is deployed at https://shesha-api.pharezsigasa.workers.dev. Database and Worker secrets have been provisioned through the connected Cloudflare account. Future GitHub backend deployment needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID repository secrets.

1. `npm ci`. Create a Cloudflare D1 database (`npx wrangler d1 create shesha`) and put its UUID in wrangler.jsonc.
2. Set `ADMIN_TOKEN` and `VAULT_KEY` with `npx wrangler secret put NAME`. Use distinct random values of at least 32 bytes; preserve VAULT_KEY or stored credentials will be unrecoverable.
3. `npx wrangler d1 migrations apply shesha --remote`, then `npm run deploy:server`. This private single-owner API requires the dashboard bearer token on every route except health. Do not share it. Enable Cloudflare access/rate limiting as appropriate without blocking native API clients.
4. Open app Settings, paste the deployed HTTPS Worker address and ADMIN_TOKEN, and Save and connect.
5. Enter GitHub username, OpenAI API key/model, LinkedIn access token and personal URN. Save integrations. Empty secret fields preserve saved secrets. To remove a provider credential use the authenticated PUT /settings endpoint with its field set to an empty string. Disconnect removes the current device's token; revoke provider tokens in their developer consoles when needed.

## Provider setup

- OpenAI: the requested default is `gpt-6-nano`. This model identifier could not be verified in official docs during implementation. Settings lets you specify an available model ID; generation reports provider failure instead of silently substituting a model. No live request has been tested without your key.
- LinkedIn: create a developer app, enable Share on LinkedIn and authorize `w_member_social` using LinkedIn's OAuth developer flow. Paste the resulting token and `urn:li:person:...` for that same authorized member into Settings. Identity can be obtained using the approved Sign In with LinkedIn product. This v1 does not embed a Connect LinkedIn OAuth flow or refresh tokens. Reauthorize when expired. No LinkedIn password belongs in the app. Company pages are not yet supported.
- Canva: reference is ONLY https://www.canva.com/d/REBmq1xjIT_1Ad2 (five-page caurosel, DAHaUCfbi2c). Other designs are excluded. Optional token enables backend GET /canva/designs, but automated Canva export/adaptation and PDF carousel publishing are not implemented yet. Use screenshots/device mockups for v1.
- GitHub: sync reads public user repositories, excluding forks and archived projects. Private repository discovery is not implemented. Optional token authenticates README reads.

## Expo and GitHub Actions

Runtime is the explicit string **1.0.1**, independent of app version. Production is the default profile and channel; preview is also defined, both with installable APK outputs.

1. The repository's EXPO_TOKEN secret is already supplied by the owner. Do not put it in Settings or source.
2. Create/link the Shesha EAS project once from a trusted terminal: `npx eas-cli init`. The supplied project UUID `0c476bbb-2342-4336-bb38-0fa2d6d9f0c8` is linked in app.config.js and is the workflow default. An optional Actions variable `EXPO_PROJECT_ID` overrides it. The app configuration reads this variable during build and OTA. Do not use the Bible Diaries project ID.
3. Set up Android signing credentials for this project once using `npx eas-cli credentials --platform android` (or complete the first interactive build). Non-interactive CI cannot create credentials that need prompts.
4. Run **Production Android APK** from Actions. The default production build uses EAS Cloud and attaches shesha.apk plus checksum to GitHub Releases. EAS billing/quotas apply. Changing release.json on main also triggers a build; ordinary UI changes do not.
5. **Publish OTA update** runs for App.tsx/index.js changes on main (production) or preview (preview); it can also be dispatched manually. It creates/maps the EAS branch/channel. Install a build on the corresponding channel before testing OTA.
6. For a native change, stop OTA, review compatibility, increase app version/build number, compile an APK and test it. Refresh native-baseline.json only after that review. Keeping runtime 1.0.1 does NOT make incompatible native code safe for old APKs; do not publish incompatible OTA to the same runtime/channel. A new compatibility runtime may ultimately be necessary if both old and new native binaries must receive different updates.

The guard hashes package, lock, app config and EAS config to block unreviewed native changes before OTA. It is a conservative input guard, not proof of binary compatibility. Keep native code managed by Expo and review added native directories manually.

## Development and validation

`npm start`, `npm run typecheck`, `npm test`, `npx expo export --platform android`.
`npm run server` uses local D1; apply migrations locally first. Tests cover encryption integrity, caption constraints, project rotation and unauthenticated API access. Live LinkedIn, Canva, OpenAI, deployed Worker and installed APK verification require infrastructure and provider credentials.

Twice-daily scheduling, fully automatic trigger-and-post, in-app OAuth and Canva carousels remain future work. V1 deliberately keeps publishing as an explicit action from the generated draft.

## Pairing the installed app

The backend URL is prefilled. Enter the one-time pairing code supplied at deployment in Settings, tap Pair this device, then Save and connect. The code expires after 48 hours and can be used once. The app exchanges it for a dashboard token stored in Android SecureStore; the server stores only the code hash and deletes it atomically on use. Provider credentials remain server-side. Pairing does not configure LinkedIn/OpenAI credentials.

## Review, feedback and carousel workflow

Generation produces a draft, never a published post. Review all five 4:5 previews and caption, edit them if needed, then choose Approve. Approval stores the exact rendered JPEG pages and caption revision. A separate Publish approved post action uploads those pages as a PDF document to LinkedIn. Editing an approved post invalidates approval. Backend publishing refuses drafts, rejected posts and stale approvals; network uncertainty never triggers an automatic retry.

Reject opens a required feedback field. Choose all projects or only this project. Feedback is saved in D1 and retrieved for later generations and regeneration of the rejected project. This is preference memory, not model training. Settings lists saved preferences and allows deletion. Every revision returns to review; feedback cannot authorize publishing.

Default visual reference: five-page Canva design DAHaUCfbi2c, especially slide two. The implemented layout uses white portrait pages, real device mockup/screenshot left, thin black divider, short copy right, blue emphasis and a pink accent. It is an app-rendered adaptation of the reference, not a Canva template autofill. Choose Use app logo instead explicitly to make a single-page logo variation. Add screenshot/logo URLs in Projects. No fabricated screens are substituted when assets are missing.

Server-only PDF dependency lives in server/package.json and server/package-lock.json. CI installs both root and server dependencies; no native dependencies or runtime changes are needed. Apply server/migrations/0003.sql once to an existing database before deploying this change. LinkedIn document access and real device capture still require a live account/device test. If LinkedIn is still processing an uploaded document, the approved post and document URN are retained for an explicit retry.

The earlier v1 single-image implementation and direct Publish button have been superseded by this required review workflow. Scheduling and unattended publishing remain disabled.

## Version 1.0.2: identity and settings

Uses the owner-supplied T.s & co PNG unchanged for icon, Android adaptive icon, splash, favicon and header. App surfaces are white, typography is black, and gold is reserved for accents. UI icons are raster PNG assets derived from Lucide outline icon nodes; the app imports no SVG icon components. The rasterization script uses the licensed vector nodes only as build-time inputs and retains Lucide's license. react-native-svg remains installed for native compatibility with 1.0.1, but is not used by Shesha's UI.

Settings now include provider-specific guidance, workspace information, review/approval rules, visual defaults, scoped memory, privacy, pairing, connection troubleshooting, activity, data sharing, updates, support and responsible-use information. Reading size is persisted and scales app text. Workspace summaries and diagnostics use Android's share sheet and deliberately exclude credentials; generated carousel page typography is not scaled by the app reading preference.

This release needs a fresh APK for the native icon/splash. Runtime stays 1.0.1. The added splash plugin is configuration-only; application JavaScript does not call any new native API. The [native-build] commit marker skips automatic OTA during this native release. Future OTA changes still need compatibility review. New APKs retain the same Android identity and EAS signing credentials.

GitHub Release publication has previously returned HTTP 403 despite contents:write. The build workflow preserves the APK and checksum as a downloadable Actions artifact first, then attempts Release publication without discarding the APK if that step is denied.

## Settings screens and prepared dashboard choices

Settings opens as plain category rows on the page, with transparent PNG icons and no cards or icon backgrounds. Each category opens its own detail screen, with an explicit Back action and Android Back support. Backend details become read-only once paired; disconnecting through Pairing & security deliberately unlocks setup again. Connected services, saved preferences, appearance, Canva/design, content review, privacy, data, help and updates have separate screens.

The header is text-only Shesha. The launcher icon and native splash from 1.0.2 are unchanged; these layout changes use existing native capabilities and are delivered through OTA on runtime 1.0.1.

On connection, the dashboard fills up to three pending repository-based drafts and shows three selectable first-slide/caption previews. These templates use repository metadata and do not claim AI generation. Generating three AI alternatives requires an OpenAI key and uses the normal reviewed-draft flow. Neither preparation nor generation publishes a post. Prepared drafts are persisted on the backend and opened in the existing full review screen; missing screenshots are explicitly indicated.
