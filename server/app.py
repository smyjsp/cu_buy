from flask import Flask, request, jsonify, send_from_directory
from SQLHandler import SQLAlchemyHandler
import os
from datetime import datetime
import json

from models.base import Base
from models.User import User
from models.Category import Category
from models.Item import Item


app = Flask(__name__)

# Add endpoint to post a new item
@app.route("/items", methods=["POST"])
def add_item():
    try:
        # Parse transaction_location from JSON string
        transaction_location = request.form.get('transaction_location')
        if transaction_location:
            transaction_location = json.loads(transaction_location)

        data = {
            'title': request.form.get('title'),
            'price': float(request.form.get('price')),
            'description': request.form.get('description'),
            'condition': request.form.get('condition'),
            'user_id': 1,
            'transaction_location': transaction_location,
            'pickup_start_datetime': request.form.get('pickup_start_datetime'),
            'pickup_end_datetime': request.form.get('pickup_end_datetime'),
            'category_id': request.form.get('category')
        }

        # Validate condition is one of the allowed values
        if data['condition'].lower() not in ['like new', 'good', 'fair', 'poor']:
            return jsonify({
                'status': 'error',
                'message': 'Invalid condition value: ' + data['condition']
            }), 400

        # Check for at least one image
        if 'image1' not in request.files:
            return jsonify({
                'status': 'error',
                'message': 'No image provided'
            }), 400
        # HARD CODED FOR NOW
        data['uni'] = 'lol9999'
        # Create directory for item images if it doesn't exist
        image_dir = f"./data/{data['uni']}/items"
        os.makedirs(image_dir, exist_ok=True)

        # Generate base filename with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Save each image with a unique filename
        image_filenames = []
        for i in range(1, 4):
            image_key = f'image{i}'
            if image_key in request.files and request.files[image_key]:
                image = request.files[image_key]
                filename = f"item_{timestamp}_{i}.jpg"
                image_path = os.path.join(image_dir, filename)
                image.save(image_path)
                image_filenames.append(image_path)
                
        # Concatenate image_filenames into a single string
        image_urls = ', '.join(image_filenames)

        with handler.session_scope() as session:
            new_item = Item(
                title=data['title'],
                description=data['description'],
                condition=data['condition'].lower(),
                price=data['price'],
                category_id=int(data['category_id']) if data['category_id'] else None,
                user_id=data['user_id'],
                image_url=image_urls,
                transaction_location=json.dumps(data['transaction_location']) if data['transaction_location'] else None,
                pickup_start_datetime=datetime.fromisoformat(data['pickup_start_datetime'].replace('Z', '+00:00')) if data['pickup_start_datetime'] else None,
                pickup_end_datetime=datetime.fromisoformat(data['pickup_end_datetime'].replace('Z', '+00:00')) if data['pickup_end_datetime'] else None
            )
            
            session.add(new_item)
            session.commit()

            return jsonify({
                'status': 'success',
                'message': 'Item added successfully',
                'data': {
                    'id': new_item.id,
                    'title': new_item.title,
                    'price': float(new_item.price),
                    'imageUrls': [f'http://3.149.231.33/images/items/{filename}' 
                                for filename in image_filenames],
                    'description': new_item.description,
                    'condition': new_item.condition,
                    'transaction_location': new_item.transaction_location,
                    'pickup_start_datetime': new_item.pickup_start_datetime.isoformat() if new_item.pickup_start_datetime else None,
                    'pickup_end_datetime': new_item.pickup_end_datetime.isoformat() if new_item.pickup_end_datetime else None,
                    'category_id': new_item.category_id
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
            return jsonify({'status': 'success', 'message': 'Login successful', 'data': user.to_dict()}), 200
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

# Run the Flask app
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)