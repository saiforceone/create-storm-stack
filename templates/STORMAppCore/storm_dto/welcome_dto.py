# Core imports
from pydantic import BaseModel


class WelcomeDTO(BaseModel):
    """
    Developer Note: The general idea is to use a DTO for validation of incoming data to
    API endpoints. This class is just an example of the structure of a DTO. You may want to
    import the typing module for more robust typing in your DTOs.
    For more information on using Pydantic: https://docs.pydantic.dev/latest/
    """
    label: str
