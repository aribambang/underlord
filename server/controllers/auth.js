const User = require('../models/user');
const { hashPassword, comparePassword } = require('../utils/auth');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const { nanoid } = require('nanoid');

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

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

export const sendEmail = async (req, res) => {
  try {
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: ['fundemy.id@gmail.com'],
      },
      ReplyToAddresses: [process.env.EMAIL_FROM],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
            <html>
              <h1>Reset Password Link</h1>
              <p>Please use the following link to reset your password</p>
            </html>
            `,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Reset Password Link',
        },
      },
    };

    SES.sendEmail(params, (err, data) => {
      if (err) {
        throw new Error(err);
      } else {
        console.log(data);
        return res.status(200).json({ ok: true });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate({ email }, { passwordResetCode: shortCode });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      ReplyToAddresses: [process.env.EMAIL_FROM],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
            <html>
              <h1>Reset Password</h1>
              <p>User this code to reset your password</p>
              <h2 style='color:red;'>${shortCode}</h2>
              <i>Underlord</i>
            </html>
            `,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Reset Password',
        },
      },
    };

    SES.sendEmail(params, (err, data) => {
      if (err) {
        throw new Error(err);
      } else {
        console.log(data);
        return res.status(200).json({ ok: true });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const hashedPassword = await hashPassword(newPassword);

    const user = User.findOneAndUpdate(
      { email, passwordResetCode: code },
      { password: hashedPassword, code: '' },
    ).exec();

    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};
