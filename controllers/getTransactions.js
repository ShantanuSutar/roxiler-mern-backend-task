const Product = require("../models/Product");

const getTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search = "", month } = req.query;

  try {
    const skip = (page - 1) * perPage;
    const match = {};

    console.log("Input query:", { page, perPage, search, month });

    if (search) {
      const searchNumber = parseFloat(search);
      if (!isNaN(searchNumber)) {
        match.price = searchNumber;
      } else {
        match.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
    }

    if (month) {
      const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1;
      console.log("Month number derived from input:", monthNumber);
      match.$expr = {
        $eq: [{ $month: "$dateOfSale" }, monthNumber],
      };
    }

    const pipeline = [
      { $match: match },
      { $skip: skip },
      { $limit: parseInt(perPage) },
      {
        $project: {
          _id: 1,
          title: 1,
          price: 1,
          description: 1,
          category: 1,
          image: 1,
          sold: 1,
          dateOfSale: 1,
        },
      },
    ];

    const products = await Product.aggregate(pipeline);

    const totalCountPipeline = [{ $match: match }, { $count: "totalCount" }];
    const totalCountResult = await Product.aggregate(totalCountPipeline);
    const totalCount =
      totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;

    res.json({
      data: products,
      pagination: {
        page: parseInt(page),
        perPage: parseInt(perPage),
        totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTransactions };
