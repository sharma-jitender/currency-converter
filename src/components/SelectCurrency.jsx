const SelectCurrency = ({ label, value, onChange, currencies }) => {
  return (
    <div className="select-currency">
      <label>{label}</label>
      <select value={value} onChange={onChange}>
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectCurrency;