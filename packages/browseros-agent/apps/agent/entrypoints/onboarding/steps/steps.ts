import { StepConnectApps } from './StepConnectApps'
import { StepGoals } from './StepGoals'
import { StepOne } from './StepOne'
import { StepTwo } from './StepTwo'
import { StepVision } from './StepVision'
import { StepWorkStyle } from './StepWorkStyle'

export const steps = [
  {
    id: 1,
    name: 'About You',
    component: StepOne,
  },
  {
    id: 2,
    name: 'Vision',
    component: StepVision,
  },
  {
    id: 3,
    name: 'Goals',
    component: StepGoals,
  },
  {
    id: 4,
    name: 'Work & AI',
    component: StepWorkStyle,
  },
  {
    id: 5,
    name: 'Connect Apps',
    component: StepConnectApps,
  },
  {
    id: 6,
    name: 'Sign In',
    component: StepTwo,
  },
]
