import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Badge, Button } from '../../design-system'
import type { Resource, ResourceStatus } from '../../types/resource'
import {
  isBasicInfoComplete,
  isProjectDetailsComplete,
} from '../../utils/moduleCompletion'
import { resourceOverviewPath } from '../../hooks/useResourceId'
import { ModuleCompletionBadge } from './ModuleCompletionBadge'

interface ResourcesListProps {
  resources: Resource[]
  onDelete: (resource: Resource) => void
  deletingResourceId: number | null
}

function statusVariant(status: ResourceStatus): 'warning' | 'success' {
  return status === 'completed' ? 'success' : 'warning'
}

function statusLabel(status: ResourceStatus): string {
  return status === 'completed' ? 'Completed' : 'Draft'
}

export function ResourcesList({
  resources,
  onDelete,
  deletingResourceId,
}: ResourcesListProps) {
  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <HeaderCell scope="col">ID</HeaderCell>
            <HeaderCell scope="col">Name</HeaderCell>
            <HeaderCell scope="col">Status</HeaderCell>
            <HeaderCell scope="col">Basic Info</HeaderCell>
            <HeaderCell scope="col">Project Details</HeaderCell>
            <HeaderCell scope="col">Actions</HeaderCell>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => {
            const isDeleting = deletingResourceId === resource.resourceId

            return (
              <tr key={resource._id}>
                <Cell>{resource.resourceId}</Cell>
                <Cell>{resource.name}</Cell>
                <Cell>
                  <Badge variant={statusVariant(resource.status)}>
                    {statusLabel(resource.status)}
                  </Badge>
                </Cell>
                <Cell>
                  <ModuleCompletionBadge
                    complete={isBasicInfoComplete(resource.basicInfo)}
                  />
                </Cell>
                <Cell>
                  <ModuleCompletionBadge
                    complete={isProjectDetailsComplete(resource.projectDetails)}
                  />
                </Cell>
                <Cell>
                  <ActionGroup>
                    <OpenLink
                      to={resourceOverviewPath(String(resource.resourceId))}
                    >
                      Open
                    </OpenLink>
                    <Button
                      type="button"
                      variant="ghost"
                      size="small"
                      onClick={() => onDelete(resource)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting…' : 'Delete'}
                    </Button>
                  </ActionGroup>
                </Cell>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </TableWrapper>
  )
}

const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`

const HeaderCell = styled.th`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.inkMuted};
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
`

const Cell = styled.td`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.ink};
  vertical-align: middle;
`

const ActionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`

const OpenLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.inkStrong};
  font-size: 0.875rem;
  text-decoration: none;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`
