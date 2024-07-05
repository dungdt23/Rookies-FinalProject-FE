import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as yup from 'yup';
import Iconify from '../../components/iconify';
import { useAuth } from '../../contexts/AuthContext';
import { loginPost, LoginRequest } from '../../services/user.service';

// Define the validation schema
const validationSchema = yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
});

const LoginForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { login } = useAuth();
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setIsFetching(true);
            try {
                const payload: LoginRequest = {
                    userName: values.username,
                    password: values.password,
                };

                const response = await loginPost(payload);
                login(response.data.token);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 403) {
                        setError("This account is disabled. Please contact the admin for more information.")
                    } else if (error.response?.status === 400) {
                        setError("Login failed. Please check your credentials");
                    }
                    console.error(error);
                }
            } finally {
                setIsFetching(false);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3} mb={3}>
                <TextField
                    name="username"
                    label="Username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                    required
                    autoFocus
                    InputLabelProps={{
                        shrink: true
                    }}
                />

                <TextField
                    name="password"
                    label="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    required
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    InputLabelProps={{
                        shrink: true
                    }}
                />
            </Stack>

            {error && (
                <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>
            )}

            <LoadingButton loading={isFetching} fullWidth size="large" type="submit" variant="contained">
                Login
            </LoadingButton>
        </form>
    );
};

export default LoginForm;
