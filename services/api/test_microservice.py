import requests
import os
from PIL import Image
import io
import json

def create_test_image() -> io.BytesIO:
    """Create a simple test image with a colored rectangle"""
    # Create a new image 
    img = Image.new('RGB', (200, 200), color='white')
    
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    
    return img_byte_arr

def test_microservice():
    # URL of the microservice
    url = "http://localhost:5050/analyze"

    test_image = create_test_image()
    
    files = {
        'image': ('test_plant.jpg', test_image, 'image/jpeg')
    }
    data = {
        'prompt': 'Test analysis of plant health'
    }
    
    print("\n=== Starting Microservice Test ===")
    print("\n1. Preparing Request:")
    print(f"   URL: {url}")
    print(f"   Files: {list(files.keys())}")
    print(f"   Data: {data}")
    
    print("\n2. Sending Request to Microservice...")
    
    try:
        # Send the request
        response = requests.post(url, files=files, data=data)
        
        print("\n3. Response Received:")
        print(f"   Status Code: {response.status_code}")
        print(f"   Content Type: {response.headers.get('content-type', 'Not specified')}")
        print(f"   Content Length: {len(response.content)} bytes")
        
        # Check the response
        if response.status_code == 200:
            print("\n4. Processing Successful Response:")
            
            # Save the PDF
            with open('test_report.pdf', 'wb') as f:
                f.write(response.content)
            print(" PDF report saved as 'test_report.pdf'")
            

            print(f"PDF size: {len(response.content)} bytes")
            
            print("\n=== Test Completed Successfully ===")
        else:
            print("\n4. Error Response:")
            print(f"   Error Code: {response.status_code}")
            print(f"   Error Message: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("\n3. Connection Error:")
        print("   Could not connect to the microservice. Make sure it's running!")
    except Exception as e:
        print(f"\n3. Unexpected Error: {str(e)}")

if __name__ == "__main__":
    test_microservice() 