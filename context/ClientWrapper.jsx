'use client'; // ✅ Mark this as a client component

import React from 'react';
import { AppContextProvider } from './AppContext';

const ClientWrapper = ({ children }) => {
  return <AppContextProvider>{children}</AppContextProvider>;
};

export default ClientWrapper;
