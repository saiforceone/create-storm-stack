# Description: ST🌀RM Stack Routes

# Core & third-party imports
from starlette.routing import Route

# ST🌀RM Stack Controller imports
from smrt_controllers import *

routes = [
    Route('/api', WelcomeController),
]
