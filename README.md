## 1871 CHATGPT HACKATHON 2023

### Team Members

- [Arnoldas Kemeklis](https://github.com/arnasltlt)
- [Tyler Hill](https://github.com/tyler-hill)

### Project Description

This project is an interactive web application that enables users to receive notifications about issues and communicate with ChatGPT to resolve them. Users can discuss the problem, gather more information, and instruct ChatGPT to perform specific actions to address the issue. The application is built using Python for the backend and React for the frontend.

### Backend Setup

1. Ensure you have Python 3.7 or later installed.
2. (Optional) Create a virtual environment using `python -m venv myenv` and activate it with `source myenv/bin/activate` (Linux/Mac) or `myenv\Scripts\activate` (Windows).
3. Create a .env file in the server directory and add your OpenAI API key as follows: openai_key=YOUR_API_KEY_HERE
4. Install the required Python packages using `pip install -r requirements.txt`
5. Run the backend server by navigating to the folder containing `main.py` and executing `python main.py`.

### Frontend Setup

1. Ensure you have Node.js and npm (or yarn) installed.
2. Navigate to the frontend project folder in the terminal.
3. Install the required packages by running `npm install` (or `yarn install` if you prefer yarn).
4. Start the frontend development server by running `npm start` (or `yarn start`).

After setting up both the backend and frontend, open a web browser and visit `http://localhost:8001` to interact with the app.

### Project Structure

- `main.py`: The main Python file that runs the HTTP server and handles the routing of incoming requests.
- `tools.py`: A Python file that contains the functions and logic for the available tools (actions) ChatGPT can perform based on user input.
- `app.js`: The main React file that sets up the frontend application.
- `MessageList.js`: A React component for displaying the list of messages in the conversation.
- `MessageForm.js`: A React component for handling user input and submitting messages.

### Features

- Receive notifications about issues
- Engage in a conversation with ChatGPT to learn more about the issue and decide on an action
- Instruct ChatGPT to execute the chosen action

### Tools (Actions)

- Generate a price quote
- Schedule a meeting
- Process a refund
- Update inventory
- (Add more tools as needed)

### Technologies Used

- Python
- OpenAI API (GPT-4)
- React
- HTTPServer (Python)
