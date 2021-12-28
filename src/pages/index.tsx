import { GetStaticPropsContext } from 'next'

import { useMemo, useState, SyntheticEvent } from 'react'

import Head from 'next/head'
import {
  isEmpty,
  map,
  mapValues,
  pick,
  toString,
  trimStart,
} from 'lodash'
import { useTranslations } from 'use-intl'

import {
  Alert,
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  SnackbarCloseReason
} from '@mui/material'
import { withStyles } from '@mui/styles'
import { Close as CloseIcon } from '@mui/icons-material'

import Form from '../components/Form'
import Header from '../components/Header'
import RatingCard from '../components/RatingCard'
import { useFormData } from '../contexts/FormDataContext'
import generateTextToCopy from '../functions/generateTextToCopy'
import { HomeProps } from '../interfaces/Home'
import { SnackbarProps } from '../interfaces/Snackbar'
import { IntegrantType } from '../interfaces/Teams'

import styles from '../styles/Home.module'

const Home = (props: HomeProps) => {
  const { classes } = props

  const t = useTranslations('home')

  const { controls, membersToRating, result } = useFormData()

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

  const openSnackbar = ({
    type,
    message,
    open = true,
    autoHideDuration = 5000
  }: SnackbarProps): void => {
    setSnackbar({
      open,
      type,
      message,
      autoHideDuration
    })
  }

  const closeSnackbar = (
    _event: Event | SyntheticEvent<any, Event>,
    reason?: SnackbarCloseReason | undefined
  ): void => {
    if (reason === 'clickaway') {
      return
    }

    setSnackbar(prevState => ({
      ...prevState,
      open: false
    }))
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

        <Form
          openSnackbar={openSnackbar}
          textToCopy={textToCopy}
        />

        {
          (controls.withRating && !isEmpty(membersToRating)) && (
            <RatingCard />
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
              <br />
              <br />
            </>
          )
        }
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.autoHideDuration ?? 5000}
        onClose={closeSnackbar}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={closeSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Alert onClose={closeSnackbar} severity={snackbar.type} sx={{ width: '100%' }}>
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
        ['home', 'generic']
      )
    }
  };
}
