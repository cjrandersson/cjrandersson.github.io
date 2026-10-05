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

The SoundCloud playlist iframe is the source of truth for track titles, order and playback. Editing the same playlist in SoundCloud is reflected when the portfolio is opened/reloaded, subject to SoundCloud caching. No manual track-name copy or GitHub deployment is needed. An already-open player is not a real-time subscription; reload after editing. Keep the playlist publicly embeddable. If its URL changes, update `playlistUrl` and `soundcloudEmbed` together. The external link remains available if the embed is blocked.

The old custom `getSounds()` list was removed because partially populated track objects produced invented “Track 3–6” labels. Do not recreate a static duplicate track list.
