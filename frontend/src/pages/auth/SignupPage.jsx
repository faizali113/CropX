import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import AuthShell from '../../components/common/AuthShell';
import { getDashboardPath, ROLES } from '../../constants/roles';
import { parseApiError } from '../../utils/errorParser';
import { usePageTitle } from '../../hooks/usePageTitle';

const ROLE_OPTIONS = [
  { value: ROLES.FARMER, label: 'Farmer' },
  { value: ROLES.CUSTOMER, label: 'Customer' },
  { value: ROLES.ADMIN, label: 'Admin' },
];

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: 'transparent' };
  const strong =
    password.length >= 12 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);
  if (strong) return { score: 100, label: 'Strong', color: '#22c55e' };
  if (password.length >= 8) return { score: 60, label: 'Fair', color: '#f59e0b' };
  return { score: 25, label: 'Weak', color: '#ef4444' };
}

export default function SignupPage() {
  usePageTitle('Create account');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register: createAccount } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: ROLES.CUSTOMER } });

  const password = watch('password', '');
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const onSubmit = async (data) => {
    try {
      const response = await createAccount({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirm: data.password_confirm,
        role: data.role,
      });
      toast.success('Account created — welcome to CropX!');
      navigate(getDashboardPath(response.user?.role ?? data.role), { replace: true });
    } catch (error) {
      toast.error(parseApiError(error, 'Unable to create account.'));
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join CropX as a farmer, customer, or admin."
      wide
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2.5}>
          {/* Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Full name"
              fullWidth
              autoComplete="name"
              {...register('name', { required: 'Name is required' })}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email address"
              type="email"
              fullWidth
              autoComplete="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
              })}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              autoComplete="new-password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {password && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={strength.score}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: 'rgba(0,0,0,0.06)',
                    '& .MuiLinearProgress-bar': { bgcolor: strength.color, borderRadius: 2 },
                  }}
                />
                <Typography variant="caption" sx={{ color: strength.color, fontWeight: 600 }}>
                  {strength.label}
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Confirm password */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Confirm password"
              type={showConfirm ? 'text' : 'password'}
              fullWidth
              autoComplete="new-password"
              {...register('password_confirm', {
                required: 'Please confirm your password',
                validate: (v) => v === watch('password') || 'Passwords do not match',
              })}
              error={Boolean(errors.password_confirm)}
              helperText={errors.password_confirm?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm((p) => !p)} edge="end">
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Role */}
          <Grid item xs={12}>
            <TextField
              select
              label="I am a…"
              fullWidth
              defaultValue={ROLES.CUSTOMER}
              {...register('role')}
            >
              {ROLE_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Terms */}
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox {...register('terms')} size="small" />}
              label={
                <Typography variant="body2" color="text.secondary">
                  I agree to the{' '}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'primary.main', fontWeight: 600 }}
                  >
                    terms and conditions
                  </Typography>
                </Typography>
              }
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isSubmitting}
          sx={{ mt: 3 }}
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Typography
            component={Link}
            to="/login"
            variant="body2"
            sx={{ color: 'primary.main', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
          >
            Sign in
          </Typography>
        </Typography>
      </Box>
    </AuthShell>
  );
}
