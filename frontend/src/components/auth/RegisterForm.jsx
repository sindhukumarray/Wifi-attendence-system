import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useAuth from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  roll_no: yup.string().required('Roll Number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const RegisterForm = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      // Remove confirmPassword before sending to API
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        roll_no: data.roll_no,
        role: 'student' // Phase 4 currently assumes self-registration is only for students
      };
      
      const success = await authRegister(payload);
      if (success) {
        // Redirect to login upon successful registration
        navigate('/login');
      }
    } catch (error) {
      // Error is handled by toast in AuthContext
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Roll Number"
        type="text"
        placeholder="CS2024-001"
        {...register('roll_no')}
        error={errors.roll_no?.message}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="student@example.com"
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

      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      <Button 
        type="submit" 
        className="w-full mt-4 py-3" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting Registration...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default RegisterForm;
