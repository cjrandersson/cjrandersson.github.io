# CJ Robin Andersson Portfolio

Three selected projects in sound, software and product design: 
Tactile package design
flöde~
Tunnelbanekollen 
and REKO Nord

## Live portfolio

**[https://cjrandersson.github.io/](https://cjrandersson.github.io/)**

- [flöde~](https://cjrandersson.github.io/?v=20260910-contact#project/flode)
- [Tunnelbanekollen](https://cjrandersson.github.io/?v=20260910-contact#project/tunnelbanekollen)
- [REKO Nord — original MVP V1 views](https://cjrandersson.github.io/?v=20260910-contact#project/reko-nord)
- [Latest verified deployment](https://cjrandersson.github.io/?v=20260910-contact)
- [About page](https://cjrandersson.github.io/?v=20260910-contact#about)

## Repository

[github.com/cjrandersson/cjrandersson.github.io](https://github.com/cjrandersson/cjrandersson.github.io)

The website is a portable static package. Its HTML, CSS, JavaScript, fonts and media use relative paths and are served directly through GitHub Pages from the `main` branch.


## Colorado Plateau

Project copy and poster live in the Colorado section of `projects.js`; `app.js` renders them without SoundCloud callbacks modifying the content. Colours and responsive layout are scoped in `colorado-soundtrack.css`.

The SoundCloud playlist is the source of truth for track titles, durations, order and playback. `colorado-soundtrack.js` connects the dark custom controls to SoundCloud's documented Widget API. It waits for complete metadata (with bounded retries), rather than inventing names for partially loaded tracks. If metadata or the API cannot load within 20 seconds, the native playlist remains the fallback. No API keys or hardcoded track names are used.

Editing the same playlist in SoundCloud is reflected on the next portfolio page load, subject to SoundCloud caching. An already-open player is not a real-time subscription: reload after editing. Keep the playlist publicly embeddable. If its URL changes, update `playlistUrl` and `soundcloudEmbed` together.

Controls: play/pause, track selection, keyboard-accessible seeking, mute/unmute. Closing or leaving the project pauses playback and removes event listeners. SoundCloud changes cannot overwrite the project description or poster.
