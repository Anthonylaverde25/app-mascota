import { useState, useCallback } from 'react'
import axios from 'axios'

export function useApiAvailable(apiUrl: string) {
    const [isChecking, setIsChecking] = useState(false)
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null)

    const checkApi = useCallback(async () => {
        setIsChecking(true)
        let available = false
        try {
            const { status } = await axios.get(apiUrl)
            available = status === 200
            setIsAvailable(available)
        } catch {
            setIsAvailable(false)
        } finally {
            setIsChecking(false)
        }
        return available
    }, [apiUrl])

    return { isAvailable, isChecking, checkApi }
}
