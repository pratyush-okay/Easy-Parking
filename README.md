<<<<<<< HEAD
# Easy-Parking
=======

# Installation and User Manual

## Installation Guide

This section provides detailed instructions for operating the software application, including management of Docker containers and procedures for running the application without Docker.

### Run Project with Docker

To effectively manage your Docker environment and control the application containers, use the following basic Docker commands:

#### Starting and Stopping Containers

We utilize Docker Compose for managing multi-container Docker applications. Below are the commands to start and stop all containers defined in the Docker Compose file:

- To start all containers in the background:
  ```
  docker-compose up -d
  ```

- To stop all running containers:
  ```
  docker-compose down
  ```

These commands facilitate the easy setup and teardown of your development or production environments, streamlining the process of getting your application up and running or shutting it down.

### Running the Application Without Docker

For environments where Docker is not available or preferred, you can also run the application natively on your system. Below are the steps to set up and run the frontend and backend separately:

#### Running the Frontend (ReactJS)

- Navigate to the frontend directory:
  ```
  cd frontend
  ```
- Install all required npm packages:
  ```
  npm install
  ```
- Start the React application:
  ```
  npm start
  ```
- The application should now be accessible via a web browser at `http://localhost:3000`.

#### Running the Backend (Django)

- Navigate to the backend directory:
  ```
  cd backend
  ```
- Install required Python dependencies:
  ```
  pip install -r requirements.txt
  ```
- Initialize the database (if necessary):
  ```
  python manage.py migrate
  ```
- Start the Django server:
  ```
  python manage.py runserver
  ```
- The server will be running at `http://localhost:8000`.

## Environment Setup

### Python

- **Version:** 3.12.2

### Node

- **Version:** 21.6.2
- **Npm:** 10.2.4

### Virtual Environment Setup

1. Clone the remote repo and go into the project folder.
2. Install Miniconda or Anaconda.
3. Create the Conda virtual environment:
   ```
   conda env create -f environment.yml
   ```
4. Activate the Conda Environment:
   ```
   conda activate 9900projectenv
   ```
5. Install Backend Dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```

### Node Version Manager (nvm)

- Install `nvm` from the [official GitHub page](https://github.com/nvm-sh/nvm#installing-and-updating).
- Install and use the Node.js version specified for this project:
   ```
   nvm install
   nvm use
   ```
- Verify npm Version:
   ```
   npm --version
   ```

## Frontend Setup

- Install Node.js directly from [Node.js official website](https://nodejs.org/en/).
- Verify the Node.js installation:
   ```
   node --version
   ```
- Install dependencies and start the React server:
   ```
   cd frontend
   npm install
   npm start
   ```

## Backend Setup

- Install Python from [the official site](https://www.python.org/downloads/).
- Verify Python and pip installations:
   ```
   python --version
   pip --version
   ```
- Setup and activate the virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # Use 'venv\Scripts\activate' on Windows
   ```
- Install required Python packages:
   ```
   pip install -r requirements.txt
   ```
- Start the Django development server:
   ```
   python manage.py runserver
   ```
>>>>>>> 549b01f (Final Commit)
