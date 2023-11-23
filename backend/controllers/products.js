const Product = require("../models/products");
const slugify = require("slugify");

// const getAllProducts = async (req, res) => {
//   const { featured, company, name, sort, fields, numericFilters } = req.query;
//   const queryObject = {};

//   if (featured) {
//     queryObject.featured = featured === "true" ? true : false;
//   }
//   if (company) {
//     queryObject.company = company;
//   }
//   if (name) {
//     queryObject.name = { $regex: name, $options: "i" };
//   }
//   if (numericFilters) {
//     const operatorMap = {
//       ">": "$gt",
//       ">=": "$gte",
//       "=": "$eq",
//       "<": "$lt",
//       "<=": "$lte",
//     };
//     const regEx = /\b(<|>|>=|=|<|<=)\b/g;
//     let filters = numericFilters.replace(
//       regEx,
//       (match) => `-${operatorMap[match]}-`
//     );
//     const options = ["price", "rating"];
//     filters = filters.split(",").forEach((item) => {
//       const [field, operator, value] = item.split("-");
//       if (options.includes(field)) {
//         queryObject[field] = { [operator]: Number(value) };
//       }
//     });
//   }

//   let result = Product.find(queryObject);
//   // sort
//   if (sort) {
//     const sortList = sort.split(",").join(" ");
//     result = result.sort(sortList);
//   } else {
//     result = result.sort("createdAt");
//   }

//   if (fields) {
//     const fieldsList = fields.split(",").join(" ");
//     result = result.select(fieldsList);
//   }
//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   result = result.skip(skip).limit(limit);
//   // 23
//   // 4 7 7 7 2

//   const products = await result;
//   res.status(200).json({ products, nbHits: products.length });
// };
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const createProduct = async (req, res) => {
  try {
    console.log(req.body);
    let reqProduct = req.body;
    const slug = slugify(reqProduct.title, { lower: true });
    const uniqueSlug = `${slug}-${Date.now()}`;
    reqProduct["slug"] = uniqueSlug;
    const product = await Product.create(req.body);

    res.status(201).json(product);
    console.log(product);
  } catch (error) {
    // console.log(err)
    if (error.code === 11000) {
      const duplicatedKey = Object.keys(error.keyPattern)[0];

      const existingProduct = await Product.findOne({
        [duplicatedKey]: req.body[duplicatedKey],
      });

      return res.status(409).json(existingProduct);
    }
    res.status(500).json({ error: error.message });
  }
};
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById({ _id: id });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedProduct);
    console.log(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct: deletedProduct,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
