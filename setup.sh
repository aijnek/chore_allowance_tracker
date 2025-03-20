#!/bin/bash

echo "Setting up Chore Allowance Tracker..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install

# Create .env file from example if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file from .env.example..."
  cp .env.example .env
fi

echo "Setup complete! You can now run the application."
echo ""
echo "To start the backend locally:"
echo "cd backend && npm run start"
echo ""
echo "To start the frontend locally:"
echo "cd frontend && npm run start"
echo ""
echo "For deployment instructions, please refer to the README.md file."
