import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Avatar, Box, Chip, CircularProgress, Divider, Grid, IconButton,
  InputAdornment, Paper, Skeleton, Stack, TextField, Typography, alpha,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

function getInitials(name, email) {
  if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (email?.[0] ?? '?').toUpperCase();
}

export default function CustomerMessages() {
  usePageTitle('Messages');
  const { user } = useAuth();
  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const fetchPartners = useCallback(async () => {
    try {
      const { data } = await api.get('/messages/');
      setPartners(Array.isArray(data) ? data : []);
    } catch { setPartners([]); } finally { setLoadingPartners(false); }
  }, []);

  const fetchMessages = useCallback(async (partnerId) => {
    setLoadingMessages(true);
    try {
      const { data } = await api.get(`/messages/?with=${partnerId}`);
      setMessages(Array.isArray(data) ? data : []);
    } catch { setMessages([]); } finally { setLoadingMessages(false); }
  }, []);

  useEffect(() => { fetchPartners(); }, [fetchPartners]);
  useEffect(() => { if (activePartner) fetchMessages(activePartner.id); }, [activePartner, fetchMessages]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => {
    if (!activePartner) return;
    const t = setInterval(() => fetchMessages(activePartner.id), 5000);
    return () => clearInterval(t);
  }, [activePartner, fetchMessages]);

  const handleSend = async () => {
    if (!input.trim() || !activePartner) return;
    setSending(true);
    const body = input.trim();
    setInput('');
    try {
      const { data } = await api.post('/messages/', { recipient: activePartner.id, body });
      setMessages(prev => [...prev, data]);
    } catch { toast.error('Failed to send'); setInput(body); }
    finally { setSending(false); }
  };

  return (
    <DashboardLayout title="Messages">
      <Grid container spacing={0} sx={{ height: 'calc(100vh - 160px)', minHeight: 520 }}>
        {/* Contact list */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ borderRadius: { xs: 3, md: '16px 0 0 16px' }, border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={700}>Messages</Typography>
              <Typography variant="caption" color="text.secondary">Your farmer conversations</Typography>
            </Box>
            <Box sx={{ overflowY: 'auto', flex: 1 }}>
              {loadingPartners ? (
                Array.from({ length: 3 }).map((_, i) => <Box key={i} sx={{ p: 2 }}><Stack direction="row" spacing={1.5}><Skeleton variant="circular" width={42} height={42} /><Box sx={{ flex: 1 }}><Skeleton width="60%" /><Skeleton width="80%" /></Box></Stack></Box>)
              ) : partners.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 36, mb: 1 }}>💬</Typography>
                  <Typography variant="body2" color="text.secondary">No conversations yet</Typography>
                  <Typography variant="caption" color="text.disabled">Message a farmer from the Browse Farms page to start</Typography>
                </Box>
              ) : partners.map((p, i) => (
                <Box key={p.id}>
                  <Box onClick={() => setActivePartner(p)} sx={{ p: 2, cursor: 'pointer', bgcolor: activePartner?.id === p.id ? alpha('#3b82f6', 0.08) : 'transparent', '&:hover': { bgcolor: alpha('#3b82f6', 0.04) }, transition: 'all 0.15s' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 42, height: 42, fontWeight: 800, fontSize: 14, background: 'linear-gradient(135deg,#2E7D32,#4caf50)' }}>
                        {getInitials(p.name, p.email)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={700} noWrap>{p.name || p.email}</Typography>
                        <Chip label={p.role || 'Farmer'} size="small" sx={{ height: 16, fontSize: '0.6rem', fontWeight: 600, bgcolor: alpha('#22c55e', 0.1), color: '#15803d', borderRadius: 0.75 }} />
                      </Box>
                    </Stack>
                  </Box>
                  {i < partners.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Chat */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: { xs: 3, md: '0 16px 16px 0' }, border: '1px solid', borderLeft: { md: 'none' }, borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {!activePartner ? (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                <Typography sx={{ fontSize: 48, mb: 2 }}>💬</Typography>
                <Typography variant="h6" fontWeight={700} color="text.secondary">Select a conversation</Typography>
                <Typography variant="body2" color="text.disabled">Choose a farmer from the left</Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 38, height: 38, fontWeight: 800, background: 'linear-gradient(135deg,#2E7D32,#4caf50)' }}>
                    {getInitials(activePartner.name, activePartner.email)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>{activePartner.name || activePartner.email}</Typography>
                    <Typography variant="caption" color="text.secondary">{activePartner.role || 'Farmer'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {loadingMessages ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress size={28} /></Box>
                    : messages.length === 0 ? <Box sx={{ textAlign: 'center', mt: 6 }}><Typography variant="body2" color="text.disabled">No messages yet</Typography></Box>
                    : messages.map(m => {
                      const isMine = m.sender === user?.id;
                      return (
                        <Box key={m.id} sx={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                          <Box sx={{ maxWidth: '72%', px: 2, py: 1, borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px', bgcolor: isMine ? '#1d4ed8' : alpha('#3b82f6', 0.08) }}>
                            <Typography variant="body2" sx={{ color: isMine ? 'white' : 'text.primary', lineHeight: 1.5 }}>{m.body}</Typography>
                            <Typography variant="caption" sx={{ color: isMine ? 'rgba(255,255,255,0.65)' : 'text.disabled', display: 'block', mt: 0.25, fontSize: '0.63rem' }}>
                              {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  <div ref={bottomRef} />
                </Box>
                <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <TextField fullWidth size="small" placeholder={`Message ${activePartner.name || 'farmer'}…`}
                    value={input} onChange={e => setInput(e.target.value)} disabled={sending}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    InputProps={{ endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={handleSend} color="primary" disabled={!input.trim() || sending}>{sending ? <CircularProgress size={16} /> : <Send fontSize="small" />}</IconButton></InputAdornment> }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
