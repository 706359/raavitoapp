// context/FavoritesContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { axios_ } from '../../utils/utils';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load favorites from API
  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios_.get('/favorites');
      setFavorites(data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const addFavorite = async (kitchen) => {
    try {
      await axios_.post('/favorites', { kitchenId: kitchen.id || kitchen._id });
      await loadFavorites(); // Reload from server
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (kitchenId) => {
    try {
      await axios_.delete(`/favorites/${kitchenId}`);
      setFavorites((prev) => prev.filter((f) => (f._id || f.id) !== kitchenId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  const isFavorite = (id) => favorites.some((f) => (f._id || f.id) === id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite, loadFavorites, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
