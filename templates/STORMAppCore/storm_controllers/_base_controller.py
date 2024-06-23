# author: create-storm-stack

# core imports
import logging

from starlette.endpoints import HTTPEndpoint
from starlette.types import Scope, Receive, Send

from storm_types.storm_types import StormAPIResponse, StormResponseMeta

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
ConsoleLogger = logging.StreamHandler()
logger.addHandler(ConsoleLogger)


class StormBaseController(HTTPEndpoint):
    """
    Defines a base controller that all controllers will inherit from. This will have built-in methods
    that can simplify returning responses
    📝 Developer Note:
    """

    def __init__(self, scope: Scope, receive: Receive, send: Send):
        """
        Sets up the controller based on HTTP endpoint
        """
        super().__init__(scope, receive, send)
        self.logger = logger

    @staticmethod
    def build_response(success: bool = False, message: str = '', meta=None, data=None) -> StormAPIResponse:
        """
        Builds a standard response object that will be sent back for api responses
        """
        if meta is None:
            meta = {}
        if data is None:
            data = {}
        return {
            "success": success,
            "message": message,
            "data": data,
            "meta": meta
        }
