import { useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'

import { isEmpty, isNumber, toNumber } from 'lodash'
import { useRecoilState } from 'recoil'
import { useTranslations } from 'use-intl'

import {
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Theme
} from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { LoadingButton } from '@mui/lab'
import {
  Shuffle as ShuffleIcon,
  Star as StarIcon
} from '@mui/icons-material'
import { makeStyles } from '@mui/styles'

import { formAtom } from '../../atoms/formAtom'
import { membersToRatingAtom } from '../../atoms/membersToRatingAtom'
import { resultAtom } from '../../atoms/resultAtom'
import { organizeMembersToRating, shuffleTeams } from '../../functions/shuffleTeams'
import { FormProps, IFormData } from '../../interfaces/Forms'
import { IntegrantType, SeparatedTeamsType } from '../../interfaces/Teams'

const useStyles = makeStyles((theme: Theme) => ({
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
  }
}))

export default function Form({ openSnackbar }: FormProps) {
  const t = useTranslations('home')
  const classes = useStyles()
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const [loading, setLoading] = useState(false)
  const [formState, setFormState] = useRecoilState<IFormData>(formAtom)
  const [, setMembersToRatingState] = useRecoilState<IntegrantType[]>(membersToRatingAtom)
  const [, setResultState] = useRecoilState<SeparatedTeamsType>(resultAtom)

  const { control, handleSubmit, watch } = useForm<IFormData>({
    defaultValues: {
      withRating: false,
      members: '',
      numberOfTeams: '2'
    }
  })

  const onSubmit: SubmitHandler<IFormData> = data => {
    setFormState(data)

    if (isEmpty(data.members)) {
      openSnackbar({ type: 'error', message: t('informTeamMembers'), open: true })
      return
    }

    const teams = toNumber(data.numberOfTeams)

    if (!isNumber(teams) || teams <= 0) {
      openSnackbar({ type: 'error', message: t('informTeamQuantity'), open: true })
      return
    }

    setLoading(true)

    const separatedTeams = shuffleTeams(data.members, teams)
    setResultState(separatedTeams)

    setLoading(false)
  }

  /**
   * Função executada ao clicar em "Adicionar pontuação"
   * @returns `void`
   */
  function handleRating(): void {
    if (isEmpty(formState.members)) {
      openSnackbar({ type: 'error', message: t('informTeamMembers'), open: true })
      return
    }

    const teams = toNumber(formState.numberOfTeams)

    if (!isNumber(teams) || teams <= 0) {
      openSnackbar({ type: 'error', message: t('informTeamQuantity'), open: true })
      return
    }

    const separatedMembers = organizeMembersToRating(formState.members)
    setMembersToRatingState(separatedMembers)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="withRating"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} />}
                label={t('withScore')}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="members"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label={t('members')}
                multiline
                rows={4}
                fullWidth
                size="small"
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="numberOfTeams"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label={t('numberOfTeams')}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                size="small"
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          {
            watch('withRating')
              ? (
                <LoadingButton
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<StarIcon />}
                  variant="outlined"
                  onClick={handleRating}
                  fullWidth={isMobile}
                  className={classes.button}
                >
                  {t('addScore')}
                </LoadingButton>
              )
              : (
                <LoadingButton
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<ShuffleIcon />}
                  variant="outlined"
                  fullWidth={isMobile}
                  className={classes.button}
                  type="submit"
                >
                  {t('shuffle')}
                </LoadingButton>
              )
          }
        </Grid>
      </Grid>
    </form>
  )
}