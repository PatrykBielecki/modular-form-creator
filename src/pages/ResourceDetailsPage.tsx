import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  PRIORITY_OPTIONS,
  PROJECT_CATEGORY_OPTIONS,
} from '../constants/formOptions'
import { ResourceStatusBadge } from '../components/resources/ResourceStatusBadge'
import {
  ResourceSummarySection,
  SummaryField,
  SummaryNavLink,
  SummaryNavLinkDisabled,
} from '../components/resources/ResourceSummarySection'
import { ModuleCompletionBadge } from '../components/resources/ModuleCompletionBadge'
import { AsyncState } from '../components/layout/AsyncState'
import { PageHeader } from '../components/layout/PageHeader'
import { useResource } from '../hooks/useResource'
import {
  resourceBasicInfoPath,
  resourceOverviewPath,
  resourceProjectDetailsPath,
  useResourceId,
} from '../hooks/useResourceId'
import type { Resource } from '../types/resource'
import {
  canEditProjectDetails,
  getProvisioningBlockedReason,
  isBasicInfoComplete,
  isProjectDetailsComplete,
  isReadyForProvisioning,
} from '../utils/moduleCompletion'

function displayText(value: string): string {
  const trimmed = value.trim()
  return trimmed || '—'
}

function formatTimestamp(value?: string): string {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString()
}

function formatPriority(value: string): string {
  const option = PRIORITY_OPTIONS.find((item) => item.value === value)
  return option?.label ?? displayText(value)
}

function formatCategory(value: string): string {
  const option = PROJECT_CATEGORY_OPTIONS.find((item) => item.value === value)
  return option?.label ?? displayText(value)
}

function formatOptions(values: string[]): string {
  if (values.length === 0) {
    return '—'
  }
  return values.join(', ')
}

interface ResourceDetailsSummaryProps {
  resource: Resource
  resourceId: string
}

function ResourceDetailsSummary({
  resource,
  resourceId,
}: ResourceDetailsSummaryProps) {
  const basicInfoComplete = isBasicInfoComplete(resource.basicInfo)
  const projectDetailsComplete = isProjectDetailsComplete(resource.projectDetails)
  const projectDetailsAccessible =
    resource.status === 'completed' ||
    canEditProjectDetails(resource.basicInfo)
  const provisioningBlockedReason = getProvisioningBlockedReason(resource)

  return (
    <Content>
      <MetaCard>
        <MetaHeader>
          <MetaTitle>{resource.name}</MetaTitle>
          <ResourceStatusBadge status={resource.status} />
        </MetaHeader>
        <MetaGrid>
          <SummaryField label="Resource ID" value={resource.resourceId} />
          <SummaryField label="Resource name" value={resource.name} />
          <SummaryField label="Status" value={<ResourceStatusBadge status={resource.status} />} />
          <SummaryField
            label="Created"
            value={formatTimestamp(resource.createdAt)}
          />
          <SummaryField
            label="Last updated"
            value={formatTimestamp(resource.updatedAt)}
          />
        </MetaGrid>
      </MetaCard>

      <StatusNotice $variant={resource.status === 'completed' ? 'completed' : isReadyForProvisioning(resource) ? 'ready' : 'pending'}>
        {resource.status === 'completed' ? (
          <>This resource is completed. Provisioning is not available.</>
        ) : isReadyForProvisioning(resource) ? (
          <>
            Both modules are complete. This resource can be provisioned from the{' '}
            <InlineLink to={resourceOverviewPath(resourceId)}>resource overview</InlineLink>.
          </>
        ) : (
          <>{provisioningBlockedReason ?? 'Complete all modules before provisioning.'}</>
        )}
      </StatusNotice>

      <ModulesSummary>
        <SummaryField
          label="Overall module progress"
          value={`${Number(basicInfoComplete) + Number(projectDetailsComplete)} of 2 modules complete`}
        />
        <ModuleBadges>
          <ModuleCompletionBadge complete={basicInfoComplete} />
          <ModuleCompletionBadge complete={projectDetailsComplete} />
        </ModuleBadges>
      </ModulesSummary>

      <ResourceSummarySection
        title="Basic Info"
        complete={basicInfoComplete}
        action={
          <SummaryNavLink to={resourceBasicInfoPath(resourceId)}>
            Edit Basic Info
          </SummaryNavLink>
        }
      >
        <SummaryField
          label="Resource name"
          value={displayText(resource.basicInfo.resourceName)}
        />
        <SummaryField label="Owner" value={displayText(resource.basicInfo.owner)} />
        <SummaryField label="Email" value={displayText(resource.basicInfo.email)} />
        <SummaryField
          label="Description"
          value={displayText(resource.basicInfo.description)}
        />
        <SummaryField
          label="Priority"
          value={formatPriority(resource.basicInfo.priority)}
        />
      </ResourceSummarySection>

      <ResourceSummarySection
        title="Project Details"
        complete={projectDetailsComplete}
        action={
          projectDetailsAccessible ? (
            <SummaryNavLink to={resourceProjectDetailsPath(resourceId)}>
              Edit Project Details
            </SummaryNavLink>
          ) : (
            <SummaryNavLinkDisabled
              reason="Complete Basic Info to unlock Project Details."
            >
              Edit Project Details (locked)
            </SummaryNavLinkDisabled>
          )
        }
      >
        {!projectDetailsAccessible ? (
          <LockedNotice>
            Project Details is locked until Basic Info is complete for this draft
            resource.
          </LockedNotice>
        ) : null}
        <SummaryField
          label="Project name"
          value={displayText(resource.projectDetails.projectName)}
        />
        <SummaryField
          label="Budget"
          value={displayText(resource.projectDetails.budget)}
        />
        <SummaryField
          label="Category"
          value={formatCategory(resource.projectDetails.category)}
        />
        <SummaryField
          label="Team members"
          value={formatOptions(resource.projectDetails.options)}
        />
      </ResourceSummarySection>

      <NavigationSection>
        <NavigationTitle>Navigation</NavigationTitle>
        <NavigationLinks>
          <SummaryNavLink to={resourceOverviewPath(resourceId)}>
            Back to overview
          </SummaryNavLink>
          <SummaryNavLink to="/resources">Back to resources list</SummaryNavLink>
          <SummaryNavLink to={resourceBasicInfoPath(resourceId)}>
            Edit Basic Info
          </SummaryNavLink>
          {projectDetailsAccessible ? (
            <SummaryNavLink to={resourceProjectDetailsPath(resourceId)}>
              Edit Project Details
            </SummaryNavLink>
          ) : (
            <SummaryNavLinkDisabled reason="Complete Basic Info first.">
              Edit Project Details (locked)
            </SummaryNavLinkDisabled>
          )}
        </NavigationLinks>
      </NavigationSection>
    </Content>
  )
}

export function ResourceDetailsPage() {
  const resourceId = useResourceId()
  const { resource, loading, loadError, isNotFound } = useResource(resourceId)

  return (
    <section>
      <PageHeader
        title="Resource Details"
        description={
          resource
            ? `${resource.name} · Resource #${resource.resourceId}`
            : `Summary for resource #${resourceId}`
        }
        backTo={resourceOverviewPath(resourceId)}
        backLabel="Back to overview"
      />

      <AsyncState
        loading={loading}
        error={loadError}
        loadingMessage="Loading resource details…"
        errorTitle={isNotFound ? 'Resource not found' : 'Could not load resource'}
      >
        {resource ? (
          <ResourceDetailsSummary
            resource={resource}
            resourceId={resourceId}
          />
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

const MetaCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
`

const MetaHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`

const MetaTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const MetaGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const StatusNotice = styled.p<{ $variant: 'completed' | 'ready' | 'pending' }>`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.95rem;
  color: ${({ theme, $variant }) =>
    $variant === 'completed'
      ? theme.colors.success
      : $variant === 'ready'
        ? theme.colors.info
        : theme.colors.inkMuted};
  background: ${({ theme, $variant }) =>
    $variant === 'completed'
      ? 'rgba(46, 139, 87, 0.08)'
      : $variant === 'ready'
        ? 'rgba(60, 90, 137, 0.08)'
        : theme.colors.surfaceAlt};
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === 'completed'
        ? theme.colors.success
        : $variant === 'ready'
          ? theme.colors.info
          : theme.colors.border};
`

const InlineLink = styled(Link)`
  color: inherit;
  font-weight: 600;
  text-decoration: underline;
`

const ModulesSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

const ModuleBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`

const LockedNotice = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: rgba(180, 71, 27, 0.08);
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.9rem;
`

const NavigationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.sm};
`

const NavigationTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const NavigationLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`
