import { useMemo, useState, SyntheticEvent } from 'react'
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
// import Image from 'next/image'
import styles from '../styles/Home.module.css'

import {
  Alert,
  AlertColor,
  Box,
  Button,
  Container,
  Grid,
  // IconButton,
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
  Typography,
} from '@material-ui/core'

import {
  // Close as CloseIcon,
  ContentCopy as CopyIcon,
  Shuffle as ShuffleIcon
} from '@material-ui/icons'

import LoadingButton from '@material-ui/lab/LoadingButton'

type SnackbarProps = {
  open: boolean;
  type: AlertColor;
  message?: string;
}

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const [members, setMembers] = useState<string>('')
  const [numberOfTeams, setNumberOfTeams] = useState<string>('2')
  const [result, setResult] = useState<Object>()
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: '',
    type: 'warning'
  })

  const openSnackbar = ({ type, message }): void => {
    setSnackbar({
      open: true,
      type,
      message
    })
  }

  const closeSnackbar = (event: SyntheticEvent<Element, Event>, reason: string): void => {
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
      openSnackbar({ type: 'error', message: 'Informe os integrantes da equipe.' })
      return
    }

    const teams = toNumber(numberOfTeams)

    if (!isNumber(teams) || teams <= 0) {
      openSnackbar({ type: 'error', message: 'Informe a quantidade de equipes.' })
      return
    }

    setLoading(true)

    const listMembers = split(members, ',')
    const shuffledMembers = shuffle(listMembers)

    let count = 1
    const separedTeams = {}

    for (let index = 0; index < size(shuffledMembers); index++) {
      if (count > teams) {
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
    <Box className={styles.container}>
      <Head>
        <title>Sorteador de Times</title>
        <meta name="description" content="Sorteador de Times para qualquer esporte." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="sm">
        <Box className={styles.header}>
          <Typography variant="h1" className={styles.title}>
            Sorteador de <b>Times!</b>
          </Typography>

          <Typography variant="h2" className={styles.description}>
            Digite os nomes dos integrantes separados por vírgula{' '}
            <code className={styles.code}>,</code>
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
                    onCopy={() => openSnackbar({ type: 'success', message: 'Resultado copiado com sucesso.' })}
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
              <Grid container spacing={1} className={styles.table}>
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

      {/* <footer className={styles.footer}>
        <Link
          color="inherit"
          underline="hover"
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
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
