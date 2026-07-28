import { useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, Checkbox, Container, FormControlLabel, Grid, IconButton, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import PageShell from '../../components/common/PageShell';

const roleOptions = [
  { value: 'FARMER', label: 'Farmer' },
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'ADMIN', label: 'Admin' },
];

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: createAccount } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ defaultValues: { role: 'CUSTOMER' } });

  const password = watch('password', '');
  const passwordStrength = useMemo(() => {
    if (!password) return { label: 'Enter a password', score: 0 };
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { label: 'Strong', score: 3 };
    }
    if (password.length >= 8) return { label: 'Fair', score: 2 };
    return { label: 'Weak', score: 1 };
  }, [password]);

  const onSubmit = async (data) => {
    try {
      const response = await createAccount({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirm: data.password_confirm,
        role: data.role,
      });
      const role = response.user?.role || data.role;
      toast.success('Account created successfully. Welcome to CropX!');

      if (role === 'FARMER') {
        navigate('/farmer/dashboard');
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (error) {
      const message = error.response?.data?.email?.[0] || error.response?.data?.password_confirm?.[0] || error.response?.data?.detail || 'Unable to create account';
      toast.error(message);
    }
  };

  return (
    <PageShell>
      <Card elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #e8f5e9', maxWidth: 760, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h4" fontWeight={800} color="#2E7D32" sx={{ mb: 1 }}>Create your account</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>Join CropX as a farmer, customer, or admin and start your next step.</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="Full name" fullWidth {...register('name', { required: 'Name is required' })} error={Boolean(errors.name)} helperText={errors.name?.message} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Email" type="email" fullWidth {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} error={Boolean(errors.email)} helperText={errors.email?.message} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Password" type={showPassword ? 'text' : 'password'} fullWidth {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} error={Boolean(errors.password)} helperText={errors.password?.message} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
                <Typography variant="body2" color={passwordStrength.score >= 3 ? 'success.main' : passwordStrength.score >= 2 ? 'warning.main' : 'text.secondary'} sx={{ mt: 1 }}>
                  Password strength: {passwordStrength.label}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} fullWidth {...register('password_confirm', { required: 'Confirm password is required', validate: (value) => value === watch('password') || 'Passwords do not match' })} error={Boolean(errors.password_confirm)} helperText={errors.password_confirm?.message} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
              </Grid>
              <Grid item xs={12}>
                <TextField select label="Role" defaultValue="CUSTOMER" fullWidth {...register('role')}>
                  {roleOptions.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel control={<Checkbox {...register('terms')} />} label="I agree to the terms and conditions" />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" size="large" disabled={isSubmitting} sx={{ mt: 3, bgcolor: '#2E7D32', '&:hover': { bgcolor: '#256b28' } }}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
          <Typography sx={{ mt: 3 }}>
            Already have an account? <Link to="/login" style={{ color: '#2E7D32', textDecoration: 'none' }}>Sign in</Link>
          </Typography>
        </CardContent>
      </Card>
    </PageShell>
  );
}
