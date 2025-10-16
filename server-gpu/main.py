from fastapi import FastAPI, UploadFile, Form, HTTPException

from functions import predict_pneumonia

app = FastAPI()

models_list = ["pneumonia"]


@app.post("/predict/{model_name}")
async def predict_endpoint(model_name: str, image: UploadFile = Form(...)):
    image_bytes = await image.read()
    if model_name not in models_list:
        raise HTTPException(status_code=404, detail=fr"Model {model_name} not found")
    onnx_path = f"models/{model_name}/{model_name}_model.onnx"
    try:
        if model_name == "pneumonia":
            result = predict_pneumonia(image_bytes, onnx_path, name_dis=model_name.capitalize())
        else:
            raise HTTPException(status_code=500, detail="Something get wrong")
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=fr"Error: {e}")
