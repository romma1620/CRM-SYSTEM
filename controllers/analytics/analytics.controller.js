const moment = require('moment');
const Order = require('../../models/Order');
const errorHandler = require('../../errors');

function getOrdersMap(orders = []) {
  const daysOrders = {};
  orders.forEach(order => {
    const date = moment(order.date).format('DD.MM.YYYY');

    if (date === moment().format('DD.MM.YYYY')) {
      return;
    }

    if (!daysOrders[date]) {
      daysOrders[date] = [];
    }
    daysOrders[date].push(order);

  });

  return daysOrders;
}

function calculatePrice(orders = []) {

  return orders.reduce((total, order) => {
    const orderPrice = order.list.reduce((orderTotal, item) => {
      orderTotal += item.cos * item.quantity;
    }, 0);
    total += orderPrice;
  }, 0);
}

module.exports = {
  analytic: async (req, res) => {

  },

  overview: async (req, res) => {
    try {
      const allOrders = await Order.find({user: req.user.id}).sort({date: 1});
      const ordersMap = getOrdersMap(allOrders);
      const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [];
      //YESTERDAY ORDER QUANTITY
      const yesterdayOrdersNumber = yesterdayOrders.length;
      //  ORDER QUANTITY
      const totalOrdersNumber = allOrders.length;
      //  DAYS QUANTITY
      const daysNumber = Object.keys(ordersMap).length;
      //  QUANTITY OF ORDERS PER DAY
      const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0);
      //  PERCENT ORDER QUANTITY
      const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);
      //  TOTAL GAIN
      const totalGain = calculatePrice(allOrders);
      //  GAIN PER DAY
      const gainPerDay = totalGain / daysNumber;
      //    YESTERDAY GAIN
      const yesterdayGain = calculatePrice(yesterdayOrders);
      //    GAIN PERCENT
      const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2);
      //    COMPARE GAIN
      const compareGain = (yesterdayGain - gainPerDay).toFixed(2);
      //        COMPARE QUANTITY ORDER
      const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2);
      res.status(200).json({
        gain: {
          percent: Math.abs(+gainPercent),
          compare: Math.abs(+compareGain),
          yesterday: +yesterdayGain,
          isHigher: +gainPercent > 0
        },
        orders: {
          percent: Math.abs(+ordersPercent),
          compare: Math.abs(+compareNumber),
          yesterday: +yesterdayOrdersNumber,
          isHigher: +ordersPercent > 0
        }
      });
    } catch (e) {
      errorHandler(res, e);
    }

  }
};

