import React from 'react';
import styles from './ActionBar.module.scss';
import MeleeAction from './MeleeAction';
import RangeAction from './RangeAction';
import SpellAction from './SpellAction';
import Action from './Action';
import { CreatureActorInterface } from '../../types';

type PropsType = {
  actor: CreatureActorInterface,
}

const Actions: React.FC<PropsType> = ({
  actor,
}) => (
  <div className={styles.actions}>
    <div className={styles.common}>
      <MeleeAction actor={actor} />
      <RangeAction actor={actor} />
    </div>
    <div className={styles.actionList}>
      {
        actor.character.spells.map((s) => (
          <SpellAction key={s.name} actor={actor} spell={s} />
        ))
      }
      {
        actor.character.cantrips.map((s) => (
          <SpellAction key={s.name} actor={actor} spell={s} />
        ))
      }
      {
        actor.character.charClass.actions.map((a) => (
          <Action key={a.name} actor={actor} action={a} />
        ))
      }
    </div>
  </div>
)

export default Actions;