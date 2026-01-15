'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, X, AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastProps {
  toast: Toast
  onClose: () => void
}

function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: <CheckCircle size={20} className="text-green-400" />,
    error: <XCircle size={20} className="text-red-400" />,
    info: <CheckCircle size={20} className="text-neon-cyan" />,
    warning: <AlertTriangle size={20} className="text-yellow-400" />,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: 300 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="glassmorphism rounded-lg p-4 border border-neon-cyan/30 flex items-center gap-3 min-w-[300px]"
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm text-white">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  removeToast: (id: string) => void
}

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-24 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
