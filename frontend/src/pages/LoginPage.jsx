import React from 'react';
import AuthLayout from '../layouts/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import Badge from '../components/common/Badge';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="inline-flex justify-center mb-4">
          <Badge variant="primary">Smart Attendance</Badge>
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Welcome Back</h1>
        <p className="text-slate-500 mt-2 font-medium">Sign in to manage your attendance portal</p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-slate-500 mt-8 font-medium">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
          Create Account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
