import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { formatLongDate, formatRelativeToToday } from '../lib/date'
import { isTimeEligibleForNextPhase, nextPhase, PHASES, weeksPostOp } from '../lib/phases'
import { useMilestoneCheckins } from '../hooks/useMilestoneCheckins'
import type { UserProfile } from '../types'
import { IconX } from './icons'
import { MilestoneCheckIn } from './MilestoneCheckIn'
import './HomeScreen.css'

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

interface HomeScreenProps {
  userId: string
  profile: UserProfile
  onProfileChange: () => void
  onOpenRehab: () => void
  onOpenProfile: () => void
}

export function HomeScreen({ userId, profile, onProfileChange, onOpenRehab, onOpenProfile }: HomeScreenProps) {
  const { current_phase: currentPhase, track } = profile
  const phaseDef = PHASES[currentPhase]
  const [checkinOpen, setCheckinOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  const cycleWeek = track === 'rehab' && profile.surgery_date ? weeksPostOp(profile.surgery_date) : 0
  const { submitCheckin } = useMilestoneCheckins(userId)

  const next = nextPhase(currentPhase)
  const checkinDue =
    next !== null && (track === 'prehab' || isTimeEligibleForNextPhase(track, currentPhase, profile.surgery_date))

  const surgeryTimelineText =
    track === 'prehab'
      ? profile.surgery_date
        ? `Surgery ${formatRelativeToToday(profile.surgery_date)}`
        : profile.surgery_timeframe === 'considering'
          ? "Still deciding on surgery. That's okay."
          : profile.surgery_timeframe === 'no_date'
            ? 'No surgery date yet.'
            : null
      : null

  const injuryText = profile.injury_date ? `Injury ${formatRelativeToToday(profile.injury_date)}` : null

  return (
    <main className="app-shell app-shell-with-tabs">
      <header className="app-header">
        <h1>Cruciate</h1>
        <button type="button" className="home-avatar" aria-label="Open profile" onClick={onOpenProfile}>
          {profile.name.trim().charAt(0).toUpperCase()}
        </button>
      </header>

      <section className="home-greeting">
        <div className="home-greeting-block">
          <motion.p
            className="home-greeting-hi"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(8px)', transform: 'translateY(8px)' }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }}
            transition={{ duration: reduceMotion ? 0.2 : 0.5, ease: EASE_OUT }}
          >
            Welcome back,{' '}
            <motion.span
              className="home-greeting-name"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.85)' }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, transform: 'scale(1)' }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.25, delay: reduceMotion ? 0 : 0.15 }}
            >
              {profile.name}
            </motion.span>
          </motion.p>

          <p className="home-date">It's {formatLongDate()}</p>
        </div>

        <div className="home-status">
          <p className="home-phase-label">
            {track === 'prehab' ? 'Prehab' : 'Rehab'} · {phaseDef.shortLabel}: {phaseDef.title}
          </p>
          {track === 'rehab' && profile.surgery_date && <p className="home-phase-week">Week {cycleWeek} post-op</p>}
          {surgeryTimelineText && <p className="home-phase-week">{surgeryTimelineText}</p>}
          {injuryText && <p className="home-phase-week">{injuryText}</p>}
          <p className="home-phase-criterion">{phaseDef.graduationCriterion}</p>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {checkinDue && !checkinOpen && (
          <motion.button
            key="checkin-prompt"
            type="button"
            className="checkin-prompt-card"
            onClick={() => setCheckinOpen(true)}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.97) translateY(-6px)' }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, transform: 'scale(1) translateY(0px)' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.97) translateY(-6px)' }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          >
            <span className="checkin-prompt-title">
              {track === 'rehab' ? "You're time-eligible for your next phase" : 'Ready to check your progress?'}
            </span>
            <span className="checkin-prompt-body">Answer a quick check-in to see if you're ready to advance.</span>
          </motion.button>
        )}

        {checkinDue && checkinOpen && (
          <motion.section
            key="checkin-panel"
            className="checkin-panel"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.97) translateY(-6px)' }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, transform: 'scale(1) translateY(0px)' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.97) translateY(-6px)' }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          >
            <button
              type="button"
              className="checkin-panel-close"
              aria-label="Close check-in"
              onClick={() => setCheckinOpen(false)}
            >
              <IconX />
            </button>
            <MilestoneCheckIn
              phase={currentPhase}
              title="Milestone check-in"
              onSubmit={async (answers) => {
                const result = await submitCheckin(currentPhase, answers)
                onProfileChange()
                return result
              }}
              onContinue={() => setCheckinOpen(false)}
            />
          </motion.section>
        )}
      </AnimatePresence>

      <button type="button" className="home-rehab-cta" onClick={onOpenRehab}>
        <span className="home-rehab-cta-title">Complete today's rehab</span>
        <span className="home-rehab-cta-body">Exercises, range of motion, and today's check-in</span>
      </button>
    </main>
  )
}
