import { atom } from 'recoil'
import { IntegrantType } from '../interfaces/Teams'

export const membersToRatingAtom = atom<IntegrantType[]>({
  key: 'membersToRatingAtom',
  default: []
})