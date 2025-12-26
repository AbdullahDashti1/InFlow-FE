import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#334155',
                    color: '#fff',
                },
                success: {
                    style: {
                        background: '#10b981',
                    },
                },
                error: {
                    style: {
                        background: '#ef4444',
                    },
                },
            }}
        />
    );
};

export default ToastProvider;