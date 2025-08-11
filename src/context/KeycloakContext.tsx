"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: "http://localhost:8081",
  realm: "teamhub",
  clientId: "teamhub-frontend",
};

const KeycloakContext = createContext(null);

export const useKeycloak = () => useContext(KeycloakContext);

export const KeycloakProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const keycloak = new Keycloak(keycloakConfig);
    keycloak.init({ onLoad: "check-sso", pkceMethod: "S256" }).then(() => {
      setKeycloak(keycloak);
      setInitialized(true);
    });
  }, []);

  return (
    <KeycloakContext.Provider value={{ keycloak, initialized }}>
      {children}
    </KeycloakContext.Provider>
  );
};