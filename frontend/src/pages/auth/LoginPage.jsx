import { useState } from 'react';
import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import PageShell from '../../components/common/PageShell';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await login(data.email, data.password);
      toast.success('Welcome back to CropX');
      const role = response.user.role;
      if (role === 'FARMER') navigate('/farmer/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/customer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Unable to sign in right now');
    }
  };

  return (
    <PageShell>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #e8f5e9', width: '100%', maxWidth: 520 }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Typography variant="h4" fontWeight={800} color="#2E7D32" sx={{ mb: 1 }}>Welcome back</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Sign in to continue your agricultural journey.</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2.5}>
                <TextField label="Email" type="email" fullWidth {...register('email', { required: 'Email is required' })} error={Boolean(errors.email)} helperText={errors.email?.message} />
                <TextField label="Password" type={showPassword ? 'text' : 'password'} fullWidth {...register('password', { required: 'Password is required' })} error={Boolean(errors.password)} helperText={errors.password?.message} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                  <FormControlLabel control={<Checkbox {...register('remember')} />} label="Remember me" />
                  <Link to="/forgot-password" style={{ color: '#2E7D32', textDecoration: 'none' }}>Forgot password?</Link>
                </Stack>
                <Button type="submit" variant="contained" size="large" disabled={isSubmitting} sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#256b28' } }}>
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </Stack>
            </form>
            <Typography sx={{ mt: 3 }}>
              Need an account? <Link to="/signup" style={{ color: '#2E7D32', textDecoration: 'none' }}>Create account</Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </PageShell>
  );
}
