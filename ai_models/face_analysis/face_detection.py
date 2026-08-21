import cv2
import mediapipe as mp


face_mesh = mp.solutions.face_mesh.FaceMesh()


def detect_face_shape(image):

    # Check image
    if image is None:
        return "No image provided"


    # Convert BGR to RGB
    rgb = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2RGB
    )


    result = face_mesh.process(rgb)


    if not result.multi_face_landmarks:
        return "No face detected"


    landmarks = result.multi_face_landmarks[0].landmark


    # Face points

    left_face = landmarks[234]

    right_face = landmarks[454]

    top_face = landmarks[10]

    bottom_face = landmarks[152]


    width = abs(
        right_face.x -
        left_face.x
    )


    height = abs(
        bottom_face.y -
        top_face.y
    )


    ratio = width / height


    if ratio > 0.85:
        return "Round"

    elif ratio < 0.70:
        return "Oval"

    else:
        return "Square"