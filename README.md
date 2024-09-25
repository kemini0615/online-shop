# Project Overview
A simple online shopping mall built with Node.js, Express, and MongoDB.

# Getting Started
## Prerequisites
- Node.js
- MongoDB

## Installation and Setup
1. Clone the repository  
```git clone <repository-url>```

2. Navigate to the project directory  
```cd <project-directory>```

3. Install dependencies  
```npm install```

4. Setup MongoDB  
- Run MongoDB on "localhost:27017"
- Create collections(tables) of "users", "sessions" and "orders"

5. Start the local server  
```npm run start```

6. Access the website running on local server  
```http://localhost:3000```

# Features
## Authentication and Authorization
- Sign up and Sign in with form validation  
<img width="827" alt="sign-up" src="https://github.com/user-attachments/assets/418f3723-6292-4c01-977d-c40519345cd4">  
<img width="808" alt="sign-in" src="https://github.com/user-attachments/assets/4e6dde73-51ea-4133-afa7-8efd7e7b712d">  

## Admin User
- Can manage products and orders
<img width="827" alt="admin-manage-products" src="https://github.com/user-attachments/assets/417c44bb-7027-4f98-9520-c61871f4ca9d">  
<img width="822" alt="admin-manage-orders" src="https://github.com/user-attachments/assets/19a2df27-2493-4d48-8579-eb1fabcae866">  

## Regular User
- Can add products to their cart whether they are logged in or not
- Can buy products on their cart with Stripe API which is very secure payment service when they are logged in 
<img width="846" alt="user-view-products" src="https://github.com/user-attachments/assets/d3d72090-99e7-4662-88e5-78f29d744940">  
<img width="840" alt="user-view-product-details" src="https://github.com/user-attachments/assets/f3e272df-5940-4b75-9058-b6a3ab4ed051">  
<img width="810" alt="user-add-item-to-cart" src="https://github.com/user-attachments/assets/b2c87963-ef09-459f-841b-f698f01c8e39">  
<img width="1440" alt="user-buy-products-stripe-api" src="https://github.com/user-attachments/assets/052c9001-6676-47c9-99c0-ee622a1a0fec">  