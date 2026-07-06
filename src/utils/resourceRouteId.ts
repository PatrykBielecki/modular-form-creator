const OBJECT_ID_REGEX = /^[a-fA-F0-9]{24}$/

export const INVALID_RESOURCE_ID_MESSAGE =
  'Resource id must be a positive number or Mongo ObjectId.'

/** Matches backend acceptance for numeric resourceId or Mongo ObjectId. */
export function isValidResourceRouteId(value: string): boolean {
  if (/^\d+$/.test(value)) {
    const numeric = Number(value)
    return Number.isInteger(numeric) && numeric > 0
  }

  return OBJECT_ID_REGEX.test(value)
}
