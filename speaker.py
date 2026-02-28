import os
import uuid
import pygame
from dotenv import load_dotenv
from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs

# pip install python-dotenv elevenlabs pygame

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
elevenlabs = ElevenLabs(api_key=ELEVENLABS_API_KEY)

pygame.mixer.init()


def say(text: str):
    """
    Converts text to speech, plays it, then deletes the temp file.
    Blocks until audio finishes playing.
    """
    print(f"[SPEAKER] {text}")

    # Generate audio and save to temp mp3
    response = elevenlabs.text_to_speech.convert(
        voice_id="pNInz6obpgDQGcFmaJgB",  # Adam pre-made voice
        output_format="mp3_22050_32",
        text=text,
        model_id="eleven_turbo_v2_5",  # turbo for low latency
        voice_settings=VoiceSettings(
            stability=0.0,
            similarity_boost=1.0,
            style=0.0,
            use_speaker_boost=True,
            speed=1.0,
        ),
    )

    save_file_path = f"{uuid.uuid4()}.mp3"
    with open(save_file_path, "wb") as f:
        for chunk in response:
            if chunk:
                f.write(chunk)

    # Play the file and block until done
    pygame.mixer.music.load(save_file_path)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)

    # Clean up temp file
    pygame.mixer.music.unload()
    os.remove(save_file_path)


# --- Quick test ---
if __name__ == "__main__":
    say("Navigation system ready. Please say your destination.")
    say("Walk straight ahead for 10 paces.")
    say("You have arrived at Lecture Hall 1210.")