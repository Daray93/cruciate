import type { WeekProgram } from '../types'

export const program: WeekProgram[] = [
  {
    week: 1,
    phase: 'Prehab · Swelling & activation',
    days: [
      {
        dayKey: 'w1d1',
        label: 'Day 1',
        focus: 'Quad activation, swelling control',
        exercises: [
          { id: 'quad-sets', name: 'Quad sets', sets: 3, repsTarget: '10 x 5s hold' },
          { id: 'ankle-pumps', name: 'Ankle pumps', sets: 3, repsTarget: '20' },
          { id: 'heel-slides', name: 'Heel slides', sets: 3, repsTarget: '10' },
          { id: 'straight-leg-raise', name: 'Straight leg raise', sets: 3, repsTarget: '10' },
        ],
      },
      {
        dayKey: 'w1d2',
        label: 'Day 2',
        focus: 'ROM & patellar mobility',
        exercises: [
          { id: 'heel-props', name: 'Heel props (extension)', sets: 3, repsTarget: '5 min hold' },
          { id: 'patellar-mobs', name: 'Patellar mobilizations', sets: 2, repsTarget: '1 min' },
          { id: 'quad-sets', name: 'Quad sets', sets: 3, repsTarget: '10 x 5s hold' },
          { id: 'seated-heel-slides', name: 'Seated heel slides', sets: 3, repsTarget: '10' },
        ],
      },
    ],
  },
  {
    week: 2,
    phase: 'Prehab · Strength foundation',
    days: [
      {
        dayKey: 'w2d1',
        label: 'Day 1',
        focus: 'Closed-chain strength',
        exercises: [
          { id: 'mini-squats', name: 'Mini squats', sets: 3, repsTarget: '10' },
          { id: 'straight-leg-raise', name: 'Straight leg raise', sets: 3, repsTarget: '12' },
          { id: 'clamshells', name: 'Clamshells', sets: 3, repsTarget: '15' },
          { id: 'calf-raises', name: 'Calf raises', sets: 3, repsTarget: '15' },
        ],
      },
      {
        dayKey: 'w2d2',
        label: 'Day 2',
        focus: 'Balance & control',
        exercises: [
          { id: 'single-leg-balance', name: 'Single-leg balance', sets: 3, repsTarget: '30s' },
          { id: 'step-ups', name: 'Step-ups', sets: 3, repsTarget: '10' },
          { id: 'mini-squats', name: 'Mini squats', sets: 3, repsTarget: '10' },
          { id: 'bridges', name: 'Glute bridges', sets: 3, repsTarget: '12' },
        ],
      },
    ],
  },
  {
    week: 3,
    phase: 'Rehab · Loaded strength',
    days: [
      {
        dayKey: 'w3d1',
        label: 'Day 1',
        focus: 'Loaded strength (clearance required)',
        exercises: [
          { id: 'leg-press', name: 'Leg press', sets: 3, repsTarget: '10', requiresLoadClearance: true },
          { id: 'walking-lunges', name: 'Walking lunges', sets: 3, repsTarget: '10/leg', requiresLoadClearance: true },
          { id: 'single-leg-balance', name: 'Single-leg balance', sets: 3, repsTarget: '30s' },
          { id: 'calf-raises', name: 'Calf raises', sets: 3, repsTarget: '15' },
        ],
      },
      {
        dayKey: 'w3d2',
        label: 'Day 2',
        focus: 'Control & stability',
        exercises: [
          { id: 'step-downs', name: 'Step-downs', sets: 3, repsTarget: '10', requiresLoadClearance: true },
          { id: 'single-leg-squat', name: 'Single-leg squat (assisted)', sets: 3, repsTarget: '8', requiresLoadClearance: true },
          { id: 'bridges', name: 'Glute bridges', sets: 3, repsTarget: '12' },
          { id: 'clamshells', name: 'Clamshells', sets: 3, repsTarget: '15' },
        ],
      },
    ],
  },
]
