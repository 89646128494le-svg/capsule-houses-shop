'use client'

import { useToastStore } from '@/store/toastStore'
import ToastContainer from './Toast'

export default function ToastProvider() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  return <ToastContainer toasts={toasts} removeToast={removeToast} />
}
