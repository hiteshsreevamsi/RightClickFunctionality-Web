import os

from flask_sqlalchemy import SQLAlchemy

# init SQLAlchemy so we can use it later in our models
db = SQLAlchemy()
BASE_DIR = os.path.abspath(os.curdir)
