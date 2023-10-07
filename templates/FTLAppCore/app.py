from flask import render_template

from . import create_app
from .support.flak_tags import FlakViteTags

# auto import controllers from __init__
from .flak_controllers import *


app = create_app()

# Safety check
if app is None:
    raise RuntimeError("Failed to start Flak Stack application. Did your configuration file get corrupted or deleted?")

app.app_context().push()

# add extension to Jinja2 Environment
app.jinja_env.add_extension(FlakViteTags)


@app.route("/")
def entry():
    return render_template("app.html")


# Error Handling
@app.errorhandler(404)
def not_found(e):
    if app.config['DEBUG']:
        print(f" * WARNING: 404 Redirect triggered. {e}")
    return render_template("app.html")

# Add your error handlers here for 400, 401, 500 etc


# Add routes after here
@app.route("/api/hello")
def api_hello():
    # test function that returns a JSON response such as from an API
    return {
        "message": "Hello API!"
    }


# URL Rules will get added below when a controller is generated

# add rule for single resource
app.add_url_rule("/api/welcome/", view_func=WelcomeController.as_view(name='Welcome'))
