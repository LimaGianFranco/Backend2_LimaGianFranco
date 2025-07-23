import { UserModel } from '../models/user.model.js';

export const getUserByEmail = async (email) => {
  return await UserModel.findOne({ email });
};

export const getUserById = async (id) => {
  return await UserModel.findById(id);
};

export const createUser = async (userData) => {
  const newUser = new UserModel(userData);
  await newUser.save();
  return newUser;
};

export const updateResetPasswordToken = async (userId, resetToken, expiration) => {
  return await UserModel.findByIdAndUpdate(userId, {
    resetPasswordToken: resetToken,
    resetPasswordExpires: expiration
  });
};
