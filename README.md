
# Cart Management API

#### **Project Abilities**

This project is a RESTful API built with NestJS and TypeORM for managing carts and products. It includes endpoints for creating, updating, retrieving, and deleting products and carts. Below is a list of available endpoints along with brief explanations.


## Installation

1. Clone the repository:

```bash
git clone https://github.com/itamardaisy/passportcard-cart.git
cd path-to-your-directory/passportcard-cart
```

2. Install dependencies:
```bash
npm install
```

3. Configure the database:
    - Create a MySQL database named **passportcard_test**.
    - Copy **.env.example** to **.env** and update the database credentials.

4. Start the application:
```bash
npm run start
```

5. Run the following SQL script to seed the database with initial data:
```SQL
USE passportcard_test;

-- Create Users
INSERT INTO user (name, email) VALUES ('John Doe', 'john@example.com');
INSERT INTO user (name, email) VALUES ('Jane Smith', 'jane@example.com');
INSERT INTO user (name, email) VALUES ('Jim Brown', 'jim@example.com');
INSERT INTO user (name, email) VALUES ('Jake White', 'jake@example.com');
INSERT INTO user (name, email) VALUES ('Jill Green', 'jill@example.com');

-- Create Products
INSERT INTO product (id, name, price, stockQuantity, expirationDate) VALUES (UUID(), 'Product 1', 10.99, 100, '2025-12-31');
INSERT INTO product (id, name, price, stockQuantity, expirationDate) VALUES (UUID(), 'Product 2', 20.99, 50, '2025-12-31');
INSERT INTO product (id, name, price, stockQuantity, expirationDate) VALUES (UUID(), 'Product 3', 30.99, 75, '2025-12-31');
INSERT INTO product (id, name, price, stockQuantity, expirationDate) VALUES (UUID(), 'Product 4', 40.99, 200, '2025-12-31');
INSERT INTO product (id, name, price, stockQuantity, expirationDate) VALUES (UUID(), 'Product 5', 50.99, 150, '2025-12-31');
INSERT INTO product (id, name, price, stockQuantity, expirationDate) VALUES (UUID(), 'Product 6', 60.99, 300, '2025-12-31');
INSERT INTO product (id, name, price, stockQuantity, expirationDate) VALUES (UUID(), 'Product 7', 70.99, 10, '2025-12-31');
INSERT INTO product (id, name, price, stockQuantity, expirationDate) VALUES (UUID(), 'Product 8', 80.99, 5, '2025-12-31');
INSERT INTO product (id, name, price, stockQuantity, expirationDate) VALUES (UUID(), 'Product 9', 90.99, 25, '2025-12-31');
INSERT INTO product (id, name, price, stockQuantity, expirationDate) VALUES (UUID(), 'Product 10', 100.99, 35, '2025-12-31');
```


## Postman Instructions
#### Postman Collection
A Postman collection has been created for testing the API endpoints. Import the following JSON file into Postman to get started.
```JSON
{
  "info": {
    "name": "Cart and Product Management API",
    "description": "Postman collection for Cart and Product Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Product",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Sample Product\",\n  \"price\": 19.99,\n  \"stockQuantity\": 100,\n  \"expirationDate\": \"2025-12-31T00:00:00.000Z\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/products",
          "protocol": "http",
          "host": [
            "localhost"
          ],
          "port": "3000",
          "path": [
            "products"
          ]
        }
      },
      "response": []
    },
    {
      "name": "Get All Products",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/products?page=1",
          "protocol": "http",
          "host": [
            "localhost"
          ],
          "port": "3000",
          "path": [
            "products"
          ],
          "query": [
            {
              "key": "page",
              "value": "1"
            }
          ]
        }
      },
      "response": []
    },
    {
      "name": "Add Product to Cart",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"userId\": 1,\n  \"productId\": \"uuid-of-product\",\n  \"quantity\": 2\n}"
        },
        "url": {
          "raw": "http://localhost:3000/cart/add-product",
          "protocol": "http",
          "host": [
            "localhost"
          ],
          "port": "3000",
          "path": [
            "cart",
            "add-product"
          ]
        }
      },
      "response": []
    },
    {
      "name": "Remove Product from Cart",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"userId\": 1,\n  \"productId\": \"uuid-of-product\",\n  \"quantity\": 1\n}"
        },
        "url": {
          "raw": "http://localhost:3000/cart/remove-product",
          "protocol": "http",
          "host": [
            "localhost"
          ],
          "port": "3000",
          "path": [
            "cart",
            "remove-product"
          ]
        }
      },
      "response": []
    },
    {
      "name": "Update Product Quantity in Cart",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"userId\": 1,\n  \"productId\": \"uuid-of-product\",\n  \"quantity\": 3\n}"
        },
        "url": {
          "raw": "http://localhost:3000/cart/update-product-quantity",
          "protocol": "http",
          "host": [
            "localhost"
          ],
          "port": "3000",
          "path": [
            "cart",
            "update-product-quantity"
          ]
        }
      },
      "response": []
    },
    {
      "name": "Get Cart View",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/cart/view?userId=1",
          "protocol": "http",
          "host": [
            "localhost"
          ],
          "port": "3000",
          "path": [
            "cart",
            "view"
          ],
          "query": [
            {
              "key": "userId",
              "value": "1"
            }
          ]
        }
      },
      "response": []
    }
  ]
}
```

#### Importing the Collection into Postman
    1. Open Postman.
    2. Click on the "Import" button.
    3. Select "Raw text" and paste the above JSON.
    4. Click "Continue" and then "Import".

You should now see the collection with the requests for creating products, retrieving products, adding products to the cart, removing products from the cart, updating product quantities in the cart, and viewing the cart.