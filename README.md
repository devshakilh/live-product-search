

# Live Product Search App

## Objective:
The goal of this project is to create a full-stack product search application using **Next.js** (React), **MySQL**, **tailwindcss**, and **shadcn**. The application will allow users to search for products by typing in a search box, and display relevant products fetched from the database.

---

## Features:

- **Search Box**: A search box is provided to input search terms.
- **Initial Empty List**: Initially, the product list will be empty.
- **Search Trigger**: The search request is triggered when the user types at least 3 characters.
- **Debounced API Calls**: The search request avoids redundant API calls while typing, ensuring efficient fetching.
- **Product Display**: Displays up to 10 matching products from the database.
- **Loading Indicator**: A loading spinner or message is shown while fetching results from the database.

---

## Tech Stack:
- **Next.js (React)**: Frontend framework for building the web application.
- **MySQL**: Database used to store product data.
- **tailwindcss**: Utility-first CSS framework used for styling the app.
- **shadcn**: UI components used for advanced styling and interaction.

---

## Installation Instructions:

### 1. Clone the Repository

```bash
git clone https://github.com/devshakilh/live-product-search.git
cd live-product-search
```

### 2. Install Dependencies

Use **pnpm** to install all the required dependencies.

```bash
pnpm install
```

> If you don't have `pnpm` installed, you can install it globally with:

```bash
npm install -g pnpm
```

### 3. Set Up the Database

- Create a **MySQL** database named `live_product_search`.
- Populate the database with a `products` table. Example schema:

```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- Add some sample products into the `products` table.

### 4. Set Up Environment Variables

Create a `.env` file at the root of the project and add the following configuration to connect to your MySQL database:

```env
DB_HOST
```

Replace `username` and `password` with your MySQL credentials.

### 5. Running the Application

To run the development server:

```bash
pnpm dev
```

This will start the Next.js development server on `http://localhost:3000`.

---

## How It Works:

- When the page loads, the product list will be empty.
- As the user types in the search box, the application will listen for changes.
- Once the user types 3 characters or more, the app will send an API request to fetch matching products from the database.
- **Debouncing** is used to prevent excessive API calls when the user types rapidly.
- The products will be displayed in a list, showing up to 10 products that match the search query.
- While fetching, a loading spinner will be displayed until the results are fetched.

---

## Testing:

The application can be tested using the built-in Jest testing framework. To run the tests, use:

```bash
pnpm test
```

Ensure that you have **jest** and **@testing-library/react** installed for unit and integration tests.

---

## Contributions:

Feel free to contribute to this project! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.


---

## GitHub Repository:

[GitHub Repository Link](https://github.com/devshakil/live-product-search)

---

### End of README.

"# live-product-search" 
