# mongodb-project

This project is a TypeScript application that connects to a MongoDB database using Mongoose. It provides a structured way to perform CRUD operations through a RESTful API.

## Project Structure

```
mongodb-project
├── src
│   ├── config
│   │   └── database.ts
│   ├── models
│   │   └── index.ts
│   ├── controllers
│   │   └── index.ts
│   ├── routes
│   │   └── index.ts
│   ├── services
│   │   └── index.ts
│   └── app.ts
├── tests
│   └── index.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd mongodb-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the database:**
   Update the `src/config/database.ts` file with your MongoDB connection string.

4. **Run the application:**
   ```bash
   npm start
   ```

5. **Run tests:**
   ```bash
   npm test
   ```

## Usage

Once the application is running, you can interact with the API endpoints defined in the routes. Use tools like Postman or curl to test the endpoints.

## License

This project is licensed under the MIT License.