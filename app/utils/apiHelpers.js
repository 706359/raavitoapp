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

