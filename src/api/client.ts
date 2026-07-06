import { ApiError, isApiErrorBody } from './errors'

const DEFAULT_API_BASE_URL = 'http://localhost:5001'

export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim()
  return configured || DEFAULT_API_BASE_URL
}

function buildUrl(path: string): string {
  const base = getApiBaseUrl().replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  const fallbackMessage = `Request failed with status ${response.status}`

  try {
    const body: unknown = await response.json()
    if (isApiErrorBody(body)) {
      return new ApiError(response.status, body.message, body.details)
    }
  } catch {
    // Response body is not JSON — use fallback message below.
  }

  return new ApiError(response.status, fallbackMessage)
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let response: Response

  try {
    response = await fetch(buildUrl(path), {
      ...options,
      headers,
    })
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Network request failed', { cause: error })
  }

  if (!response.ok) {
    throw await parseErrorResponse(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
