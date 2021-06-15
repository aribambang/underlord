const User = require('../models/user');
const { hashPassword, comparePassword } = require('../utils/auth');
const jwt = require('jsonwebtoken');

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) return res.status(400).json({ message: 'Name is required' });
    if (!password || password.length < 6)
      return res
        .status(400)
        .json({ message: 'Password is required and should be min 6 characters long' });

    const userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).json({ message: 'Email is taken' });
    console.log('ok');
    const hashedPassword = await hashPassword(password);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    return res.status(200).json({ message: 'Successfully, user has been registered' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).json({ message: 'User not found' });

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) return res.status(400).json({ message: 'Password not match' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    user.password = undefined;
    console.log('masuk');

    res.cookie('token', token, { httpOnly: true });

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.json({ message: 'Signout success' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').exec();
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json(err);
  }
};
