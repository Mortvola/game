import React from 'react';
import { FocusInfo } from '../WorldInterface';
import styles from './Focused.module.scss';

type PropsType = {
  focused: FocusInfo | null,
}

const Focused: React.FC<PropsType> = ({
  focused,
}) => {
  if (focused) {
    return (
      <div>
        <div className={styles.name}>
          <div>
            {focused.name}
          </div>
          <div>
            {
              `HP: ${focused.hitpoints}/${focused.maxHitpoints}`
            }
            {
              focused.temporaryHitpoints
                ? ` + ${focused.temporaryHitpoints}`
                : ''
            }
          </div>
          <div>
            {`AC: ${focused.armorClass}`}
          </div>
        </div>
        <div>
          {
            focused.conditions.map((c) => (
              <div>{`${c.name} (${c.duration / 6})`}</div>
            ))
          }
        </div>
      </div>
    )
  }

  return null;
}

export default Focused;
