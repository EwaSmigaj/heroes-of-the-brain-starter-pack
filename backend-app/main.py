from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from brainaccess.core.eeg_manager import EEGManager
from brainaccess.core.eeg_channel import EEGChannel
import json
import time
import asyncio
from datetime import datetime

app = FastAPI()

# Device configuration
DEVICE_NAME = "BA MINI 035"
CAP_CONFIG = {
    0: "F3",
    1: "F4",
    2: "C3",
    3: "C4",
    4: "P3",
    5: "P4",
    6: "O1",
    7: "O2",
}
SAMPLING_RATE = 250
MOCK = True

def analyze_eeg_chunk(data):
    """
    Simple analysis function - replace with your actual analysis
    Returns a percentage value based on the data
    """
    # Example: calculate average signal strength as percentage
    # You would replace this with your actual BCI analysis logic
    import numpy as np
    avg_signal = np.mean(np.abs(data))
    percentage = min(100, max(0, int(avg_signal / 100)))  # normalize to 0-100
    return percentage

async def generate_bci_stream():
    """Generator function that yields BCI analysis results"""
    if MOCK: 
        # Mock mode for testing without device
        while True:
            result = {
                "percentage": 50,
                "timestamp": int(datetime.now().timestamp() * 1000)
            }
            yield f"{json.dumps(result)}\n"
            await asyncio.sleep(0.1) 
    else: 
        with EEGManager() as mgr:
            # Connect to device
            eeg_ch = EEGChannel(SAMPLING_RATE, CAP_CONFIG)
            mgr.connect(DEVICE_NAME)
            eeg_ch.start_acquisition(mgr)
            
            try:
                while True:
                    # Get latest data chunk
                    data = eeg_ch.get_mne()
                    
                    if data is not None and len(data) > 0:
                        # Analyze the data
                        percentage = analyze_eeg_chunk(data)
                        
                        # Create JSON response
                        result = {
                            "percentage": percentage,
                            "timestamp": int(datetime.now().timestamp() * 1000)
                        }
                        
                        # Yield as JSON string with newline for streaming
                        yield f"{json.dumps(result)}\n"
                    
                    # Small delay to control streaming rate
                    await asyncio.sleep(0.1)  # 10 updates per second
                    
            finally:
                # Cleanup
                eeg_ch.stop_acquisition()
                mgr.disconnect()

@app.get("/stream")
async def stream_bci_data():
    """
    Endpoint that streams BCI analysis results
    Usage: GET http://localhost:8000/stream
    """
    return StreamingResponse(
        generate_bci_stream(),
        media_type="application/x-ndjson"  # newline-delimited JSON
    )

@app.get("/")
async def root():
    return {
        "message": "BCI Streaming API",
        "endpoints": {
            "/stream": "GET - Stream BCI analysis results"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)