# edge-tts upstream and usage reference

Pinned integration version: `edge-tts 7.2.8`.

## Verified upstream

- Repository: https://github.com/rany2/edge-tts
- Versioned README: https://github.com/rany2/edge-tts/blob/7.2.8/README.md
- Release: https://github.com/rany2/edge-tts/releases/tag/7.2.8
- License: https://github.com/rany2/edge-tts/blob/7.2.8/LICENSE

## Installation

Upstream supports pip installation. ClawMama provisions a dedicated Python virtual environment, then exposes `edge-tts` and `edge-playback` through `$HOME/.local/bin`.

## CLI facts

```bash
edge-tts --list-voices
edge-tts --voice VOICE --text "TEXT" --write-media output.mp3
edge-tts --voice VOICE --file input.txt --write-media output.mp3 --write-subtitles output.srt
```

Supported delivery controls include `--rate`, `--volume`, and `--pitch`.

The current client requests Microsoft Edge online audio as 24 kHz, 48 kbps, mono MP3. Treat this as a verified implementation fact for version 7.2.8, not a permanent service guarantee.

## Limitations

- Requires network access to Microsoft's online service.
- Does not provide Azure Speech SLA or official unlimited-free guarantees.
- Available voices are dynamic; query them at runtime.
- Arbitrary custom SSML is not supported.
- Upstream endpoint or response changes may require a client upgrade.

## License wording

The upstream repository is primarily GNU LGPL v3. The `srt_composer.py` file is separately MIT-licensed. Preserve this distinction in public credits.
