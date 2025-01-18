from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate 


db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config.from_object('config.Config')
    db.init_app(app)

    migrate = Migrate(app, db)

    from app.routes import getAllData, upload,saveData, delete, getDataById
    app.register_blueprint(getAllData.bp)
    app.register_blueprint(upload.bp)
    app.register_blueprint(saveData.bp)
    app.register_blueprint(delete.bp)
    app.register_blueprint(getDataById.bp)

    return app
