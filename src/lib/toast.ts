import { toastManager } from '@/components/ui/toast'

export function showToast(type: 'success' | 'error' | 'info' | 'warning', title: string, description?: string) {
  toastManager.add({
    type,
    title,
    description
  })
}

