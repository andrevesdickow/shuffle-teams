import { atom } from 'recoil'
import { IFormData } from '../interfaces/Forms'

export const formAtom = atom<IFormData>({
  key: 'formAtom',
  default: {
    withRating: false,
    members: '',
    numberOfTeams: '2'
  }
})