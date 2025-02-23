from pydantic import BaseModel

class AudioRequest(BaseModel):
    exerciseId: str
    generate_text: str

class AudioResponse(BaseModel):
    status: str
    timestamps: dict
    audioUrl: str 