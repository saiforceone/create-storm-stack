from jinja2_simple_tags import StandaloneTag


class FTLViteTags(StandaloneTag):
    """
    Creates the Vite tags extension
    """
    safe_output = True
    tags = {"ftl_vite_tags"}
    is_debug = False

    def render(self):
        config = self.context.__getitem__('config')

        if config is not None:
            self.is_debug = config["DEBUG"]

        if self.is_debug:
            # Print debug output
            print("debug mode: {}".format(self.is_debug))
            print("debug mode, FTL CLI vite port: {}".format(config['FTL_VITE_PORT']))

            # set up paths
            vite_client_src = f"{config['FTL_VITE_HOST']}:{config['FTL_VITE_PORT']}/static/@vite/client"
            component_src = f"{config['FTL_VITE_HOST']}:{config['FTL_VITE_PORT']}/static/src/{config['FTL_ENTRYPOINT']}"

            return f"<script type=\"module\" src=\"{vite_client_src}\"></script>" \
                   f"\n<script type=\"module\" src=\"{component_src}\"></script>"

        return "<script src=\"/static/dist/main.js\"></script>"
