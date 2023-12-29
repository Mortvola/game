import React from 'react';
import styles from './ActionBar.module.scss';
import Creature from '../../Character/Creature';
import MeleeAction from './MeleeAction';
import RangeAction from './RangeAction';
import SpellAction from './SpellAction';

type PropsType = {
  character: Creature,
}

const ActionBar: React.FC<PropsType> = ({
  character,
}) => (
  <div>
    <div className={styles.list}>
      {
        character.equipped.meleeWeapon
          ? <MeleeAction character={character} />
          : null
      }
      {
        character.equipped.rangeWeapon
          ? <RangeAction character={character} />
          : null
      }
      {
        character.spells.filter((s) => s.prepared).map((s) => (
          <SpellAction character={character} spell={s.spell} />
        ))
      }
    </div>
  </div>
)

export default ActionBar;