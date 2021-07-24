import { useMemo, useState } from 'react'

import {
  get,
  isEmpty,
  isNaN,
  isNumber,
  map,
  mapValues,
  set,
  shuffle,
  size,
  split,
  toString,
  trimStart,
} from 'lodash'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import {
  Box,
  Button,
  Center,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from '@chakra-ui/react'

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const [members, setMembers] = useState<string>('')
  const [numberOfTeams, setNumberOfTeams] = useState<number>(2)
  const [result, setResult] = useState<Object>()

  const toast = useToast()

  function shuffleTeams() {
    if (isEmpty(members)) {
      toast({
        title: ":(",
        description: "Informe os integrantes da equipe.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })

      return
    }

    if (!isNumber(numberOfTeams) || numberOfTeams <= 0) {
      toast({
        title: ":(",
        description: "Informe a quantidade de equipes.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })

      return
    }

    setLoading(true)

    const listMembers = split(members, ',')
    const shuffledMembers = shuffle(listMembers)

    let count = 1
    const separedTeams = {}

    for (let index = 0; index < size(shuffledMembers); index++) {
      if (count > numberOfTeams) {
        count = 1
      }

      set(separedTeams, `team${count}`, [
        ...get(separedTeams, `team${count}`, []),
        shuffledMembers[index]
      ])

      count++
    }

    setResult(separedTeams)

    setLoading(false)
  }

  const teams = useMemo(() => {
    const aux = []
    mapValues(result, (teams) => {
      aux.push(teams)
    })

    return aux
  }, [result])

  return (
    <div className={styles.container}>
      <Head>
        <title>Sorteador de Times</title>
        <meta name="description" content="Sorteador de Times" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box className={styles.header}>
          <h1 className={styles.title}>
            Sorteador de <b>Times!</b>
          </h1>

          <p className={styles.description}>
            Digite os nomes dos integrantes separados por vírgula{' '}
            <code className={styles.code}>,</code>
          </p>
        </Box>


        <SimpleGrid columns={1} spacing={10}>
          <Box w="100%">
            <Textarea
              value={members}
              onChange={e => setMembers(e.target.value)}
              placeholder="Integrantes"
            />
          </Box>
          <Box>
            <NumberInput
              value={numberOfTeams}
              onChange={(_, valueAsNumber) => setNumberOfTeams(isNaN(valueAsNumber) ? 0 : valueAsNumber)}
              placeholder="Nº de Equipes"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
          <Box>
            <Center>
              <Button
                isLoading={loading}
                loadingText="Sorteando"
                colorScheme="teal"
                variant="outline"
                onClick={shuffleTeams}
              >
                Sortear
              </Button>
            </Center>
          </Box>
          {
            !isEmpty(result)
              ? (
                <Box>
                  <Center>
                    {
                      map(teams, (team, teamIndex) => (
                        <Table size="sm" className={styles.table} key={`Equipe ${teamIndex + 1}`}>
                          <Thead>
                            <Tr>
                              <Th>Equipe {teamIndex + 1}</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {
                              map(team, (integrant, integrantIndex) => (
                                <Tr>
                                  <Td className={styles.integrantName}>{integrantIndex + 1}. {trimStart(toString(integrant))}</Td>
                                </Tr>
                              ))
                            }
                          </Tbody>
                        </Table>
                      ))
                    }
                  </Center>
                </Box>
              )
              : null
          }
        </SimpleGrid>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
