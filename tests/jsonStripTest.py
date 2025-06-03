import re

ai_response_content = """
    ```json
    {
        "disease_detected": "Pear leaf spot",
        "confidence": "85%",
        "severity": "Medium",
        "recommendations": [
            "Remove and destroy affected leaves to prevent further spread.",
            "Apply a fungicide specifically labeled for pear leaf spot, following the product instructions carefully."
        ],
        "plant_health": "60%"
    }
    ```
"""

# remove the ```json and ``` from the response
if ai_response_content.strip().startswith("```"):
    # Remove triple backticks and optional 'json' after them
    ai_response_content = re.sub(r"^```(?:json)?\s*", "", ai_response_content.strip(), flags=re.IGNORECASE)
    ai_response_content = re.sub(r"\s*```$", "", ai_response_content.strip())

print(ai_response_content)
