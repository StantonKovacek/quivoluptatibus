import styled from 'styled-components'

export const StepContainer = styled.div<{ appearance }>`
  background-color: ${(props) => props.appearance?.theme?.colorBackground};
  border: 1px solid;
  border-color: ${(props) => props.appearance?.theme?.colorBorder};
  border-radius: 6px;
  padding: 2px 20px 2px 20px;
  display: flex;
  margin-top: 14px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  transition: max-height 0.25s;
`

export const StepMediaContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`

export const StepImage = styled.img`
  border-radius: 4px;
  max-height: 260px;
  min-height: 200px;
`
export const StepHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

export const StepTitle = styled.p<{ appearance }>`
  color: ${(props) => props.appearance?.theme?.colorText};
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  margin-left: 8px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

export const CollapseChevronContainer = styled.div`
  cursor: pointer;
  color: ${(props) => props.appearance.theme.colorTextSecondary};
  :hover {
    opacity: 0.8;
  }
`

export const ExpandedContentContainer = styled.div``

export const StepSubtitle = styled.p<{ appearance }>`
  color: ${(props) => props.appearance?.theme?.colorText};
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
`

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
