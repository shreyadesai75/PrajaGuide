from flask import Flask
import os
from dotenv import load_dotenv
from .models import db

# Load environment variables
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

def create_app():
    app = Flask(__name__)
    app.secret_key = os.urandom(24) # Required for session/flash messages

    # Configure Database
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///prajaguide.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    
    with app.app_context():
        db.create_all()

    # Register Main Blueprint
    from .routes import main
    app.register_blueprint(main)

    # Register Chatbot Blueprint
    # We import inside the function to avoid circular dependency issues
    from chatbot.app import chatbot
    app.register_blueprint(chatbot)

    return app