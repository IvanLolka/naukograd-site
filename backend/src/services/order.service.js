const HttpError = require("../lib/http-error");

async function getOwnedOrderOrThrow(tx, orderId, userId, include = {}) {
  const order = await tx.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include,
  });

  if (!order) {
    throw new HttpError(404, "ORDER_NOT_FOUND", "Order not found");
  }

  return order;
}

async function recalcOrderTotals(tx, orderId) {
  const aggregate = await tx.orderItem.aggregate({
    where: { orderId },
    _sum: {
      totalPriceCents: true,
    },
  });

  const subtotal = aggregate._sum.totalPriceCents || 0;
  const discount = 0;
  const total = Math.max(subtotal - discount, 0);

  return tx.order.update({
    where: { id: orderId },
    data: {
      subtotalAmountCents: subtotal,
      discountAmountCents: discount,
      totalAmountCents: total,
    },
    include: {
      items: true,
      payments: true,
    },
  });
}

module.exports = {
  getOwnedOrderOrThrow,
  recalcOrderTotals,
};
