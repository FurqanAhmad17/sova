import cv2


def scan_for_qr() -> str | None:
    """
    Opens the webcam and scans frames until a valid ACCESSIBLE_NAV QR code is found.
    Returns the full QR string (e.g. "ACCESSIBLE_NAV::NODE_FRONT_DOOR").
    Press 'q' to quit without scanning.
    """
    cap = cv2.VideoCapture(0)
    detector = cv2.QRCodeDetector()

    print("[QR] Camera open. Scanning for QR code...")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("[QR] Failed to read from camera.")
            break

        data, _, _ = detector.detectAndDecode(frame)

        if data and data.startswith("ACCESSIBLE_NAV::"):
            print(f"[QR] Detected: {data}")
            cap.release()
            cv2.destroyAllWindows()
            return data

        # Show live feed so you can see what the camera sees
        cv2.imshow("QR Scanner - press Q to quit", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            print("[QR] Quit by user.")
            break

    cap.release()
    cv2.destroyAllWindows()
    return None


def scan_once(timeout_seconds: int = 10) -> str | None:
    """
    Like scan_for_qr() but gives up after timeout_seconds if nothing is found.
    Useful for the main loop where you don't want to block forever.
    """
    import time
    cap = cv2.VideoCapture(0)
    detector = cv2.QRCodeDetector()
    start = time.time()

    while time.time() - start < timeout_seconds:
        ret, frame = cap.read()
        if not ret:
            break

        data, _, _ = detector.detectAndDecode(frame)

        if data and data.startswith("ACCESSIBLE_NAV::"):
            print(f"[QR] Detected: {data}")
            cap.release()
            cv2.destroyAllWindows()
            return data

        cv2.imshow("QR Scanner", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
    return None


# --- Quick test ---
if __name__ == "__main__":
    print("Hold a QR code up to the camera...")
    result = scan_for_qr()
    if result:
        print(f"Got QR: {result}")
    else:
        print("No QR code detected.")