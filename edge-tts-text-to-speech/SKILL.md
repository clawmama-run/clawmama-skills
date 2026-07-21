---
name: edge-tts-text-to-speech
description: "Generate multilingual MP3 voiceovers and SRT subtitles with the edge-tts command-line tool. Use for text-to-speech, selecting Microsoft Edge online voices, adjusting rate/pitch/volume, producing narration files, and verifying audio output."
license: LGPL-3.0-or-later
metadata:
  author: clawmama
  version: "1.0.0"
  homepage: "https://github.com/rany2/edge-tts"
---

# Edge TTS Text-to-Speech

Use this Skill when the user wants to turn text into spoken audio, make a voiceover, list available voices, produce subtitles, or adjust speech rate, pitch, and volume. It operates the open-source [`edge-tts`](https://github.com/rany2/edge-tts) CLI by rany2, which connects to Microsoft Edge's online text-to-speech service.

## Runtime requirement

The Catalog Agent provisions the pinned CLI automatically. For manual setup, use an isolated environment rather than changing the system Python:

```bash
python3 -m venv "$HOME/.local/share/clawmama/edge-tts-7.2.8"
"$HOME/.local/share/clawmama/edge-tts-7.2.8/bin/python" -m pip install --upgrade pip
"$HOME/.local/share/clawmama/edge-tts-7.2.8/bin/python" -m pip install "edge-tts==7.2.8"
mkdir -p "$HOME/.local/bin"
ln -sfn "$HOME/.local/share/clawmama/edge-tts-7.2.8/bin/edge-tts" "$HOME/.local/bin/edge-tts"
ln -sfn "$HOME/.local/share/clawmama/edge-tts-7.2.8/bin/edge-playback" "$HOME/.local/bin/edge-playback"
```

Verify:

```bash
edge-tts --version
edge-tts --list-voices
```

## Generate audio

Choose a voice from the live voice list, then write an MP3:

```bash
edge-tts \
  --voice zh-CN-XiaoxiaoNeural \
  --text "你好，欢迎使用免费语音生成 Agent。" \
  --write-media output.mp3
```

Generate audio and SRT subtitles together:

```bash
edge-tts \
  --voice zh-CN-XiaoxiaoNeural \
  --file input.txt \
  --write-media narration.mp3 \
  --write-subtitles narration.srt
```

Adjust delivery:

```bash
edge-tts \
  --voice zh-CN-XiaoxiaoNeural \
  --rate=+5% \
  --pitch=-2Hz \
  --volume=+0% \
  --text "这是一段节奏自然的中文旁白。" \
  --write-media narration.mp3
```

For negative values, use the equals form such as `--rate=-10%`; otherwise the CLI may parse the value as another option.

## Voice selection

Always query the current list instead of promising a fixed number of voices:

```bash
edge-tts --list-voices
```

Practical defaults when present:

- Simplified Chinese, friendly female: `zh-CN-XiaoxiaoNeural`
- Simplified Chinese, male: inspect the current `zh-CN-*` entries and choose by gender/personality
- English: inspect `en-US-*` or the requested locale
- Other languages: filter the list by locale prefix

Example filtering:

```bash
edge-tts --list-voices | grep '^zh-CN-'
edge-tts --list-voices | grep '^en-US-'
```

## Verification before delivery

Do not treat exit code 0 alone as completion. Confirm that the output exists, is non-empty, and is valid audio:

```bash
test -s narration.mp3
ffprobe -v error \
  -show_entries format=duration,size,format_name \
  -of json narration.mp3
```

Listen or inspect the complete narration when pronunciation, timing, or tone matters. Regenerate after changing voice, rate, pitch, punctuation, or wording.

## Workflow

1. Confirm language, script, intended tone, and approximate duration.
2. Run `edge-tts --list-voices` and select an appropriate current voice.
3. Generate MP3; generate SRT too when captions or timed editing are useful.
4. Verify the file with `ffprobe` and check the actual duration.
5. If matching video, make the real narration duration the timing source for the edit.
6. Return the output path, voice, settings, duration, and any material limitations.

## Boundaries

- This is an online service client, not an offline speech model; working internet access is required.
- No API key is normally required, but this does not imply an official uptime SLA, unlimited usage, or a guaranteed permanent free service.
- Voice availability and service behavior can change upstream. Query voices at runtime and keep the pinned client version maintainable.
- Arbitrary custom SSML is not supported. Use the exposed voice, rate, pitch, and volume controls.
- `edge-playback` requires `mpv` outside Windows. Prefer writing an MP3 for portable delivery.
- Do not clone or imitate a real person's voice. This tool uses service-provided synthetic voices.

## Attribution and license

`edge-tts` is maintained by rany2 at https://github.com/rany2/edge-tts. The project is primarily licensed under GNU LGPL v3; its `srt_composer.py` file is separately MIT-licensed. ClawMama provides this operating Skill and Catalog packaging and does not imply endorsement by Microsoft or the upstream maintainer.

See `references/upstream-and-usage.md` for pinned-version facts, output characteristics, and source links.
