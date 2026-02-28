import os
from elevenlabs.client import ElevenLabs
from elevenlabs import play

# --- Configuration ---
API_KEY = os.environ.get("ELEVENLABS_API_KEY", "YOUR_API_KEY_HERE")
VOICE_ID = "EXAVITQu4vr4xnSDxMaL"  # "Sarah" - clear, calm, neutral voice
MODEL_ID = "eleven_monolingual_v1"

client = ElevenLabs(api_key=API_KEY)


def say(text: str):
    """
    Speaks the given text aloud using ElevenLabs TTS.
    Blocks until the audio has finished playing.
    
    Args:
        text: The instruction or message to speak to the user.
    """
    print(f"[SPEAKER] {text}")  # helpful for debugging during development

    audio = client.generate(
        text=text,
        voice=VOICE_ID,
        model=MODEL_ID
    )
    play(audio)


# --- Quick test ---
if __name__ == "__main__":
    say("Navigation system ready. Please say your destination.")
    say("Walk straight ahead for 10 paces.")
    say("You have arrived at Lecture Hall 1210.")