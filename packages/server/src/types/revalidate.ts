// Dashboard audiences that read cached data; each name is also the cache tag of its copy
export type PublicAudience = 'viewer' | 'guest'

export interface RevalidateRequest {
  audiences: PublicAudience[]
}
