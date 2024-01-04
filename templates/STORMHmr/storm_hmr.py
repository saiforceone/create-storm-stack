# author: SaiForceOne
# description: Adds the functionality to support vite's HMR when in debug
# mode and a normal script tag that points to main.js when not in Debug
import os
from jinja2_simple_tags import StandaloneTag
from starlette.config import Config
from starlette.datastructures import URL

# read application configuration
BASE_DIR = os.path.dirname(__file__)
config_path = os.path.abspath(os.path.join(BASE_DIR, '..', '.env'))
config = Config(config_path)


class StormHmrExtension(StandaloneTag):
    """
    Creates the Vite tags extension
    """
    safe_output = True
    tags = {"strm_hmr"}
    is_debug = config('DEBUG', cast=bool, default=True)

    def render(self):
        if self.is_debug:
            # retrieve settings for dev mode
            frontend_entrypoint = config('FRONTEND_ENTRYPOINT')
            vite_port = config('VITE_PORT', cast=int, default=3003)
            vite_host = config('VITE_HOST', cast=URL)

            # Print debug output
            print(f"debug mode: {self.is_debug}")
            print(f"debug mode, STRM CLI vite port: {vite_port}")

            # set up paths
            vite_client_src = f"{vite_host}:{vite_port}/static/@vite/client"
            component_src = f"{vite_host}:{vite_port}/static/src/{frontend_entrypoint}"

            return f"<script type=\"module\" src=\"{vite_client_src}\"></script>" \
                   f"\n<script type=\"module\" src=\"{component_src}\"></script>"

        # once we're not running in debug, we will always return /static/dist/main.js
        return "<script src=\"/static/dist/main.js\"></script>"
