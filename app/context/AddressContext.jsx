import React, { createContext, useContext, useEffect, useState } from 'react';
import { axios_ } from '../../utils/utils';
import { useAuth } from './AuthContext';

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load addresses from API
  const loadAddresses = async () => {
    if (!user) {
      setAddresses([]);
      setSelectedAddress(null);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios_.get('/addresses');
      setAddresses(data);
      // Set default address if available
      const defaultAddr = data.find((addr) => addr.isDefault) || data[0];
      if (defaultAddr) setSelectedAddress(defaultAddr);
    } catch (error) {
      console.error('Error loading addresses:', error);
      setAddresses([]);
      setSelectedAddress(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [user]);

  const addAddress = async (addressData) => {
    try {
      const { data } = await axios_.post('/addresses', addressData);
      setAddresses((prev) => [...prev, data]);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const updateAddress = async (id, addressData) => {
    try {
      const { data } = await axios_.put(`/addresses/${id}`, addressData);
      setAddresses((prev) => prev.map((addr) => (addr._id === id ? data : addr)));
      if (selectedAddress?._id === id) setSelectedAddress(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const deleteAddress = async (id) => {
    try {
      await axios_.delete(`/addresses/${id}`);
      setAddresses((prev) => prev.filter((addr) => addr._id !== id));
      if (selectedAddress?._id === id) {
        const remaining = addresses.filter((addr) => addr._id !== id);
        setSelectedAddress(remaining[0] || null);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        setSelectedAddress,
        loadAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        loading,
      }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
