import { useState } from 'react'
import { MdShuffle as ShuffleIcon } from 'react-icons/md'
import ReactStars from 'react-stars'

import { cloneDeep, map, toNumber } from 'lodash'
import { useTranslations } from 'use-intl'

import { Box, Button, Flex, Heading, Icon, Text, useBreakpointValue } from '@chakra-ui/react'

import { useFormData } from '../../contexts/FormDataContext'
import { shuffleTeamsByRating } from '../../functions/shuffleTeams'

export default function RatingCard() {
  const t = useTranslations('home')
  const isMobile = useBreakpointValue({
    base: true,
    sm: false
  })

  const [loading, setLoading] = useState(false)

  const {
    controls,
    handleChangeMembersToRating,
    membersToRating,
    handleChangeResult
  } = useFormData()

  /**
   * Função que altera a pontuação do jogador
   * @param rating pontuação
   * @param index índice
   */
  function handleChangeIntegrantRating(rating: number | null, index: number) {
    const clone = cloneDeep(membersToRating)
    clone[index].rating = rating
    handleChangeMembersToRating(clone)
  }

  /**
   * Função executada ao clicar em "Sortear"
   * @returns `void`
   */
  async function handleShuffleByRating() {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))

    const teams = toNumber(controls.numberOfTeams)
    const separatedTeams = shuffleTeamsByRating(membersToRating, teams)
    handleChangeResult(separatedTeams)

    setLoading(false)
  }

  return (
    <Box p="4" mt="4" border="1px" borderColor="gray.100" borderRadius="8">
      <Heading size="sm">{t('enterPlayerScores')}</Heading>
      <Box>
        {
          map(membersToRating, (memberToRating, indexMemberToRating) => (
            <Flex key={memberToRating.name} direction="row" align="center">
              <ReactStars
                count={5}
                half={false}
                value={toNumber(memberToRating.rating)}
                onChange={(newRating: number) => {
                  handleChangeIntegrantRating(newRating, indexMemberToRating)
                }}
                size={isMobile ? 24 : 16}
              />
              <Text as="legend" ml={["2", "4"]}>{memberToRating.name}</Text>
            </Flex>
          ))
        }
      </Box>
      <Box mt="4">
        <Button
          colorScheme="teal"
          isLoading={loading}
          leftIcon={<Icon as={ShuffleIcon} />}
          variant="outline"
          onClick={handleShuffleByRating}
          width={isMobile ? 'full' : 'intrinsic'}
        >
          {t('shuffle')}
        </Button>
      </Box>
    </Box>
  )
}