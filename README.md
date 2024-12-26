
# Master Project




Software project "Interactive Generation and Visualization of Chemical Reaction Networks" for the academic course "Master Project WiSe24/25" at the Berliner Hochschule für Technik (BHT), in cooperation with the Fritz-Haber-Institut (FHI) of the Max-Planck-Gesellschaft.



## Prerequisites 

Before you start... Everything you need to successfully run and develop this project is described in this README.

## Requirements

### Software 

* Some form of UNIX-based shell like bash; especially on Windows, use PowerShell or Command Prompt
* Git 
* NodeJS version ^20.5.x 
	* Including NPM version ^10.3.x


### Actions

* #### Using venv

        python3 -m venv virtualenvname

* #### Command Syntax: 

        /path/to/python3 -m venv /path/to/directory/virtual_env_name

* #### Using virtualenv

        virtualenv -p python3 virtualenvname

* #### Command Syntax: 

        virtualenv -p /path/to/python3 /path/to/directory/virtual_env_name

* #### Activate the virtual environment

    * On Linux, Unix or MacOS, using the terminal or bash shell: 


            source /path/to/venv/bin/activate (e.g. source virtualenvname/bin/activate)

    * On Unix or MacOS, using the csh shell: 
    
            source /path/to/venv/bin/activate.csh

    * On Unix or MacOS, using the fish shell: 
    
            source /path/to/venv/bin/activate.fish

    * On Windows using the Command Prompt: 
    
            path\to\venv\Scripts\activate.bat

    * On Windows using PowerShell: 
    
            path\to\venv\Scripts\Activate.ps1


* #### Deactivating the virtual environment
    * On Linux, Unix or MacOS, using the terminal or bash shell: 
    
            deactivate

    * On Windows using the Command Prompt: 
            path\to\venv\Scripts\deactivate.bat

    * On Windows using PowerShell: 
    
            deactivate

## Branches

The repository consistently holds two branches, main and dev.

### Main Branch

Considered as the "release" branch. Commits on this branch need to be approved via Pull Request by a minimum of one other team member. The branch requires a linear Git history.

### dev Branch

Considered as the "newest features/fixes" branch This is a fast-paced branch for internal development, so expect a lot of changes while you are working on it. Holds the latest additions to the code base.


## Frontend and Backend

### Frontend 

* Simulation visualization layer for the web browser 
* Readme 
* Install dependencies: 

        npm run install
* Remove dependencies: 

        npm run remove
* Install serve globally:   

        npm install -g serve

Build for production: 

        npm run build

Serve the app: 

        serve -s build


### Backend

* Create a virtual environment:
 
        python -m venv venv

* Activate the virtual environment:

    * On Windows: 
    
            venv\Scripts\activate

    * On macOS/Linux: 
    
            source venv/bin/activate

* Install dependencies: 

    * Ensure you have pip installed and a Python environment set up.

            pip install -r requirements.txt
    * You will need to install the CatMAP package. The steps to follow can be found at this link: https://catmap.readthedocs.io/en/latest/installation.html#

* Run the backend: 

        python3 example.py
