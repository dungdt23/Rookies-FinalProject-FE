import { Search as SearchIcon } from '@mui/icons-material';
import { Divider, IconButton, InputAdornment, PaperProps, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React, { forwardRef } from 'react';
import * as Yup from 'yup';

interface SearchBarProps extends PaperProps {
    placeholderSearch: string;
    onSearchSubmit: (searchTerm: string) => void;
    inputRef?: React.Ref<HTMLInputElement>;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
    ({ placeholderSearch, onSearchSubmit, inputRef }, ref) => {
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

        console.log(formik.touched.searchTerm, formik.errors.searchTerm);
        

        return (
            <form onSubmit={formik.handleSubmit} style={{ minWidth: '20rem', display: 'flex', alignItems: 'center', flex: 1 }}>
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
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </>
                            </InputAdornment>
                        ),
                    }}
                    onKeyUp={handleKeyPress}
                />
            </form>
        );
    }
);

export default SearchBar;
