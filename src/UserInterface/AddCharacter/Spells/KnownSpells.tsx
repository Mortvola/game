import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './Spell';
import styles from '../AddCharacter.module.scss';
import Spell from '../../../Character/Actions/Spells/Spell';
import KnownSpellComponent, { KnownSpell } from './KnownSpell';
import { SpellFactory } from '../../../types';

type PropsType = {
  knownSpells: KnownSpell[],
  maxKnownSpells: number,
  maxPreparedSpells: number,
  onChange: (spells: KnownSpell[]) => void,
}

const KnownSpells: React.FC<PropsType> = ({
  knownSpells,
  maxKnownSpells,
  maxPreparedSpells,
  onChange,
}) => {  
  const moveSpell = React.useCallback((spell: SpellFactory<Spell>) => {
    onChange([
      ...knownSpells,
      {
        prepared: false,
        spell,
      }
    ]);
  }, [knownSpells, onChange])

  const checkDrop = React.useCallback((spell: SpellFactory<Spell>): boolean => (
    knownSpells.length < maxKnownSpells
    && !knownSpells.some((s) => s.spell.name === spell.name)
  ), [knownSpells, maxKnownSpells])

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.SPELL,
    drop: moveSpell,
    canDrop: checkDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    })
  }), [knownSpells, onChange])

  const countPreparedSpells = (): number => (
    knownSpells.reduce((sum, spell) => (sum + (spell.prepared ? 1 : 0)), 0)
  )

  const [numPrepared, setNumPrepared] = React.useState<number>(countPreparedSpells());

  const handleChange = () => {
    setNumPrepared(countPreparedSpells())
  }

  return (
    <div ref={drop} className={`${styles.spellsKnown} ${isOver && canDrop ? styles.isOver : ''}`}>
      {
        knownSpells.map((spell) => (
          <KnownSpellComponent spell={spell} onChange={handleChange} disable={numPrepared === maxPreparedSpells} />
        ))
      }
    </div>
  )
}

export default KnownSpells;
