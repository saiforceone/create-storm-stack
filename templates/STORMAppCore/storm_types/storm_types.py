import typing
from typing import NewType, TypedDict

STORM_JWT_OPTIONS = NewType('STORM_JWT_OPTIONS', dict)


class StormJWTOptions(TypedDict):
    audience: str
    client_secret: str
    issuer: str
    signing_algorithm: str


class StormAPIResponse(TypedDict):
    success: bool
    message: str
    data: typing.Dict | typing.List[typing.Dict]
    meta: typing.Dict


class StormResponseMeta(TypedDict):
    detail: str
    resource: str
