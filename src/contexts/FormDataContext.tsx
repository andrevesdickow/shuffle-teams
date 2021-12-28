import { createContext, useContext, useState, ReactNode } from 'react'

import { isEmpty } from 'lodash'

import { IFormData } from '../interfaces/Forms'
import { IntegrantType, SeparatedTeamsType } from '../interfaces/Teams'

interface IFormDataContextProps {
  controls: IFormData;
  handleChangeControls: (data: IFormData) => void;
  result: SeparatedTeamsType;
  handleChangeResult: (separatedTeams: SeparatedTeamsType) => void;
  membersToRating: IntegrantType[];
  handleChangeMembersToRating: (integrantTypes: IntegrantType[]) => void;
  resetFormData: () => void;
  hasResult: boolean;
}

interface IFormDataProviderProps {
  children: ReactNode;
}

const defaultControls: IFormData = {
  members: '',
  numberOfTeams: '2',
  withRating: false
}

// Context
const FormDataContext = createContext<IFormDataContextProps>({} as IFormDataContextProps)

// Provider
export function FormDataProvider({ children }: IFormDataProviderProps) {
  const [controls, setControls] = useState<IFormData>(defaultControls)
  const [result, setResult] = useState<SeparatedTeamsType>({})
  const [membersToRating, setMembersToRating] = useState<IntegrantType[]>([])

  /**
   * Change form control value
   * @param data
   */
  function handleChangeControls(data: IFormData) {
    setControls(data)
  }

  /**
   * Seta o resultado final embaralhado
   * @param separatedTeams 
   */
  function handleChangeResult(separatedTeams: SeparatedTeamsType) {
    setResult(separatedTeams)
  }

  /**
   * Seta os integrantes para avaliação
   * @param integrantTypes 
   */
  function handleChangeMembersToRating(integrantTypes: IntegrantType[]) {
    setMembersToRating(integrantTypes)
  }

  /**
   * Clear results and form
   */
  function resetFormData() {
    setControls(defaultControls)
    setResult({})
    setMembersToRating([])
  }

  return (
    <FormDataContext.Provider
      value={{
        controls,
        handleChangeControls,
        result,
        handleChangeResult,
        membersToRating,
        handleChangeMembersToRating,
        resetFormData,
        hasResult: !isEmpty(result)
      }}
    >
      {children}
    </FormDataContext.Provider>
  )
}

export function useFormData() {
  const context = useContext(FormDataContext)
  return context
}