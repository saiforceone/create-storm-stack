# description: Sets up Sentry within your project.
# Developer note: feel free to customize the options for sentry as needed.

# Core imports
from starlette.config import Config
import sentry_sdk

# Load configuration from .env
config = Config('.env')

# Developer note: you will need to add your Sentry DSN to your .env file in the root of the project.
sentry_sdk.init(
    dsn=config.get('SENTRY_DSN', default=''),
    enable_tracing=True,
    traces_sample_rate=1.0,
    profiles_sample_rate=1.0,
)
