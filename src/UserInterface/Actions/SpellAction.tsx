import React from 'react';
import styles from './ActionBar.module.scss';
import { CreatureActorInterface, SpellFactory, SpellInterface } from '../../types';
import { observer } from 'mobx-react-lite';

type PropsType = {
  actor: CreatureActorInterface,
  spell: SpellFactory<SpellInterface>,
}

const SpellAction: React.FC<PropsType> = observer(({
  actor,
  spell,
}) => {
  const isAvailable = (): boolean => {
    return (
      ((spell.time === 'Action' && actor.character.actionsLeft > 0)
      || (spell.time === 'Bonus' && actor.character.bonusActionsLeft > 0))
      && (spell.level === 0 || actor.character.spellSlots[spell.level - 1] > 0)
    )
  }

  const handleClick = () => {
    if (isAvailable()) {
      actor.setAction(spell);
    }
  }

  let className = styles.action;
  if (spell.time === 'Bonus') {
    className = `${className} ${styles.bonus}`;
  }

  if (!isAvailable()) {
    className = `${className} ${styles.disabled}`
  }
  else if (actor.getAction() === spell) {
    className = `${className} ${styles.selected}`
  }

  return (
    <div
      className={className}
      onClick={handleClick}
    >
      {spell.name}
    </div>
  )
})

export default SpellAction;
