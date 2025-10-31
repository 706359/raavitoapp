import React, { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  return (
    <PaymentContext.Provider value={{ selectedPayment, setSelectedPayment }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
