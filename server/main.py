from http.server import BaseHTTPRequestHandler, HTTPServer
import json
from dotenv import load_dotenv
import os
import openai
from tools import *

load_dotenv()

openai.api_key = os.environ["openai_key"]

if openai.api_key is None:
    print(
        "Error: OpenAI API key not found. Please make sure it is defined in a .env file in the root directory."
    )
    exit(1)

conversation_history = [
    {"role": "system", "content": "The order is late - what would you like to do?"}
]

found_definitions = False

while not found_definitions:
    user_input = input("User: ")
    conversation_history.append({"role": "user", "content": user_input})

    assistant_response = retrieve_tool_and_params_definition(conversation_history)
    conversation_history.append({"role": "assistant", "content": assistant_response})

    print("Assistant:", assistant_response)

    if assistant_response.startswith("Definitions found:"):
        found_definitions = True

# Extract tool_name and parameters_definition from assistant_response
definitions = assistant_response[len("Definitions found: ") :].split(", ", 1)
tool_name = definitions[0].strip()
parameters_definition = definitions[1].strip()

print("Tool Name:", tool_name)
print("Parameters Definition:", parameters_definition)

print(conversation_history)

tool = pick_tool(conversation_history)

if tool:
    tool_params = extract_tool_parameters(tool.__name__, conversation_history)
    print("Extracted parameters:", tool_params)

    # Call the tool function with the extracted parameters
    result = tool(**tool_params)
    print("Result:", result)
else:
    print("No matching tool found.")


#
#
# def question_interpreter(json):
#     interpretation = openai.ChatCompletion.create(
#       model="gpt-3.5-turbo",
#       messages=[
#         {"role": "system", "content": "You help translate a JSON file into a question to a user."
#                                       "The JSON will contain information of why the user is being notified"
#                                       "And you need to ask that question to the user directly. Your task is to help the user"
#                                       "decide what action to take. End with 'what should we do?' "},
#         {"role": "user", "content": f"{json}"},
#       ],temperature = 0,
#     )
#
#     return interpretation.choices[0].message.content
#
# def final_answer(history):
#     interpretation = openai.ChatCompletion.create(
#       model="gpt-4",
#       messages=[
#         {"role": "system", "content": " You have to extract the final action that needs to be taken"
#                                       "out of the context provided to you."
#                                       "The only available options are: cancel_order, send_email, read_history, other "
#                                       f"''' full conversation: {history} '''"
#                                       ""}
#       ],temperature = 0,
#     )
#
#     return interpretation.choices[0].message.content
#
#
class WebhookHandler(BaseHTTPRequestHandler):
    def _send_response(self, message):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(bytes(json.dumps(message), "utf8"))

    def do_POST(self):
        content_length = int(self.headers["Content-Length"])
        post_data = self.rfile.read(content_length)
        post_data = json.loads(post_data)

        # Extract relevant information from the JSON data
        user_input = post_data.get("message")

        # Add the user input to the conversation history
        conversation_history.append({"role": "user", "content": user_input})

        # Generate the assistant's response
        assistant_response = retrieve_tool_and_params_definition(conversation_history)
        conversation_history.append(
            {"role": "assistant", "content": assistant_response}
        )

        # Send the assistant's response to the frontend
        self._send_response({"message": assistant_response})


class MessagesHandler(BaseHTTPRequestHandler):
    def _send_response(self, messages):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(bytes(json.dumps(messages), "utf8"))

    def do_GET(self):
        if self.path == "/api/messages":
            self._send_response(conversation_history)


if __name__ == "__main__":
    server_address = ("0.0.0.0", 8001)  # listens on all IPs, port 8001

    class CustomHTTPServer(HTTPServer):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.RequestHandlerClass.protocol_version = "HTTP/1.0"

        def finish_request(self, request, client_address):
            if request.path == "/api/messages":
                self.RequestHandlerClass = MessagesHandler
            else:
                self.RequestHandlerClass = WebhookHandler
            super().finish_request(request, client_address)


httpd = CustomHTTPServer(server_address)

print("Running server...")
httpd.serve_forever()
