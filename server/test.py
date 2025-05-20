from google import genai

client = genai.Client(api_key="AIzaSyCv4N3b9yVHIADUf808AhKlUcwguhnABdo")

myfile = client.files.upload(file="image.png")

response = client.models.generate_content(
    model="gemini-2.0-flash", contents=["Describe this image", myfile]
)

print(response.text)

