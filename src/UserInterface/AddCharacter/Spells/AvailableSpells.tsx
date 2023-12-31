import React from 'react';
import { useDrop } from 'react-dnd';
import SpellComponent, { ItemTypes } from './Spell';
import styles from '../AddCharacter.module.scss';
import Spell from '../../../Character/Actions/Spells/Spell';
import { R } from '../../../Character/Actions/Spells/Spells';

type PropsType = {
  spells: R<Spell>[],
  onChange: (spells: R<Spell>[]) => void,
}

const AvailableSpells: React.FC<PropsType> = ({
  spells,
  onChange,
}) => {  
  const moveSpell = React.useCallback((spell: R<Spell>) => {
    onChange([
      ...spells,
      spell,
    ]);
  }, [spells, onChange])

  const checkDrop = React.useCallback((spell: R<Spell>): boolean => (
    !spells.includes(spell)
  ), [spells])

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.KNOWN_SPELL,
    drop: moveSpell,
    canDrop: checkDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    })
  }), [spells, onChange])

  return (
    <div ref={drop} className={`${styles.spellsKnown} ${isOver && canDrop ? styles.isOver : ''}`}>
      {
        spells.map((spell) => (
          <SpellComponent key={spell.name} spell={spell} type={ItemTypes.SPELL} />
        ))
      }
    </div>
  )
}

export default AvailableSpells;
