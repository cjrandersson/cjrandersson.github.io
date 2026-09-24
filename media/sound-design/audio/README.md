# Sound Design audio

Place curated portfolio audio files in this folder.

Suggested filenames for the current provisional selection:

- `yadda-yadda.mp3`
- `le-plombier.mp3`
- `manifestation-of-ectoplasm.mp3`
- `rogaland-fylke.mp3`
- `slapdash-acid-hq.mp3`
- `old-iphone-10-jazz-flip-01.mp3`

The project currently keeps each `audio` value as `null` in `projects.js`, so missing files never create broken players.

When a file is ready, change the relevant section to a relative path, for example:

```js
"mediaType": "audio",
"audio": "media/sound-design/audio/yadda-yadda.mp3"
```

The shared renderer in `app.js` will then show the native HTML5 player with `preload="metadata"`. No autoplay is used. If a configured file later becomes unavailable, the player is replaced with an unavailable-audio status rather than breaking the project viewer.
