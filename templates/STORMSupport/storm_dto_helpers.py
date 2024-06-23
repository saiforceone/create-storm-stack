# author: create-storm-stack
# description: Allows us to set up validation for incoming endpoints while utilizing Pydantic-based
# DTOs.
import functools
import inspect
import typing
from starlette.requests import Request
from starlette.responses import JSONResponse
from pydantic import BaseModel, ValidationError


def validate_with_dto(required_dto: typing.Type[BaseModel]):
    """
    Defines a decorator function that validates the request body based on a given DTO (pydantic)
    If validation fails, we will return a JSONResponse saying that data validation failed
    """
    def dto_exec_wrapper(func: typing.Callable) -> typing.Callable:
        sig = inspect.signature(func)
        for idx, parameter in enumerate(sig.parameters.values()):
            if parameter.name == "request":
                break
        else:
            raise Exception(
                f'No "request" argument on function "{func}"'
            )

        @functools.wraps(func)
        async def exec_dto_validation(*args, **kwargs):
            request = kwargs.get("request", args[idx] if idx < len(args) else None)
            assert isinstance(request, Request)

            try:
                body_data = await request.json()
                dto_instance = required_dto(**body_data)
            except ValidationError as ve:
                print(f"exception from dto_helper... {ve.__str__()}")
                return JSONResponse({
                    "success": False,
                    "message": "ERR_INVALID_PAYLOAD"
                }, 400)
            except Exception as e:
                print(f"uncaught exception from dto_helper... {e.__str__()}")
                return JSONResponse({
                    "success": False,
                    "message": "ERR_OPERATION_FAILED"
                }, 500)

            # send the body data to the calling function. will need to assert on the receiving end
            kwargs.__setitem__('body_data', dto_instance)

            return await func(*args, **kwargs)

        return exec_dto_validation

    return dto_exec_wrapper
