import { useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { isEmpty, isNumber, toNumber } from 'lodash'
import { useTranslations } from 'use-intl'

import {
  Button,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Theme
} from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { LoadingButton } from '@mui/lab'
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  Shuffle as ShuffleIcon,
  Star as StarIcon
} from '@mui/icons-material'
import { makeStyles } from '@mui/styles'

import { useFormData } from '../../contexts/FormDataContext'
import { organizeMembersToRating, shuffleTeams } from '../../functions/shuffleTeams'
import { FormProps, IFormData } from '../../interfaces/Forms'

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

export default function Form({ openSnackbar, textToCopy }: FormProps) {
  const t = useTranslations('home')
  const classes = useStyles()
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const [loading, setLoading] = useState(false)

  const {
    handleChangeControls,
    handleChangeResult,
    handleChangeMembersToRating,
    resetFormData,
    hasResult
  } = useFormData()

  const { control, handleSubmit, watch } = useForm<IFormData>({
    defaultValues: {
      withRating: false,
      members: '',
      numberOfTeams: '2'
    }
  })

  /**
   * Função executada ao clicar em embaralhar
   * @param data 
   * @returns `void`
   */
  const handleShuffle: SubmitHandler<IFormData> = data => {
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

    handleChangeControls(data)

    const separatedTeams = shuffleTeams(data.members, teams)
    handleChangeResult(separatedTeams)

    setLoading(false)
  }

  /**
   * Função executada ao clicar em "Adicionar pontuação"
   * @returns `void`
   */
  const handleRating: SubmitHandler<IFormData> = data => {
    if (isEmpty(data.members)) {
      openSnackbar({ type: 'error', message: t('informTeamMembers'), open: true })
      return
    }

    const teams = toNumber(data.numberOfTeams)

    if (!isNumber(teams) || teams <= 0) {
      openSnackbar({ type: 'error', message: t('informTeamQuantity'), open: true })
      return
    }

    handleChangeControls(data)

    const separatedMembers = organizeMembersToRating(data.members)
    handleChangeMembersToRating(separatedMembers)
  }

  /**
   * Função que limpa os resultados e formulário
   */
  function clearResults() {
    resetFormData()
  }

  return (
    <form onSubmit={handleSubmit(!watch('withRating') ? handleShuffle : handleRating)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="withRating"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    onChange={(event, checked: boolean) => {
                      field.onChange(event)

                      if (!checked) {
                        handleChangeMembersToRating([])
                        handleChangeResult({})
                      }
                    }}
                  />
                }
                label={t('withScore')}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="members"
            control={control}
            // rules={{ required: true }}
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
            // rules={{ required: true }}
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
                  fullWidth={isMobile}
                  className={classes.button}
                  type="submit"
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
          {
            hasResult && (
              <Button
                startIcon={<CloseIcon />}
                variant="outlined"
                onClick={clearResults}
                fullWidth={isMobile}
                className={classes.button}
              >
                {t('clear')}
              </Button>
            )
          }
          {
            (!isEmpty(textToCopy)) && (
              <CopyToClipboard
                text={textToCopy}
                onCopy={() => openSnackbar({
                  type: 'success',
                  message: t('resultCopied'),
                  open: true,
                  autoHideDuration: 2000
                })}
              >
                <Button
                  startIcon={<CopyIcon />}
                  variant="outlined"
                  onClick={() => { }}
                  fullWidth={isMobile}
                  className={classes.button}
                >
                  {t('copyResult')}
                </Button>
              </CopyToClipboard>
            )
          }
        </Grid>
      </Grid>
    </form>
  )
}