import face_recognition
import numpy as np
import json
import cv2
import base64


def encoding_to_str(encoding: np.ndarray) -> str:
    return json.dumps(encoding.tolist())


def str_to_encoding(s: str) -> np.ndarray:
    return np.array(json.loads(s))


def extract_encoding_from_frame(frame_bgr):
    """
    Recibe un frame BGR de OpenCV.
    Retorna el encoding del primer rostro encontrado, o None si no hay rostro.
    """
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    locations = face_recognition.face_locations(rgb)
    if not locations:
        return None
    encodings = face_recognition.face_encodings(rgb, known_face_locations=locations)
    if not encodings:
        return None
    return encodings[0]


def extract_encoding_from_b64(b64_string: str):
    """
    Recibe una imagen en base64 (enviada desde el navegador vía JS).
    Retorna el encoding del primer rostro encontrado, o None.
    """
    try:
        header, data = b64_string.split(',', 1)
    except ValueError:
        data = b64_string

    img_bytes = base64.b64decode(data)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if frame is None:
        return None
    return extract_encoding_from_frame(frame)


def compare_encodings(known_encoding: np.ndarray, candidate_encoding: np.ndarray, tolerance: float = 0.55) -> bool:
    results = face_recognition.compare_faces([known_encoding], candidate_encoding, tolerance=tolerance)
    return bool(results[0])