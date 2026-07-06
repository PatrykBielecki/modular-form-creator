import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getErrorMessage } from '../api/errors'
import { deleteResource, getResources } from '../api/resources'
import { CreateResourceDrawer } from '../components/resources/CreateResourceDrawer'
import { ResourcesList } from '../components/resources/ResourcesList'
import { AsyncState } from '../components/layout/AsyncState'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../design-system'
import type { Resource } from '../types/resource'

const LIST_QUERY = {
  page: 1,
  pageSize: 100,
  sortOrder: 'desc' as const,
}

export function ResourcesListPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [deletingResourceId, setDeletingResourceId] = useState<number | null>(
    null,
  )

  useEffect(() => {
    let cancelled = false

    getResources(LIST_QUERY)
      .then((response) => {
        if (!cancelled) {
          setResources(response.items)
          setLoadError(null)
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(getErrorMessage(error))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleCreated = (resource: Resource) => {
    setResources((current) => [resource, ...current])
    setActionError(null)
  }

  const handleDelete = async (resource: Resource) => {
    const confirmed = window.confirm(
      `Delete resource "${resource.name}" (#${resource.resourceId})? This cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    setActionError(null)
    setDeletingResourceId(resource.resourceId)

    try {
      await deleteResource(resource.resourceId)
      setResources((current) =>
        current.filter((item) => item.resourceId !== resource.resourceId),
      )
    } catch (error) {
      setActionError(getErrorMessage(error))
    } finally {
      setDeletingResourceId(null)
    }
  }

  return (
    <section>
      <PageHeader
        title="Resources"
        description="Create, track, and complete resources through the module workflow."
        actions={
          <Button type="button" onClick={() => setIsCreateOpen(true)}>
            Create resource
          </Button>
        }
      />

      {actionError ? (
        <InlineError role="alert">{actionError}</InlineError>
      ) : null}

      <AsyncState
        loading={loading}
        error={loadError}
        loadingMessage="Loading resources…"
        errorTitle="Could not load resources"
      >
        {resources.length === 0 ? (
          <EmptyState>
            <EmptyTitle>No resources yet</EmptyTitle>
            <EmptyMessage>
              Create your first resource to start the module workflow.
            </EmptyMessage>
            <Button type="button" onClick={() => setIsCreateOpen(true)}>
              Create resource
            </Button>
          </EmptyState>
        ) : (
          <ResourcesList
            resources={resources}
            onDelete={handleDelete}
            deletingResourceId={deletingResourceId}
          />
        )}
      </AsyncState>

      <CreateResourceDrawer
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleCreated}
      />
    </section>
  )
}

const InlineError = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.warning};
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(180, 71, 27, 0.08);
  color: ${({ theme }) => theme.colors.warning};
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
`

const EmptyTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const EmptyMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`
