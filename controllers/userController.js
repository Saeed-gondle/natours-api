import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { deleteOne, getOne, updateOne ,createOne} from './handleFactory.js';
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
export const getUser = getOne(User);
export const createUser = createOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
export const getMe = (req, res, next) => {
  req.params.id = req.user.id; // Overwrite the ID to the current user
  next();
};
export const deleteMe = catchAsync(async (req, res, next) => {  
  // 1) Find the user and set active to false
  await User.findByIdAndUpdate(req.user.id, { active: false });
  // 2) Log the user out by sending no token
  res.status(204).json({
    status: 'success',
    data: null,
  });
});