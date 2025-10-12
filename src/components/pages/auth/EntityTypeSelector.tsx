'use client'

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'

type EntityType = 'owner' | 'service'

type EntityTypeElement = {
    id: number
    code: EntityType
    description: string
}

interface EntityTypeSelectorProps {
    form: UseFormReturn<any>
    entityTypes: EntityTypeElement[]
}

export function EntityTypeSelector({
    form,
    entityTypes,
}: EntityTypeSelectorProps) {
    return (
        <FormField
            control={form.control}
            name="entityType"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Tipo de usuario</FormLabel>

                    <div className="flex gap-4 mt-2">
                        {entityTypes?.map((type) => {
                            const isSelected = field.value?.id === type.id

                            return (
                                <div
                                    key={type.id}
                                    onClick={() =>
                                        field.onChange({
                                            id: type.id,
                                            code: type.code,
                                        })
                                    }
                                    className={`flex-1 cursor-pointer rounded-xl p-2.5 text-center transition-all duration-200 border ${
                                        isSelected
                                            ? 'border-primary bg-primary/10 shadow-md'
                                            : 'border-gray-300 hover:border-primary hover:bg-primary/5'
                                    }`}
                                >
                                    <p className="text-sm font-medium">
                                        {type.description}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {type.code}
                                    </p>
                                </div>
                            )
                        })}
                    </div>

                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
