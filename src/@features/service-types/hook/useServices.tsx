import { useAxiosInstance } from '@/lib/@axios'
import { useQuery } from '@tanstack/react-query'

export default function useServices() {
    const axiosInstance = useAxiosInstance()

    const query = useQuery({
        queryKey: ['services-types'],
        queryFn: async () => {
            const {
                data: { services_types },
            } = await axiosInstance.get(`service-types`)
            return services_types
        },
    })

    return { ...query }
}
