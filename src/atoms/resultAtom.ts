import { atom } from 'recoil'
import { SeparatedTeamsType } from '../interfaces/Teams'

export const resultAtom = atom<SeparatedTeamsType>({
  key: 'resultAtom',
  default: {}
})