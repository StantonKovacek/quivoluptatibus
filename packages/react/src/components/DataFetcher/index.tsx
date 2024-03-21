import React, { FC, useContext, useEffect, useState } from 'react'
import { Flow, FlowType, TriggerType, useFlows } from '../../api/flows'
import { FrigadeContext } from '../../FrigadeProvider'
import { GUEST_PREFIX, useUser } from '../../api/users'
import { v4 as uuidv4 } from 'uuid'
import { useFlowResponses } from '../../api/flow-responses'
import { useUserFlowStates } from '../../api/user-flow-states'
import FrigadeForm from '../../FrigadeForm'
import { NOT_STARTED_FLOW } from '../../api/common'
import { useOrganization } from '../../api/organizations'

interface DataFetcherProps {}

export const guestUserIdField = 'frigade-xFrigade_guestUserId'
export const realUserIdField = 'frigade-xFrigade_userId'

export const DataFetcher: FC<DataFetcherProps> = ({}) => {
  const { setFlowResponses } = useFlowResponses()
  const { userFlowStatesData, isLoadingUserFlowStateData, mutateUserFlowState } =
    useUserFlowStates()
  const { userId, setUserId } = useUser()
  const [lastUserId, setLastUserId] = useState<string | null>(userId)
  const { getFlowStatus } = useFlows()
  const { flows, userProperties, setIsNewGuestUser, flowResponses } = useContext(FrigadeContext)
  const [automaticFlowIdsToTrigger, setAutomaticFlowIdsToTrigger] = useState<Flow[]>([])
  // Add list of flows already triggered
  const [triggeredFlows, setTriggeredFlows] = useState<string[]>([])
  const { organizationId } = useOrganization()
  const [lastOrganizationId, setLastOrganizationId] = useState<string | null>(organizationId)
  const [hasFinishedInitialLoad, setHasFinishedInitialLoad] = useState(false)

  useEffect(() => {
    if (!isLoadingUserFlowStateData) {
      if (userFlowStatesData) {
        for (let i = 0; i < userFlowStatesData.length; i++) {
          const flowState = userFlowStatesData[i]
          const flow = flows.find((flow) => flow.slug === flowState?.flowId)
          if (
            flow &&
            flowState &&
            flowState.shouldTrigger === true &&
            flow.type == FlowType.FORM &&
            flow.triggerType === TriggerType.AUTOMATIC &&
            !triggeredFlows.includes(flow.slug)
          ) {
            // If the flow should be triggered, trigger it
            // Give a small grace period before triggering the flow
            setTimeout(() => {
              triggerFlow(flowState.flowId)
            }, 500)

            // We only want to trigger one at a time
            break
          }
        }
      }
    }
  }, [isLoadingUserFlowStateData, userFlowStatesData])

  useEffect(() => {
    if (flowResponses.length > 0) {
      mutateUserFlowState()
    }
  }, [flowResponses])

  useEffect(() => {
    if (!hasFinishedInitialLoad) {
      setHasFinishedInitialLoad(true)
      mutateUserFlowState()
    }
  }, [isLoadingUserFlowStateData, setHasFinishedInitialLoad])

  function triggerFlow(flowId: string) {
    const flow = flows.find((flow) => flow.slug === flowId)
    if (flow && flow.triggerType === TriggerType.AUTOMATIC && !triggeredFlows.includes(flow.slug)) {
      // We only trigger one at a time
      setTriggeredFlows([...triggeredFlows, flow.slug])
      setAutomaticFlowIdsToTrigger([flow])
    }
  }

  function generateGuestUserId() {
    // If userId is null, generate a guest user id using uuid
    if (!userId) {
      // Check if a real user id exists in local storage
      const realUserId = localStorage.getItem(realUserIdField)
      if (realUserId) {
        setUserId(realUserId)
        return
      }

      // Call local storage to see if we already have a guest user id
      const guestUserId = localStorage.getItem(guestUserIdField)
      if (guestUserId) {
        setUserId(guestUserId)
        return
      }

      // If we don't have a guest user id, generate one and save it to local storage
      setIsNewGuestUser(true)
      const newGuestUserId = GUEST_PREFIX + uuidv4()
      try {
        localStorage.setItem(guestUserIdField, newGuestUserId)
      } catch (e) {
        console.log('Failed to save guest user id locally: Local storage unavailable', e)
      }
      setUserId((userId) => (userId ? userId : newGuestUserId))
    }
  }

  useEffect(() => {
    try {
      // Parse all image urls from flows (contained in flow.data) and asynchronously load them
      if (flows) {
        const loadedImageUrls: string[] = []
        flows.forEach((flow) => {
          if (flow.data) {
            // Find all image urls in flow data. All image urls are in the json data as "imageUri" fields
            const imageUrls = flow.data.match(/"imageUri":"(.*?)"/g)
            if (imageUrls) {
              imageUrls.forEach((imageUrl) => {
                // Remove the "imageUri" and " from the url
                const url = imageUrl.replace('"imageUri":"', '').replace('"', '')
                // If the url has already been loaded, skip it
                if (loadedImageUrls.includes(url)) {
                  return
                }
                // Create an image element and set the src to the url
                const img = new Image()
                img.src = url
                loadedImageUrls.push(url)
              })
            }
          }
        })
      }
    } catch (e) {}
  }, [flows])

  useEffect(() => {
    if (userId !== lastUserId) {
      // Reset responses
      setFlowResponses([])
      mutateUserFlowState()
    }

    setLastUserId(userId)
    // if user id isn't null and doesn't begin with GUEST_PREFIX , save it to local storage
    if (userId && !userId.startsWith(GUEST_PREFIX)) {
      try {
        localStorage.setItem(realUserIdField, userId)
      } catch (e) {
        console.log('Failed to save user id locally: Local storage available', e)
      }
    }
    // If the user ID is null, give a grace period of 50ms to set the real user id
    if (userId === null) {
      setTimeout(() => {
        if (userId === null) {
          generateGuestUserId()
        }
      }, 50)
    }
  }, [userId, flows, userProperties])

  useEffect(() => {
    if (organizationId != lastOrganizationId) {
      setLastOrganizationId(organizationId)
      setFlowResponses([])
      mutateUserFlowState()
    }
  }, [organizationId, lastOrganizationId, setLastOrganizationId])

  function AutomaticFlowIdsToTrigger() {
    return (
      <>
        {automaticFlowIdsToTrigger.map((flow) => {
          if (getFlowStatus(flow.slug) !== NOT_STARTED_FLOW) {
            return null
          }

          return (
            <span key={flow.slug}>
              <FrigadeForm
                flowId={flow.slug}
                type={'modal'}
                modalPosition={'center'}
                endFlowOnDismiss={true}
              />
            </span>
          )
        })}
      </>
    )
  }

  return (
    <>
      <AutomaticFlowIdsToTrigger />
    </>
  )
}
