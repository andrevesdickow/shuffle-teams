import { AlertColor } from '@mui/material'

export type SnackbarProps = {
  open: boolean;
  type: AlertColor;
  message?: string;
  autoHideDuration?: number; // in milliseconds
}