import cv2
import navigation
import speaker
import voice_input

FLOOR_PLAN_PATH = "floor_plan.json"


def run():
    floor_plan = navigation.load_floor_plan()

    # --- Step 1: Listen for destination ---
    speaker.say("Welcome. Please say your destination. You can say: washroom, cafeteria, lecture hall 1210, or staircase.")
    spoken = voice_input.listen_for_destination(max_wait_seconds=10)

    if not spoken:
        speaker.say("Sorry, I didn't catch a valid destination. Please try again.")
        return

    dest_node = navigation.resolve_destination(floor_plan, spoken)

    if not dest_node:
        speaker.say("Sorry, I didn't catch a valid destination. Please restart.")
        return

    speaker.say(f"Navigating to {spoken}.") #Please walk to the nearest QR code to begin.

    # --- Step 2: Continuous scanning loop ---
    cap = cv2.VideoCapture(0)
    detector = cv2.QRCodeDetector()
    last_node = None

    print("[MAIN] Scanning loop started. Press Q to quit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("[MAIN] Camera read failed.")
            break

        data, _, _ = detector.detectAndDecode(frame)

        if data and data.startswith("ACCESSIBLE_NAV::"):
            current_node = navigation.resolve_qr(floor_plan, data)

            if current_node and current_node != last_node:
                last_node = current_node
                print(f"[MAIN] Position updated: {current_node}")

                # Arrived at destination
                if current_node == dest_node:
                    arrival = navigation.get_arrival_message(floor_plan, dest_node)
                    speaker.say(arrival)
                    print("[MAIN] Destination reached. Exiting.")
                    break

                # Calculate remaining path and give next instruction
                path = navigation.get_path(floor_plan, current_node, dest_node)

                if not path or len(path) < 2:
                    speaker.say("Something went wrong with navigation. Please ask for assistance.")
                    break

                instruction = navigation.get_next_instruction(floor_plan, path[0], path[1])
                if instruction:
                    speaker.say(instruction)

        cv2.imshow("SOVA Navigation - press Q to quit", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            print("[MAIN] Quit by user.")
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    run()