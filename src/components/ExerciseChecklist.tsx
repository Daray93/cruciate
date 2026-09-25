import { useEffect, useState } from 'react'
import { motion, useDragControls } from 'motion/react'
import type { PanInfo } from 'motion/react'
import type { ExerciseDef, ExerciseLog, LoggedExercise } from '../types'
import { HoldTimerBadge } from './HoldTimerBadge'
import { IconEyeOff, IconInfoCircle } from './icons'
import './ExerciseChecklist.css'

interface ExerciseChecklistProps {
  exercises: ExerciseDef[]
  log: ExerciseLog
  loadCleared: boolean
  onChange: (exerciseId: string, setsCompleted: number, holdsCompleted?: number) => void
  onHide?: (exerciseId: string) => void
}

const emptyLog: LoggedExercise = { done: false, setsCompleted: 0, holdsCompleted: 0, weight: '', reps: '', rpe: '' }
const HIDE_ACTION_WIDTH = 88

function targetLabel(exercise: ExerciseDef, entry: LoggedExercise, hasSetPips: boolean): string {
  if (hasSetPips) return exercise.repsTarget
  // Multi-hold sets (e.g. 15 quad set holds per set): the counter shows holds,
  // so the label carries which set you're on.
  const inProgress = entry.setsCompleted > 0 || entry.holdsCompleted > 0
  if ((exercise.holdReps ?? 1) > 1 && inProgress && entry.setsCompleted < exercise.sets) {
    return `Set ${entry.setsCompleted + 1} of ${exercise.sets} · ${exercise.holdReps} holds`
  }
  if (exercise.sets > 0) return `${exercise.sets} × ${exercise.repsTarget}`
  return exercise.repsTarget
}

interface ExerciseRowProps {
  exercise: ExerciseDef
  entry: LoggedExercise
  locked: boolean
  hasInfo: boolean
  hasSetPips: boolean
  hasSetCounter: boolean
  infoOpen: boolean
  swipeOpen: boolean
  onToggleInfo: () => void
  onDragEnd: (info: PanInfo) => void
  onHide?: () => void
  onChange: (setsCompleted: number, holdsCompleted?: number) => void
  onSetTap: (setIndex: number) => void
}

function ExerciseRow({
  exercise,
  entry,
  locked,
  hasInfo,
  hasSetPips,
  hasSetCounter,
  infoOpen,
  swipeOpen,
  onToggleInfo,
  onDragEnd,
  onHide,
  onChange,
  onSetTap,
}: ExerciseRowProps) {
  const dragControls = useDragControls()
  const holdReps = exercise.holdReps ?? 1
  const allSetsDone = entry.setsCompleted >= exercise.sets

  // One finished hold. With holdReps > 1 it counts toward the current set and
  // rolls into the next set once the set's holds are done.
  function addHold() {
    if (allSetsDone) return
    const holds = entry.holdsCompleted + 1
    if (holds >= holdReps) onChange(entry.setsCompleted + 1, 0)
    else onChange(entry.setsCompleted, holds)
  }

  // Dragging is started manually (dragListener=false) so a tap on any
  // interactive control never gets mistaken for the start of a swipe —
  // relying on event propagation order to sort that out proved unreliable.
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!onHide) return
    if ((e.target as HTMLElement).closest('button, input')) return
    dragControls.start(e)
  }

  return (
    <li className={`exercise-row-swipe${locked ? ' locked' : ''}`}>
      {onHide && (
        <button
          type="button"
          className="exercise-row-hide-action"
          aria-label={`Hide ${exercise.name} from this phase`}
          onClick={onHide}
        >
          <IconEyeOff />
          Hide
        </button>
      )}

      <motion.div
        className="exercise-row"
        drag={onHide ? 'x' : false}
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ left: -HIDE_ACTION_WIDTH, right: 0 }}
        dragElastic={0.05}
        dragMomentum={false}
        animate={{ x: swipeOpen ? -HIDE_ACTION_WIDTH : 0 }}
        transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
        onPointerDown={handlePointerDown}
        onDragEnd={(_, info) => onDragEnd(info)}
      >
        {hasInfo && (
          <span className={`exercise-info${infoOpen ? ' open' : ''}`}>
            <button
              type="button"
              className="exercise-info-trigger"
              aria-label={`More about ${exercise.name}`}
              aria-expanded={infoOpen}
              onClick={onToggleInfo}
            >
              <IconInfoCircle />
            </button>
            <span className="exercise-info-tooltip" role="note">
              {exercise.instructions && <span className="exercise-info-line">{exercise.instructions}</span>}
              {exercise.purpose && <span className="exercise-info-line">{exercise.purpose}</span>}
              {exercise.cue && <span className="exercise-info-line">&ldquo;{exercise.cue}&rdquo;</span>}
              {exercise.frequencyNote && <span className="exercise-info-line">{exercise.frequencyNote}</span>}
              {exercise.equipment && <span className="exercise-info-line">Equipment: {exercise.equipment}</span>}
              {exercise.contraindications && (
                <span className="exercise-info-line exercise-info-warn">{exercise.contraindications}</span>
              )}
            </span>
          </span>
        )}

        <span className="exercise-row-name">{exercise.name}</span>

        <span className="exercise-row-target">{targetLabel(exercise, entry, hasSetPips)}</span>

        {exercise.holdSeconds ? (
          <HoldTimerBadge
            seconds={exercise.holdSeconds}
            onComplete={hasSetCounter ? addHold : undefined}
          />
        ) : null}

        {locked && (
          <span className="exercise-row-locked-label" title="Needs load clearance">
            Locked
          </span>
        )}

        {!locked && hasSetPips && (
          <span className="exercise-set-pips">
            {Array.from({ length: exercise.sets }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`exercise-set-pip${i < entry.setsCompleted ? ' filled' : ''}`}
                aria-label={`Set ${i + 1} of ${exercise.sets}${i < entry.setsCompleted ? ', done' : ''}`}
                aria-pressed={i < entry.setsCompleted}
                onClick={() => onSetTap(i)}
              />
            ))}
          </span>
        )}

        {/* No room for pips next to a timer badge, so a counter shows progress
            instead. Each finished hold timer (or a tap) adds one: sets for
            one-hold-per-set exercises, holds within the set otherwise. A tap once
            everything is done clears it. */}
        {!locked && hasSetCounter && (
          <button
            type="button"
            className={`exercise-row-counter${
              allSetsDone ? ' checked' : entry.setsCompleted > 0 || entry.holdsCompleted > 0 ? ' partial' : ''
            }`}
            aria-label={
              holdReps > 1 && !allSetsDone
                ? `${entry.holdsCompleted} of ${holdReps} holds, set ${entry.setsCompleted + 1} of ${exercise.sets}, for ${exercise.name}`
                : `${entry.setsCompleted} of ${exercise.sets} sets done for ${exercise.name}`
            }
            onClick={() => (allSetsDone ? onChange(0, 0) : addHold())}
          >
            {holdReps > 1 && !allSetsDone
              ? entry.holdsCompleted > 0
                ? entry.holdsCompleted
                : ''
              : entry.setsCompleted > 0
                ? entry.setsCompleted
                : ''}
          </button>
        )}

        {!locked && !hasSetPips && !hasSetCounter && (
          <button
            type="button"
            className={`exercise-row-checkbox${entry.done ? ' checked' : ''}`}
            role="checkbox"
            aria-checked={entry.done}
            aria-label={`Mark ${exercise.name} done`}
            onClick={() => onChange(entry.done ? 0 : Math.max(exercise.sets, 1))}
          />
        )}
      </motion.div>
    </li>
  )
}

export function ExerciseChecklist({ exercises, log, loadCleared, onChange, onHide }: ExerciseChecklistProps) {
  const [openInfoId, setOpenInfoId] = useState<string | null>(null)
  const [openSwipeId, setOpenSwipeId] = useState<string | null>(null)

  useEffect(() => {
    if (!openInfoId && !openSwipeId) return
    function handleClickOutside(e: MouseEvent) {
      if (!(e.target instanceof Element)) return
      if (openInfoId && !e.target.closest('.exercise-info')) setOpenInfoId(null)
      if (openSwipeId && !e.target.closest('.exercise-row-swipe')) setOpenSwipeId(null)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [openInfoId, openSwipeId])

  return (
    <ul className="exercise-list">
      {exercises.map((exercise) => {
        const locked = Boolean(exercise.requiresLoadClearance) && !loadCleared
        const entry = log[exercise.id] ?? emptyLog
        const hasInfo = Boolean(
          exercise.instructions ||
            exercise.purpose ||
            exercise.cue ||
            exercise.frequencyNote ||
            exercise.equipment ||
            exercise.contraindications,
        )
        // Hold-timer exercises with multiple sets get a numbered counter instead
        // of pips — pips + a timer badge in one row is too much going on.
        const hasSetPips = exercise.sets > 1 && !exercise.holdSeconds
        const hasSetCounter =
          Boolean(exercise.holdSeconds) && (exercise.sets > 1 || (exercise.holdReps ?? 1) > 1)

        return (
          <ExerciseRow
            key={exercise.id}
            exercise={exercise}
            entry={entry}
            locked={locked}
            hasInfo={hasInfo}
            hasSetPips={hasSetPips}
            hasSetCounter={hasSetCounter}
            infoOpen={openInfoId === exercise.id}
            swipeOpen={openSwipeId === exercise.id}
            onToggleInfo={() => setOpenInfoId((prev) => (prev === exercise.id ? null : exercise.id))}
            onDragEnd={(info) => {
              const shouldOpen = info.offset.x < -HIDE_ACTION_WIDTH / 2 || info.velocity.x < -400
              setOpenSwipeId(shouldOpen ? exercise.id : null)
            }}
            onHide={
              onHide
                ? () => {
                    onHide(exercise.id)
                    setOpenSwipeId(null)
                  }
                : undefined
            }
            onChange={(setsCompleted, holdsCompleted) => onChange(exercise.id, setsCompleted, holdsCompleted)}
            onSetTap={(setIndex) => {
              const target = setIndex + 1
              onChange(exercise.id, target === entry.setsCompleted ? setIndex : target)
            }}
          />
        )
      })}
    </ul>
  )
}
