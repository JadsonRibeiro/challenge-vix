import { TextareaHTMLAttributes } from "react";

import styles from "./textarea.module.scss";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

export function Textarea({ name, ...rest }: TextareaProps) {
  return (
    <div className={styles.container}>
      <label htmlFor={name}>
        {name}
      </label>
      <textarea
        id={name}
        {...rest}
      />
    </div>
  )
}