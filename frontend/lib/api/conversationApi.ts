import type {
  ConversationResponse,
  PromptResultResponse,
} from "@/lib/types/conversation"
import {
  ApiProblemError,
  normalizeProblemDetails,
} from "@/lib/api/problemDetails"
import { createTraceId } from "@/lib/observability/trace"

const BASE_URL = "/api/v1/conversations"
const TRACE_ID_HEADER = "X-Trace-Id"

async function handleResponse<T>(res: Response, requestTraceId: string): Promise<T> {
  if (!res.ok) {
    let parsedPayload: unknown
    try {
      parsedPayload = await res.json()
    } catch {
      // fallback to generic HTTP error
    }
    const problem = normalizeProblemDetails(parsedPayload, {
      status: res.status,
      instance: res.url || undefined,
      traceId:
        typeof res.headers?.get === "function"
          ? res.headers.get(TRACE_ID_HEADER) || requestTraceId
          : requestTraceId,
    })
    if (problem) {
      throw new ApiProblemError(problem)
    }

    throw new Error(`HTTP ${res.status} (traceId: ${requestTraceId})`)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return res.json() as Promise<T>
}

export async function createConversation(): Promise<ConversationResponse> {
  const traceId = createTraceId()
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", [TRACE_ID_HEADER]: traceId },
    body: "{}",
  })
  return handleResponse<ConversationResponse>(res, traceId)
}

export async function getConversation(
  conversationId: string,
): Promise<ConversationResponse> {
  const traceId = createTraceId()
  const res = await fetch(`${BASE_URL}/${conversationId}`, {
    method: "GET",
    headers: { Accept: "application/json", [TRACE_ID_HEADER]: traceId },
  })
  return handleResponse<ConversationResponse>(res, traceId)
}

export async function sendPrompt(
  conversationId: string,
  content: string,
): Promise<PromptResultResponse> {
  const traceId = createTraceId()
  const res = await fetch(`${BASE_URL}/${conversationId}/prompts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", [TRACE_ID_HEADER]: traceId },
    body: JSON.stringify({ content }),
  })
  return handleResponse<PromptResultResponse>(res, traceId)
}

export async function deleteConversation(
  conversationId: string,
): Promise<void> {
  const traceId = createTraceId()
  const res = await fetch(`${BASE_URL}/${conversationId}`, {
    method: "DELETE",
    headers: { [TRACE_ID_HEADER]: traceId },
  })
  return handleResponse<void>(res, traceId)
}
