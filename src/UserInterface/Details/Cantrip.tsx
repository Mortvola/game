import React from 'react';
import { R } from '../../Character/Actions/Spells/Spells';
import Spell from '../../Character/Actions/Spells/Spell';

type PropsType = {
  spell: R<Spell>
}

const Cantrip: React.FC<PropsType> = ({
  spell,
}) => (
  <div>
    { spell.name }
  </div>
)

export default Cantrip;
