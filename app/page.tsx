'use client'
import {TokenCanvas} from './ui/TokenCanvas'

export default function Page() {
  const randomName = Array.from(Array(Math.floor(Math.random() * 36)), () => Math.floor(Math.random() * 36).toString(36)).join('');;
  return (
    <div>
      <TokenCanvas
       diameter={512} 
       reminderCount={7}
        affectsSetup={true}
        firstNight={true}
        otherNights={true}
        name={randomName}
        ability='Once before the game, define an ability here.'
      />
    </div>
  )
}