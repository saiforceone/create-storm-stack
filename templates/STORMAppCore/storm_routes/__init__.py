# Description: ST🌀RM Stack Routes

# Core & third-party imports
from starlette.routing import Route

# ST🌀RM Stack Controller imports
from storm_controllers import *

routes = [
    Route('/api/welcome', WelcomeController),
]
