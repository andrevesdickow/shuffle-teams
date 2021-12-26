import { useState } from 'react'

import { camelCase, cloneDeep, map, toNumber } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useTranslations } from 'use-intl'

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Rating,
  Theme,
  Typography
} from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Shuffle as ShuffleIcon } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { makeStyles } from '@mui/styles'

import { formAtom } from '../../atoms/formAtom'
import { membersToRatingAtom } from '../../atoms/membersToRatingAtom'
import { resultAtom } from '../../atoms/resultAtom'
import { shuffleTeamsByRating } from '../../functions/shuffleTeams'

const useStyles = makeStyles((theme: Theme) => ({
  cardMembersToRating: {
    marginTop: theme.spacing(2),
  },
  membersToRating: {
    display: 'flex',
    alignItems: 'center',

    '& legend': {
      marginLeft: theme.spacing(1)
    }
  },

  button: {
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(1),

      '& > :first-child': {
        marginRight: 0
      }
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),

      '& > :nth-child(1)': {
        marginTop: 0
      }
    }
  },
}))

export default function RatingCard() {
  const t = useTranslations('home')
  const classes = useStyles()
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const [loading, setLoading] = useState(false)

  const formState = useRecoilValue(formAtom)
  const [membersToRatingState, setMembersToRatingState] = useRecoilState(membersToRatingAtom)
  const [res, setResultState] = useRecoilState(resultAtom)

  console.warn({
    membersToRatingState,
    res
  })

  /**
   * Função que altera a pontuação do jogador
   * @param rating pontuação
   * @param index índice
   */
  function handleChangeIntegrantRating(rating: number | null, index: number) {
    const clone = cloneDeep(membersToRatingState)
    clone[index].rating = rating
    setMembersToRatingState(clone)
  }

  /**
   * Função executada ao clicar em "Sortear"
   * @returns `void`
   */
  function handleShuffleByRating(): void {
    setLoading(true)

    const teams = toNumber(formState.numberOfTeams)
    const separatedTeams = shuffleTeamsByRating(membersToRatingState, teams)
    setResultState(separatedTeams)

    setLoading(false)
  }

  return (
    <Card className={classes.cardMembersToRating}>
      <CardHeader title={t('enterPlayerScores')} />
      <CardContent>
        {
          map(membersToRatingState, (memberToRating, indexMemberToRating) => (
            <Box key={memberToRating.name} className={classes.membersToRating}>
              <Rating
                name={camelCase(memberToRating.name)}
                value={memberToRating.rating}
                onChange={(_event: React.SyntheticEvent<Element, Event>, newValue: number | null) => {
                  handleChangeIntegrantRating(newValue, indexMemberToRating)
                }}
                size={isMobile ? 'large' : 'medium'}
              />
              <Typography component="legend">{memberToRating.name}</Typography>
            </Box>
          ))
        }
      </CardContent>
      <CardActions>
        <LoadingButton
          loading={loading}
          loadingPosition="start"
          startIcon={<ShuffleIcon />}
          variant="outlined"
          onClick={handleShuffleByRating}
          fullWidth={isMobile}
          className={classes.button}
        >
          {t('shuffle')}
        </LoadingButton>
      </CardActions>
    </Card>
  )
}