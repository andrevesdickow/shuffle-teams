import { useContext, useMemo, useState, SyntheticEvent, ChangeEvent } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import {
  camelCase,
  cloneDeep,
  get,
  isEmpty,
  isNumber,
  map,
  mapValues,
  toNumber,
  toString,
  trimStart,
} from 'lodash'
import Head from 'next/head'

import {
  Alert,
  AlertColor,
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
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
  Toolbar,
  Typography,
} from '@mui/material'

import { withStyles } from '@mui/styles'

import {
  BrightnessMedium as BrightnessMediumIcon,
  ContentCopy as CopyIcon,
  Shuffle as ShuffleIcon,
  Star as StarIcon
} from '@mui/icons-material'

import { LoadingButton } from '@mui/lab'

import AppContext from '../components/contexts/AppContext'
import generateTextToCopy from '../components/functions/generateTextToCopy'
import {
  organizeMembersToRating,
  shuffleTeams,
  shuffleTeamsByRating,
  SeparatedTeamsType,
  IntegrantType
} from '../components/functions/shuffleTeams'

import styles from '../styles/Home.module'

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

  const { toggleTheme } = useContext(AppContext)

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
      openSnackbar({ type: 'error', message: 'Informe os integrantes da equipe.', open: true })
      return
    }

    const teams = toNumber(numberOfTeams)

    if (!isNumber(teams) || teams <= 0) {
      openSnackbar({ type: 'error', message: 'Informe a quantidade de equipes.', open: true })
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
      openSnackbar({ type: 'error', message: 'Informe os integrantes da equipe.', open: true })
      return
    }

    const teams = toNumber(numberOfTeams)

    if (!isNumber(teams) || teams <= 0) {
      openSnackbar({ type: 'error', message: 'Informe a quantidade de equipes.', open: true })
      return
    }

    const separatedMembers = organizeMembersToRating(members)
    setMembersToRating(separatedMembers)
  }

  /**
   * Função executada ao trocar o switch se irá ter pontuação ou não
   * @param _event ChangeEvent
   * @param checked boolean
   */
  function handleChangeWithRating(_event: ChangeEvent, checked: boolean) {
    setWithRating(checked)
    setResult({})
    setMembersToRating([])
  }

  function handleChangeIntegrantRating(rating: number | null, index: number) {
    const clone = cloneDeep(membersToRating)
    clone[index].rating = rating
    setMembersToRating(clone)
  }

  return (
    <Box className={classes.main}>
      <Head>
        <title>Sortchêador de Times</title>
        <meta name="description" content="Sorteador de Times para qualquer esporte." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
          // sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Sor<b>tchê</b>ador de <b>Times</b>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <IconButton
              size="large"
              edge="end"
              aria-label="toggle theme"
              aria-controls="toggleTheme"
              aria-haspopup="true"
              onClick={toggleTheme}
              color="inherit"
            >
              <BrightnessMediumIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" className={classes.container}>
        <Box className={classes.header}>
          <Typography variant="h1" className={classes.title}>
            Sor<b>tchê</b>ador de <b>Times!</b>
          </Typography>

          <Typography variant="h2" className={classes.description}>
            Digite os nomes dos integrantes separados por vírgula{' '}
            <code className={classes.code}>,</code>{' '}
            ou cole aqui a lista de uma conversa 😀
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
              label="Com pontuação dos jogadores?"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="integrants"
              label="Integrantes"
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
              label="Nº de Equipes"
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
                  >
                    Adicionar pontuação
                  </LoadingButton>
                )
                : (
                  <LoadingButton
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<ShuffleIcon />}
                    variant="outlined"
                    onClick={handleShuffle}
                  >
                    Sortear
                  </LoadingButton>
                )
            }
            &nbsp;&nbsp;
            {
              !isEmpty(textToCopy)
                ? (
                  <CopyToClipboard
                    text={textToCopy}
                    onCopy={() => openSnackbar({ type: 'success', message: 'Resultado copiado com sucesso.', open: true })}
                  >
                    <Button
                      startIcon={<CopyIcon />}
                      variant="outlined"
                      onClick={() => { }}
                    // size="small"
                    >
                      Copiar resultado
                    </Button>
                  </CopyToClipboard>
                )
                : null
            }
          </Grid>
        </Grid>

        {
          (withRating && !isEmpty(membersToRating)) && (
            <Card className={classes.cardMembersToRating}>
              <CardHeader title="Informe a pontuação dos jogadores" />
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
                >
                  Sortear
                </LoadingButton>
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
                        <Table size="small" aria-label="Resultado das equipes">
                          <TableHead>
                            <TableRow>
                              <TableCell>Equipe {teamIndex + 1}</TableCell>
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

      {/* <footer className={classes.footer}>
        <Link
          color="inherit"
          underline="hover"
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={classes.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </Link >
      </footer> */}
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
