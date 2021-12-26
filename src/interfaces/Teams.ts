export type IntegrantType = {
  name: string;
  rating: number | null;
}

export type SeparatedTeamsType = {
  [name: string]: IntegrantType[];
}

export interface IResultTeams {
  listResult: SeparatedTeamsType;
  listToRating: IntegrantType[];
}