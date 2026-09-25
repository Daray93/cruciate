interface IconProps {
  className?: string
}

const BASE_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function IconSun({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

export function IconMoon({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5Z" />
    </svg>
  )
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  )
}

export function IconAlertCircle({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16.2v.1" />
    </svg>
  )
}

export function IconInfoCircle({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 7.8v.1" />
    </svg>
  )
}

export function IconEye({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function IconGoogle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z" />
    </svg>
  )
}

export function IconCalendar({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  )
}

export function IconChevronLeft({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}

export function IconChevronRight({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

export function IconChevronDown({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M5 9l7 7 7-7" />
    </svg>
  )
}

export function IconDotsHorizontal({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconLogout({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  )
}

export function IconX({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

export function IconTrash({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  )
}

export function IconHome({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
    </svg>
  )
}

export function IconBody({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <circle cx="12" cy="4.5" r="2.5" />
      <path d="M12 8v7" />
      <path d="M8 11l4-1.5 4 1.5" />
      <path d="M12 15l-3 6" />
      <path d="M12 15l3 6" />
    </svg>
  )
}

export function IconTrendingUp({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  )
}

export function IconTrendingDown({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M3 7l6 6 4-4 8 8" />
      <path d="M15 17h6v-6" />
    </svg>
  )
}

export function IconMinus({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M5 12h14" />
    </svg>
  )
}

export function IconPlus({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconLayers({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M12 3l9 5-9 5-9-5 9-5Z" />
      <path d="M3 13l9 5 9-5" />
      <path d="M3 8l9 5 9-5" />
    </svg>
  )
}

export function IconUser({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
    </svg>
  )
}

export function IconGear({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

export function IconEyeOff({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className}>
      <path d="M6.6 6.6C3.9 8.3 2 12 2 12s3.5 7 10 7a10.4 10.4 0 0 0 4.4-.94" />
      <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.5 17.5 0 0 1-3.06 4.06" />
      <path d="M9.5 9.7A3 3 0 0 0 12 15a3 3 0 0 0 2.3-1.05" />
      <path d="M3 3l18 18" />
    </svg>
  )
}
