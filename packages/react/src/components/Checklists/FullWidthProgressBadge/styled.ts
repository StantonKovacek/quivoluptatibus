import styled from 'styled-components'
import { getCustomClassOverrides } from '../../../shared/appearance'

export const FullWidthProgressBadgeContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  align-items: center;
  background-color: ${(props) => props.appearance.theme.colorBackground};
  border: 1px solid ${(props) => props.appearance.theme.colorBorder};
  border-radius: ${(props) => props.appearance.theme.borderRadius}px;
`

export const IconContainer = styled.div`
  ${(props) => getCustomClassOverrides(props)} {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
  }
`

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 0;
`
export const ProgressBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 16px;
  min-width: 200px;
`

export const DismissButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-left: 16px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`
