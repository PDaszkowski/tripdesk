import { RegisterForm } from '../components/RegisterForm'
import styles from './RegisterPage.module.css'

/** Pełny widok rejestracji — logika formularza w ../components/RegisterForm.tsx */
export function RegisterPage() {
  return (
    <div className={styles.shell}>
      <RegisterForm />
    </div>
  )
}
