import type { ReactNode } from 'react'
import styled from 'styled-components'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  return (
    <StatePanel role="status" aria-live="polite">
      <Message>{message}</Message>
    </StatePanel>
  )
}

interface ErrorStateProps {
  message: string
  title?: string
  action?: ReactNode
}

export function ErrorState({
  message,
  title = 'Something went wrong',
  action,
}: ErrorStateProps) {
  return (
    <StatePanel role="alert">
      <StateTitle>{title}</StateTitle>
      <Message>{message}</Message>
      {action}
    </StatePanel>
  )
}

interface AsyncStateProps {
  loading?: boolean
  error?: string | null
  loadingMessage?: string
  errorTitle?: string
  errorAction?: ReactNode
  children: ReactNode
}

export function AsyncState({
  loading = false,
  error = null,
  loadingMessage,
  errorTitle,
  errorAction,
  children,
}: AsyncStateProps) {
  if (loading) {
    return <LoadingState message={loadingMessage} />
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        title={errorTitle}
        action={errorAction}
      />
    )
  }

  return children
}

const StatePanel = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

const StateTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const Message = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`
