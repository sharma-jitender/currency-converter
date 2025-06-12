import { useState, useEffect } from 'react';
import axios from 'axios';
import InputField from './InputField';
import SelectCurrency from './SelectCurrency';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState(null);
  const [news, setNews] = useState([]);

  const EXCHANGE_API_KEY = '8b752ad4a46498fae4228218'; 
  const NEWS_API_KEY = 'd6872694363d429eb4e53982cadffd30'; 
  const EXCHANGE_API_BASE_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/`;
  const NEWS_API_URL = `https://newsapi.org/v2/everything?q=currency+market&apiKey=${NEWS_API_KEY}&language=en&pageSize=5`;

  // Fetch available currencies and initial exchange rate
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(`${EXCHANGE_API_BASE_URL}USD`);
        const currencyList = Object.keys(response.data.conversion_rates);
        setCurrencies(currencyList);
        setExchangeRate(response.data.conversion_rates[toCurrency]);
      } catch (err) {
        setError('Failed to fetch exchange rates. Please try again later.');
        console.error(err);
      }
    };
    fetchCurrencies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EXCHANGE_API_BASE_URL]);

  // Update exchange rate when currencies change
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(`${EXCHANGE_API_BASE_URL}${fromCurrency}`);
        const newRate = response.data.conversion_rates[toCurrency];
        setExchangeRate(newRate);
        setError(null);
      } catch (err) {
        setError('Failed to fetch exchange rates. Please try again later.');
        console.error(err);
      }
    };
    if (fromCurrency && toCurrency) {
      fetchExchangeRate();
    }
  }, [EXCHANGE_API_BASE_URL, fromCurrency, toCurrency]);

  // Calculate converted amount
  useEffect(() => {
    if (exchangeRate && amount) {
      const result = (amount * exchangeRate).toFixed(2);
      setConvertedAmount(result);
    }
  }, [amount, exchangeRate]);

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(NEWS_API_URL);
        setNews(response.data.articles);
      } catch (err) {
        console.error('Failed to fetch news:', err);
      }
    };
    fetchNews();
  }, [NEWS_API_URL]);

  // Handle amount input change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value >= 0 || value === '') {
      setAmount(value);
    }
  };

  // Swap currencies and update exchange rate immediately
  const handleSwap = async () => {
    const oldFrom = fromCurrency;
    const oldTo = toCurrency;
    setFromCurrency(oldTo);
    setToCurrency(oldFrom);

    try {
      const response = await axios.get(`${EXCHANGE_API_BASE_URL}${oldTo}`);
      const newRate = response.data.conversion_rates[oldFrom];
      setExchangeRate(newRate);
    } catch (err) {
      setError('Failed to fetch exchange rate after swap. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="converter">
      {error && <p className="error">{error}</p>}
      <div className="input-group">
        <InputField
          label="Amount"
          value={amount}
          onChange={handleAmountChange}
        />
        <SelectCurrency
          label="From"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          currencies={currencies}
        />
      </div>
      <button className="swap-button" onClick={handleSwap}>
        ↔
      </button>
      <div className="input-group">
        <InputField
          label="Converted Amount"
          value={convertedAmount || ''}
          readOnly
        />
        <SelectCurrency
          label="To"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          currencies={currencies}
        />
      </div>
      {exchangeRate && (
        <p className="rate-info">
          1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
        </p>
      )}
      <div className="news-section">
        <h3>Latest Currency News</h3>
        {news.length > 0 ? (
          <ul>
            {news.map((article, index) => (
              <li key={index}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading news...</p>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;