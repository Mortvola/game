import React from 'react';
import { useDrag } from 'react-dnd';
import Spell from '../../../Character/Spells/Spell';

export enum ItemTypes {
  SPELL = 'spell',
  KNOWN_SPELL = 'known spell',
  PREPARED_SPELL = 'prepared spell',
}

type PropsType = {
  spell: Spell,
  type: ItemTypes,
}

const SpellComponent: React.FC<PropsType> = ({
  spell,
  type,
}) => {
  const [, drag] = useDrag(() => ({
    type,
    item: spell,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))

  return (
    <div ref={drag}>{spell.name}</div>
  )
}

export default SpellComponent;
