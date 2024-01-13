import React from 'react';
import { R, SpellInterface } from '../../types';

type PropsType = {
  spell: R<SpellInterface>
}

const Cantrip: React.FC<PropsType> = ({
  spell,
}) => (
  <div>
    { spell.name }
  </div>
)

export default Cantrip;
