# **Project Instructions**

## **1. Project Setup**

### **Prerequisites**

Make sure you have the following installed on your system:

- **Node.js** (Recommended: v18 or later)
- **npm** (Comes with Node.js)
- **Docker and Docker Compose** (for PostgreSQL database container)

### **Installation**

1. Clone the repository:
   ```sh
   git clone https://github.com/adirben98/popcorn_palace
   cd popcorn_palace
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## **2. Database Setup with Docker**

### Starting the PostgreSQL Database

The project includes a docker-compose.yml file for running PostgreSQL in a container:

1.  Start the PostgreSQL container:
    ```sh
    docker-compose up
    ```
2.  Verify the database is running:
    ```sh
    docker-compose ps
    ```
If you want to shut down the db container run:
   ```sh
   docker-compose down
   ```

### **Environment Variables**

Create a `.env` file in the root directory and configure the required environment variables:

```env
PG_USERNAME=Postgres_username
PG_PASSWORD=Postgres_password
PG_DATABASE=database_name
PORT=5432
```

## **3. Running the Project**

### **Development Mode**

To start the application in development mode:

```sh
npm run start:dev
```

The server will run on `http://localhost:3000` by default.

### **Production Mode**

To start the application in production mode:

```sh
npm run build
npm run start:prod
```

## **4. Running Tests**

### **Unit Tests**

Run unit tests using Jest:

```sh
npm run test
```

### **Generate Test Coverage Report**

To generate a test coverage report:

```sh
npm run test:cov
```

## **5. Building the Project**

To create a production-ready build:

```sh
npm run build
```

This will generate a `dist/` folder containing compiled files.

## **6. API Documentation**

### Swagger API Documentation

The project includes a Swagger YAML template that describes the API endpoints.

To view and interact with the API documentation:

   1. Copy the contents of the openapi-spec.yaml file in the project root.
   2. Visit the Swagger Editor at https://editor.swagger.io/ or any other Swagger UI tool.
   3. Paste the copied YAML content into the editor.

This will render an interactive API documentation interface where you can:

   - Explore all available endpoints
   - View request/response models
   - Test API calls directly from the interface

---

Your project should now be running successfully! 🚀
