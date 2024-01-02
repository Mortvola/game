import React from 'react';
import { R } from '../../Character/Actions/Spells/Spells';
import Spell from '../../Character/Actions/Spells/Spell';

export type KnownSpell = {
  prepared: boolean,
  spell: R<Spell>,
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
