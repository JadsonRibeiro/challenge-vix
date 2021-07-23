import { ButtonHTMLAttributes } from "react";

import styles from "./button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ children, ...rest }: ButtonProps) {
  return (
    <button
      className={styles.container}
      {...rest}
    >
      {children}
    </button>
  )
}