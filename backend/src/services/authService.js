const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const generateToken = require('../utils/generateToken');

const register = async (data) => {
  const { name, email, password, role, roll_no } = data;

  // 1. Check if user already exists
  const existingUser = await userModel.getUserByEmailAndRole(email, role);
  if (existingUser) {
    throw new Error('User with this email already exists in this role');
  }

  // 2. Additional check for students (roll_no must be unique)
  if (role === 'student') {
    const existingStudent = await userModel.getStudentByRollNo(roll_no);
    if (existingStudent) {
      throw new Error('Student with this Roll Number already exists');
    }
  }

  // 3. Hash the password securely with bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Insert user into correct table
  const newUser = await userModel.createUser({
    name,
    email,
    password: hashedPassword,
    role,
    roll_no
  });

  return newUser;
};

const login = async (email, password, role) => {
  // 1. Find user by email and role table
  const user = await userModel.getUserByEmailAndRole(email, role);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // 2. Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // 3. Generate JWT Token
  const token = generateToken(user.id, user.email, role);

  // Remove password from returned user object for security
  delete user.password;

  return { user, token };
};

module.exports = {
  register,
  login
};
