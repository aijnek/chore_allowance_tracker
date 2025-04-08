# Chore Allowance Tracker

A web application for tracking chores and calculating monthly allowances for children. Created by vibe coding with Windsurf.

## Features

- Register, modify, and delete chores with their prices
- Manage children profiles
- Record, modify, and delete completed chores with child and date information
- Calculate and display monthly allowances for each child based on completed chores

## Architecture

### Frontend
- React with TypeScript
- Material-UI for the user interface
- Hosted on S3 + CloudFront

### Backend
- AWS Lambda (TypeScript)
- API Gateway
- DynamoDB
- AWS SAM for infrastructure as code

## Project Structure

```
chore_allowance_tracker/
├── backend/                # Backend code
│   ├── src/                # Lambda function code
│   │   ├── chores/         # Chores API
│   │   ├── children/       # Children API
│   │   ├── records/        # Records API
│   │   └── allowances/     # Allowances API
│   ├── template.yaml       # AWS SAM template
│   ├── package.json        # Backend dependencies
│   └── tsconfig.json       # TypeScript configuration
└── frontend/               # Frontend code
    ├── public/             # Static assets
    ├── src/                # React application code
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Application pages
    │   ├── services/       # API services
    │   ├── types/          # TypeScript type definitions
    │   └── utils/          # Utility functions
    ├── package.json        # Frontend dependencies
    └── tsconfig.json       # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- AWS CLI
- AWS SAM CLI
- An AWS account

### Quick Setup

Run the setup script to install all dependencies:

```bash
./setup.sh
```

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the TypeScript code:
   ```
   npm run build
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your API endpoint (copy from `.env.example`):
   ```
   cp .env.example .env
   ```

## Running Locally

### Backend

1. Start the local API using SAM:
   ```
   cd backend
   npm run start
   ```

   This will start the API Gateway locally at http://localhost:3000/dev

### Frontend

1. Start the React development server:
   ```
   cd frontend
   npm start
   ```

   This will start the frontend at http://localhost:3000

## Deployment

### Backend Deployment

1. Build and deploy using SAM:
   ```
   cd backend
   npm run deploy
   ```

2. Note the API Gateway endpoint URL from the deployment output.

3. Update the frontend `.env` file with the new API URL.

### Frontend Deployment

1. Deploy the CloudFormation stack for S3 and CloudFront:
   ```
   cd frontend
   npm run deploy
   ```

   This will:
   - Create the CloudFormation stack
   - Build the React app
   - Upload the build files to S3

2. After deployment, you can access your application via the CloudFront URL shown in the CloudFormation stack outputs.

## Usage Guide

### Managing Chores

1. Navigate to the "Chores" page
2. Add new chores with their prices
3. Edit or delete existing chores as needed

### Managing Children

1. Navigate to the "Children" page
2. Add new children profiles
3. Edit or delete existing profiles as needed

### Recording Completed Chores

1. Navigate to the "Records" page
2. Add new records by selecting a child, chore, and date
3. Edit or delete existing records as needed

### Viewing Allowances

1. Navigate to the "Allowances" page
2. Select a month and year to view
3. View the calculated allowances for each child based on their completed chores

## License

This project is licensed under the MIT License.
