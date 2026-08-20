import type { ReactNode } from 'react'
import { IconAlertCircle, IconInfoCircle } from './icons'
import './Alert.css'

interface AlertProps {
  variant: 'error' | 'info'
  children: ReactNode
}

export function Alert({ variant, children }: AlertProps) {
  const Icon = variant === 'error' ? IconAlertCircle : IconInfoCircle

  return (
    <div className={`alert alert-${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      <Icon className="alert-icon" />
      <p>{children}</p>
    </div>
  )
}
