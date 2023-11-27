import React, { createContext, useContext, useState } from 'react';

const UsuarioContext = createContext();

const UsuarioProvider = ({ children }) => {
  const [usuarioId, setUsuarioId] = useState(null);

  const setUsuarioIdValue = (newUsuarioId) => {
    setUsuarioId(newUsuarioId);
  };

  return (
    <UsuarioContext.Provider value={{ usuarioId, setUsuarioIdValue }}>
      {children}
    </UsuarioContext.Provider>
  );
};

const useUsuarioContext = () => {
  const context = useContext(UsuarioContext);
  if (!context) {
    throw new Error('useUsuarioContext must be used within a UsuarioProvider');
  }
  return context;
};

export { UsuarioProvider, useUsuarioContext };