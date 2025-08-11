"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Keycloak, { KeycloakInstance } from "keycloak-js";

const keycloakConfig = {
  url: "http://localhost:8081",
  realm: "teamhub",
  clientId: "teamhub-frontend",
};

interface KeycloakContextType {
  keycloak: KeycloakInstance | null;
  initialized: boolean;
}

const KeycloakContext = createContext<KeycloakContextType | null>(null);

export const useKeycloak = (): KeycloakContextType | null => useContext(KeycloakContext);

interface KeycloakProviderProps {
  children: ReactNode;
}

export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
  const [keycloak, setKeycloak] = useState<KeycloakInstance | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const keycloakInstance = new Keycloak(keycloakConfig);
    keycloakInstance
      .init({ onLoad: "check-sso", pkceMethod: "S256" })
      .then((authenticated) => {
        setKeycloak(keycloakInstance);
        setInitialized(true);
        // Optionally you can do something with authenticated here
      })
      .catch((error) => {
        console.error("Keycloak initialization failed:", error);
        setInitialized(true); // still set initialized true to avoid indefinite loading
      });
  }, []);

  return (
    <KeycloakContext.Provider value={{ keycloak, initialized }}>
      {children}
    </KeycloakContext.Provider>
  );
};
