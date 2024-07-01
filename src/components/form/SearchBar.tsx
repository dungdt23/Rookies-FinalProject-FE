import { Search as SearchIcon } from '@mui/icons-material';
import { Box, Divider, IconButton, InputAdornment, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React, { forwardRef } from 'react';
import * as Yup from 'yup';

interface SearchBarProps {
    placeholderSearch: string;
    onSearchSubmit: (searchTerm: string) => void;
    inputRef?: React.Ref<HTMLInputElement>;
    TextFieldProps?: React.ComponentProps<typeof TextField>
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
    ({ placeholderSearch, onSearchSubmit, inputRef , TextFieldProps}, ref) => {
        const formik = useFormik({
            initialValues: {
                searchTerm: ''
            },
            validationSchema: Yup.object({
                searchTerm: Yup.string()
                    .trim()
                    .max(200, 'Search term must be at most 200 characters')
            }),
            onSubmit: (values) => {
                onSearchSubmit(values.searchTerm.trim());
            },
        });


        const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
                formik.handleSubmit();
            }
        };

        return (
            <Box style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    inputRef={inputRef || ref}
                    sx={{ flex: 1 }}
                    placeholder={placeholderSearch}
                    error={Boolean(formik.errors.searchTerm)}
                    helperText={formik.errors.searchTerm}
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={formik.handleChange}
                    value={formik.values.searchTerm}
                    name="searchTerm"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <>
                                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                    <IconButton
                                        type="submit"
                                        sx={{ p: '10px' }}
                                        aria-label="search"
                                        onClick={() => formik.handleSubmit()}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </>
                            </InputAdornment>
                        ),
                    }}
                    onKeyUp={handleKeyPress}
                    {...TextFieldProps}
                />
            </Box>
        );
    }
);

export default SearchBar;
