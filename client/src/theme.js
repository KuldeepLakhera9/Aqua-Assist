import { createTheme } from '@mui/material/styles';

/**
 * Unified MUI Theme bridged directly to application CSS Custom Properties.
 * This guarantees that all MUI components automatically respond to the Tailwind
 * dark/light toggle (.dark class on <html>) through dynamic CSS variables.
 */
const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(var(--app-accent, 37 99 235))',
      light: 'rgb(var(--app-accent, 56 189 248))',
      dark: 'rgb(var(--app-primary, 30 58 138))',
      contrastText: '#ffffff',
    },
    secondary: {
      main: 'rgb(var(--app-muted, 100 116 139))',
      contrastText: '#ffffff',
    },
    background: {
      default: 'rgb(var(--app-base, 255 255 255))',
      paper: 'rgb(var(--app-card, 255 255 255))',
    },
    text: {
      primary: 'rgb(var(--app-text, 15 23 42))',
      secondary: 'rgb(var(--app-muted, 100 116 139))',
    },
    divider: 'rgb(var(--app-border, 226 232 240))',
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgb(var(--app-card, 255 255 255))',
          color: 'rgb(var(--app-text, 15 23 42))',
          border: '1px solid rgb(var(--app-border, 226 232 240))',
          transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(var(--app-card, 255 255 255))',
          color: 'rgb(var(--app-text, 15 23 42))',
          border: '1px solid rgb(var(--app-card-border, 226 232 240))',
          boxShadow: 'none',
          transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgb(var(--app-card, 255 255 255))',
          color: 'rgb(var(--app-text, 15 23 42))',
          border: '1px solid rgb(var(--app-card-border, 226 232 240))',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: 'rgb(var(--app-text, 15 23 42))',
          borderBottom: '1px solid rgb(var(--app-border, 226 232 240))',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgb(var(--app-surface, 248 250 252))',
        },
      },
    },
  },
});

export default theme;