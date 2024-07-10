import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import replace from '@rollup/plugin-replace';

export default defineConfig({
    plugins: [
        react(),
        // Configure @rollup/plugin-replace to replace console.log in production
        {
            ...replace({
                preventAssignment: true,
                values: {
                    'console.log': '(()=>{})',
                },
            }),
            apply: 'build', // Apply only in build mode
        },
    ],
});
