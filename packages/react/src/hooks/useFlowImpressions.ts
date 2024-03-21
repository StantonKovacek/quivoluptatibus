import { useEffect, useState } from 'react'
import { NOT_STARTED_FLOW } from '../api/common'
import { useFlows } from '../api/flows'

export function useFlowImpressions(flowId: string, visible: boolean = true) {
  const [hasMarkedFlowStarted, setHasMarkedFlowStarted] = useState(false)
  const {
    markStepStarted,
    isLoading,
    getFlowStatus,
    getFlowSteps,
    getCurrentStepIndex,
    targetingLogicShouldHideFlow,
    getFlow,
  } = useFlows()
  const steps = getFlowSteps(flowId)

  async function markFlowStartedIfNeeded() {
    if (
      !hasMarkedFlowStarted &&
      !isLoading &&
      getFlowStatus(flowId) === NOT_STARTED_FLOW &&
      targetingLogicShouldHideFlow(getFlow(flowId)) === false &&
      visible &&
      steps &&
      steps.length > 0
    ) {
      setHasMarkedFlowStarted(true)
      await markStepStarted(flowId, steps[getCurrentStepIndex(flowId)].id)
    }
  }

  useEffect(() => {
    markFlowStartedIfNeeded()
  }, [isLoading, flowId, visible])

  return {}
}
