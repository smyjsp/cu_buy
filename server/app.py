from flask import Flask, request, jsonify

app = Flask(__name__)

# Define a route for the root URL
@app.route("/")
def home():
    return "Hello, Flask!"

# Define another route
@app.route("/about")
def about():
    return "This is a basic Flask server!"

@app.route("/register", methods=["POST"])
def register():
    try:
        # Get form data
        data = {
            'firstName': request.form.get('firstName', ''),
            'lastName': request.form.get('lastName', ''),
            'email': request.form.get('email', ''),
            'uni': request.form.get('uni', ''),
        }
        
        # Handle file uploads
        if 'profileImage' in request.files:
            data['profileImage'] = request.files['profileImage'].filename
        
        if 'idImage' in request.files:
            data['idImage'] = request.files['idImage'].filename

        print("Received data:", data)  # For debugging
        print("Received files:", request.files)
        
        return jsonify({
            'status': 'success',
            'message': 'Registration data received successfully',
            'data': data
        }), 200

    except Exception as e:
        print("Error:", str(e))  # For debugging
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

# Run the Flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0",debug=True)