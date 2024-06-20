'use client'
import {TokenCanvas} from './ui/TokenCanvas'

export default function Page() {
  return (
    <div>
      <TokenCanvas
       diameter={512} 
       reminderCount={7}
        affectsSetup={true}
        firstNight={true}
        otherNights={true}
        name="Test-y Roleieio"
        ability='Once before the game, define an ability here.'
      />
    </div>
  )
}