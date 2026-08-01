import { useCallback, useEffect, useState } from 'react';
import {
  Avatar, Box, Button, Chip, Grid, InputAdornment, Paper,
  Skeleton, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography, alpha,
} from '@mui/material';
import { AgricultureOutlined, LocationOnOutlined, SearchOutlined, WaterDropOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';
import api from '../../services/api';

export default function BrowseFarms() {
  usePageTitle('Browse Farms');
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchFarms = useCallback(async () => {
    setLoading(true);
    try {
      const params = search ? { search } : {};
      // Customers can see all active listings — we fetch public marketplace listings
      // and derive farm info from the listing farmer data
      const { data } = await api.get('/listings/', { params: { ...params, status: 'ACTIVE' } });
      setFarms(data.results ?? data);
    } catch {
      setFarms([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchFarms(); }, [fetchFarms]);

  return (
    <DashboardLayout title="Browse Farms">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Browse Farms & Listings</Typography>
          <Typography variant="body2" color="text.secondary">
            Explore active crop listings from verified farmers. Click a row to message the farmer.
          </Typography>
        </Box>

        {/* Search */}
        <TextField
          fullWidth size="small" placeholder="Search by crop name or variety…"
          value={search} onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlined fontSize="small" /></InputAdornment> }}
          sx={{ maxWidth: 480 }}
        />

        {loading ? (
          <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 4 }} />
        ) : farms.length === 0 ? (
          <Paper sx={{ p: 6, borderRadius: 4, border: '2px dashed', borderColor: alpha('#2E7D32', 0.2), textAlign: 'center' }}>
            <AgricultureOutlined sx={{ fontSize: 56, color: alpha('#2E7D32', 0.3), mb: 2 }} />
            <Typography variant="h6" fontWeight={700} color="text.secondary">No listings yet</Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              Active crop listings from farmers will appear here once published.
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Data Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha('#2E7D32', 0.04) }}>
                    {['Farmer', 'Crop', 'Variety', 'Qty Available', 'Price/kg', 'Organic', 'Status', 'Action'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {farms.map((listing, i) => (
                    <motion.tr
                      key={listing.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{ display: 'table-row' }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 800 }}>
                            {(listing.farmer_name || '?')[0].toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700}>{listing.farmer_name || '—'}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{listing.crop_name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{listing.variety || '—'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{Number(listing.quantity_kg).toLocaleString('en-IN')} kg</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="primary.main">₹{Number(listing.price_per_kg).toLocaleString('en-IN')}</Typography>
                      </TableCell>
                      <TableCell>
                        {listing.is_organic
                          ? <Chip label="Organic" size="small" sx={{ bgcolor: alpha('#22c55e', 0.1), color: '#15803d', fontWeight: 700, height: 22, fontSize: '0.68rem' }} />
                          : <Typography variant="caption" color="text.disabled">—</Typography>}
                      </TableCell>
                      <TableCell>
                        <Chip label={listing.status} size="small" sx={{ bgcolor: alpha('#2E7D32', 0.1), color: '#15803d', fontWeight: 700, height: 22, fontSize: '0.68rem' }} />
                      </TableCell>
                      <TableCell>
                        <Button
                          component={Link}
                          to="/customer/messages"
                          size="small"
                          variant="contained"
                          sx={{ borderRadius: 2, fontSize: '0.72rem', py: 0.5 }}
                        >
                          Message Farmer
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center' }}>
              Showing {farms.length} active listing{farms.length !== 1 ? 's' : ''}
            </Typography>
          </>
        )}
      </Stack>
    </DashboardLayout>
  );
}
