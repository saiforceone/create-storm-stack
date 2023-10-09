import json
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

basedir = os.path.abspath(os.path.dirname(__file__))
secret_key = os.environ.get('flak_sec')

# initialize sql alchemy
db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    # app configuration

    # read app configuration json and set app config dict as required
    try:
        print(f"Loading app with debug mode: {app.config['DEBUG']}")
        # Read config file
        flak_config_path = os.path.join(basedir, 'flak_config.json')
        flak_config_data = open(flak_config_path)
        flak_config = dict(json.load(flak_config_data))
        flak_config_data.close()

        # read app id and then retrieve the secret key from env
        app_id = flak_config.get('appId')

        if app_id is None:
            raise AttributeError("Invalid or no app id found in configuration file", "appId")

        flak_app_id = flak_config['appId']

        app_key_path = f"flak_dev_key_{flak_app_id}" if app.config['DEBUG'] else f"flak_key_{flak_app_id}"

        # try to get environment key or print warning
        app_key = os.environ.get(app_key_path)

        if app_key is None:
            app.config['SECRET_KEY'] = 'thi$-is-@-secret-k#y?'  # FALLBACK KEY
            print("Warning: no environment variable set for secret key using temporary secret key...")
        else:
            app.config['SECRET_KEY'] = app_key

        flak_db_settings = flak_config.get('flakDatabase')

        if flak_db_settings is None:
            raise AttributeError("invalid database option", "flakDatabase")

        if flak_db_settings.get('dbms') is None:
            raise AttributeError("database system not specified", "flakDatabase.dbms")

        if flak_db_settings.get('path') is None:
            raise AttributeError("database was not specified", "flakDatabase.path")

        if flak_db_settings['dbms'] == 'sqlite':
            app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, flak_db_settings['path'])
        else:
            app.config['SQLALCHEMY_DATABASE_URI'] = flak_db_settings['path']

        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

        app.config['FLAK_VITE_PORT'] = flak_config['flakVitePort'] if flak_config['flakVitePort'] is not None else 3003

        if flak_config['flakViteHost'] is not None:
            app.config['FLAK_VITE_HOST'] = flak_config['flakViteHost']

        if flak_config['flakFrontendEntryPoint'] is not None:
            app.config['FLAK_ENTRYPOINT'] = flak_config['flakFrontendEntryPoint']

        if app.config['DEBUG']:
            print(f" * FE Entrypoint: {app.config['FLAK_ENTRYPOINT']}")
            print(f" * Running frontend on: {app.config['FLAK_VITE_HOST']}:{app.config['FLAK_VITE_PORT']}")

        # Initialize application
        db.init_app(app)
        # set up flask migration
        migrate = Migrate(app, db)

        # Context, tell SQL Alchemy to create all tables / flak_models
        with app.app_context():
            db.create_all()

        return app
    except RuntimeWarning as warn:
        print(f"Application warning: {warn}")
    except AttributeError as a_err:
        print(f"Failed to retrieve attribute error: {a_err}")
    except RuntimeError as err:
        print(f"App start error: {err}")
    except Exception as exception:
        print(f"failed to load json config file with error: {exception.__str__()}")
