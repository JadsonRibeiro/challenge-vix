import { InputHTMLAttributes } from "react";

import styles from "./input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export function Input({ name, ...rest }: InputProps) {
  return (
    <div className={styles.container}>
      <label htmlFor={name} >
        {name}
      </label>
      <input 
        id={name}
        {...rest}
      />
    </div>
  )
}