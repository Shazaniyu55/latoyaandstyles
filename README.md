# Latoya and Styles

Latoya and Styles is a simple ecommerce website built using EJS, Node.js, and MongoDB. The platform allows users to browse and purchase a variety of products, providing a streamlined shopping experience.

## Features

- **Product Listing**: Display a list of products with images, descriptions, and prices.
- **Shopping Cart**: Add products to a cart and view the cart's contents.
- **Checkout**: Complete purchases and process transactions.
- **User Authentication**: Register, login, and manage user accounts.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web application framework for Node.js.
- **EJS**: Embedded JavaScript templating for rendering HTML views.
- **MongoDB**: NoSQL database for storing product and user data.
- **Mongoose**: ODM library for MongoDB to model data.

## Installation

To get started with the project, follow these steps:

1. **Clone the Repository**

    ```bash
    git clone https://github.com/yourusername/latoyaandstyles.git
    cd latoyaandstyles
    ```

2. **Install Dependencies**

    Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. Run the following command to install the required dependencies:

    ```bash
    npm install
    ```

3. **Set Up Environment Variables**

    Create a `.env` file in the root directory of the project and add the following environment variables:

    ```env
    MONGO_URI=mongodb://localhost:27017/latoyaandstyles
    SESSION_SECRET=your_secret_key
    ```

4. **Start the Development Server**

    Use the following command to start the server:

    ```bash
    npm start
    ```

    The server will run on `http://localhost:3000` by default.

## Usage

Once the server is running, you can access the application in your web browser at `http://localhost:3000`. The main features include:

- **Home Page**: Browse through the list of available products.
- **Product Page**: View product details and add items to your cart.
- **Cart**: View and manage items in your shopping cart.
- **Checkout**: Proceed to checkout to complete your purchase.

## Testing

To run tests, use the following command:

```bash
npm test
