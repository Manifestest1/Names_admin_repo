import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'secondary',
      text: 'NEW',
    },
  },
 
  {
    component: CNavItem,
    name: 'GodNames',
    to: '/godnames',
    // Add other properties as needed
  },

  {
    component: CNavItem,
    name: 'AllNames',
    to: '/allnames',
    // Add other properties as needed
  }
]

export default _nav
