// @ts-nocheck

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { auth } from 'src/firebase-config'; // Ensure you have firebase-config file

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function SignInView() {
  
  const navigate = useNavigate();
  useEffect(() => {
    const auth2 = getAuth();
    signOut(auth2)
      .then(() => {
        // Sign-out successful.
        console.log('User signed out.');
        // Redirect the user to the login page or any other desired page
        // e.g., using a routing library like React Router:
        navigate('/sign-in');
      })
      .catch((error) => {
        // An error happened.
        console.error('Error signing out:', error);
      });
  }, [navigate]);

  const { handleSubmit, control, formState: { errors } } = useForm();
  const [error, setError] = useState('');

  return (
    <Box>
      <Typography variant="h4" mb={2} align="center">Sign In</Typography>
      <form onSubmit={handleSubmit(async (data)=>{
        try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate('/students');
        } catch (e) {
        setError('Failed to sign in. Please check your email and password.');
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
        rules={{ required: 'Password is required' }}
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
        Sign In
      </Button>
    </form>
    </Box >
  );
}