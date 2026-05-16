import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';
import Badge from '../components/common/Badge';

const RegisterPage = () => {
  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="inline-flex justify-center mb-4">
          <Badge variant="primary">Student Portal</Badge>
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Create Account</h1>
        <p className="text-slate-500 mt-2 font-medium">Register for the Wi-Fi Attendance System</p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-slate-500 mt-8 font-medium">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
          Sign In Here
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
