import { Skeleton } from './Skeleton'
import './AppSkeleton.css'

export function AppSkeleton() {
  return (
    <main className="app-shell app-skeleton" aria-label="Loading" aria-busy="true">
      <header className="app-header">
        <Skeleton width={110} height={28} />
      </header>

      <section className="app-skeleton-greeting">
        <Skeleton width={170} height={22} />
        <Skeleton width={120} height={14} />
      </section>

      <section className="app-skeleton-status">
        <Skeleton width="80%" height={14} />
        <Skeleton width="55%" height={14} />
        <Skeleton width="70%" height={14} />
      </section>

      <Skeleton height={72} radius="var(--radius-lg)" />
      <Skeleton width={140} height={16} />
    </main>
  )
}
