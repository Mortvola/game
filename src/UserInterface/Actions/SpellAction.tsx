import React from 'react';
import styles from './ActionBar.module.scss';
import Spell from '../../Character/Actions/Spells/Spell';
import { R } from '../../Character/Actions/Spells/Spells';
import Actor from '../../Character/Actor';

type PropsType = {
  actor: Actor,
  spell: R<Spell>,
}

const SpellAction: React.FC<PropsType> = ({
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
      actor.setAction(new spell.spell(actor));
    }
  }

  let className = styles.action;
  if (spell.time === 'Bonus') {
    className = `${className} ${styles.bonus}`;
  }

  if (!isAvailable()) {
    className = `${className} ${styles.disabled}`
  }

  return (
    <div
      className={className}
      onClick={handleClick}
    >
      {spell.name}
    </div>
  )
}

export default SpellAction;
