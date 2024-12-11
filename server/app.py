from flask import Flask, request, jsonify
from SQLHandler import SQLAlchemyHandler
from models import Base, User, Category, Item
import os

app = Flask(__name__)

# Configuration
DATABASE_URL = os.environ.get('DATABASE_URL_USERS', 'mysql+pymysql://root:your_password@127.0.0.1:3306/users')

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
        
        print("Received data:", data)  # Debugging log
        print("Received files:", request.files)  # Debugging log
        
        with handler.session_scope() as session:
            try:
                if handler.get_user_by_email(session, data['email']):
                    return jsonify({
                        'status': 'error',
                        'message': 'User already exists'
                    }), 400
                if not os.path.exists(f"./data/{data['uni']}"):
                    # save the image to the folder
                    os.makedirs(f"./data/{data['uni']}", exist_ok=True)
                    if 'profileImage' in request.files:
                        request.files['profileImage'].save(f"./data/{data['uni']}/profileImage.jpg")
                        profile_image_url = f"./data/{data['uni']}/profileImage.jpg"
                    if 'idImage' in request.files:
                        request.files['idImage'].save(f"./data/{data['uni']}/idImage.jpg")
                        id_card_image_url = f"./data/{data['uni']}/idImage.jpg"
                else:
                    return jsonify({
                        'status': 'error',
                        'message': 'User already exists'
                    }), 400
                new_user = User(
                    name=data['firstName'] + " " + data['lastName'],
                    email=data['email'],
                    uni=data['uni'],
                    profile_image_url=profile_image_url,
                    id_card_image_url=id_card_image_url
                )
                session.add(new_user)
                session.commit()
                return jsonify({
                    'status': 'success',
                    'message': 'Registration data received successfully',
                    'data': data
                }), 200
            except Exception as db_error:
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