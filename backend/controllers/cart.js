const Cart = require("../models/cart");

const cartController = {
  getCart: async (req, res) => {
    try {
      const { userId } = req.params;

      // Find the cart for the user
      const cart = await Cart.findOne({ user: userId }).populate(
        "products.product"
      );

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  addToCart: async (req, res) => {
    try {
      const { userId, productId } = req.params;

      // Check if the user already has a cart
      let cart = await Cart.findOne({ user: userId });

      // If the user doesn't have a cart, create a new one
      if (!cart) {
        cart = new Cart({
          user: userId,
          products: [{ product: productId, quantity: 1 }],
        });
        await cart.save();
      } else {
        // If the user already has a cart, check if the product is already in it
        const existingProductIndex = cart.products.findIndex(
          (item) => item.product.toString() === productId
        );

        if (existingProductIndex === -1) {
          // If the product is not in the cart, add it
          cart.products.push({ product: productId, quantity: 1 });
        } else {
          // If the product is already in the cart, increment its quantity
          cart.products[existingProductIndex].quantity += 1;
        }

        await cart.save();
      }

      res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteFromCart: async (req, res) => {
    try {
      const { userId, productId } = req.params;

      // Find the cart for the user
      const cart = await Cart.findOne({ user: userId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Check if the product is in the cart
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingProductIndex !== -1) {
        // If the product is in the cart, decrement its quantity
        if (cart.products[existingProductIndex].quantity > 1) {
          cart.products[existingProductIndex].quantity -= 1;
        } else {
          // If the quantity is 1, remove the product from the cart
          cart.products.splice(existingProductIndex, 1);
        }

        await cart.save();
        res
          .status(200)
          .json({ message: "Product removed from cart successfully" });
      } else {
        res.status(404).json({ message: "Product not found in cart" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = cartController;
