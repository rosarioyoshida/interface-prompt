export enum MessageRole {
  USER = "USER",
  ASSISTANT = "ASSISTANT",
}

export enum ConversationStatus {
  EMPTY = "EMPTY",
  ACTIVE = "ACTIVE",
}

export interface MessageResponse {
  id: string
  role: MessageRole
  content: string
  timestamp: string
}

export interface HateoasLink {
  href: string
  method?: string
}

export interface HateoasLinks {
  self?: HateoasLink
  "send-prompt"?: HateoasLink
  clear?: HateoasLink
  new?: HateoasLink
  conversation?: HateoasLink
  [key: string]: HateoasLink | undefined
}

export interface ConversationResponse {
  id: string
  status: ConversationStatus
  messages: MessageResponse[]
  createdAt: string
  _links: HateoasLinks
}

export interface PromptResultResponse {
  conversationId: string
  userMessage: MessageResponse
  assistantMessage: MessageResponse
  _links: HateoasLinks
}
