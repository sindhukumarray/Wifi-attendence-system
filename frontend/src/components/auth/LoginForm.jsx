import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';

// Validation Schema
const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
  role: yup.string().oneOf(['student', 'faculty', 'admin'], 'Invalid role').required('Role is required'),
});

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'student' }
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      // Role-based redirect
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'faculty') navigate('/faculty/dashboard');
      else navigate('/dashboard'); // student
    } catch (error) {
      // Error is already handled by toast in AuthContext
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Login As</label>
        <select 
          {...register('role')} 
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Administrator</option>
        </select>
        {errors.role && <p className="mt-1 text-xs text-red-500 font-medium">{errors.role.message}</p>}
      </div>

      <Input
        label="Email Address"
        type="email"
        placeholder="admin@example.com"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        {...register('password')}
        error={errors.password?.message}
      />

      <div className="flex justify-end">
        <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          Forgot Password?
        </a>
      </div>

      <Button 
        type="submit" 
        className="w-full mt-2 py-3" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
