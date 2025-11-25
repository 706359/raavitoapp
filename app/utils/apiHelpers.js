// API Helper functions for common operations
import { axios_ } from '../../utils/utils';

/**
 * Fetch all kitchens with optional filters
 * @param {Object} filters - { search, cuisineType, minRating, topRated }
 * @returns {Promise<Array>} Array of kitchens
 */
export const fetchKitchens = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.cuisineType) params.append('cuisineType', filters.cuisineType);
    if (filters.minRating) params.append('minRating', filters.minRating);
    if (filters.topRated) params.append('topRated', filters.topRated);

    const { data } = await axios_.get(`/kitchens?${params.toString()}`);
    return data;
  } catch (error) {
    console.error('Error fetching kitchens:', error);
    throw error;
  }
};

/**
 * Fetch all active offers
 * @returns {Promise<Array>} Array of offers
 */
export const fetchOffers = async () => {
  try {
    const { data } = await axios_.get('/offers');
    return data;
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw error;
  }
};

/**
 * Fetch all active deals
 * @returns {Promise<Array>} Array of deals
 */
export const fetchDeals = async () => {
  try {
    const { data } = await axios_.get('/deals');
    return data;
  } catch (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }
};

/**
 * Fetch kitchen details with menu items
 * @param {string} kitchenId
 * @returns {Promise<Object>} { kitchen, menuItems }
 */
export const fetchKitchenDetails = async (kitchenId) => {
  try {
    const { data } = await axios_.get(`/kitchens/${kitchenId}`);
    return data;
  } catch (error) {
    console.error('Error fetching kitchen details:', error);
    throw error;
  }
};

/**
 * Fetch menu items with optional filters
 * @param {Object} filters - { kitchenId, category, search, isVeg }
 * @returns {Promise<Array>} Array of menu items
 */
export const fetchMenuItems = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.kitchenId) params.append('kitchenId', filters.kitchenId);
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.isVeg !== undefined) params.append('isVeg', filters.isVeg);

    const { data } = await axios_.get(`/menu?${params.toString()}`);
    return data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

/**
 * Fetch user orders
 * @param {string} status - Optional status filter
 * @returns {Promise<Array>} Array of orders
 */
export const fetchUserOrders = async (status = null) => {
  try {
    const url = status && status !== 'All' ? `/orders/my?status=${status}` : '/orders/my';
    const { data } = await axios_.get(url);
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Fetch wallet balance
 * @returns {Promise<Object>} Wallet object with balance and transactions
 */
export const fetchWallet = async () => {
  try {
    const { data } = await axios_.get('/wallet');
    return data;
  } catch (error) {
    console.error('Error fetching wallet:', error);
    throw error;
  }
};

/**
 * Fetch user profile
 * @returns {Promise<Object>} User profile
 */
export const fetchUserProfile = async () => {
  try {
    const { data } = await axios_.get('/users/profile');
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Fetch subscription plans
 * @returns {Promise<Array>} Array of subscription plans
 */
export const fetchSubscriptionPlans = async () => {
  try {
    const { data } = await axios_.get('/subscriptions/plans');
    return data;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    throw error;
  }
};

/**
 * Fetch user's subscriptions
 * @returns {Promise<Array>} Array of user subscriptions
 */
export const fetchMySubscriptions = async () => {
  try {
    const { data } = await axios_.get('/subscriptions/my');
    return data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
};

/**
 * Fetch active subscription
 * @returns {Promise<Object|null>} Active subscription or null if none exists
 */
export const fetchActiveSubscription = async () => {
  try {
    const { data } = await axios_.get('/subscriptions/active');
    return data; // Will be null if no active subscription
  } catch (error) {
    // Handle 404 gracefully - it means no active subscription
    if (error?.response?.status === 404) {
      return null;
    }
    console.error('Error fetching active subscription:', error);
    return null; // Return null on any error to prevent app crash
  }
};

/**
 * Fetch subscription calendar
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @returns {Promise<Object>} Subscription calendar data
 */
export const fetchSubscriptionCalendar = async (month, year) => {
  try {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    const { data } = await axios_.get(`/subscriptions/calendar?${params.toString()}`);
    return data || { subscription: null, calendar: {} };
  } catch (error) {
    // Handle 404 gracefully
    if (error?.response?.status === 404) {
      return { subscription: null, calendar: {} };
    }
    console.error('Error fetching subscription calendar:', error);
    return { subscription: null, calendar: {} }; // Return empty calendar on error
  }
};

/**
 * Create subscription
 * @param {Object} subscriptionData - Subscription data
 * @returns {Promise<Object>} Created subscription
 */
export const createSubscription = async (subscriptionData) => {
  try {
    const { data } = await axios_.post('/subscriptions', subscriptionData);
    return data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

/**
 * Cancel subscription
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} Cancelled subscription
 */
export const cancelSubscription = async (reason) => {
  try {
    const { data } = await axios_.put('/subscriptions/cancel', { reason });
    return data;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};

/**
 * Pause subscription
 * @param {Date} pauseUntil - Date to pause until
 * @returns {Promise<Object>} Paused subscription
 */
export const pauseSubscription = async (pauseUntil) => {
  try {
    const { data } = await axios_.put('/subscriptions/pause', { pauseUntil });
    return data;
  } catch (error) {
    console.error('Error pausing subscription:', error);
    throw error;
  }
};

/**
 * Resume subscription
 * @returns {Promise<Object>} Resumed subscription
 */
export const resumeSubscription = async () => {
  try {
    const { data } = await axios_.put('/subscriptions/resume');
    return data;
  } catch (error) {
    console.error('Error resuming subscription:', error);
    throw error;
  }
};

/**
 * Admin Dashboard API Helpers
 */

/**
 * Fetch admin dashboard stats
 * @returns {Promise<Object>} Dashboard statistics
 */
export const fetchAdminStats = async () => {
  try {
    const { data } = await axios_.get('/admin/stats');
    return data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
};

/**
 * Fetch admin dashboard comprehensive stats
 * @returns {Promise<Object>} Comprehensive dashboard statistics
 */
export const fetchAdminDashboard = async () => {
  try {
    const { data } = await axios_.get('/admin/dashboard');
    return data;
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    throw error;
  }
};

/**
 * Fetch all kitchens for admin
 * @returns {Promise<Array>} Array of kitchens
 */
export const fetchAdminKitchens = async () => {
  try {
    const { data } = await axios_.get('/admin/kitchens');
    return data;
  } catch (error) {
    console.error('Error fetching admin kitchens:', error);
    throw error;
  }
};

/**
 * Fetch all orders for admin
 * @param {string} status - Optional status filter
 * @returns {Promise<Array>} Array of orders
 */
export const fetchAdminOrders = async (status = null) => {
  try {
    const url = status ? `/admin/orders?status=${status}` : '/admin/orders';
    const { data } = await axios_.get(url);
    return data;
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    throw error;
  }
};

/**
 * Fetch all users for admin
 * @returns {Promise<Array>} Array of users
 */
export const fetchAdminUsers = async () => {
  try {
    const { data } = await axios_.get('/admin/users');
    return data;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    throw error;
  }
};

/**
 * Fetch all menu items for admin
 * @returns {Promise<Array>} Array of menu items
 */
export const fetchAdminMenuItems = async () => {
  try {
    const { data } = await axios_.get('/admin/menu-items');
    return data;
  } catch (error) {
    console.error('Error fetching admin menu items:', error);
    throw error;
  }
};

/**
 * Partner Dashboard API Helpers
 */

/**
 * Fetch partner dashboard stats
 * @returns {Promise<Object>} Partner dashboard statistics
 */
export const fetchPartnerDashboard = async () => {
  try {
    const { data } = await axios_.get('/partners/dashboard');
    return data;
  } catch (error) {
    console.error('Error fetching partner dashboard:', error);
    throw error;
  }
};

/**
 * Fetch partner orders
 * @param {string} status - Optional status filter
 * @returns {Promise<Array>} Array of orders
 */
export const fetchPartnerOrders = async (status = null) => {
  try {
    const url = status ? `/partners/orders?status=${status}` : '/partners/orders';
    const { data } = await axios_.get(url);
    return data;
  } catch (error) {
    console.error('Error fetching partner orders:', error);
    throw error;
  }
};

/**
 * Update order status (partner)
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const { data } = await axios_.patch(`/partners/orders/${orderId}/status`, { status });
    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Fetch partner menu items
 * @returns {Promise<Array>} Array of menu items
 */
export const fetchPartnerMenuItems = async () => {
  try {
    const { data } = await axios_.get('/partners/menu-items');
    return data;
  } catch (error) {
    console.error('Error fetching partner menu items:', error);
    throw error;
  }
};

/**
 * Update menu item availability (partner)
 * @param {string} itemId - Menu item ID
 * @param {boolean} available - Availability status
 * @returns {Promise<Object>} Updated menu item
 */
export const updateMenuItemAvailability = async (itemId, available) => {
  try {
    const { data } = await axios_.patch(`/partners/menu-items/${itemId}/availability`, { available });
    return data;
  } catch (error) {
    console.error('Error updating menu item availability:', error);
    throw error;
  }
};

/**
 * Update kitchen status (partner)
 * @param {boolean} isActive - Kitchen active status
 * @returns {Promise<Object>} Updated kitchen
 */
export const updateKitchenStatus = async (isActive) => {
  try {
    const { data } = await axios_.patch('/partners/kitchen/status', { isActive });
    return data;
  } catch (error) {
    console.error('Error updating kitchen status:', error);
    throw error;
  }
};

