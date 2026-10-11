const Customer = require('../models/Customer');
const CustomerUser = require('../models/CustomerUser');

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json({
      count: customers.length,
      customers,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;

    const customer = await Customer.create({
      name,
      email,
      phone,
      address,
    });

    res.status(201).json({
      message: 'Customer created successfully',
      customer,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const customer = await Customer.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({
      message: 'Customer updated successfully',
      customer,
    });
  } catch (error) {
    next(error);
  }
};

exports.registerCustomer = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      companyName,
      companyAddress
    } = req.body;

    // Check if account already exists
    const existingCustomer = await CustomerUser.findOne({ email });

    if (existingCustomer) {
      return res.status(400).json({
        message: 'Customer with this email already exists'
      });
    }

    const customer = await CustomerUser.create({
      name,
      email,
      password,
      phone,
      companyName,
      companyAddress,
      status: 'pending',
      role: 'customer'
    });

    res.status(201).json({
      message:
        'Registration successful. Your account is pending admin approval.',
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        companyName: customer.companyName,
        status: customer.status
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};