
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getExchangeRates, formatCurrency as apiFormatCurrency } from '../services/api';

type Currency = 'ZAR' | 'USD' | 'GBP' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: Record<string, number>;
  formatValue: (amount: number) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('ZAR');
  const [rates, setRates] = useState<Record<string, number>>({ ZAR: 1 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRates = async () => {
      try {
        const res = await getExchangeRates();
        setRates(res);
      } catch (e) {
        console.error("Rates fetch failed, using defaults");
      } finally {
        setIsLoading(false);
      }
    };
    loadRates();
  }, []);

  const formatValue = (amount: number) => apiFormatCurrency(amount, currency, rates);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, formatValue, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
