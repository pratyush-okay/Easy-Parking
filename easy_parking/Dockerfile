
# Use an official Python runtime as a parent image
FROM python:3.11.6

ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Install Django and other dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app


# Make port 8000 available to the world outside this container
EXPOSE 8000