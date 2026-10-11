const CustomerUser = require('../models/CustomerUser');

exports.getPendingCustomers = async (req, res, next) => {
  try {
    const customers = await CustomerUser.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.status(200).json({ count: customers.length, customers });
  } catch (error) {
    next(error);
  }
};

exports.getApprovedCustomers = async (req, res, next) => {
  try {
    const customers = await CustomerUser.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.status(200).json({ count: customers.length, customers });
  } catch (error) {
    next(error);
  }
};

exports.verifyCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const customer = await CustomerUser.findByIdAndUpdate(
      customerId,
      {
        status: 'verified',
        verifiedBy: req.user.id,
        verifiedAt: new Date(),
      },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer verified successfully', customer });
  } catch (error) {
    next(error);
  }
};

exports.approveCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const customer = await CustomerUser.findByIdAndUpdate(
      customerId,
      {
        status: 'approved',
        approvedBy: req.user.id,
        approvedAt: new Date(),
      },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer approved successfully', customer });
  } catch (error) {
    next(error);
  }
};

exports.rejectCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { rejectionReason } = req.body;

    const customer = await CustomerUser.findByIdAndUpdate(
      customerId,
      {
        status: 'rejected',
        rejectionReason,
      },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer rejected', customer });
  } catch (error) {
    next(error);
  }
};

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await CustomerUser.find().sort({ createdAt: -1 });
    res.status(200).json({ count: customers.length, customers });
  } catch (error) {
    next(error);
  }
};
