import React from 'react';
import { SpellFactory, SpellInterface } from '../../types';

type PropsType = {
  spell: SpellFactory<SpellInterface>
}

const Cantrip: React.FC<PropsType> = ({
  spell,
}) => (
  <div>
    { spell.name }
  </div>
)

export default Cantrip;
