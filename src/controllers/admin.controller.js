const { Op, fn, col, literal, Sequelize } = require("sequelize");
const { User, Order, OrderItem, Product, Payment } = require("../models");

/* ---------------------------------------------
   Helper: Pagination
---------------------------------------------- */
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, parseInt(query.limit) || 20);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/* ---------------------------------------------
   1. ADMIN DASHBOARD
---------------------------------------------- */
exports.getDashboard = async (req, res, next) => {
  try {
    // Total users
    const totalUsers = await User.count();

    // Total orders
    const totalOrders = await Order.count();

    // Total sales from paid orders
    const totalSalesRow = await Order.findOne({
      attributes: [
        [fn("COALESCE", fn("SUM", col("totalAmount")), 0), "totalSales"]
      ],
      where: { payment_status: "paid" }, // paid = completed payment
      raw: true,
    });

    const totalSales = Number(totalSalesRow.totalSales || 0);

    // Pending orders (based on your enum)
    const pendingOrders = await Order.count({
      where: { order_status: "pending" },
    });

    // Best-selling product
    const topProductRow = await OrderItem.findAll({
      attributes: [
          "productId",
          [fn("SUM", col("OrderItem.quantity")), "totalSold"],
          [fn("SUM", literal("OrderItem.quantity * OrderItem.price")), "totalRevenue"]
      ],
      include: [
        {
            model: Order,
            as: "order",
            attributes: [],
            where: { payment_status: "paid" }
        },
        {
            model: Product,
            as: "product",
            attributes: ["id", "name", "imageUrl"]
        }
    ],
      group: ["productId", "product.id", "product.name", "product.imageUrl"],
      order: [[literal("totalSold"), "DESC"]],
      limit: 1,
      raw: false,
    });

    let topProduct = null;

    if (topProductRow.length > 0) {
      const r = topProductRow[0];
      const p = r.Product || {};
      topProduct = {
        productId: r.productId,
        name: p.name || null,
        imageUrl: p.imageUrl || null,
        totalSold: Number(r.get("totalSold")),
        totalRevenue: Number(r.get("totalRevenue")),
      };
    }

    res.json({
      totalUsers,
      totalOrders,
      totalSales,
      pendingOrders,
      topProduct,
    });

  } catch (err) {
  console.error("MYSQL ERROR:", err.parent?.sqlMessage);
  console.error("SQL:", err.parent?.sql);
  next(err);
}
};



/* ---------------------------------------------
   2. MANAGE USERS
---------------------------------------------- */
exports.listUsers = async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const where = {};

    if (req.query.q) {
      const q = `%${req.query.q}%`;
      where[Op.or] = [
        { name: { [Op.like]: q } },
        { email: { [Op.like]: q } }
      ];
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password"] },
    });

    res.json({
      success: true,
      meta: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
      data: rows,
    });

  } catch (err) {
    next(err);
  }
};


exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};


exports.updateUser = async (req, res, next) => {
  try {
    const { role, isVerified, isBlocked } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (role) user.role = role;
    if (typeof isVerified !== "undefined") user.isVerified = !!isVerified;
    if (typeof isBlocked !== "undefined") user.isBlocked = !!isBlocked;

    await user.save();

    res.json({ success: true, data: user });

  } catch (err) {
    next(err);
  }
};


exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Soft delete if field exists
    if (user.hasOwnProperty("isDeleted")) {
      user.isDeleted = true;
      await user.save();
      return res.json({ success: true, message: "User soft-deleted" });
    }

    await user.destroy();
    res.json({ success: true, message: "User deleted" });

  } catch (err) {
    next(err);
  }
};


/* ---------------------------------------------
   3. SALES SUMMARY (day/week/month)
---------------------------------------------- */
exports.salesSummary = async (req, res, next) => {
  try {
    const period = (req.query.period || "month").toLowerCase();

    // Revenue from PAID orders
    const revenueRow = await Order.findOne({
      attributes: [
        [fn("COALESCE", fn("SUM", col("totalAmount")), 0), "totalRevenue"]
      ],
      where: { payment_status: "paid" },
      raw: true,
    });

    const totalRevenue = Number(revenueRow.totalRevenue || 0);

    // Refunds
    let totalRefunds = 0;

    if (Payment) {
      const refundRow = await Payment.findOne({
        attributes: [
          [fn("COALESCE", fn("SUM", col("amount")), 0), "refunds"]
        ],
        where: { status: "refunded" },
        raw: true,
      });

      totalRefunds = Number(refundRow.refunds || 0);
    }

    // Date grouping
    let dateExpr;
    switch (period) {
      case "day":
        dateExpr = fn("DATE", col("createdAt"));
        break;
      case "week":
        dateExpr = literal("DATE_FORMAT(createdAt, '%x-%v')");
        break;
      default:
        dateExpr = literal("DATE_FORMAT(createdAt, '%Y-%m')");
    }

    const salesByPeriod = await Order.findAll({
      attributes: [
        [dateExpr, "period"],
        [fn("SUM", col("totalAmount")), "amount"],
        [fn("COUNT", col("id")), "ordersCount"],
      ],
      where: { payment_status: "paid" },
      group: ["period"],
      order: [[literal("period"), "DESC"]],
      raw: true,
    });

    res.json({
      totalRevenue,
      totalRefunds,
      salesByPeriod,
    });

  } catch (err) {
    console.error("MYSQL ERROR:", err.parent?.sqlMessage);
    console.error("SQL:", err.parent?.sql);
    next(err);
  }
};


/* ---------------------------------------------
   4. SALES TRENDS (last N days)
---------------------------------------------- */
exports.salesTrends = async (req, res, next) => {
  try {
    const days = Math.min(90, parseInt(req.query.days) || 30);

    const since = new Date();
    since.setDate(since.getDate() - days);

    const rows = await Order.findAll({
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("SUM", col("totalAmount")), "sales"]
      ],
      where: {
        createdAt: { [Op.gte]: since },
        payment_status: "paid"    // FIXED
      },
      group: [fn("DATE", col("createdAt"))],
      order: [[literal("date"), "ASC"]],
      raw: true,
    });

    const results = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const key = d.toISOString().slice(0, 10);

      const found = rows.find(r => r.date === key);
      results.push({
        date: key,
        sales: found ? Number(found.sales) : 0
      });
    }

    res.json(results);

  } catch (err) {
    console.error("MYSQL ERROR:", err.parent?.sqlMessage);
    console.error("SQL:", err.parent?.sql);
    next(err);
  }
};

/* ---------------------------------------------
   5. PRODUCT PERFORMANCE
---------------------------------------------- */
exports.productPerformance = async (req, res, next) => {
  try {
    const limit = Math.min(100, parseInt(req.query.limit) || 20);

    const rows = await OrderItem.findAll({
      attributes: [
        "productId",
        [fn("SUM", col("OrderItem.quantity")), "totalSold"],
        [fn("SUM", literal("OrderItem.quantity * OrderItem.price")), "totalRevenue"],
        [fn("AVG", col("OrderItem.price")), "avgPrice"]
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "imageUrl"]
        },
        {
          model: Order,
          as: "order",
          attributes: [],
          where: { payment_status: "paid" }   // FIXED
        }
      ],
      group: ["productId", "product.id", "product.name", "product.imageUrl"],
      order: [[literal("totalSold"), "DESC"]],
      limit
    });

    const formatted = rows.map(r => ({
      productId: r.productId,
      name: r.product?.name || null,
      imageUrl: r.product?.imageUrl || null,
      totalSold: Number(r.get("totalSold")),
      totalRevenue: Number(r.get("totalRevenue")),
      avgPrice: Number(r.get("avgPrice"))
    }));

    res.json(formatted);

  } catch (err) {
    console.error("MYSQL ERROR:", err.parent?.sqlMessage);
    console.error("SQL:", err.parent?.sql);
    next(err);
  }
};
