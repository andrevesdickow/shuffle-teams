import { SnackbarProps } from "./Snackbar";

export interface IFormData {
  withRating: boolean;
  members: string;
  numberOfTeams: string;
}

export type FormProps = {
  openSnackbar: (snackbarProps: SnackbarProps) => void;
}