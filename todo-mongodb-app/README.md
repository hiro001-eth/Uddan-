# README.md

# Todo MongoDB App

This project is a simple Todo application built with TypeScript and MongoDB. It allows users to create, read, update, and delete todo items.

## Features

- Create new todo items
- Retrieve all todo items
- Update existing todo items
- Delete todo items

## Technologies Used

- TypeScript
- Express.js
- MongoDB
- Mongoose

## Project Structure

```
todo-mongodb-app
├── src
│   ├── config
│   │   └── db.config.ts
│   ├── models
│   │   └── todo.model.ts
│   ├── routes
│   │   └── todo.routes.ts
│   ├── services
│   │   └── todo.service.ts
│   ├── types
│   │   └── index.ts
│   └── app.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd todo-mongodb-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```

2. Access the API at `http://localhost:3000`.

## License

This project is licensed under the MIT License.