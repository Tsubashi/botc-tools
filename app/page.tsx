'use client'
import {RoleToken} from './ui/RoleToken'
import { LoremIpsum } from 'lorem-ipsum';
import { useForm, SubmitHandler, UseFormRegister } from "react-hook-form"

interface FormValues {
  role: string;
  ability: string;
  reminders: string[];
  affectsSetup: boolean;
  firstNight: boolean;
  otherNights: boolean;
}

type FormValueName = keyof FormValues

function textField(name: FormValueName, register: UseFormRegister<FormValues>, label: string) {
  return(
    <>
      <input {...register(name)} 
        className='block 
                   py-2.5 px-0 
                   w-full 
                   text-sm text-gray-900 
                   bg-transparent 
                   border-0 border-b-2 border-gray-300 
                   appearance-none 
                   focus:outline-none focus:ring-0 focus:border-blue-600 
                   peer'
      />
      <label htmlFor={name} 
        className='peer-focus:font-medium 
                   absolute 
                   text-sm text-gray-500
                   duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
      >
        {label}
      </label>
    </>
  )
};

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
      <div id="roleToken-box" 
        className='rounded-t-lg md:rounded-lg 
                   p-2 
                   mx-auto 
                   border-emerald-800 md:border-4 
                   bg-black bg-opacity-50 
                   shadow-lg md:shadow-black'>
        {/* 
        Since the RoleToken component doesn't resize, we use a custom breakpoint to hide it if the screen is too small 
        This breakpoint should be equal to the size of the RoleToken component + padding + border (ie. 350px + 2*8px + 2*4px = 360px)
        */} 
        <div className='hidden min-[364px]:block w-fit mx-auto'> 
          <RoleToken
            diameter={350} 
            reminderCount={watch('reminders')?.length || 0}
            affectsSetup={watch('affectsSetup')}
            firstNight={watch('firstNight')}
            otherNights={watch('otherNights')}
            name={watch('role')}
            ability={watch('ability')}
          />
        </div>
        <p className='text-white text-center min-[364px]:hidden'>Unfortunately, your screen is too small to display the token.</p>
      </div>
      <div id="roleToken-form" 
        className='w-full
                   rounded-b-lg md:rounded-lg 
                   p-2 
                   border-emerald-800 md:border-4 
                   mx-auto md:ml-4 grid grid-cols-1 gap-6 
                   bg-opacity-90 bg-white 
                   shadow-lg shadow-black'
      >
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm'>
          <div className='relative z-0 w-full mb-5 group'>
            {textField("role", register, "Role")}
          </div>
          <div className='relative z-0 w-full mb-5 group'>
            {textField("ability", register, "Ability")}
          </div>
          <div className='relative z-0 w-full mb-5 group'>
            <input {...register("reminders")} />
            <label htmlFor="reminders">Reminders</label>
          </div>
          <div className='relative z-0 w-full mb-5 group'>
            <input type="checkbox" {...register("affectsSetup")} />
            <label htmlFor="affectsSetup">Affects Setup</label>
          </div>
          <div className='relative z-0 w-full mb-5 group'>
            <p>Nights:</p>
            <input type="checkbox" {...register("firstNight")} />
            <label htmlFor="firstNight">First</label>

            <input type="checkbox" {...register("otherNights")} />
            <label htmlFor="otherNights">Other</label>
          </div>
          <button type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  )
}