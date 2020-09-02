import os
import shutil
from collections import defaultdict
from contextlib import suppress
from pathlib import Path

from flask import Blueprint
from flask import render_template, request, jsonify
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from flask_cors import cross_origin
from globals import BASE_DIR

main = Blueprint('main', __name__)


@main.route('/')
def index():
    return render_template('index.html')


tree_ = list()


def del_none(d):
    if isinstance(d, list):
        for item in d:
            for key, value in list(item.items()):
                if not value:
                    del item[key]
                elif isinstance(value, list):
                    del_none(value)
        return d
    elif isinstance(d, dict):
        for key, value in list(d.items()):
            if not value:
                del d[key]
            if isinstance(value, list):
                del_none(value)
        return d


def tree(dir_path: Path, inner_tree=None):
    if inner_tree is None:
        inner_tree = defaultdict(children=list())
        tree_.append(inner_tree)
    inner_tree["name"] = dir_path.name

    contents = list(dir_path.iterdir())
    for path in contents:
        child = defaultdict(children=list())
        child["name"] = path.name
        inner_tree["children"].append(child)
        if path.is_dir():
            tree(path, inner_tree=child)
    return inner_tree


@main.route('/tree', defaults={"path": None}, methods=["GET", "POST", "DELETE"])
@main.route('/tree/<path:path>', methods=["GET", "POST", "DELETE"])
def file_system_tree(path):
    usr_dir = Path(os.path.join(BASE_DIR, "application", path if path else ""))
    if request.method == "GET":
        global tree_
        if not usr_dir.exists():
            # usr_dir.mkdir()
            return jsonify([])
        tree(usr_dir)
        usr_tree = tree_.copy()
        tree_ = list()
        return jsonify(usr_tree)
    elif request.method == "POST":
        form = request.form
        if form["type"].lower() == "folder":
            try:
                os.makedirs(usr_dir / form["path"])
                return "", 200
            except FileExistsError:
                return {"message": "Folder already Exists"}, 400
        elif form["type"].lower() == "file":
            file_ = request.files["file"]
            file_dir = usr_dir / form["path"]
            with suppress(FileExistsError):
                os.makedirs(file_dir)
            file_.save(file_dir / secure_filename(file_.filename))
            return "", 200
    elif request.method == "DELETE":
        form = request.form
        shutil.move((usr_dir / form["path"]).as_posix(), (usr_dir / "Recycle Bin").as_posix())
        return "", 200


@main.route('/profile')
@login_required
def profile():
    return ""
