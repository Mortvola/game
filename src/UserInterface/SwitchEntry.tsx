import React from 'react';
import styles from './ABSwitch.module.scss';

type PropsType = {
  label: string,
  value: number,
  onClick: (valiue: number) => void,
}

const SwitchEntry: React.FC<PropsType> = ({
  label,
  value,
  onClick,
}) => {
  const handleClick = () => {
    onClick(value);
  }

  return (
    <div className={styles.label} onClick={(handleClick)}>{label}</div>
  )
}

export default SwitchEntry;
