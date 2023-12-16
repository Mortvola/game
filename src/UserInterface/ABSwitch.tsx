import React from 'react';
import styles from './ABSwitch.module.scss';
import SwitchEntry from './SwitchEntry';

type PropsType = {
  labels: string[],
  value?: number,
  onChange: (value: number) => void,
}

const ABSwitch: React.FC<PropsType> = ({
  labels,
  value,
  onChange,
}) => {
  const [state, setState] = React.useState<number>(value ?? 0);

  const handleClick = (value: number) => {
    setState(value)
    onChange(value)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.outer}>
        <div
          className={`${styles.slider}`}
          style={{ width: `${100 / labels.length}%`, left: `${(100 / labels.length) * state}%` }}
        />
        <div className={styles.inner} style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>
          {
            labels.map((l, index) => (
              <SwitchEntry key={l} label={l} value={index} onClick={handleClick} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default ABSwitch;
