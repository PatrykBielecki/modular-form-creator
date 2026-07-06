import { Badge } from '../../design-system'
import type { ResourceStatus } from '../../types/resource'

interface ResourceStatusBadgeProps {
  status: ResourceStatus
}

function statusVariant(status: ResourceStatus): 'warning' | 'success' {
  return status === 'completed' ? 'success' : 'warning'
}

function statusLabel(status: ResourceStatus): string {
  return status === 'completed' ? 'Completed' : 'Draft'
}

export function ResourceStatusBadge({ status }: ResourceStatusBadgeProps) {
  return (
    <Badge variant={statusVariant(status)}>{statusLabel(status)}</Badge>
  )
}
