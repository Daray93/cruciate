import { supabase } from '../lib/supabase'
import { nextPhase } from '../lib/phases'
import type { PhaseId } from '../lib/phases'

export interface CheckinAnswer {
  questionId: string
  response: string
  passed: boolean
}

export function useMilestoneCheckins(userId: string) {
  async function submitCheckin(
    phaseTarget: PhaseId,
    answers: CheckinAnswer[],
  ): Promise<{ passed: boolean; advancedTo: PhaseId | null }> {
    const rows = answers.map((answer) => ({
      user_id: userId,
      phase_target: phaseTarget,
      question_id: answer.questionId,
      response: answer.response,
      passed: answer.passed,
    }))
    await supabase.from('milestone_checkins').insert(rows)

    const passed = answers.every((answer) => answer.passed)
    let advancedTo: PhaseId | null = null

    if (passed) {
      const next = nextPhase(phaseTarget)
      if (next) {
        await supabase
          .from('user_profile')
          .update({ current_phase: next, phase_advanced_at: new Date().toISOString(), phase_advanced_by: 'milestone' })
          .eq('user_id', userId)
        advancedTo = next
      }
    }

    return { passed, advancedTo }
  }

  async function overridePhase(phaseTarget: PhaseId): Promise<PhaseId | null> {
    const next = nextPhase(phaseTarget)
    if (!next) return null
    await supabase
      .from('user_profile')
      .update({ current_phase: next, phase_advanced_at: new Date().toISOString(), phase_advanced_by: 'override' })
      .eq('user_id', userId)
    return next
  }

  return { submitCheckin, overridePhase }
}
