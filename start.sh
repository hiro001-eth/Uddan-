
#!/bin/bash

echo "🚀 Starting Uddaan Consultancy Enterprise System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if MongoDB is running
check_mongodb() {
    print_status "Checking MongoDB connection..."
    
    # Try to connect to MongoDB
    if command -v mongosh &> /dev/null; then
        if mongosh --eval "db.runCommand('ping').ok" localhost:27017/test --quiet &> /dev/null; then
            print_success "MongoDB is running and accessible"
            return 0
        fi
    elif command -v mongo &> /dev/null; then
        if mongo --eval "db.runCommand('ping').ok" localhost:27017/test --quiet &> /dev/null; then
            print_success "MongoDB is running and accessible"
            return 0
        fi
    fi
    
    print_warning "MongoDB connection failed. Attempting to start..."
    
    # Try to start MongoDB
    if command -v systemctl &> /dev/null; then
        sudo systemctl start mongod
    elif command -v service &> /dev/null; then
        sudo service mongod start
    elif command -v brew &> /dev/null; then
        brew services start mongodb-community
    else
        print_error "Could not start MongoDB automatically"
        print_status "Please start MongoDB manually and run this script again"
        exit 1
    fi
    
    # Wait a bit for MongoDB to start
    sleep 3
    
    # Check again
    if mongosh --eval "db.runCommand('ping').ok" localhost:27017/test --quiet &> /dev/null || mongo --eval "db.runCommand('ping').ok" localhost:27017/test --quiet &> /dev/null; then
        print_success "MongoDB started successfully"
        return 0
    else
        print_error "Failed to start MongoDB"
        return 1
    fi
}

# Install backend dependencies
install_backend_deps() {
    print_status "Installing backend dependencies..."
    cd backend
    
    if [ -f "package.json" ]; then
        npm install
        if [ $? -eq 0 ]; then
            print_success "Backend dependencies installed"
        else
            print_error "Failed to install backend dependencies"
            exit 1
        fi
    else
        print_error "Backend package.json not found"
        exit 1
    fi
    
    cd ..
}

# Install frontend dependencies
install_frontend_deps() {
    print_status "Installing frontend dependencies..."
    cd frontend
    
    if [ -f "package.json" ]; then
        npm install
        if [ $? -eq 0 ]; then
            print_success "Frontend dependencies installed"
        else
            print_error "Failed to install frontend dependencies"
            exit 1
        fi
    else
        print_error "Frontend package.json not found"
        exit 1
    fi
    
    cd ..
}

# Seed database
seed_database() {
    print_status "Seeding database with sample data..."
    cd backend
    
    node seedData.js
    if [ $? -eq 0 ]; then
        print_success "Database seeded successfully"
    else
        print_warning "Database seeding failed or was skipped"
    fi
    
    cd ..
}

# Create environment file if it doesn't exist
create_env_file() {
    print_status "Checking environment configuration..."
    
    if [ ! -f "backend/.env" ]; then
        print_warning "Creating .env file from template..."
        cd backend
        cp .env.example .env 2>/dev/null || cat > .env << EOF
# Database Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/uddaan-consultancy

# JWT Configuration
JWT_SECRET=uddaan-super-secret-key-2024-$(date +%s)

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/

# Security Configuration
BCRYPT_ROUNDS=12
SESSION_TIMEOUT=3600
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
EOF
        print_success "Environment file created"
        cd ..
    else
        print_success "Environment file already exists"
    fi
}

# Check Node.js version
check_node_version() {
    print_status "Checking Node.js version..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
        if [ "$NODE_VERSION" -ge 16 ]; then
            print_success "Node.js version is compatible ($(node --version))"
        else
            print_warning "Node.js version $(node --version) detected. Recommended: v16 or higher"
        fi
    else
        print_error "Node.js is not installed"
        exit 1
    fi
}

# Main execution
main() {
    print_status "🌟 Uddaan Consultancy Enterprise Setup 🌟"
    echo ""
    
    # Check system requirements
    check_node_version
    
    # Setup environment
    create_env_file
    
    # Check database
    check_mongodb
    
    # Install dependencies
    install_backend_deps
    install_frontend_deps
    
    # Seed database
    seed_database
    
    echo ""
    print_success "🎉 Setup completed successfully!"
    echo ""
    print_status "📋 System Information:"
    echo "  🌐 Frontend: http://localhost:3000"
    echo "  🔧 Backend API: http://localhost:5000"
    echo "  🔐 Admin Panel: http://localhost:3000/secure-admin-access-2024"
    echo "  📊 API Health: http://localhost:5000/api/health"
    echo ""
    print_status "🔑 Default Admin Credentials:"
    echo "  Email: admin@uddaan.com"
    echo "  Password: uddaan123"
    echo ""
    print_status "🚀 Starting development servers..."
    echo ""
    
    # Start the application
    npm run dev
}

# Handle script interruption
trap 'print_warning "Setup interrupted by user"; exit 1' INT

# Run main function
main
