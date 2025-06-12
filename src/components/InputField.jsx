const InputField = ({ label, value, onChange, readOnly }) => {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input
        type="number"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
};

export default InputField;