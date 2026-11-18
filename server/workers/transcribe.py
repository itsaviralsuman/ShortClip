import sys
import json
import argparse
import av
import numpy as np
from faster_whisper import WhisperModel

def load_audio_clean(file_path, target_sr=16000):
    with av.open(file_path, mode='r') as container:
        stream = next((s for s in container.streams if s.type == 'audio'), None)
        if not stream:
            return np.zeros(0, dtype=np.float32)
        resampler = av.AudioResampler(format='s16', layout='mono', rate=target_sr)
        frames = []
        for frame in container.decode(stream):
            for r_frame in resampler.resample(frame):
                frames.append(r_frame.to_ndarray())
        if frames:
            audio = np.concatenate(frames, axis=1).squeeze(0)
            return audio.astype(np.float32) / 32768.0
        return np.zeros(0, dtype=np.float32)

def run_transcription(audio_path, model_size="tiny", language=None):
    try:
        # Load audio into numpy float32 array
        audio_arr = load_audio_clean(audio_path)
        if len(audio_arr) == 0:
            print(json.dumps({
                "success": True,
                "detected_language": "en",
                "language_probability": 1.0,
                "duration": 0,
                "words": []
            }))
            return

        # Load whisper model with int8 quantization for high speed on CPU
        model = WhisperModel(model_size, device="cpu", compute_type="int8")
        
        # Map our languages: 'hindi' -> 'hi', 'english' -> 'en', 'hinglish' -> None
        lang_code = None
        if language == 'hindi':
            lang_code = 'hi'
        elif language == 'english':
            lang_code = 'en'
            
        segments, info = model.transcribe(
            audio_arr,
            word_timestamps=True,
            language=lang_code,
            beam_size=2
        )
        
        words = []
        for segment in segments:
            if segment.words:
                for w in segment.words:
                    clean_word = w.word.strip()
                    if clean_word:
                        words.append({
                            "word": clean_word,
                            "start": round(w.start, 2),
                            "end": round(w.end, 2),
                            "probability": round(w.probability, 2)
                        })
            else:
                words.append({
                    "word": segment.text.strip(),
                    "start": round(segment.start, 2),
                    "end": round(segment.end, 2),
                    "probability": 0.9
                })

        output = {
            "success": True,
            "detected_language": info.language if info else "en",
            "language_probability": round(info.language_probability, 2) if info else 1.0,
            "duration": round(info.duration, 2) if info else round(len(audio_arr) / 16000.0, 2),
            "words": words
        }
        print(json.dumps(output))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Local Whisper Word-Level Transcriber")
    parser.add_argument("audio_path", help="Path to input audio (WAV/MP3)")
    parser.add_argument("--model", default="tiny", help="Whisper model: tiny, base, small")
    parser.add_argument("--language", default=None, help="Language code or name")
    
    args = parser.parse_args()
    run_transcription(args.audio_path, args.model, args.language)
