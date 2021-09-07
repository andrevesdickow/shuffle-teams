import { get, isEmpty, replace, set, shuffle, size, split } from 'lodash'

export type SeparatedTeamsType = {
  [name: string]: string[];
}

/**
 * Sorteia os membros entre as equipes
 * @param {string} members membros da equipe
 * @param {number} numOfTeams números de equipes
 * @returns `Object` objeto com as equipes sorteadas
 */
export default function suffleTeams(members: string, numOfTeams: number): SeparatedTeamsType {
  let listMembers = []

  const regex = new RegExp(/,/)
  const written = regex.test(members)

  // se `true`, é porque foi escrito
  // senão é colado de alguma conversa
  if (written) {
    listMembers = split(members, ',')
  } else {
    listMembers = split(members, /\n/)
  }

  const shuffledMembers = shuffle(listMembers)

  let count = 1
  const separatedTeams: SeparatedTeamsType = {}

  for (let index = 0; index < size(shuffledMembers); index++) {
    if (count > numOfTeams) {
      count = 1
    }

    const integrant = replace(shuffledMembers[index], /[^a-zA-Z]+/, '')

    if (!isEmpty(integrant)) {
      set(separatedTeams, `team${count}`, [
        ...get(separatedTeams, `team${count}`, []),
        integrant
      ])
      count++
    }
  }

  return separatedTeams
}