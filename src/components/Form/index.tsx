import { useForm, SubmitHandler } from 'react-hook-form'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import {
  MdClose as CloseIcon,
  MdContentCopy as CopyIcon,
  MdShuffle as ShuffleIcon,
  MdStar as StarIcon
} from 'react-icons/md'

import { isEmpty, isNumber, toNumber } from 'lodash'
import { useTranslations } from 'use-intl'

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  VStack,
  Textarea,
  useToast,
  useBreakpointValue
} from '@chakra-ui/react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { useFormData } from '../../contexts/FormDataContext'
import { organizeMembersToRating, shuffleTeams } from '../../functions/shuffleTeams'
import { FormProps, IFormData } from '../../interfaces/Forms'

export default function Form({ textToCopy }: FormProps) {
  const t = useTranslations('home')
  const toast = useToast()
  const isMobile = useBreakpointValue({
    base: true,
    sm: false
  })

  const {
    handleChangeControls,
    handleChangeResult,
    handleChangeMembersToRating,
    resetFormData,
    hasResult
  } = useFormData()

  const { register, handleSubmit, formState, watch } = useForm<IFormData>({
    resolver: yupResolver(yup.object().shape({
      withRating: yup.bool(),
      members: yup.string().required(t('informTeamMembers')),
      numberOfTeams: yup.number().required(t('informTeamQuantity')).min(2, t('minTeamQuantity'))
    })),
    defaultValues: {
      withRating: false,
      members: '',
      numberOfTeams: 2
    }
  })

  const { isSubmitting, errors } = formState

  /**
   * Função executada ao clicar em embaralhar
   * @param data 
   * @returns `void`
   */
  const handleShuffle: SubmitHandler<IFormData> = async data => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (isEmpty(data.members)) {
      toast({
        description: t('informTeamMembers'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      return
    }

    const teams = toNumber(data.numberOfTeams)

    if (!isNumber(teams) || teams <= 0) {
      toast({
        description: t('informTeamQuantity'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      return
    }

    handleChangeControls(data)

    const separatedTeams = shuffleTeams(data.members, teams)
    handleChangeResult(separatedTeams)
  }

  /**
   * Função executada ao clicar em "Adicionar pontuação"
   * @returns `void`
   */
  const handleRating: SubmitHandler<IFormData> = data => {
    if (isEmpty(data.members)) {
      toast({
        description: t('informTeamMembers'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      return
    }

    const teams = toNumber(data.numberOfTeams)

    if (!isNumber(teams) || teams <= 0) {
      toast({
        description: t('informTeamQuantity'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
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
    <Box
      as="form"
      flex="1"
      onSubmit={handleSubmit(!watch('withRating') ? handleShuffle : handleRating)}
    >
      <VStack align="flex-start" spacing="8">
        <Box w="100%" mt="8">
          <FormControl display="flex" mb="2">
            <Switch
              id="withRating"
              colorScheme="teal"
              {...register('withRating')}
            />
            <FormLabel htmlFor="withRating" mb="0" ml="2">
              {t('withScore')}
            </FormLabel>
          </FormControl>
          <FormControl mb="2" isInvalid={!!errors.members}>
            <Textarea
              id="members"
              placeholder={t('members')}
              resize="none"
              w="100%"
              focusBorderColor="teal.500"
              {...register('members')}
            />
            {!!errors.members && <FormErrorMessage>{errors.members.message}</FormErrorMessage>}
          </FormControl>
          <FormControl mb="2" isInvalid={!!errors.numberOfTeams}>
            <NumberInput
              id="numberOfTeams"
              name="numberOfTeams"
              placeholder={t('numberOfTeams')}
              defaultValue={2}
              min={1}
              max={20}
              focusBorderColor="teal.500"
            >
              <NumberInputField
                {...register('numberOfTeams')}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {!!errors.numberOfTeams && <FormErrorMessage>{errors.numberOfTeams.message}</FormErrorMessage>}
          </FormControl>
        </Box>
        <Box w="100%" mt="8">
          {
            watch('withRating')
              ? (
                <Button
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  leftIcon={<Icon as={StarIcon} />}
                  variant="outline"
                  type="submit"
                  isFullWidth={isMobile}
                  mr="4"
                  mb="4"
                >
                  {t('addScore')}
                </Button>
              )
              : (
                <Button
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  leftIcon={<Icon as={ShuffleIcon} />}
                  variant="outline"
                  type="submit"
                  isFullWidth={isMobile}
                  mr="4"
                  mb="4"
                >
                  {t('shuffle')}
                </Button>
              )
          }
          {
            hasResult && (
              <Button
                colorScheme="teal"
                leftIcon={<Icon as={CloseIcon} />}
                variant="outline"
                onClick={clearResults}
                isFullWidth={isMobile}
                mr="4"
                mb="4"
              >
                {t('clear')}
              </Button>
            )
          }
          {
            (!isEmpty(textToCopy)) && (
              <CopyToClipboard
                text={textToCopy}
                onCopy={() => toast({
                  description: t('resultCopied'),
                  status: 'success',
                  duration: 2000
                })}
              >
                <Button
                  colorScheme="teal"
                  leftIcon={<Icon as={CopyIcon} />}
                  variant="outline"
                  onClick={() => { }}
                  isFullWidth={isMobile}
                  mr="4"
                  mb="4"
                >
                  {t('copyResult')}
                </Button>
              </CopyToClipboard>
            )
          }
        </Box>
      </VStack>
    </Box>
  )
}