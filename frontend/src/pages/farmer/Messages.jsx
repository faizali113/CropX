import { useState } from 'react';
import {
  Avatar, Box, Chip, Divider, Grid, IconButton, InputAdornment,
  Paper, Stack, TextField, Typography, alpha,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';

const CONTACTS = [
  { id: 1, name: 'Rahul Verma', role: 'Customer', avatar: 'R', unread: 2, last: 'I need 200kg tomatoes urgently', time: '2m ago', online: true },
  { id: 2, name: 'Priya Traders', role: 'Buyer', avatar: 'P', unread: 0, last: 'Payment sent for order #ORD-4821', time: '1h ago', online: false },
  { id: 3, name: 'Agro Supplies Co.', role: 'Supplier', avatar: 'A', unread: 1, last: 'New fertilizer stock available', time: '3h ago', online: true },
  { id: 4, name: 'CropX Support', role: 'Support', avatar: 'CX', unread: 0, last: 'Your issue has been resolved', time: '1d ago', online: true },
];

const DEMO_CHAT = [
  { from: 'them', text: 'Hello! I saw your tomato listing. Is it still available?', time: '10:30 AM' },
  { from: 'me', text: 'Yes, we have 500kg available at ₹18/kg. All freshly harvested.', time: '10:32 AM' },
  { from: 'them', text: 'That sounds great! Can you deliver to Pune by Thursday?', time: '10:33 AM' },
  { from: 'me', text: 'Yes, delivery is possible. There will be a ₹500 delivery charge.', time: '10:35 AM' },
  { from: 'them', text: 'Perfect. I need 200kg. Can we finalize the order?', time: '10:36 AM' },
];

export default function Messages() {
  usePageTitle('Messages');
  const [active, setActive] = useState(CONTACTS[0]);
  const [messages, setMessages] = useState(DEMO_CHAT);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: 'me', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
  };

  return (
    <DashboardLayout title="Messages">
      <Grid container spacing={0} sx={{ height: 'calc(100vh - 160px)', minHeight: 500 }}>
        {/* Contact list */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ borderRadius: '16px 0 0 16px', border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={700}>Messages</Typography>
            </Box>
            <Box sx={{ overflowY: 'auto', flex: 1 }}>
              {CONTACTS.map((c, i) => (
                <Box key={c.id}>
                  <Box onClick={() => setActive(c)} sx={{ p: 2, cursor: 'pointer', bgcolor: active.id === c.id ? alpha('#2E7D32', 0.07) : 'transparent', '&:hover': { bgcolor: alpha('#2E7D32', 0.04) }, transition: 'all 0.15s' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ position: 'relative' }}>
                        <Avatar sx={{ width: 42, height: 42, fontWeight: 800, fontSize: 14 }}>{c.avatar}</Avatar>
                        {c.online && <Box sx={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', bgcolor: '#22c55e', border: '2px solid white' }} />}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" fontWeight={700} noWrap>{c.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{c.time}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 140 }}>{c.last}</Typography>
                          {c.unread > 0 && <Chip label={c.unread} size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem', minWidth: 18 }} />}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                  {i < CONTACTS.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Chat area */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: '0 16px 16px 0', border: '1px solid', borderLeft: 'none', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 38, height: 38, fontWeight: 800, fontSize: 13 }}>{active.avatar}</Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>{active.name}</Typography>
                <Typography variant="caption" color={active.online ? '#22c55e' : 'text.secondary'}>{active.online ? 'Online' : 'Offline'}</Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {messages.map((m, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
                  <Box sx={{ maxWidth: '72%', px: 2, py: 1, borderRadius: m.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', bgcolor: m.from === 'me' ? '#2E7D32' : alpha('#2E7D32', 0.08) }}>
                    <Typography variant="body2" sx={{ color: m.from === 'me' ? 'white' : 'text.primary', lineHeight: 1.5 }}>{m.text}</Typography>
                    <Typography variant="caption" sx={{ color: m.from === 'me' ? 'rgba(255,255,255,0.7)' : 'text.disabled', display: 'block', mt: 0.25 }}>{m.time}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <TextField fullWidth size="small" placeholder="Type a message…" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                InputProps={{ endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={send} color="primary"><Send fontSize="small" /></IconButton></InputAdornment> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
