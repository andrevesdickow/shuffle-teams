import { GetStaticPropsContext } from 'next'

import { useMemo } from 'react'

import Head from 'next/head'
import {
  isEmpty,
  map,
  mapValues,
  pick,
  toString,
  trimStart,
} from 'lodash'
import { useTranslations } from 'use-intl'

import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text
} from '@chakra-ui/react'

import Form from '../components/Form'
import Header from '../components/Header'
import RatingCard from '../components/RatingCard'
import { useFormData } from '../contexts/FormDataContext'
import generateTextToCopy from '../functions/generateTextToCopy'

type IntegrantType = {
  name: string;
  rating: number | null;
}

export default function Home() {
  const t = useTranslations('home')

  const { controls, membersToRating, result } = useFormData()

  const teams = useMemo(() => {
    const aux: IntegrantType[][] = []
    mapValues(result, (teams: IntegrantType[]) => {
      aux.push(teams)
    })

    return aux
  }, [result])

  const textToCopy = useMemo(() => {
    return generateTextToCopy(teams)
  }, [teams])

  return (
    <Box height="auto" minH="100vh">
      <Head>
        <title>Sortchêador</title>
        <meta name="description" content="Sorteador de Times para qualquer esporte." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Container maxW="container.sm" mt="8">
        <Heading as="h1" textAlign="center" fontWeight="normal" fontSize="6xl">Sor<Text as="span" fontWeight="bold" color="teal.500">tchê</Text>ador</Heading>

        <Heading as="h2" fontWeight="light" fontSize="xl">
          {`${t('typeNames')} `}
          <code>,</code>{' '}
          {t('orPaste')} 😀
        </Heading>

        <Form textToCopy={textToCopy} />

        {
          (controls.withRating && !isEmpty(membersToRating)) && (
            <RatingCard />
          )
        }

        {
          !isEmpty(result) && (
            <SimpleGrid mt="8" mb="8" columns={[1, 2, 3, 4]} spacing="8">
              {
                map(teams, (team, teamIndex) => (
                  <Table
                    key={`team-${teamIndex}`}
                    aria-label={t('teamResults')}
                    size="sm"
                    variant="striped"
                    colorScheme="blackAlpha"
                  >
                    <Thead>
                      <Tr>
                        <Th>{t('team')} {teamIndex + 1}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {
                        map(team, (integrant, integrantIndex) => (
                          <Tr key={integrant.name}>
                            <Td>{integrantIndex + 1}. {trimStart(toString(integrant.name))}</Td>
                          </Tr>
                        ))
                      }
                    </Tbody>
                  </Table>
                ))
              }
            </SimpleGrid>
          )
        }
      </Container>
    </Box>
  )
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: pick(
        await import(`../locales/${locale}.json`),
        ['home', 'generic']
      )
    }
  };
}
