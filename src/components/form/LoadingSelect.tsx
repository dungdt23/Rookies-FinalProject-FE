import React, { useEffect, useState } from 'react';
import { CircularProgress, InputLabel, MenuItem, Select, SelectChangeEvent, FormControl, FormHelperText } from '@mui/material';

export interface LoadingSelectOption {
    value: string;
    label: string;
}

interface LoadingSelectProps {
    label: string;
    loading: boolean;
    options: LoadingSelectOption[];
    value: string;
    onChange: (value: string) => void;
    helperText?: string;
}

const LoadingSelect: React.FC<LoadingSelectProps> = ({
    label,
    loading,
    options,
    value,
    onChange,
    helperText,
    ...props
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
        <FormControl >
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            {loading ? (
                <CircularProgress size={24} />
            ) : (
                <Select
                    labelId={`${label}-label`}
                    label={label}
                    value={internalValue}
                    onChange={handleChange}
                    sx={{ minWidth: '7rem' }}
                    {...props}
                >
                    {options.map((option: LoadingSelectOption) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            )}
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default LoadingSelect;
