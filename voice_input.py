import speech_recognition as sr
import time

# pip install SpeechRecognition pyaudio

# Must match keys in floor_plan.json "destinations"
VALID_DESTINATIONS = [
    "washroom",
    "cafeteria",
    "lecture hall 1210",
    "staircase",
]


def listen_for_destination(max_wait_seconds: int = 10) -> str | None:
    """
    Listens via microphone and returns a matched destination string.
    Retries until a valid destination is heard or the overall timeout is reached.
    """
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    print("[VOICE INPUT] Listening for destination...")

    with mic as source:
        recognizer.adjust_for_ambient_noise(source, duration=1)

    deadline = time.monotonic() + max_wait_seconds

    while time.monotonic() < deadline:
        print("[VOICE INPUT] Say your destination: washroom, cafeteria, lecture hall 1210, or staircase")

        with mic as source:
            try:
                remaining = max(0.1, deadline - time.monotonic())
                listen_timeout = min(3, remaining)
                audio = recognizer.listen(source, timeout=listen_timeout, phrase_time_limit=5)
                text = recognizer.recognize_google(audio).lower()
                print(f"[VOICE INPUT] Heard: '{text}'")

                matched = match_destination(text)
                if matched:
                    print(f"[VOICE INPUT] Matched destination: '{matched}'")
                    return matched
                else:
                    print(f"[VOICE INPUT] No match found, trying again...")

            except sr.WaitTimeoutError:
                print("[VOICE INPUT] No speech detected, trying again...")
            except sr.UnknownValueError:
                print("[VOICE INPUT] Could not understand audio, trying again...")
            except sr.RequestError as e:
                print(f"[VOICE INPUT] Google Speech API error: {e}")

    print(f"[VOICE INPUT] Timeout: no valid destination heard in {max_wait_seconds} seconds.")
    return None


def match_destination(text: str) -> str | None:
    """
    Tries to match spoken text to a valid destination.
    Returns the matched destination string or None.
    """
    for destination in VALID_DESTINATIONS:
        if destination in text:
            return destination

    # Fuzzy fallbacks for common mishearings
    fallbacks = {
        "bathroom": "washroom",
        "restroom": "washroom",
        "toilet": "washroom",
        "cafe": "cafeteria",
        "food": "cafeteria",
        "lecture": "lecture hall 1210",
        "1210": "lecture hall 1210",
        "hall": "lecture hall 1210",
        "stair": "staircase",
        "stairs": "staircase",
    }

    for keyword, destination in fallbacks.items():
        if keyword in text:
            return destination

    return None


# --- Quick test ---
if __name__ == "__main__":
    destination = listen_for_destination()
    print(f"User wants to go to: {destination}")