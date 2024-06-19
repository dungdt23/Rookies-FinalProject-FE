export const AxiosConstants = {
    AXIOS_BASEURL: import.meta.env.VITE_API_URL || "https://localhost:7106",
    AXIOS_TIMEOUT: 10000,
    AXIOS_HEADER: {'Content-Type': 'application/json'},
}