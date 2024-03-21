import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { FormInputProps, MultipleChoiceListProps } from '../../../../../FrigadeForm/types'
import { getClassName, getCustomClassOverrides } from '../../../../../shared/appearance'
import { Label } from '../shared/Label'
import { SubLabel } from '../shared/SubLabel'
import { CheckBox } from '../../../../CheckBox'

const MultipleChoiceListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
`

const MultipleChoiceListItem = styled.button`
  ${(props) => getCustomClassOverrides(props)} {
    // Anything inside this block will be ignored if the user provides a custom class
    border: 1px solid ${(props) => props.appearance?.theme?.colorBorder};
    font-size: 14px;
    // Selector for when selected=true
    &[data-selected='true'] {
      border: 1px solid ${(props) => props.appearance.theme.colorPrimary};
      background-color: ${(props) => props.appearance.theme.colorPrimary}1a;
    }

    :hover {
      border: 1px solid ${(props) => props.appearance.theme.colorPrimary};
    }
    text-align: left;
    border-radius: 10px;
  }
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  width: 100%;
  height: 48px;
  padding: 0 18px;
  margin-bottom: 10px;
`

export function MultipleChoiceList({
  formInput,
  customFormTypeProps,
  onSaveInputData,
  inputData,
  setFormValidationErrors,
}: FormInputProps) {
  const input = formInput as MultipleChoiceListProps
  const [selectedIds, setSelectedIds] = useState<string[]>(inputData?.choice || [])
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (selectedIds.length == 0 && !hasLoaded) {
      setHasLoaded(true)
      onSaveInputData({ choice: [] })
    }
  }, [])

  useEffect(() => {
    onSaveInputData({ choice: selectedIds })
  }, [selectedIds])

  useEffect(() => {
    // Set errors if inputData does not meet min/max requirements and if field is required
    if (
      input.required &&
      (selectedIds.length < input.props.minChoices || selectedIds.length > input.props.maxChoices)
    ) {
      setFormValidationErrors([
        {
          message: ``,
          id: input.id,
        },
      ])
    } else {
      setFormValidationErrors([])
    }
  }, [selectedIds])

  return (
    <MultipleChoiceListWrapper>
      <Label
        title={input.title}
        required={input.required}
        appearance={customFormTypeProps.appearance}
      />
      {input.props.options?.map((option) => {
        return (
          <MultipleChoiceListItem
            appearance={customFormTypeProps.appearance}
            className={getClassName(
              selectedIds.includes(option.id)
                ? 'multipleChoiceListItemSelected'
                : 'multipleChoiceListItem',
              customFormTypeProps.appearance
            )}
            key={option.id}
            value={option.id}
            data-selected={selectedIds.includes(option.id)}
            onClick={() => {
              // If the option is already selected, remove it from the selectedIds
              if (selectedIds.includes(option.id)) {
                setSelectedIds(selectedIds.filter((id) => id !== option.id))
                return
              }
              // Select the input if we are still under maxChoices
              if (selectedIds.length < input.props.maxChoices) {
                setSelectedIds([...selectedIds, option.id])
              } else {
                if (selectedIds.length == 1 && input.props.maxChoices == 1) {
                  // deselect the input if we are at maxChoices and minChoices is 1
                  setSelectedIds([option.id])
                }
              }
            }}
          >
            {option.title}
            <CheckBox
              type="round"
              primaryColor={customFormTypeProps.appearance.theme.colorPrimary}
              value={selectedIds.includes(option.id)}
              appearance={customFormTypeProps.appearance}
            />
          </MultipleChoiceListItem>
        )
      })}
      <SubLabel title={input.subtitle} appearance={customFormTypeProps.appearance} />
    </MultipleChoiceListWrapper>
  )
}
