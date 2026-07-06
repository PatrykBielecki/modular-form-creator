import { Link } from 'react-router-dom'
import { useState } from 'react'
import styled from 'styled-components'
import { getErrorMessage } from '../api/errors'
import { provisionResource } from '../api/resources'
import { BufferedChangesNotice } from '../components/resources/BufferedChangesNotice'
import { ModuleOverviewCard } from '../components/resources/ModuleOverviewCard'
import { ResourceStatusBadge } from '../components/resources/ResourceStatusBadge'
import { PageHeader } from '../components/layout/PageHeader'
import { ResourcePageAsyncState } from '../components/layout/ResourcePageAsyncState'
import { useCompletedResourceEditBuffer } from '../hooks/useCompletedResourceEditBuffer'
import { useResource } from '../hooks/useResource'
import { Button } from '../design-system'
import {
  resourceBasicInfoPath,
  resourceDetailsPath,
  resourceProjectDetailsPath,
  useResourceId,
} from '../hooks/useResourceId'
import { getResourceEditView, hasBufferedChanges } from '../utils/mergeResource'
import {
  canEditProjectDetails,
  getCompletedModuleCount,
  getProvisioningBlockedReason,
  isBasicInfoComplete,
  isProjectDetailsComplete,
  isReadyForProvisioning,
} from '../utils/moduleCompletion'

export function ResourceOverviewPage() {
  const resourceId = useResourceId()
  const { getBuffer, clearBuffer } = useCompletedResourceEditBuffer()
  const {
    resource,
    loading,
    loadError,
    loadErrorTitle,
    isNotFound,
    isInvalidId,
    setResource,
  } = useResource(resourceId)

  const [provisionError, setProvisionError] = useState<string | null>(null)
  const [provisionSuccess, setProvisionSuccess] = useState<string | null>(null)
  const [isProvisioning, setIsProvisioning] = useState(false)

  const handleProvision = () => {
    if (!resource || !isReadyForProvisioning(resource)) {
      return
    }

    const confirmed = window.confirm(
      `Provision resource "${resource.name}" (#${resource.resourceId})? This will mark it as completed and cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    setIsProvisioning(true)
    setProvisionError(null)
    setProvisionSuccess(null)

    provisionResource(resourceId)
      .then((updatedResource) => {
        clearBuffer(resourceId)
        setResource(updatedResource)
        setProvisionSuccess('Resource provisioned successfully.')
      })
      .catch((error: unknown) => {
        setProvisionError(getErrorMessage(error))
      })
      .finally(() => {
        setIsProvisioning(false)
      })
  }

  const provisioningBlockedReason = resource
    ? getProvisioningBlockedReason(resource)
    : null

  const projectDetailsAccessible =
    resource !== null &&
    (resource.status === 'completed' ||
      canEditProjectDetails(resource.basicInfo))

  const buffer = resource ? getBuffer(resourceId) : undefined
  const viewResource =
    resource && resource.status === 'completed'
      ? getResourceEditView(resource, buffer)
      : resource
  const showBufferedNotice =
    resource?.status === 'completed' &&
    hasBufferedChanges(resource, buffer)

  return (
    <section>
      <PageHeader
        title={resource?.name ?? 'Resource Overview'}
        description={
          resource
            ? `Resource #${resource.resourceId}`
            : `Resource #${resourceId}`
        }
        backTo="/resources"
        backLabel="All resources"
      />

      <ResourcePageAsyncState
        loading={loading}
        loadError={loadError}
        loadErrorTitle={loadErrorTitle}
        isNotFound={isNotFound}
        isInvalidId={isInvalidId}
        loadingMessage="Loading resource…"
      >
        {resource && viewResource ? (
          <Content>
            {showBufferedNotice ? (
              <BufferedChangesNotice message="Temporary unsaved changes exist for this completed resource. Module progress below reflects merged in-memory edits, not what is persisted on the server." />
            ) : null}

            <SummaryCard>
              <SummaryRow>
                <SummaryLabel>Resource ID</SummaryLabel>
                <SummaryValue>{resource.resourceId}</SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>Name</SummaryLabel>
                <SummaryValue>{resource.name}</SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>Status</SummaryLabel>
                <ResourceStatusBadge status={resource.status} />
              </SummaryRow>
            </SummaryCard>

            <ProgressCard>
              <ProgressTitle>Overall progress</ProgressTitle>
              <ProgressText>
                {getCompletedModuleCount(viewResource)} of 2 modules complete
                {showBufferedNotice ? ' (includes unsaved changes)' : ''}
              </ProgressText>
              {resource.status === 'completed' ? (
                <CompletedNotice>
                  This resource has been provisioned and is completed.
                </CompletedNotice>
              ) : isReadyForProvisioning(resource) ? (
                <ReadyNotice>
                  All modules are complete. You can provision this resource.
                </ReadyNotice>
              ) : (
                <PendingNotice>
                  Complete all modules before provisioning this resource.
                </PendingNotice>
              )}
            </ProgressCard>

            <ModuleGrid>
              <ModuleOverviewCard
                title="Basic Info"
                description="Owner, contact details, description, and priority."
                complete={isBasicInfoComplete(viewResource.basicInfo)}
                actionLabel="Open Basic Info"
                actionTo={resourceBasicInfoPath(resourceId)}
              />
              <ModuleOverviewCard
                title="Project Details"
                description="Project name, budget, category, and team members."
                complete={isProjectDetailsComplete(viewResource.projectDetails)}
                actionLabel="Open Project Details"
                actionTo={
                  projectDetailsAccessible
                    ? resourceProjectDetailsPath(resourceId)
                    : undefined
                }
                blocked={!projectDetailsAccessible}
                blockedReason={
                  !projectDetailsAccessible
                    ? 'Complete Basic Info before editing Project Details.'
                    : undefined
                }
              />
            </ModuleGrid>

            <ActionsSection>
              <DetailsLink to={resourceDetailsPath(resourceId)}>
                View resource details
              </DetailsLink>

              {resource.status === 'draft' ? (
                <ProvisionSection key={resourceId}>
                  <Button
                    type="button"
                    onClick={handleProvision}
                    disabled={
                      !isReadyForProvisioning(resource) || isProvisioning
                    }
                  >
                    {isProvisioning ? 'Provisioning…' : 'Provision resource'}
                  </Button>
                  {provisioningBlockedReason ? (
                    <ProvisionHint>{provisioningBlockedReason}</ProvisionHint>
                  ) : null}
                  {provisionError ? (
                    <ActionFeedback role="alert" $variant="error">
                      {provisionError}
                    </ActionFeedback>
                  ) : null}
                  {provisionSuccess ? (
                    <ActionFeedback role="status" $variant="success">
                      {provisionSuccess}
                    </ActionFeedback>
                  ) : null}
                </ProvisionSection>
              ) : (
                <ProvisionUnavailableNotice>
                  Provisioning is unavailable for completed resources.
                </ProvisionUnavailableNotice>
              )}
            </ActionsSection>
          </Content>
        ) : null}
      </ResourcePageAsyncState>
    </section>
  )
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const SummaryCard = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
`

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const SummaryLabel = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.95rem;
`

const SummaryValue = styled.span`
  color: ${({ theme }) => theme.colors.inkStrong};
  font-weight: 600;
`

const ProgressCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

const ProgressTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const ProgressText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.ink};
  font-weight: 600;
`

const CompletedNotice = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.success};
`

const ReadyNotice = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.info};
`

const PendingNotice = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const ModuleGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const ActionsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.sm};
`

const DetailsLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const ProvisionSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`

const ProvisionHint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.9rem;
`

const ProvisionUnavailableNotice = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.95rem;
`

const ActionFeedback = styled.p<{ $variant: 'error' | 'success' }>`
  margin: 0;
  color: ${({ theme, $variant }) =>
    $variant === 'success' ? theme.colors.success : theme.colors.warning};
  font-size: 0.95rem;
`
