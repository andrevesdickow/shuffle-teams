import {
  get,
  groupBy,
  isEmpty,
  mapValues,
  orderBy,
  set,
  shuffle,
  size,
  split,
  toString,
} from 'lodash'
import compactFP from 'lodash/fp/compact'
import flow from 'lodash/fp/flow'
import mapFP from 'lodash/fp/map'
import replaceFP from 'lodash/fp/replace'
import trimFP from 'lodash/fp/trim'
import { IntegrantType, SeparatedTeamsType } from '../interfaces/Teams'

/**
 * Sorteia os membros entre as equipes
 * @param {string} members membros da equipe
 * @param {number} numOfTeams números de equipes
 * @returns `Object` objeto com as equipes sorteadas
 */
export function shuffleTeams(members: string, numOfTeams: number): SeparatedTeamsType {
  let listMembers = []

  const regex = new RegExp(/,/)
  const written = regex.test(members)

  // se `true`, é porque foi escrito
  // senão é colado de alguma conversa
  if (written) {
    listMembers = split(members, ',')
  } else {
    listMembers = split(members, /\r?\n/)
  }

  const shuffledMembers = shuffle(listMembers)

  let count = 1
  const separatedTeams: SeparatedTeamsType = {}

  for (let index = 0; index < size(shuffledMembers); index++) {
    if (count > numOfTeams) {
      count = 1
    }

    const regexStartWith = new RegExp(/^\d([\w ]+)?(.|-)/g)
    if (!written && !regexStartWith.test(shuffledMembers[index])) continue

    // const integrant = replace(shuffledMembers[index], /[^a-zA-Z]+/, '')
    const integrant = flow(
      replaceFP(regexStartWith, ''),
      trimFP
    )(shuffledMembers[index])

    if (isEmpty(integrant)) continue

    set(separatedTeams, `team${count}`, [
      ...get(separatedTeams, `team${count}`, []),
      { name: integrant, rating: null }
    ])
    count++
  }

  return separatedTeams
}

export function shuffleTeamsByRating(members: IntegrantType[], numOfTeams: number): SeparatedTeamsType {
  const ordered = orderBy(members, ['rating'], ['desc'])
  const grouped = groupBy(ordered, 'rating')

  let count = 1
  const separatedTeams: SeparatedTeamsType = {}

  mapValues(grouped, (listMembers) => {
    const shuffledMembers = shuffle(listMembers)

    for (let index = 0; index < size(shuffledMembers); index++) {
      if (count > numOfTeams) {
        count = 1
      }

      const integrant = shuffledMembers[index]

      set(separatedTeams, `team${count}`, [
        ...get(separatedTeams, `team${count}`, []),
        { name: integrant.name, rating: integrant.rating }
      ])
      count++
    }

    return null
  })

  return separatedTeams
}

export function organizeMembersToRating(members: string): IntegrantType[] {
  let listMembers = []

  const regex = new RegExp(/,/)
  const written = regex.test(members)

  // se `true`, é porque foi escrito
  // senão é colado de alguma conversa
  if (written) {
    listMembers = split(members, ',')
  } else {
    listMembers = split(members, /\r?\n/)
  }

  const regexStartWith = new RegExp(/^\d([\w ]+)?(.|-)/g)

  const separatedMembers = flow(
    mapFP(integrant => {
      const name = flow(
        replaceFP(regexStartWith, ''),
        trimFP
      )(toString(integrant))

      if (isEmpty(name)) return null

      return { name, rating: null }
    }),
    compactFP
  )(listMembers)

  return separatedMembers
}
