import pathlib
from contextlib import suppress

from flask import Flask
from flask_login import LoginManager

from auth import auth as auth_blueprint
from globals import BASE_DIR
from globals import db
from main import main as main_blueprint
from models import User
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = '9OLWxND4o83j4K4iuopO'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'

db.init_app(app)
db.create_all(app=app)

app.register_blueprint(auth_blueprint)
app.register_blueprint(main_blueprint)

login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


with suppress(FileExistsError):
    pathlib.Path(BASE_DIR + "/application").mkdir()
    pathlib.Path(BASE_DIR + "/application/Recycle Bin").mkdir()

if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)
