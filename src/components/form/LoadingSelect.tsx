import React, { useEffect, useState } from 'react';
import { CircularProgress, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface LoadingSelectProps {
  label: string;
  loading: boolean;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

const LoadingSelect: React.FC<LoadingSelectProps> = ({
  label,
  loading,
  options,
  value,
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState<string>(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setInternalValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <Select
      label={label}
      value={internalValue}
      onChange={handleChange}
      disabled={loading}
      fullWidth
      renderValue={(selected) => (
        <div>
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            options.find((option) => option.value === selected)?.label || 'Select...'
          )}
        </div>
      )}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default LoadingSelect;
