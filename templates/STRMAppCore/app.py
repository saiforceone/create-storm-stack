# description: Entry point of the application. Here we are doing all the initial setup
# of the application. This should be fine as is, but you can update as necessary.

# Core & third-party imports
from starlette.applications import Starlette
from starlette.config import Config
from starlette.datastructures import CommaSeparatedStrings
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates
from mongoengine import connect

# STORM stack imports
from support.smrt_hmr import SmrtHmrExtension
# your application routes should be added to the routes module below
from smrt_routes import routes

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

# template setup
templates = Jinja2Templates(directory='templates')
# HMR Extension
templates.env.add_extension(SmrtHmrExtension)
# -- Add other extensions below this line --


async def index(request):
    """
    Loads the index page which is contains our Reactive application
    """
    return templates.TemplateResponse(request, 'app.html')


# app routes. here we have the default routes which have our controller routes merged
app_routes = [
    # default entry points
    Route('/', endpoint=index),
    Mount('/static', StaticFiles(directory='static'), name='static'),
] + routes
# app middleware. here we have the default middleware which our app will use. You can add
middleware = []
app = Starlette(debug=DEBUG, routes=app_routes, middleware=middleware)
