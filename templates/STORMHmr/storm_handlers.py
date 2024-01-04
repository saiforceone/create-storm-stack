# Author: SaiForceOne
# Description: A collection of default route handlers including exception handlers for routes
# served by Starlette

# Core & Third-party imports
import re
from starlette.responses import JSONResponse
from starlette.templating import Jinja2Templates

# STRM Imports
from support.storm_hmr import StormHmrExtension

# Regular expression for url path matching
URL_PATTERN = r"^/api(/\S+)?(\?\S+)?$"

# template setup
templates = Jinja2Templates(directory='templates')

# HMR Extension
templates.env.add_extension(StormHmrExtension)


# -- 📝 Developer note: Add other extensions below this line as needed --


def build_error_json_response(request, message, status_code):
    """Helper function that builds a standard JSON response

    :param request: the request passed in from the route handler
    :type request: Request
    :param message: the string of text to be shown as the message property
    :type message: str
    :param status_code: the http status code
    :type status_code: int
    :return: an object that will be used as a JSON response
    :rtype: dict
    """

    return {
        'message': message,
        'success': False,
        'statusCode': status_code,
        'data': None,
        'meta': {
            'path': request.url.path,
            'queryParams': str(request.query_params),
            'pathParams': request.path_params
        }
    }


def build_context_object(request, exc):
    """Helper function that builds a standard 'context' object to be passed to a Jinja2 template

    :param request: The request passed in from the route handler
    :type request: Request
    :param exc: The exception passed in from the route handler
    :return: a dict representing a context object
    :rtype: dict
    """
    return {
        'request': request,
        'exception_headers': exc.headers,
        'exception_detail': exc.detail,
        'status_code': exc.status_code
    }


async def storm_index(request):
    """Loads the index page which is contains our Reactive application

    :param request: The request passed in from the route handler
    :return: a Starlette Template Response that renders app.html which contains the Reactive UI
    :rtype: templates.TemplateResponse
    """
    return templates.TemplateResponse(request, 'app.html')


async def not_found_handler(request, exc):
    """
    Handles the redirect to the general 404 - not found page or in the case of an api-related resource, returns a JSON
    Response containing error details
    The template will render out relevant details from the exc (exception) or in the case of JSON, return the relevant
    details in the Dictionary
    """
    print("404 not found error handler")
    if re.match(URL_PATTERN, request.url.path):
        return JSONResponse(
            build_error_json_response(request, 'The 🌀 blew away the resource you were looking for', exc.status_code))

    context = build_context_object(request, exc)

    return templates.TemplateResponse(request, '404.html', context=context, status_code=exc.status_code)


async def internal_server_error_handler(request, exc):
    """
    Handles the internal server error / HTTP 500 page or in the case of an API related url, we return the appropriate
    JSON response
    """
    print("internal server error handler triggered")
    if re.match(URL_PATTERN, request.url.path):
        return JSONResponse(
            build_error_json_response(request, 'The not-so-perfect 🌀 has broken your app', 500)
            , status_code=500)

    context = build_context_object(request, exc)

    return templates.TemplateResponse(request, '500.html', context=context, status_code=500)
