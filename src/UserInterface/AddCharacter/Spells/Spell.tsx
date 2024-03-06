import React from 'react';
import { useDrag } from 'react-dnd';
import Spell from '../../../Character/Actions/Spells/Spell';
import { R } from '../../../types';

export enum ItemTypes {
  SPELL = 'spell',
  KNOWN_SPELL = 'known spell',
  PREPARED_SPELL = 'prepared spell',
}

type PropsType = {
  spell: R<Spell>,
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
