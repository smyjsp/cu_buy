from flask import Flask, request, jsonify
from SQLHandler import SQLAlchemyHandler
from models import Base, User, Category, Item
import os

app = Flask(__name__)

# Configuration
DATABASE_URL = os.environ.get('DATABASE_URL', 'mysql+pymysql://root:your_password@3.149.231.33:3306/')

app.config['DATABASE_URL'] = DATABASE_URL

# Initialize SQLAlchemy handler
handler = SQLAlchemyHandler(app.config['DATABASE_URL'])

# Define a route for the root URL
@app.route("/")
def home():
    return "Hello, Flask!"

# Define another route
@app.route("/about", methods=["GET"])
def about():
    return "This is a basic Flask server!"

@app.route("/register", methods=["POST"])
def register():
    try:
        data = {
            'firstName': request.form.get('firstName', ''),
            'lastName': request.form.get('lastName', ''),
            'email': request.form.get('email', ''),
            'uni': request.form.get('uni', ''),
        }
        
        # File handling
        if 'profileImage' in request.files:
            data['profileImage'] = request.files['profileImage'].filename
        if 'idImage' in request.files:
            data['idImage'] = request.files['idImage'].filename
        
        print("Received data:", data)  # Detailed logging
        print("Received files:", request.files)
        
        with handler.session_scope() as session:
            try:
                new_user = User(**data)
                session.add(new_user)
                session.commit()
                return jsonify({
                    'status': 'success',
                    'message': 'Registration data received successfully',
                    'data': data
                }), 200
            except Exception as db_error:
                session.rollback()
                print("Database Error:", str(db_error))
                return jsonify({
                    'status': 'database_error',
                    'message': str(db_error)
                }), 500
    
    except Exception as e:
        print("Unexpected Error:", str(e))
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

# Run the Flask app
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)