from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import os

load_dotenv()

elevenlabs = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)

def say(t: str) -> None:
    audio = elevenlabs.text_to_speech.convert(
        text=t,
        voice_id="JBFqnCBsd6RMkjVDRZzb",
        model_id="eleven_multilingual_v2",
        output_format="mp3_44100_128",
    )
    play(audio)


# --- Quick test ---
if __name__ == "__main__":
    say("Navigation system ready. Please say your destination.")
    say("Walk straight ahead for 10 paces.")
    say("You have arrived at Lecture Hall 1210.")