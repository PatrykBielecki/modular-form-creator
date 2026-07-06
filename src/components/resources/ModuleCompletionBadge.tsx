import { Badge } from '../../design-system'

interface ModuleCompletionBadgeProps {
  complete: boolean
}

export function ModuleCompletionBadge({ complete }: ModuleCompletionBadgeProps) {
  return (
    <Badge variant={complete ? 'success' : 'warning'}>
      {complete ? 'Complete' : 'Incomplete'}
    </Badge>
  )
}
