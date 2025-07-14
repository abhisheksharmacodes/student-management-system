// @ts-nocheck

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'src/firebase-config';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export function SignUpView() {
  const navigate = useNavigate();
  const { handleSubmit, control, formState: { errors } } = useForm();
  const [error, setError] = useState('');

  return (
    <Box>
      <Typography variant="h4" mb={2} align="center">Sign Up</Typography>
      <form onSubmit={handleSubmit(async (data) => {
        try {
          await createUserWithEmailAndPassword(auth, data.email, data.password);
          navigate('/students');
        } catch (e) {
          setError('Failed to sign up. Please try again.');
        }
      })}>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{ required: 'Email is required', pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email' } }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              fullWidth
              margin="normal"
              type="email"
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ''}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              fullWidth
              margin="normal"
              type="password"
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ''}
            />
          )}
        />
        {error && <Typography color="error" mb={2}>{error}</Typography>}
        <Button type="submit" style={{ marginTop: '10px' }} variant="contained" color="primary" fullWidth>
          Sign Up
        </Button>
        <Typography align="center" mt={2}>
          Already have an account? <Link to="/sign-in">Sign In</Link>
        </Typography>
      </form>
    </Box>
  );
} 