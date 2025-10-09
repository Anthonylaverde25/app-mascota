export type UserApiDTO = {
    user_id: number
    email: string
    entity: EntityDTO
    entityType: EntityTypeDTO[]
    profile: ProfileDTO | null
}
