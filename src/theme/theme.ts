import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';

import '@fontsource/onest/100.css';
import '@fontsource/onest/300.css';
import '@fontsource/onest/400.css'; // Regular weight
import '@fontsource/onest/500.css';
import '@fontsource/onest/700.css'; // Bold weight

declare module '@mui/material/styles' {
    interface TypographyVariants {
        customLabel1: React.CSSProperties;
        customLabel2: React.CSSProperties;
        customTableHeaderTitle: React.CSSProperties;
        error: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        customLabel1?: React.CSSProperties;
        customLabel2?: React.CSSProperties;
        customTableHeaderTitle?: React.CSSProperties;
        error?: React.CSSProperties;
    }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        customLabel1: true;
        customLabel2: true;
        customTableHeaderTitle: true;
        error: true;
    }
}

const theme = createTheme({
    mixins: {
        toolbar: {
            minHeight: 64,
        },
    },
    palette: {
        common: {
            black: '#222222',
            white: '#F5F5F5',
        },
        primary: {
            main: '#0A77FF',
            light: '#2196F3',
            dark: '#0A77FF',
            contrastText: '#fff',
        },
        secondary: {
            main: '#E0E9F0',
            light: '#F1F1F1',
            dark: '#E0E9F0',
            contrastText: '#fff',
        },
        text: {
            primary: '#555555',
            secondary: '#757575',
            disabled: 'rgba(0, 0, 0, 0.38)',
        },
        warning: {
            main: '#D32F2F',
            light: '##FF395D',
            dark: '#D32F2F',
            contrastText: '#fff',
        },
        info: {
            main: '#0288d1',
            light: '#03a9f4',
            dark: '#01579b',
            contrastText: '#fff',
        },
        background: {
            paper: '#fff',
            default: '#fff',
        },
    },
    typography: {
        fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
        h1: {
            fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
            fontSize: '36px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '47px',
            color: '#171A1C',
        },
        h2: {
            fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
            fontSize: '24px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '32px',
            color: '#252525',
        },
        h3: {
            fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 600, // Adjusted to fit the Figma design
            lineHeight: '24px',
            color: '#252525',
        },
        h4: {
            fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
            fontSize: '12px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '16px',
            color: '#252525',
        },
        h5: {
            fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
            fontSize: '10px',
            fontStyle: 'normal',
            fontWeight: 300,
            lineHeight: '14px',
            color: '#252525',
        },
        subtitle1: {
            fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
            fontSize: '1rem',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '125%',
            color: '#222222',
        },
        subtitle2: {
            fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
            fontSize: '0.875rem',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: '100%',
            color: '#555555',
        },
        customLabel1: {
            fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
            fontSize: '28px',
            fontWeight: 600,
            lineHeight: '24px',
            color: '#252525',
            letterSpacing: '-0.42px',
        },
        customLabel2: {
            fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '24px',
            color: '#333',
            letterSpacing: '-0.42px',
        },
        customTableHeaderTitle: {
            fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '20px',
            color: '#32383E',
            letterSpacing: '-0.42px',
        },
        error: {
            fontFamily: '"Inter", "Arial", sans-serif',
            fontSize: '10px',
            fontWeight: 400,
            lineHeight: '20px',
            color: '#D61A3C',
            letterSpacing: '-0.42px',
        },
    },
    components: {
        // Customize the MuiButton component
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
                    textTransform: 'none', // Prevent text transformation
                    fontWeight: 500,
                },
                outlined: {
                    borderColor: '#d3d3d3', // Set the border color to black
                    color: 'black', // Set the text color to black
                    '&:hover': {
                        borderColor: '#d3d3d3', // Keep the border color black on hover
                        backgroundColor: 'rgba(0, 0, 0, 0.04)', // Optional: Light hover effect
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Prevent text transformation
                },
            },
        },
        MuiBreadcrumbs: {
            styleOverrides: {
                root: {
                    fontSize: '12px', // Global font size for breadcrumbs
                    fontWeight: 'bold',
                    color: 'text.primary',
                },
                li: {
                    '&:hover': {
                        textDecoration: 'underline', // Add underline on hover for breadcrumb items
                    },
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                size: 'small', // Set the default size to 'small'
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                input: {
                    fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
                },
            },
        },
        MuiSelect: {
            defaultProps: {
                size: 'small', // Set the default size to 'small'
            },
            styleOverrides: {
                root: {
                    fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
                    color: '#32383E',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
                    color: '#32383E',
                    fontSize: '16px',
                },
            },
        },
        MuiFormControl: {
            defaultProps: {
                size: 'small', // Set default size for FormControl (affects Select)
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                columnHeaderTitle: {
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#32383E',
                },
                // Add vertical lines between columns
                cell: {
                    fontSize: '16px',
                    fontWeight: 500,
                    borderRight: '1px solid rgba(224, 224, 224, 1)', // Adjust this for the vertical line
                    color: '#333333',
                },
                // Add vertical lines to the column header cells as well
                columnHeader: {
                    backgroundColor: '#FBFCFE',
                    borderRight: '1px solid rgba(224, 224, 224, 1)', // Vertical line between column headers
                },
            },
        },
        MuiSnackbar: {
            styleOverrides: {
                root: {
                    '& .MuiPaper-root': {
                        fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
                        fontSize: '14px',
                        fontWeight: 500,
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    fontFamily: "'Onest', 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
                    fontSize: '14px',
                    fontWeight: 500,
                    alignItems: 'center',
                    '& .MuiAlert-message': {
                        padding: '8px 0',
                    },
                },
                standardSuccess: {
                    backgroundColor: '#E7F6E7',
                    color: '#1E4620',
                },
                standardError: {
                    backgroundColor: '#FDEDED',
                    color: '#5F2120',
                },
                standardWarning: {
                    backgroundColor: '#FFF4E5',
                    color: '#663C00',
                },
                standardInfo: {
                    backgroundColor: '#E5F6FD',
                    color: '#014361',
                },
            },
        },
    },
});

export default theme;
