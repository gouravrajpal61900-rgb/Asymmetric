
import base64
import os
from PIL import Image

# Use raw strings for paths to avoid escape char issues
input_path = r"C:\Users\GAURAV\.gemini\antigravity\brain\tempmediaStorage\media__1770525978039.png"
output_jpg = r"C:\Users\GAURAV\.gemini\antigravity\playground\ghost-skylab\public\logo_personal.jpg"

print(f"Checking input: {input_path}")
if not os.path.exists(input_path):
    print("ERROR: Input file not found")
    exit(1)

try:
    # Convert to JPG
    with Image.open(input_path) as img:
        rgb_im = img.convert('RGB')
        rgb_im.save(output_jpg)
        print("JPG_CREATED")

    # Get Base64
    with open(input_path, "rb") as image_file:
        b64_data = base64.b64encode(image_file.read()).decode('utf-8')
    # Write Base64 to file
    with open("logo.b64", "w") as f:
        f.write(b64_data)
    print("B64_SAVED")

except Exception as e:
    print(f"ERROR: {e}")
    exit(1)
