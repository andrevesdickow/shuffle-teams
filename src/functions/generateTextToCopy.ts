import { isEmpty, join, last, map, replace, trimStart } from 'lodash'
import { IntegrantType } from '../interfaces/Teams'

export default function generateTextToCopy(teams: IntegrantType[][]): string {
  if (isEmpty(teams)) {
    return ''
  }

  const text = map(teams, (team, teamIndex) => (
    `Equipe ${teamIndex + 1}\n${map(team, (integrant, integrantIndex) => `${integrantIndex + 1}. ${trimStart(integrant.name)}${integrant === last(team) ? '\n\n' : '\n'}`)}`
  ))

  return replace(join(text, ''), /,/g, '')
}