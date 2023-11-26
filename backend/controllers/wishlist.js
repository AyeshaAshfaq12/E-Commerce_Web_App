const Wishlist = require("../models/wishlist");

const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the wishlist for the user
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products"
    );

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    console.log("userId");
    console.log(userId);
    console.log("productId");
    console.log(productId);
    // Check if the user already has a wishlist
    let wishlist = await Wishlist.findOne({ user: userId });

    // If the user doesn't have a wishlist, create a new one
    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        products: [productId],
      });
      await wishlist.save();
    } else {
      // If the user already has a wishlist, check if the product is already in it
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
        await wishlist.save();
      } else {
        return res.status(400).json({ message: "Product already in wishlist" });
      }
    }

    res.status(200).json({ message: "Product added to wishlist successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Find the wishlist for the user
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Check if the product is in the wishlist
    const productIndex = wishlist.products.indexOf(productId);

    if (productIndex !== -1) {
      // Remove the product from the wishlist
      wishlist.products.splice(productIndex, 1);
      await wishlist.save();
      res
        .status(200)
        .json({ message: "Product removed from wishlist successfully" });
    } else {
      res.status(404).json({ message: "Product not found in wishlist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getWishlist, addToWishlist, deleteFromWishlist };
