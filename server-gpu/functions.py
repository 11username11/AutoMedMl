import io

import numpy as np
import onnxruntime as ort
from PIL import Image
from torchvision import transforms


def get_session(onnx_path: str):
    providers = ort.get_available_providers()
    if "CUDAExecutionProvider" in providers:
        print("CUDA DETECTED")
        return ort.InferenceSession(onnx_path, providers=["CUDAExecutionProvider"])
    print("CPU ONLY MOD")
    return ort.InferenceSession(onnx_path, providers=["CPUExecutionProvider"])


def predict_pneumonia(image_bytes: bytes, onnx_path: str, name_dis: str):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tfms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])
    x = tfms(img).unsqueeze(0).numpy()
    sess = get_session(onnx_path)
    pred = sess.run(None, {"input": x})[0]
    prob = float(1 / (1 + np.exp(-pred)).squeeze())
    label = name_dis if prob > 0.5 else fr"{name_dis} not detected"
    return {"probability": round(prob, 4), "label": label}