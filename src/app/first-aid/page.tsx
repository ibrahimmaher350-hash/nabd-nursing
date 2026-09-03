import { redirect } from 'next/navigation'

export default function FirstAidRedirect() {
  redirect('/medical-guide?tab=first-aid')
}
