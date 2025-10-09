import { UserApiDTO } from './auth.dto'

export const mapUserFromApi = (data: UserApiDTO): AuthUser => ({
    id: data.user_id,
    email: data.email,
    name: data.entity.name,
    entityType: data.entity.type,
    profile: data?.profile,
})
