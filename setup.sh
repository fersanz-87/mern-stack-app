#!/bin/bash

echo "🚀 Setting up Enhanced MERN Stack Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    print_warning "MongoDB doesn't appear to be running. Please start MongoDB before running the application."
fi

# Create environment files if they don't exist
if [ ! -f "server/.env" ]; then
    print_status "Creating server environment file..."
    cat > server/.env << EOL
PORT=8000
MONGO_URL=mongodb://localhost:27017/mernstack
NODE_ENV=development
CLIENT_URL=http://localhost:3000
EOL
fi

if [ ! -f "client/.env" ]; then
    print_status "Creating client environment file..."
    cat > client/.env << EOL
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_PORT=3000
EOL
fi

# Install server dependencies
print_status "Installing server dependencies..."
cd server
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install server dependencies"
    exit 1
fi

# Install client dependencies
print_status "Installing client dependencies..."
cd ../client
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install client dependencies"
    exit 1
fi

cd ..

print_status "Setup completed successfully!"
echo ""
echo "🎉 Your Enhanced MERN Stack Application is ready!"
echo ""
echo "📋 Next steps:"
echo "   1. Make sure MongoDB is running"
echo "   2. Start the server: cd server && npm run dev"
echo "   3. Start the client: cd client && npm start"
echo ""
echo "🌐 Application will be available at:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend: http://localhost:8000"
echo "   • Health Check: http://localhost:8000/health"
echo ""
echo "📚 Check the README.md for detailed documentation and features!" 