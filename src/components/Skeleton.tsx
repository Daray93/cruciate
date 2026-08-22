import './Skeleton.css'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  radius?: string
  className?: string
}

export function Skeleton({ width = '100%', height = '1em', radius, className }: SkeletonProps) {
  return (
    <div
      className={`skeleton${className ? ` ${className}` : ''}`}
      style={{ width, height, borderRadius: radius }}
    />
  )
}
