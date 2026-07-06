import { useContext } from 'react'
import { CompletedResourceEditBufferContext } from '../context/CompletedResourceEditBufferContext'

export function useCompletedResourceEditBuffer() {
  const context = useContext(CompletedResourceEditBufferContext)

  if (!context) {
    throw new Error(
      'useCompletedResourceEditBuffer must be used within CompletedResourceEditBufferProvider',
    )
  }

  return context
}
