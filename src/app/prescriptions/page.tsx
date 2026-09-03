import { redirect } from 'next/navigation'

export default function PrescriptionsRedirect() {
  redirect('/medical-guide?tab=prescriptions')
}
