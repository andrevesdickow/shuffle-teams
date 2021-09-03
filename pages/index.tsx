import { useContext, useMemo, useState, SyntheticEvent } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import {
  get,
  isEmpty,
  isNumber,
  join,
  last,
  map,
  mapValues,
  replace,
  set,
  shuffle,
  size,
  split,
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
  Container,
  Grid,
  IconButton,
  // Link,
  Paper,
  Snackbar,
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
  // Close as CloseIcon,
  BrightnessMedium as BrightnessMediumIcon,
  ContentCopy as CopyIcon,
  Shuffle as ShuffleIcon
} from '@mui/icons-material'

import { LoadingButton } from '@mui/lab'

import AppContext from '../components/contexts/AppContext'

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
  const [members, setMembers] = useState<string>('')
  const [numberOfTeams, setNumberOfTeams] = useState<string>('2')
  const [result, setResult] = useState<Object>()
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: '',
    type: 'warning'
  })

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

  function shuffleTeams(): void {
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

    let listMembers = []

    const regex = new RegExp(/,/)
    const written = regex.test(members)

    // se `true`, é porque foi escrito
    // senão é colado de alguma conversa
    if (written) {
      listMembers = split(members, ',')
    } else {
      listMembers = split(members, /\n/)
    }

    console.warn({
      listMembers,
      test: written
    })

    const shuffledMembers = shuffle(listMembers)

    let count = 1
    const separedTeams = {}

    for (let index = 0; index < size(shuffledMembers); index++) {
      if (count > teams) {
        count = 1
      }

      const integrant = replace(shuffledMembers[index], /[^a-zA-Z]+/, '')

      set(separedTeams, `team${count}`, [
        ...get(separedTeams, `team${count}`, []),
        integrant
      ])

      count++
    }

    setResult(separedTeams)

    setLoading(false)
  }

  const teams = useMemo(() => {
    const aux: string[][] = []
    mapValues(result, (teams: string[]) => {
      aux.push(teams)
    })

    return aux
  }, [result])

  const textToCopy = useMemo(() => {
    if (isEmpty(teams)) {
      return ''
    }

    const text = map(teams, (team, teamIndex) => (
      `Equipe ${teamIndex + 1}\n${map(team, (integrant, integrantIndex) => `${integrantIndex + 1}. ${trimStart(integrant)}${integrant === last(team) ? '\n\n' : '\n'}`)}`
    ))
    return replace(join(text, ''), /,/g, '')
  }, [teams])

  return (
    <Box className={classes.main}>
      <Head>
        <title>Sorteador de Times</title>
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
            Sorteador de Times
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box
          // sx={{ display: { xs: 'none', md: 'flex' } }}
          >
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
            Sorteador de <b>Times!</b>
          </Typography>

          <Typography variant="h2" className={classes.description}>
            Digite os nomes dos integrantes separados por vírgula{' '}
            <code className={classes.code}>,</code>{' '}
            ou cole aqui a lista de uma conversa 😀
          </Typography>
        </Box>

        <Grid container spacing={2}>
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
            <LoadingButton
              loading={loading}
              loadingPosition="start"
              startIcon={<ShuffleIcon />}
              variant="outlined"
              onClick={shuffleTeams}
            // size="small"
            >
              Sortear
            </LoadingButton>
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
          !isEmpty(result)
            ? (
              <Grid container spacing={1} className={classes.table}>
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
                                  key={integrant}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  <TableCell
                                    component="th"
                                    scope="row"
                                  >
                                    {integrantIndex + 1}. {trimStart(toString(integrant))}
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
            )
            : null
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
