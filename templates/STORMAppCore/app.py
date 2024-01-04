# description: Entry point of the application. Here we are doing all the initial setup
# of the application. This should be fine as is, but you can update as necessary.

# Core & third-party imports
from starlette.applications import Starlette
from starlette.config import Config
from starlette.datastructures import CommaSeparatedStrings
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles
from mongoengine import connect

# ST🌀RM stack imports
from support.storm_handlers import storm_index, not_found_handler, internal_server_error_handler
# your application routes should be added to the routes module below
from storm_routes import routes

# load configuration. non-database and secret key settings will be auto-synced from smrt_config/smrt_config.json
# You will be required to manage all other .env settings
config = Config('.env')

# Debug
DEBUG = config('DEBUG', cast=bool, default=True)
FRONTEND = config('FRONTEND')
FRONTEND_EXTENSIONS = config('FRONTEND_EXTENSIONS', cast=CommaSeparatedStrings)
DATABASE_URI = config('DATABASE_URI')

# connect to mongodb
print(f"Connecting to mongodb: {DATABASE_URI}")
connect(host=DATABASE_URI)

print(f"App frontend: {FRONTEND}")
print(f"Frontend extensions enabled: {FRONTEND_EXTENSIONS}")

# app routes. here we have the default routes which have our controller routes merged
# 📝 Developer Note: Your routes can be found in strm_routes/__init__.py. This is automatically
# generated when a new module is added via the CLI and so you don't need to necessarily edit this.
app_routes = [
    # default entry points
    # Application root (index)
    Route('/', endpoint=storm_index),
    # Static resources are located in the static folder in the root of this project
    Mount('/static', StaticFiles(directory='static'), name='static'),
] + routes

# app middleware. here we have the middleware which our app will use.
# 📝 Developer Note: You can add your middleware to the List as needed
# below. Refer to https://www.starlette.io/middleware/#using-middleware for more information about middleware
middleware = []

# application exception handlers :: 📝 Developer Note: Feel free to change the exception handlers as needed. Exception
# handlers are defined in a Dict The custom HTTP 500 error handler will only get triggered when debug=False.
# Otherwise, Starlette will print the traceback
exception_handlers = {
    404: not_found_handler,
    500: internal_server_error_handler,
}

# Starlette Application Start.
# 📝 Developer Note: Generally, you won't need to make any changes here.
app = Starlette(debug=DEBUG, routes=app_routes, middleware=middleware, exception_handlers=exception_handlers)
