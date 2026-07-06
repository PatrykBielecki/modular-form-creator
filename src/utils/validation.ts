import {
  PRIORITY_VALUES,
  PROJECT_CATEGORY_VALUES,
  TEAM_MEMBER_VALUES,
} from '../constants/formOptions'
import type { BasicInfo, ProjectDetails } from '../types/resource'

export type FieldValidationResult = string | undefined

export type BasicInfoFieldErrors = Partial<Record<keyof BasicInfo, string>>
export type ProjectDetailsFieldErrors = Partial<
  Record<keyof ProjectDetails, string>
>

const NAME_REGEX = /^[A-Za-z0-9 -]+$/
const OWNER_REGEX = /^[A-Za-z ]+$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INTEGER_REGEX = /^\d+$/

export function validateResourceName(value: string): FieldValidationResult {
  const trimmed = value.trim()
  if (!trimmed) {
    return 'resourceName is required'
  }
  if (trimmed.length > 255) {
    return 'resourceName must be at most 255 characters long'
  }
  if (!NAME_REGEX.test(trimmed)) {
    return 'resourceName can contain only letters, numbers, spaces, and hyphens'
  }
  return undefined
}

export function validateProjectName(value: string): FieldValidationResult {
  const trimmed = value.trim()
  if (!trimmed) {
    return 'projectName is required'
  }
  if (trimmed.length > 255) {
    return 'projectName must be at most 255 characters long'
  }
  if (!NAME_REGEX.test(trimmed)) {
    return 'projectName can contain only letters, numbers, spaces, and hyphens'
  }
  return undefined
}

export function validateOwner(value: string): FieldValidationResult {
  const trimmed = value.trim()
  if (!trimmed) {
    return 'owner is required'
  }
  if (trimmed.length > 255) {
    return 'owner must be at most 255 characters long'
  }
  if (!OWNER_REGEX.test(trimmed)) {
    return 'owner can contain only letters and spaces'
  }
  return undefined
}

export function validateEmail(value: string): FieldValidationResult {
  const trimmed = value.trim()
  if (!trimmed) {
    return 'email is required'
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'email must be a valid email format'
  }
  return undefined
}

export function validateDescription(value: string): FieldValidationResult {
  const trimmed = value.trim()
  if (!trimmed) {
    return 'description is required'
  }
  if (trimmed.length > 1000) {
    return 'description must be at most 1000 characters long'
  }
  return undefined
}

export function validatePriority(value: string): FieldValidationResult {
  if (!PRIORITY_VALUES.includes(value as (typeof PRIORITY_VALUES)[number])) {
    return 'priority must be one of: low, medium, high'
  }
  return undefined
}

export function validateBudget(value: string): FieldValidationResult {
  const trimmed = value.trim()
  if (!trimmed) {
    return 'budget is required'
  }
  if (!INTEGER_REGEX.test(trimmed)) {
    return 'budget must contain only integers'
  }
  return undefined
}

export function validateCategory(value: string): FieldValidationResult {
  if (
    !PROJECT_CATEGORY_VALUES.includes(
      value as (typeof PROJECT_CATEGORY_VALUES)[number],
    )
  ) {
    return 'category must be one of: internal, external, vendor'
  }
  return undefined
}

export function validateTeamMemberOptions(
  values: string[],
): FieldValidationResult {
  if (!Array.isArray(values) || values.length === 0) {
    return 'At least one team member is required'
  }

  const invalid = values.find(
    (value) =>
      !TEAM_MEMBER_VALUES.includes(value as (typeof TEAM_MEMBER_VALUES)[number]),
  )
  if (invalid) {
    return `Unsupported team member option: ${invalid}`
  }
  return undefined
}

export function validateBasicInfo(basicInfo: BasicInfo): BasicInfoFieldErrors {
  const errors: BasicInfoFieldErrors = {}

  const resourceNameError = validateResourceName(basicInfo.resourceName)
  if (resourceNameError) {
    errors.resourceName = resourceNameError
  }

  const ownerError = validateOwner(basicInfo.owner)
  if (ownerError) {
    errors.owner = ownerError
  }

  const emailError = validateEmail(basicInfo.email)
  if (emailError) {
    errors.email = emailError
  }

  const descriptionError = validateDescription(basicInfo.description)
  if (descriptionError) {
    errors.description = descriptionError
  }

  const priorityError = validatePriority(basicInfo.priority)
  if (priorityError) {
    errors.priority = priorityError
  }

  return errors
}

export function validateProjectDetails(
  projectDetails: ProjectDetails,
): ProjectDetailsFieldErrors {
  const errors: ProjectDetailsFieldErrors = {}

  const projectNameError = validateProjectName(projectDetails.projectName)
  if (projectNameError) {
    errors.projectName = projectNameError
  }

  const budgetError = validateBudget(projectDetails.budget)
  if (budgetError) {
    errors.budget = budgetError
  }

  const categoryError = validateCategory(projectDetails.category)
  if (categoryError) {
    errors.category = categoryError
  }

  const optionsError = validateTeamMemberOptions(projectDetails.options)
  if (optionsError) {
    errors.options = optionsError
  }

  return errors
}

export function isBasicInfoValid(basicInfo: BasicInfo): boolean {
  return Object.keys(validateBasicInfo(basicInfo)).length === 0
}

export function isProjectDetailsValid(projectDetails: ProjectDetails): boolean {
  return Object.keys(validateProjectDetails(projectDetails)).length === 0
}

export function hasValidationErrors<T extends Record<string, string>>(
  errors: Partial<T>,
): boolean {
  return Object.keys(errors).length > 0
}
