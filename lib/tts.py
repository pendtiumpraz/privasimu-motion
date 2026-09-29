# Voice-over via edge-tts + timing per kata (untuk sinkron visual & SFX).
# python tts.py <voice> <rate> <text> <out.mp3> <out.json> [pitch, mis. -12Hz]
import asyncio, json, sys
import edge_tts

async def main(voice, rate, text, mp3, js, pitch="+0Hz"):
    comm = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary="WordBoundary")
    words = []
    with open(mp3, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({"w": chunk["text"], "t": chunk["offset"] / 1e7, "d": chunk["duration"] / 1e7})
    with open(js, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False)

asyncio.run(main(*sys.argv[1:7]))
