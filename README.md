
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
INSERT INTO product (id, name, price, stockQuantity, expirationDate) VALUES
(UUID(), 'Product 1', 10.99, 100, '2025-12-31'),
(UUID(), 'Product 2', 15.49, 50, '2025-11-30'),
(UUID(), 'Product 3', 20.00, 200, '2025-10-31'),
(UUID(), 'Product 4', 5.99, 150, '2025-09-30'),
(UUID(), 'Product 5', 25.00, 75, '2025-08-31'),
(UUID(), 'Product 6', 12.50, 60, '2025-07-31'),
(UUID(), 'Product 7', 7.25, 120, '2025-06-30'),
(UUID(), 'Product 8', 9.99, 110, '2025-05-31'),
(UUID(), 'Product 9', 30.00, 90, '2025-04-30'),
(UUID(), 'Product 10', 50.00, 80, '2025-03-31'),
(UUID(), 'Product 11', 22.00, 130, '2025-02-28'),
(UUID(), 'Product 12', 18.75, 140, '2025-01-31'),
(UUID(), 'Product 13', 60.00, 160, '2024-12-31'),
(UUID(), 'Product 14', 45.00, 70, '2024-11-30'),
(UUID(), 'Product 15', 35.00, 55, '2024-10-31'),
(UUID(), 'Product 16', 40.00, 65, '2024-09-30'),
(UUID(), 'Product 17', 55.00, 85, '2024-08-31'),
(UUID(), 'Product 18', 65.00, 95, '2024-07-31'),
(UUID(), 'Product 19', 70.00, 105, '2024-06-30'),
(UUID(), 'Product 20', 75.00, 115, '2024-05-31');
```


## Postman Instructions
#### Postman Collection
A Postman collection has been created for testing the API endpoints. Import the following JSON file into Postman to get started.
```JSON
{
  "info": {
    "name": "Cart Management API",
    "description": "Postman collection for Cart Management API",
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
          "raw": "{\n  \"userId\": 1,\n  \"productId\": \"COPY-CREATED-PRODUCT-ID\",\n  \"quantity\": 2\n}"
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
          "raw": "{\n  \"userId\": 1,\n  \"productId\": \"COPY-CREATED-PRODUCT-ID\",\n  \"quantity\": 1\n}"
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
          "raw": "{\n  \"userId\": 1,\n  \"productId\": \"COPY-CREATED-PRODUCT-ID\",\n  \"quantity\": 3\n}"
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
    5. Notice in some request you need to replace the COPY-CREATED-PRODUCT-ID with an existing product from your database.

You should now see the collection with the requests for creating products, retrieving products, adding products to the cart, removing products from the cart, updating product quantities in the cart, and viewing the cart.