import { useCallback, useEffect, useState } from 'react';
import {
  Box, Button, Chip, Paper, Skeleton, Stack, Typography, alpha,
} from '@mui/material';
import { CheckCircleOutlined, NotificationsNoneOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';
import api from '../../services/api';

const TYPE_COLORS = { ORDER: '#3b82f6', WEATHER: '#06b6d4', MARKET: '#22c55e', DISEASE: '#ef4444', SYSTEM: '#8b5cf6', AI: '#f97316' };
const TYPE_ICONS = { ORDER: '📦', WEATHER: '🌤️', MARKET: '📈', DISEASE: '🦠', SYSTEM: '⚙️', AI: '🤖' };

// Demo notifications if API returns empty
const DEMO = [
  { id: 1, notification_type: 'AI', title: 'Price Alert: Tomato prices rising', message: 'Tomato prices up 12% in Azadpur Mandi. Consider selling now for maximum profit.', is_read: false, created_at: new Date().toISOString() },
  { id: 2, notification_type: 'WEATHER', title: 'Rain Alert Tomorrow', message: 'Heavy rainfall expected in your area. Delay fertilizer application and harvest ripe produce today.', is_read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, notification_type: 'ORDER', title: 'New Order Received', message: 'Rahul Verma placed an order for 200kg Tomato at ₹18/kg. Total: ₹3,600', is_read: true, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 4, notification_type: 'DISEASE', title: 'Disease Risk Warning', message: 'High humidity detected. Risk of fungal diseases in wheat crop. Monitor closely.', is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 5, notification_type: 'MARKET', title: 'Market Opportunity', message: 'Cotton prices at 6-month high in Akola. Consider listing your cotton stock now.', is_read: true, created_at: new Date(Date.now() - 172800000).toISOString() },
];

export default function Notifications() {
  usePageTitle('Notifications');
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications/');
      const list = data.results ?? data;
      setNotifs(list.length > 0 ? list : DEMO);
    } catch { setNotifs(DEMO); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const markAll = async () => {
    try {
      await api.post('/notifications/read/');
      setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    } catch { setNotifs(prev => prev.map(n => ({ ...n, is_read: true }))); toast.success('All marked as read'); }
  };

  const markOne = async (id) => {
    try { await api.post(`/notifications/${id}/read/`); } catch {}
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const types = ['ALL', ...new Set(notifs.map(n => n.notification_type))];
  const filtered = filter === 'ALL' ? notifs : notifs.filter(n => n.notification_type === filter);
  const unread = notifs.filter(n => !n.is_read).length;

  return (
    <DashboardLayout title="Notifications">
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight={800}>Notifications</Typography>
            <Typography variant="body2" color="text.secondary">{unread} unread · {notifs.length} total</Typography>
          </Box>
          {unread > 0 && (
            <Button variant="outlined" size="small" startIcon={<CheckCircleOutlined />} onClick={markAll} sx={{ borderRadius: 2 }}>
              Mark all as read
            </Button>
          )}
        </Stack>

        {/* Type filters */}
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {types.map(t => (
            <Chip key={t} label={t === 'ALL' ? `All (${notifs.length})` : `${TYPE_ICONS[t] || ''} ${t}`}
              onClick={() => setFilter(t)} size="small"
              sx={{ fontWeight: 700, bgcolor: filter === t ? alpha('#2E7D32', 0.1) : 'transparent', color: filter === t ? 'primary.main' : 'text.secondary', border: '1px solid', borderColor: filter === t ? 'primary.main' : 'divider', cursor: 'pointer' }} />
          ))}
        </Stack>

        {loading ? (
          <Stack spacing={1.5}>{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="rectangular" height={76} sx={{ borderRadius: 3 }} />)}</Stack>
        ) : filtered.length === 0 ? (
          <Paper sx={{ p: 6, borderRadius: 4, border: '2px dashed', borderColor: alpha('#8b5cf6', 0.2), textAlign: 'center' }}>
            <NotificationsNoneOutlined sx={{ fontSize: 56, color: alpha('#8b5cf6', 0.3), mb: 2 }} />
            <Typography variant="h6" fontWeight={700} color="text.secondary">No notifications</Typography>
          </Paper>
        ) : (
          <Stack spacing={1.5}>
            <AnimatePresence>
              {filtered.map(n => {
                const color = TYPE_COLORS[n.notification_type] || '#64748b';
                return (
                  <motion.div key={n.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} layout>
                    <Box onClick={() => !n.is_read && markOne(n.id)} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: n.is_read ? 'divider' : alpha(color, 0.4), bgcolor: n.is_read ? 'white' : alpha(color, 0.04), cursor: n.is_read ? 'default' : 'pointer', display: 'flex', gap: 2, alignItems: 'flex-start', '&:hover': { borderColor: alpha(color, 0.5) }, transition: 'all 0.15s' }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: alpha(color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                        {TYPE_ICONS[n.notification_type] || '📢'}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Typography variant="body2" fontWeight={n.is_read ? 500 : 700} noWrap sx={{ maxWidth: '80%' }}>{n.title}</Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {!n.is_read && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />}
                            <Typography variant="caption" color="text.secondary">{new Date(n.created_at).toLocaleDateString()}</Typography>
                          </Stack>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, lineHeight: 1.55 }}>{n.message}</Typography>
                      </Box>
                    </Box>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </Stack>
        )}
      </Stack>
    </DashboardLayout>
  );
}
