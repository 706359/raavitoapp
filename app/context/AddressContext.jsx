import React, { createContext, useContext, useState } from 'react';

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [selectedAddress, setSelectedAddress] = useState('Fetching...');

  return (
    <AddressContext.Provider value={{ selectedAddress, setSelectedAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
