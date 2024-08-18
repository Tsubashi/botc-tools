'use client'
import {RoleToken} from '../../ui/RoleToken'
import { LoremIpsum } from 'lorem-ipsum';
import { useForm, SubmitHandler } from "react-hook-form"

interface FormValues {
  role: string;
  ability: string;
  reminders: string[];
  affectsSetup: boolean;
  firstNight: boolean;
  otherNights: boolean;
}

export default function Page() {
  const {register, handleSubmit, watch, formState: { errors },} = useForm<FormValues>({
    defaultValues: { 
      role: Array.from(Array(Math.floor(Math.random() * 36)), () => Math.floor(Math.random() * 36).toString(36)).join(''), 
      ability: new LoremIpsum().generateSentences(1),
      reminders: [],
      affectsSetup: false,
      firstNight: false,
      otherNights: false
    }
  });
  const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data)

  return (
    <div className="md:flex">
      <div id="roleToken-container" className='w-fit rounded-lg p-2 border-emerald-800 border-4 mx-auto'>
        <RoleToken
          diameter={512} 
          reminderCount={watch('reminders')?.length || 0}
          affectsSetup={watch('affectsSetup')}
          firstNight={watch('firstNight')}
          otherNights={watch('otherNights')}
          name={watch('role')}
          ability={watch('ability')}
        />
      </div>
      <div id="roleToken-form" className='w-full rounded-lg p-2 border-emerald-800 md:border-4 mx-auto md:mx-4'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="role">Role</label>
          <input {...register("role")} />
          <label htmlFor="ability">Ability</label>
          <input {...register("ability")} />
          <label htmlFor="reminders">Reminders</label>
          <input {...register("reminders")} />
          <label htmlFor="affectsSetup">Affects Setup</label>
          <input type="checkbox" {...register("affectsSetup")} />
          <label htmlFor="firstNight">First Night</label>
          <input type="checkbox" {...register("firstNight")} />
          <label htmlFor="otherNights">Other Nights</label>
          <input type="checkbox" {...register("otherNights")} />
          <button type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  )
}