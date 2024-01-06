# Description: Welcome Controller that serves as an example of how you can build controllers.
# You should replace this with something that better fits your project. For more information
# on how to use Starlette's HTTPEndpoints see: https://www.starlette.io/endpoints/#httpendpoint

# core & third-party imports
from starlette.endpoints import HTTPEndpoint
from starlette.responses import JSONResponse


class WelcomeController(HTTPEndpoint):
    """
    Represents an example of what a controller should look like for the STRM
    Stack. As this is an example, you should use this as a reference.
    """
    def get(self, request):
        """
        Return a basic JSONResponse that will be consumed by the Frontend's
        welcome page (component)
        """
        return JSONResponse({
            'success': True,
            'message': 'Welcome to the STORM Stack',
            'data': {
                'stack': [{
                    'component': 'Starlette',
                }, {
                    'component': 'Tailwind CSS'
                }, {
                    'component': 'Reactive UI (Vite)'
                }, {
                    'component': 'MongoDB'
                }],
            },
        })
