export const ROLES = {
  FARMER: 'FARMER',
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
};

export const ROLE_LABELS = {
  FARMER: 'Farmer',
  CUSTOMER: 'Customer',
  ADMIN: 'Admin',
};

export const DASHBOARD_PATHS = {
  FARMER: '/farmer/dashboard',
  CUSTOMER: '/customer/dashboard',
  ADMIN: '/admin/dashboard',
};

export function getDashboardPath(role) {
  return DASHBOARD_PATHS[role] ?? DASHBOARD_PATHS.CUSTOMER;
}
