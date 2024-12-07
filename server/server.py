from flask import Flask

app = Flask(__name__)

# Define a route for the root URL
@app.route("/")
def home():
    return "Hello, Flask!"

# Define another route
@app.route("/about")
def about():
    return "This is a basic Flask server!"

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)