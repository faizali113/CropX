import { Box, Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/forgot-password/', data);
      toast.success('If that email exists, a reset link has been sent.');
    } catch (error) {
      toast.error('Unable to process your request');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F8FAF5 0%, #eef7eb 100%)', p: 3 }}>
      <Container maxWidth="sm">
        <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e8f5e9' }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Typography variant="h4" fontWeight={800} color="#2E7D32" sx={{ mb: 1 }}>Reset your password</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Enter your email and we will send reset instructions.</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2.5}>
                <TextField label="Email" type="email" fullWidth {...register('email', { required: 'Email is required' })} error={Boolean(errors.email)} helperText={errors.email?.message} />
                <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#256b28' } }}>
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </Stack>
            </form>
            <Typography sx={{ mt: 3 }}><Link to="/login" style={{ color: '#2E7D32', textDecoration: 'none' }}>Back to sign in</Link></Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
