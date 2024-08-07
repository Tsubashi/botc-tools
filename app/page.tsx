'use client'
import {RoleToken} from './ui/RoleToken'
import { LoremIpsum } from 'lorem-ipsum';
import { useState } from 'react';

export default function Page() {
  const randomName = Array.from(Array(Math.floor(Math.random() * 36)), () => Math.floor(Math.random() * 36).toString(36)).join('');;
  const [roleName, setRoleName] = useState(randomName);
  const nonsenseAbility = new LoremIpsum().generateSentences(1);
  return (
    <div>
      <RoleToken
        diameter={256} 
        reminderCount={7}
        affectsSetup={true}
        firstNight={true}
        otherNights={true}
        name={roleName}
        ability={nonsenseAbility}
      />
    <RoleToken
      diameter={512} 
      reminderCount={7}
      affectsSetup={true}
      firstNight={true}
      otherNights={true}
      name={roleName}
      ability={nonsenseAbility}
    />
    <RoleToken
      diameter={768} 
      reminderCount={7}
      affectsSetup={true}
      firstNight={true}
      otherNights={true}
      name={roleName}
      ability={nonsenseAbility}
    />
    <br />
    <form>
      <input type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} />
    </form>
  </div>
  )
}