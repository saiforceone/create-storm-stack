# S.T.🌀.R.M Stack CLI (beta)

Introducing the S.T.🌀.R.M Stack, the easiest way to create modern fullstack web application.
We believe that using S.T.🌀.R.M will be a breeze 🙃

## Requirements

The S.T.🌀.R.M stack has a few core requirements shown below

* [Python 3.8+](https://www.python.org/)
* [NodeJs 18.x](https://nodejs.org/en)
* [Pipenv](https://pipenv.pypa.io/en/latest/)  (refer to changes to Python's handling of modules or just install it with Homebrew)

## Supported Platforms

The S.T.🌀.R.M Stack CLI aims to be platform-agnostic once the core dependencies are met. That said, below shows platform
support currently.

* ✅ Linux (Ubuntu 22.04+) 
* ✅ MacOS 
* ✅ Windows

## The Main Stack

- [Starlette](https://www.starlette.io/) (Web Framework)
- [Tailwind CSS](https://tailwindcss.com/) (Styling)
- [Reactive UI](https://vitejs.dev/) (Vite)
- [MongoDB](https://www.mongodb.com/) (Database)

## Things to keep in mind

- This is an early version of the CLI and things may change in future versions
- Some things might not work properly with later versions or Python
- When running on windows, it is better to use `Powershell` or `Gitbash` when running `storm-dev` via `npm`

## Creating your first S.T.🌀.R.M Stack project

### Creating the project
To create your first project, in a terminal window, run the following and answer the prompts
```shell
npx create-storm-stack@latest
```
The command above will start the scaffolding process. Once you answer all the prompts, the process will start.
Once completed, the instructions for running the project will be printed out.

#### Project Naming Conventions
**Import note:** _Project names follow Python conventions so spaces or special characters are not allowed_

* ✅ my_storm_project
* ✅ mystormproject
* ⛔ my-storm-project
* ⛔ my storm project

### Running your project
Activate the virtual environment
```shell
pipenv shell
```
Run the project
```shell
npm run storm-dev
```

By default, your newly created S.T.🌀.R.M Stack project will be accessible from `http://127.0.0.1:5000`

### Database Stuff

The default database for your newly created S.T.🌀.R.M Stack project will have the same name as your project. 
For example, if your project was called `my_project` the mongodb uri would be `mongodb://localhost:27017/my_project`.

**Note:** _You may change the database settings as needed for your project._

## S.T.🌀.R.M Stack Module System

The S.T.🌀.R.M Stack makes use of _modules_ where a _module_ is a collection of backend (controller + model) and optional frontend components.
You can think of modules kinda like resources. More information on this will be in the official documentation.

### Creating a module

From the root of your S.T.🌀.R.M Stack project, you can run the following command to create a module
```shell
npx create-storm-stack@latest makeModule --name <module_name> [--plural <pluralized_module_name> --controllerOnly]
```

**Note:** _the only required option is `--name <module_name>`_

* `-name <module_name>`: specifies the name of the module to be created. This name must be unique and follows the same naming conventions as above
* `--plural <pluralized_module_name>`: optionally specifies the pluralized name of the module. Setting this will make API endpoints and frontend paths more REST-like
* `--controllerOnly`: optionally specifies if the creation of frontend components should be skipped for the module being created

#### Examples of module creation
Here are a few examples to get you started with creating your own modules

**Example of making a normal module**
```shell
npx create-storm-stack@latest makeModule --name biscuit --plural biscuits
```
**Example of making an api-only module**
```shell
npx create-storm-stack@latest makeModule --name lemon --plural lemons --controllerOnly
```
#### Accessing your newly-created module

When a module is created, your can access the corresponding api endpoint at `http://127.0.0.1:5000/api/<module_name>` or `http://127.0.0.1:5000/api/<pluralized_module_name>`

Frontend components can be accessed at the `http://127.0.0.1:5000/#/<module_name>` or `http://127.0.0.1:5000/#/<pluralized_module_name>`.

**Note:** _Further details will be provided in the developer docs/manual_ 

### Important Files & Folders (Module)

When a module is created, several file are created and others are updated as shown below.

* `storm_modules/storm_modules.json`: this file manages the entire module system
* `storm_controllers`: controllers created will be added to this folder. The `storm_controllers/__init__.py` file will be automatically updated
* `storm_routes/__init__.py`: This file is automatically updated when a module is created. There is no need to manually update this
* `storm_models`: models created will be added to this folder.
* `storm_fe_<frontend>/src/pages`: Frontend components will be added to this folder. 

**Note:** _More details will be provided in the developer docs/manual_
