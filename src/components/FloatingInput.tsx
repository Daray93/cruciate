import { useId, useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { IconEye, IconEyeOff } from './icons'
import './FloatingInput.css'

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function FloatingInput({ label, id, className, type, ...inputProps }: FloatingInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const isPassword = type === 'password'
  const [revealed, setRevealed] = useState(false)

  return (
    <div
      className={`floating-field${isPassword ? ' floating-field-password' : ''}${className ? ` ${className}` : ''}`}
    >
      <input id={inputId} type={isPassword && revealed ? 'text' : type} placeholder=" " {...inputProps} />
      <label htmlFor={inputId}>{label}</label>
      {isPassword && (
        <button
          type="button"
          className="floating-field-reveal"
          tabIndex={-1}
          aria-label={revealed ? 'Hide password' : 'Show password'}
          onClick={() => setRevealed((r) => !r)}
        >
          {revealed ? <IconEyeOff /> : <IconEye />}
        </button>
      )}
    </div>
  )
}
