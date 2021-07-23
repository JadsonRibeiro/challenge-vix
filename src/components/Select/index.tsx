import { SelectHTMLAttributes } from "react";

import styles from "./status-select.module.scss";

export function StatusSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={styles.select} {...props}>
      <option value="">-- status --</option>
      <option value="pending">Pendente</option>
      <option value="canceled">Cancelado</option>
      <option value="completed">Completo</option>
    </select>
  )
}