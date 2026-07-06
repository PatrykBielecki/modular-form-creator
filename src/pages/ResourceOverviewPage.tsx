import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getErrorMessage } from '../api/errors'
import { getResource, provisionResource } from '../api/resources'
import { ModuleOverviewCard } from '../components/resources/ModuleOverviewCard'
import { ResourceStatusBadge } from '../components/resources/ResourceStatusBadge'
import { AsyncState } from '../components/layout/AsyncState'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../design-system'
import {
  resourceBasicInfoPath,
  resourceDetailsPath,
  resourceProjectDetailsPath,
  useResourceId,
} from '../hooks/useResourceId'
import type { Resource } from '../types/resource'
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
  const [resource, setResource] = useState<Resource | null>(null)
  const [fetchError, setFetchError] = useState<{
    resourceId: string
    message: string
  } | null>(null)
  const [provisionError, setProvisionError] = useState<string | null>(null)
  const [isProvisioning, setIsProvisioning] = useState(false)

  const isCurrentResource =
    resource !== null && String(resource.resourceId) === resourceId
  const loadError =
    fetchError?.resourceId === resourceId ? fetchError.message : null
  const loading = !isCurrentResource && loadError === null

  useEffect(() => {
    let cancelled = false

    getResource(resourceId)
      .then((loadedResource) => {
        if (!cancelled) {
          setResource(loadedResource)
          setFetchError(null)
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setFetchError({
            resourceId,
            message: getErrorMessage(error),
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [resourceId])

  const handleProvision = () => {
    if (!resource || !isReadyForProvisioning(resource)) {
      return
    }

    setIsProvisioning(true)
    setProvisionError(null)

    provisionResource(resourceId)
      .then((updatedResource) => {
        setResource(updatedResource)
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

      <AsyncState
        loading={loading}
        error={loadError}
        loadingMessage="Loading resource…"
        errorTitle="Could not load resource"
      >
        {resource ? (
          <Content>
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
                {getCompletedModuleCount(resource)} of 2 modules complete
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
                complete={isBasicInfoComplete(resource.basicInfo)}
                actionLabel="Open Basic Info"
                actionTo={resourceBasicInfoPath(resourceId)}
              />
              <ModuleOverviewCard
                title="Project Details"
                description="Project name, budget, category, and team members."
                complete={isProjectDetailsComplete(resource.projectDetails)}
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
                <ProvisionSection>
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
                    <ProvisionError role="alert">{provisionError}</ProvisionError>
                  ) : null}
                </ProvisionSection>
              ) : null}
            </ActionsSection>
          </Content>
        ) : null}
      </AsyncState>
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

const ProvisionError = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.95rem;
`
