import z from 'zod'

export const profileSchema = z.object({
    service_types: z
        .array(
            z
                .object({
                    id: z.number(),
                    code: z.string(),
                    license_number: z.string().optional(),
                })
                .refine(
                    (data) =>
                        data.code !== 'veterinarian' ||
                        !!data.license_number?.trim(),
                    {
                        message: 'El número de matrícula es obligatorio',
                        path: ['license_number'],
                    }
                )
        )
        .nonempty({
            message: 'Debes seleccionar al menos un tipo de servicio',
        }),
})
