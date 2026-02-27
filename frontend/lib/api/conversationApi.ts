import type { ConversationResponse, PromptResultResponse } from "@/lib/types/conversation"

const BASE_URL = "/api/v1/conversations"

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const problem = await res.json()
      detail = problem.detail ?? problem.title ?? detail
    } catch {
      // ignore parse error
    }
    throw new Error(detail)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return res.json() as Promise<T>
}

export async function createConversation(): Promise<ConversationResponse> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  })
  return handleResponse<ConversationResponse>(res)
}

export async function getConversation(conversationId: string): Promise<ConversationResponse> {
  const res = await fetch(`${BASE_URL}/${conversationId}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  })
  return handleResponse<ConversationResponse>(res)
}

export async function sendPrompt(
  conversationId: string,
  content: string
): Promise<PromptResultResponse> {
  const res = await fetch(`${BASE_URL}/${conversationId}/prompts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  })
  return handleResponse<PromptResultResponse>(res)
}

export async function deleteConversation(conversationId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${conversationId}`, {
    method: "DELETE",
  })
  return handleResponse<void>(res)
}
