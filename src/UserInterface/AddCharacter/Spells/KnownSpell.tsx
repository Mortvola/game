import React from 'react';
import SpellComponent, { ItemTypes } from './Spell';
import Spell from '../../../Character/Spells/Spell';

export type KnownSpell = {
  prepared: boolean,
  spell: Spell,
}

type PropsType = {
  spell: KnownSpell,
  disable: boolean,
  onChange: () => void,
}

const KnownSpellComponent: React.FC<PropsType> = ({
  spell,
  disable,
  onChange,
}) => {
  const [prepared, setPrepared] = React.useState<boolean>(spell.prepared);

  const handlePreparedChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setPrepared(event.target.checked)
    spell.prepared = event.target.checked;

    onChange()
  }

  return (
    <label>
      <input type="checkbox" checked={prepared} onChange={handlePreparedChange} disabled={!prepared && disable} />
      <SpellComponent key={spell.spell.name} spell={spell.spell} type={ItemTypes.KNOWN_SPELL} />
    </label>
  )
}

export default KnownSpellComponent;
