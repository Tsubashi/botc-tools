'use client'
import {RoleToken} from '../../ui/RoleToken'
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
      <Formik
       initialValues={{ email: '', password: '' }}
       validate={values => {
         const errors = {};
         if (!values.email) {
           errors.email = 'Required';
         } else if (
           !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
         ) {
           errors.email = 'Invalid email address';
         }
         return errors;
       }}
       onSubmit={(values, { setSubmitting }) => {
         setTimeout(() => {
           alert(JSON.stringify(values, null, 2));
           setSubmitting(false);
         }, 400);
       }}
     >
       {({ isSubmitting }) => (
         <Form>
           <Field type="email" name="email" />
           <ErrorMessage name="email" component="div" />
           <Field type="password" name="password" />
           <ErrorMessage name="password" component="div" />
           <button type="submit" disabled={isSubmitting}>
             Submit
           </button>
         </Form>
       )}
     </Formik>
    </div>
  )
}