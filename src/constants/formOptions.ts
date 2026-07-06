import type { SelectOption } from '../design-system'

export const PRIORITY_VALUES = ['low', 'medium', 'high'] as const

export const PROJECT_CATEGORY_VALUES = ['internal', 'external', 'vendor'] as const

export const TEAM_MEMBER_VALUES = [
  'FE devs',
  'BE devs',
  'Designer',
  'Data Eng',
  'Product Owner',
] as const

export const PRIORITY_OPTIONS: SelectOption[] = [
  { value: '', label: 'Select priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export const PROJECT_CATEGORY_OPTIONS: SelectOption[] = [
  { value: '', label: 'Select a category' },
  { value: 'internal', label: 'Internal' },
  { value: 'external', label: 'External' },
  { value: 'vendor', label: 'Vendor' },
]
