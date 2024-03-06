import React from 'react';
import { SpellFactory, SpellInterface } from '../../types';

export type KnownSpell = {
  prepared: boolean,
  spell: SpellFactory<SpellInterface>,
}

type PropsType = {
  spell: KnownSpell,
  disable: boolean,
  onChange?: (spell: KnownSpell) => void,
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

    if (onChange) {
      onChange(spell)
    }
  }

  return (
    <label>
      <input type="checkbox" checked={prepared} onChange={handlePreparedChange} disabled={!prepared && disable} />
      <div>{spell.spell.name}</div>
    </label>
  )
}

export default KnownSpellComponent;
