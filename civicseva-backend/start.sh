#!/bin/bash

# CivicSeva Backend Startup Script

echo "Starting CivicSeva Backend..."

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "Maven is not installed. Please install Maven 3.6 or higher."
    exit 1
fi

# Navigate to the backend directory
cd "$(dirname "$0")"

# Build the project
echo "Building the project..."
mvn clean install -DskipTests

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful! Starting the application..."
    mvn spring-boot:run
else
    echo "Build failed. Please check for errors."
    exit 1
fi
