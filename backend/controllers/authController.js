const Inspector = require('../models/Inspector');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register Inspector
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if inspector already exists
    const existingInspector = await Inspector.findOne({ email });
    if (existingInspector) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new inspector
    const inspector = await Inspector.create({ name, email, password });

    const token = generateToken(inspector._id);

    res.status(201).json({
      message: 'Inspector registered successfully',
      token,
      inspector: {
        id: inspector._id,
        name: inspector.name,
        email: inspector.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Inspector
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find inspector by email
    const inspector = await Inspector.findOne({ email }).select('+password');
    if (!inspector) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordMatched = await inspector.matchPassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(inspector._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      inspector: {
        id: inspector._id,
        name: inspector.name,
        email: inspector.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all inspectors (optional - for admin purposes)
exports.getAllInspectors = async (req, res) => {
  try {
    const inspectors = await Inspector.find().select('-password');
    res.status(200).json({
      count: inspectors.length,
      inspectors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
