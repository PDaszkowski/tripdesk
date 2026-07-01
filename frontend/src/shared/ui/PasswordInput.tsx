import { useState, type InputHTMLAttributes, type Ref } from 'react';
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from 'react-icons/hi2';
import { Input } from '@/shared/ui/Input';

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'id'
> & {
  label?: string;
  error?: string;
  id?: string;
  ref?: Ref<HTMLInputElement>;
};

export function PasswordInput(props: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <Input
      type={show ? 'text' : 'password'}
      icon={<HiOutlineLockClosed size={18} />}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Ukryj hasło' : 'Pokaż hasło'}
          className="text-slate-500 transition-colors hover:text-slate-700"
        >
          {show ? <HiOutlineEyeSlash size={18} /> : <HiOutlineEye size={18} />}
        </button>
      }
      {...props}
    />
  );
}
