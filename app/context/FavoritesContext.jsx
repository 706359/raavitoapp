// context/FavoritesContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('favorites');
      if (saved) setFavorites(JSON.parse(saved));
    })();
  }, []);

  const saveFavorites = async (data) => {
    setFavorites(data);
    await AsyncStorage.setItem('favorites', JSON.stringify(data));
  };

  const addFavorite = (kitchen) => {
    if (!favorites.some((f) => f.id === kitchen.id)) {
      const updated = [...favorites, kitchen];
      saveFavorites(updated);
    }
  };

  const removeFavorite = (id) => {
    const updated = favorites.filter((f) => f.id !== id);
    saveFavorites(updated);
  };

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
