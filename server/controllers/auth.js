const User = require('../models/user');
const { hashPassword, comparePassword } = require('../utils/auth');

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
