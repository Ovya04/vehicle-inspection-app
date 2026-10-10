const Inspector = require('../models/Inspector');
const CustomerUser = require('../models/CustomerUser');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ==================== INSPECTOR AUTH ====================

exports.inspectorRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, licenseNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingInspector = await Inspector.findOne({ email });
    if (existingInspector) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const inspector = await Inspector.create({
      name,
      email,
      password,
      phone,
      licenseNumber,
      role: 'inspector',
    });

    const token = generateToken(inspector._id, 'inspector');

    res.status(201).json({
      message: 'Inspector registered successfully',
      token,
      user: {
        id: inspector._id,
        name: inspector.name,
        email: inspector.email,
        role: 'inspector',
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.inspectorLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const inspector = await Inspector.findOne({ email }).select('+password');
    if (!inspector) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatched = await inspector.matchPassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(inspector._id, 'inspector');

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: inspector._id,
        name: inspector.name,
        email: inspector.email,
        role: 'inspector',
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== CUSTOMER AUTH ====================

exports.customerRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, companyName, companyAddress } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingCustomer = await CustomerUser.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const customer = await CustomerUser.create({
      name,
      email,
      password,
      phone,
      companyName,
      companyAddress,
      status: 'pending',
      role: 'customer',
    });

    res.status(201).json({
      message: 'Registration successful. Awaiting admin verification.',
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        status: customer.status,
        role: 'customer',
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.customerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const customer = await CustomerUser.findOne({ email }).select('+password');
    if (!customer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if verified
    if (customer.status === 'pending') {
      return res.status(403).json({ 
        message: 'Your account is pending verification by admin. Please wait.',
        status: 'pending'
      });
    }

    if (customer.status === 'rejected') {
      return res.status(403).json({ 
        message: `Your account was rejected. Reason: ${customer.rejectionReason}`,
        status: 'rejected'
      });
    }

    if (customer.status === 'verified' && customer.status !== 'approved') {
      return res.status(403).json({ 
        message: 'Your account is verified but awaiting final approval.',
        status: 'verified'
      });
    }

    const isPasswordMatched = await customer.matchPassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(customer._id, 'customer');

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        status: customer.status,
        role: 'customer',
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== ADMIN AUTH ====================

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatched = await admin.matchPassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin._id, 'admin');

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== GET CURRENT USER ====================

exports.getCurrentUser = async (req, res, next) => {
  try {
    const { id, role } = req.user;

    let user;
    if (role === 'inspector') {
      user = await Inspector.findById(id);
    } else if (role === 'customer') {
      user = await CustomerUser.findById(id);
    } else if (role === 'admin') {
      user = await Admin.findById(id);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};