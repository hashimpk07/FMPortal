import { createRoot } from 'react-dom/client';
import AppProvider from './Provider';
import setMuiLicenseKey from '../lib/muiConfig';
import { MUI_LICENSE_KEY } from '../constants/config';

const rootElement = document.getElementById('root');

async function enableMocking() {
    // Only enable mocks in development and when VITE_USE_MOCKS is not 'false'
    const shouldUseMocks =
        import.meta.env.DEV &&
        import.meta.env.VITE_USE_MOCKS !== 'false' &&
        !localStorage.getItem('msw-disabled');

    if (!shouldUseMocks) {
        console.log('Mocking is disabled');
        return;
    }

    // @ts-expect-error Worker refuses to be defined in global.d.ts
    const { worker } = await import('../mocks/browser').catch(() => {
        throw new Error('Failed to import worker');
    });

    await worker.start();
}

enableMocking().then(() => {
    setMuiLicenseKey(MUI_LICENSE_KEY);

    if (rootElement) {
        createRoot(rootElement).render(<AppProvider />);
    } else {
        console.error('Root element not found!');
    }
});
