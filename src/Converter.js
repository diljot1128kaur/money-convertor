import React, { useEffect, useState } from 'react';
import './index.css';

const API_URL = 'https://api.frankfurter.app';

function Converter() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load available currencies
  useEffect(() => {
    fetch(`${API_URL}/currencies`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setCurrencies(Object.keys(data));
          setLoading(false);
        } else {
          throw new Error("No currency data");
        }
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch currency list.");
        setLoading(false);
      });
  }, []);

  // Convert amount
  useEffect(() => {
    if (fromCurrency && toCurrency && amount && fromCurrency !== toCurrency) {
      fetch(`${API_URL}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.rates && data.rates[toCurrency]) {
            setConvertedAmount(data.rates[toCurrency].toFixed(2));
          } else {
            setConvertedAmount("Error");
          }
        })
        .catch(err => {
          console.error(err);
          setConvertedAmount("Error");
        });
    } else if (fromCurrency === toCurrency) {
      setConvertedAmount(amount);
    }
  }, [fromCurrency, toCurrency, amount]);

  if (loading) return <div className="converter">Loading currencies...</div>;
  if (error) return <div className="converter error">{error}</div>;

  return (
    <div className="converter">
      <div className="input-group">
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="0"
        />
        <select
          value={fromCurrency}
          onChange={e => setFromCurrency(e.target.value)}
        >
          {currencies.map(cur => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>
        <span>→</span>
        <select
          value={toCurrency}
          onChange={e => setToCurrency(e.target.value)}
        >
          {currencies.map(cur => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>
      </div>
      <div className="result">
        {amount} {fromCurrency} = {convertedAmount || '...'} {toCurrency}
      </div>
    </div>
  );
}

export default Converter;
