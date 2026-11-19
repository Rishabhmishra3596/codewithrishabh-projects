# Sliding Auth — synchronized code build

24-second silent portrait reel, 1080 x 1920, 30fps. Full-width desktop capture layout inspired by the supplied reference, with browser address and bookmarks bars above and a dark VS Code-style editor directly below. The page starts as unstyled HTML on white before building into the pale-blue page and red-and-white form. No field filling: after the complete form is built, a cursor clicks Sign Up once, and the empty registration form slides into view. The closing CTA uses @codewithrishabh3596.

## Timing
- 0–3.2s: HTML types and elements appear.
- 3.2–17s: CSS types. Preview changes only after complete declarations, including flex layout, width, white card background, rounded corners, input styles and red overlay/buttons.
- 17–20s: JavaScript toggle code types.
- 20.05–20.70s: cursor moves onto Sign Up.
- 20.75–21.45s: registration transition.
- 22.1–24s: end CTA.

## Source
Open index.html for the actual native HTML/CSS/JavaScript frontend. Required email/password inputs and native validation are included. Login/register and password reset actions are frontend demonstrations only, with no authentication backend or stored credentials. No external libraries or CDN is required for this frontend.

Open reel.html for the exact animated reel layout, playback controls and seeking. It uses the same reel.js SVG picture renderer as the MP4 export. The editor contains concise excerpts from the frontend source. These are not the complete project; index.html, style.css and app.js contain the full implementation.

code-data.js holds the three typed excerpts. reel.js derives style flags from completed CSS declarations and draws corresponding visual states; it does not take screenshots of the native browser's CSS engine. Consequently the native frontend and the reel share colours, layout and interaction but are not guaranteed pixel-identical across browsers. No personal data is entered into any field in the reel.

## Export
Install Node.js 20+ and FFmpeg. Run npm install and npm run render. The output contains 720 frames at 30fps (24 seconds). Frames are composed at 720 x 1280 and scaled proportionally to 1080 x 1920. npm run preview-frames saves representative PNG frames. window.renderAtTime(seconds) seeks in reel.html.

## Verification
Source syntax, native DOM form switching, input emptiness, frontend submission behavior, finite SVG frames, CSS declaration timing, one signup transition and end-only CTA are checked. Early HTML, intermediate CSS and finished registration frames were visually inspected. Native browser visual verification was not available in this environment.
