import React from 'react';
import styles from './ActionBar.module.scss';
import MeleeAction from './MeleeAction';
import RangeAction from './RangeAction';
import SpellAction from './SpellAction';
import Action from './Action';
import Actor from '../../Character/Actor';

type PropsType = {
  actor: Actor,
}

const ActionBar: React.FC<PropsType> = ({
  actor,
}) => (
  <div>
    <div className={styles.list}>
      {
        actor.character.equipped.meleeWeapon
          ? <MeleeAction actor={actor} />
          : null
      }
      {
        actor.character.equipped.rangeWeapon
          ? <RangeAction actor={actor} />
          : null
      }
      {
        actor.character.spells.map((s) => (
          <SpellAction actor={actor} spell={s} />
        ))
      }
      {
        actor.character.charClass.actions.map((a) => (
          <Action actor={actor} action={a} />
        ))
      }
    </div>
  </div>
)

export default ActionBar;