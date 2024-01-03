import React from 'react';
import { FocusInfo } from '../WorldInterface';

type PropsType = {
  focused: FocusInfo | null,
}

const Focused: React.FC<PropsType> = ({
  focused,
}) => {
  if (focused) {
    return (
      <div>
        <div>
          {
            `${focused.name} HP: ${focused.hitpoints}/${focused.maxHitpoints} AC: ${focused.armorClass}`
          }
        </div>
        <div>
          {
            focused.conditions.map((c) => (
              <div>{c.name}</div>
            ))
          }
        </div>
      </div>
    )
  }

  return null;
}

export default Focused;
