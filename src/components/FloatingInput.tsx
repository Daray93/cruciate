import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import './FloatingInput.css'

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function FloatingInput({ label, id, className, ...inputProps }: FloatingInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={`floating-field${className ? ` ${className}` : ''}`}>
      <input id={inputId} placeholder=" " {...inputProps} />
      <label htmlFor={inputId}>{label}</label>
    </div>
  )
}
