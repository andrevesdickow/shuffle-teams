import { GetStaticPropsContext } from 'next'
import { useMemo, useState, SyntheticEvent } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import Head from 'next/head'
import {
  isEmpty,
  map,
  mapValues,
  pick,
  toString,
  trimStart,
} from 'lodash'
import { useRecoilValue } from 'recoil'
import { useTranslations } from 'use-intl'

import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Theme
} from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { withStyles } from '@mui/styles'
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material'

import { formAtom } from '../atoms/formAtom'
import { membersToRatingAtom } from '../atoms/membersToRatingAtom'
import { resultAtom } from '../atoms/resultAtom'
import Form from '../components/Form'
import Header from '../components/Header'
import RatingCard from '../components/RatingCard'
import generateTextToCopy from '../functions/generateTextToCopy'
import { HomeProps } from '../interfaces/Home'
import { SnackbarProps } from '../interfaces/Snackbar'
import { IntegrantType } from '../interfaces/Teams'

import styles from '../styles/Home.module'

const Home = (props: HomeProps) => {
  const { classes } = props

  const t = useTranslations('home')

  const formState = useRecoilValue(formAtom)
  const resultState = useRecoilValue(resultAtom)
  const membersToRatingState = useRecoilValue(membersToRatingAtom)

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: '',
    type: 'warning'
  })

  const teams = useMemo(() => {
    const aux: IntegrantType[][] = []
    mapValues(resultState, (teams: IntegrantType[]) => {
      aux.push(teams)
    })

    return aux
  }, [resultState])

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
   * Função que limpa os resultados
   */
  function clearResults() {
    // setResult({})
    // setMembersToRating([])
    // setMembers('')
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

        <Form openSnackbar={openSnackbar} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            {
              (!formState.withRating && !isEmpty(textToCopy)) && (
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
              !isEmpty(resultState) && (
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
          (formState.withRating && !isEmpty(membersToRatingState)) && (
            <RatingCard />
          )
        }

        {
          !isEmpty(resultState) && (
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
