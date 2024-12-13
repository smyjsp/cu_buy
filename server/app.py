from flask import Flask, request, jsonify
from SQLHandler import SQLAlchemyHandler
import os
from datetime import datetime

from models.base import Base
from models.User import User
from models.Category import Category
from models.Item import Item


app = Flask(__name__)

# Add this new endpoint to get all items
@app.route("/items", methods=["GET"])
def get_items():
    try:
        with handler.session_scope() as session:
            items = session.query(Item).all()
            items_list = []
            for item in items:
                items_list.append({
                    'id': item.id,
                    'title': item.title,
                    'price': item.price,
                    'imageUrl': f'http://3.149.231.33/images/{item.uni}/{item.image_filename}',
                    'description': item.description,
                    'seller': item.seller_uni
                })
            return jsonify(items_list), 200
    except Exception as e:
        print("Error fetching items:", str(e))
        return jsonify({
            'status': 'error',
            'message': 'Failed to fetch items'
        }), 500
# Add endpoint to post a new item
@app.route("/items", methods=["POST"])
def add_item():
    try:
        data = {
            'title': request.form.get('title'),
            'price': float(request.form.get('price')),
            'description': request.form.get('description'),
            'seller_uni': request.form.get('uni')
        }

        if 'image' not in request.files:
            return jsonify({
                'status': 'error',
                'message': 'No image provided'
            }), 400

        image = request.files['image']
        
        # Create directory for item images if it doesn't exist
        image_dir = f"./data/{data['seller_uni']}/items"
        os.makedirs(image_dir, exist_ok=True)

        # Generate unique filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"item_{timestamp}.jpg"
        image_path = os.path.join(image_dir, filename)
        
        # Save image
        image.save(image_path)

        with handler.session_scope() as session:
            new_item = Item(
                title=data['title'],
                price=data['price'],
                description=data['description'],
                seller_uni=data['seller_uni'],
                image_filename=filename
            )
            session.add(new_item)
            session.commit()

            return jsonify({
                'status': 'success',
                'message': 'Item added successfully',
                'data': {
                    'id': new_item.id,
                    'title': new_item.title,
                    'price': new_item.price,
                    'imageUrl': f'http://3.149.231.33/images/{new_item.seller_uni}/{filename}',
                    'description': new_item.description
                }
            }), 201

    except Exception as e:
        print("Error adding item:", str(e))
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# Add endpoint to serve images
@app.route("/images/<uni>/<filename>")
def serve_image(uni, filename):
    return send_from_directory(f"./data/{uni}", filename)

# Add endpoint to serve item images
@app.route("/images/<uni>/items/<filename>")
def serve_item_image(uni, filename):
    return send_from_directory(f"./data/{uni}/items", filename)




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

@app.route("/login", methods=["POST"])
def login():
    email = request.form.get('email')
    password = request.form.get('password')  # 假设密码是明文传输，实际应用中应使用加密传输

    if not email or not password:
        return jsonify({'status': 'error', 'message': 'Missing email or password'}), 400

    with handler.session_scope() as session:
        user = handler.get_user_by_email(session, email)
        if user and user.password == password:
            return jsonify({'status': 'success', 'message': 'Login successful'}), 200
        else:
            return jsonify({'status': 'error', 'message': 'Invalid credentials'}), 401


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

@app.route("/items", methods=["GET"])
def get_items():
    try:
        with handler.session_scope() as session:
            items = session.query(Item).all()
            items_list = []
            for item in items:
                items_list.append({
                    'title': item.title,
                    'price': item.price,
                    'imageUrl': f'http://3.149.231.33/images/{item.uni}/{item.image_filename}'
                })
            return jsonify(items_list), 200
    except Exception as e:
        print("Error fetching items:", str(e))
        return jsonify({
            'status': 'error',
            'message': 'Failed to fetch items'
        }), 500


# Run the Flask app
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)