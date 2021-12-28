import { useState } from 'react'

import { camelCase, cloneDeep, map, toNumber } from 'lodash'
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

import { useFormData } from '../../contexts/FormDataContext'
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
  function handleShuffleByRating(): void {
    setLoading(true)

    const teams = toNumber(controls.numberOfTeams)
    const separatedTeams = shuffleTeamsByRating(membersToRating, teams)
    handleChangeResult(separatedTeams)

    setLoading(false)
  }

  return (
    <Card className={classes.cardMembersToRating}>
      <CardHeader title={t('enterPlayerScores')} />
      <CardContent>
        {
          map(membersToRating, (memberToRating, indexMemberToRating) => (
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