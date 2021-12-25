import { useMemo, useState, SyntheticEvent, ChangeEvent } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import {
  camelCase,
  cloneDeep,
  get,
  isEmpty,
  isNumber,
  map,
  mapValues,
  pick,
  toNumber,
  toString,
  trimStart,
} from 'lodash'
import Head from 'next/head'

import {
  Alert,
  AlertColor,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  FormControlLabel,
  Grid,
  Paper,
  Rating,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Theme
} from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'

import { withStyles } from '@mui/styles'

import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  Shuffle as ShuffleIcon,
  Star as StarIcon
} from '@mui/icons-material'

import { LoadingButton } from '@mui/lab'

import generateTextToCopy from '../functions/generateTextToCopy'
import {
  organizeMembersToRating,
  shuffleTeams,
  shuffleTeamsByRating,
  SeparatedTeamsType,
  IntegrantType
} from '../functions/shuffleTeams'

import styles from '../styles/Home.module'
import Header from '../components/Header'
import { GetStaticPropsContext } from 'next'
import { useTranslations } from 'use-intl'

type HomeProps = {
  classes: any
}

type SnackbarProps = {
  open: boolean;
  type: AlertColor;
  message?: string;
}

const Home = (props: HomeProps) => {
  const { classes } = props

  const t = useTranslations('home')

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const [loading, setLoading] = useState<boolean>(false)
  const [withRating, setWithRating] = useState<boolean>(false)
  const [members, setMembers] = useState<string>('')
  const [numberOfTeams, setNumberOfTeams] = useState<string>('2')
  const [membersToRating, setMembersToRating] = useState<IntegrantType[]>([])
  const [result, setResult] = useState<SeparatedTeamsType>({})
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: '',
    type: 'warning'
  })

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

  const openSnackbar = ({ type, message, open = true }: SnackbarProps): void => {
    setSnackbar({
      open,
      type,
      message
    })
  }

  const closeSnackbar = (_event: SyntheticEvent<Element, Event>, reason: string): void => {
    if (reason === 'clickaway') {
      return
    }

    setSnackbar(prevState => ({
      ...prevState,
      open: false
    }))
  }

  /**
   * Função executada ao clicar em "Sortear"
   * @returns `void`
   */
  function handleShuffle(): void {
    if (isEmpty(members)) {
      openSnackbar({ type: 'error', message: t('informTeamMembers'), open: true })
      return
    }

    const teams = toNumber(numberOfTeams)

    if (!isNumber(teams) || teams <= 0) {
      openSnackbar({ type: 'error', message: t('informTeamQuantity'), open: true })
      return
    }

    setLoading(true)

    const separatedTeams = shuffleTeams(members, teams)
    setResult(separatedTeams)

    setLoading(false)
  }

  /**
   * Função executada ao cliar em "Sortear"
   * @returns `void`
   */
  function handleShuffleByRating(): void {
    setLoading(true)

    const teams = toNumber(numberOfTeams)
    const separatedTeams = shuffleTeamsByRating(membersToRating, teams)
    setResult(separatedTeams)

    setLoading(false)
  }

  /**
   * Função executada ao clicar em "Adicionar pontuação"
   * @returns `void`
   */
  function handleRating(): void {
    if (isEmpty(members)) {
      openSnackbar({ type: 'error', message: t('informTeamMembers'), open: true })
      return
    }

    const teams = toNumber(numberOfTeams)

    if (!isNumber(teams) || teams <= 0) {
      openSnackbar({ type: 'error', message: t('informTeamQuantity'), open: true })
      return
    }

    const separatedMembers = organizeMembersToRating(members)
    setMembersToRating(separatedMembers)
  }

  /**
   * Função executada ao trocar o switch se irá ter pontuação ou não
   * @param _event evento
   * @param checked marcado
   */
  function handleChangeWithRating(_event: ChangeEvent, checked: boolean) {
    setWithRating(checked)
    setResult({})
    setMembersToRating([])
  }

  /**
   * Função que altera a pontuação do jogador
   * @param rating pontuação
   * @param index índice
   */
  function handleChangeIntegrantRating(rating: number | null, index: number) {
    const clone = cloneDeep(membersToRating)
    clone[index].rating = rating
    setMembersToRating(clone)
  }

  /**
   * Função que limpa os resultados
   */
  function clearResults() {
    setResult({})
    setMembersToRating([])
    setMembers('')
  }

  return (
    <Box className={classes.main}>
      <Head>
        <title>Sortchêador</title>
        <meta name="description" content="Sorteador de Times para qualquer esporte." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Container maxWidth="sm" className={classes.container}>
        <Box className={classes.header}>
          <Typography variant="h1" className={classes.title}>
            Sor<b>tchê</b>ador
          </Typography>

          <Typography variant="h2" className={classes.description}>
            {`${t('typeNames')} `}
            <code className={classes.code}>,</code>{' '}
            {t('orPaste')} 😀
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={withRating}
                  onChange={handleChangeWithRating}
                />
              }
              label={t('withScore')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="integrants"
              label={t('members')}
              multiline
              rows={4}
              fullWidth
              value={members}
              onChange={e => setMembers(e.target.value)}
              onPaste={e => setMembers(get(e, 'target.value'))}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="numberOsTeams"
              label={t('numberOfTeams')}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              value={numberOfTeams}
              onChange={e => setNumberOfTeams(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            {
              withRating
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
                    onClick={handleShuffle}
                    fullWidth={isMobile}
                    className={classes.button}
                  >
                    {t('shuffle')}
                  </LoadingButton>
                )
            }
            {
              (!withRating && !isEmpty(textToCopy)) && (
                <CopyToClipboard
                  text={textToCopy}
                  onCopy={() => openSnackbar({ type: 'success', message: t('resultCopied'), open: true })}
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
            {
              !isEmpty(result) && (
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
          </Grid>
        </Grid>

        {
          (withRating && !isEmpty(membersToRating)) && (
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
                {
                  !isEmpty(textToCopy) && (
                    <CopyToClipboard
                      text={textToCopy}
                      onCopy={() => openSnackbar({ type: 'success', message: t('resultCopied'), open: true })}
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
              </CardActions>
            </Card>
          )
        }

        {
          !isEmpty(result) && (
            <>
              <br />
              <Grid container spacing={1}>
                {
                  map(teams, (team, teamIndex) => (
                    <Grid item lg={3} md={4} sm={6} xs={12} key={`Equipe ${teamIndex + 1}`}>
                      <TableContainer component={Paper}>
                        <Table size="small" aria-label={t('teamResults')}>
                          <TableHead>
                            <TableRow>
                              <TableCell>{t('team')} {teamIndex + 1}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {
                              map(team, (integrant, integrantIndex) => (
                                <TableRow
                                  key={integrant.name}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  <TableCell
                                    component="th"
                                    scope="row"
                                  >
                                    {integrantIndex + 1}. {trimStart(toString(integrant.name))}
                                  </TableCell>
                                </TableRow>
                              ))
                            }
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  ))
                }
              </Grid>
            </>
          )
        }
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={closeSnackbar}
      // action={(
      //   <IconButton
      //     size="small"
      //     aria-label="close"
      //     color="inherit"
      //     onClick={closeSnackbar}
      //   >
      //     <CloseIcon fontSize="small" />
      //   </IconButton>
      // )}
      >
        <Alert severity={snackbar.type} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default withStyles(styles)(Home)

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: pick(
        await import(`../locales/${locale}.json`),
        ['home']
      )
    }
  };
}
