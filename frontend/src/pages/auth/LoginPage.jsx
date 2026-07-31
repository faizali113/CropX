import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import AuthShell from '../../components/common/AuthShell';
import { getDashboardPath } from '../../constants/roles';
import { parseApiError } from '../../utils/errorParser';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function LoginPage() {
  usePageTitle('Sign in');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await login(data.email, data.password);
      toast.success('Welcome back to CropX!');
      navigate(getDashboardPath(response.user.role), { replace: true });
    } catch (error) {
      toast.error(parseApiError(error, 'Unable to sign in right now.'));
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your agricultural journey."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
          <TextField
            label="Email address"
            type="email"
            fullWidth
            autoComplete="email"
            {...register('email', { required: 'Email is required' })}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            autoComplete="current-password"
            {...register('password', { required: 'Password is required' })}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((p) => !p)}
                    edge="end"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={1}
          >
            <FormControlLabel
              control={<Checkbox {...register('remember')} size="small" />}
              label={<Typography variant="body2">Remember me</Typography>}
            />
            <Typography
              component={Link}
              to="/forgot-password"
              variant="body2"
              sx={{ color: 'primary.main', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
            >
              Forgot password?
            </Typography>
          </Stack>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </Stack>
      </form>

      <Box
        sx={{
          mt: 3,
          pt: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Typography
            component={Link}
            to="/signup"
            variant="body2"
            sx={{ color: 'primary.main', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
          >
            Create account
          </Typography>
        </Typography>
      </Box>
    </AuthShell>
  );
}
