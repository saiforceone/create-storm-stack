# Description: Generic controller example. You should probably replace this with something
# that better fits your project
from flask.views import MethodView


class WelcomeController(MethodView):

    def get(self):
        return {
            'message': 'Welcome to the FTL Stack'
        }
