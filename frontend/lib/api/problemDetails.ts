export interface ProblemFieldError {
  name: string
  reason: string
  location?: "body" | "query" | "path" | "header"
  code?: string
}

export interface ProblemDetails {
  type: string
  title: string
  status: number
  detail: string
  instance?: string
  traceId?: string
  errors?: ProblemFieldError[]
}

export class ApiProblemError extends Error {
  readonly problem: ProblemDetails

  constructor(problem: ProblemDetails) {
    super(problem.detail || problem.title)
    this.name = "ApiProblemError"
    this.problem = problem
  }
}

export function isProblemDetails(input: unknown): input is ProblemDetails {
  if (!input || typeof input !== "object") return false
  const obj = input as Record<string, unknown>
  return (
    typeof obj.type === "string" &&
    typeof obj.title === "string" &&
    typeof obj.status === "number" &&
    (typeof obj.detail === "string" || obj.detail === undefined)
  )
}

export function normalizeProblemDetails(
  input: unknown,
  fallback?: { status: number; instance?: string; traceId?: string },
): ProblemDetails | null {
  if (!isProblemDetails(input)) return null

  const problem = input as ProblemDetails
  return {
    type: problem.type,
    title: problem.title,
    status: fallback?.status ?? problem.status,
    detail: problem.detail || problem.title,
    instance: problem.instance ?? fallback?.instance,
    traceId: problem.traceId ?? fallback?.traceId,
    errors: problem.errors,
  }
}
