import React from 'react';
import SelectClass from './SelectClass';
import CharacterClass from '../../Character/Classes/CharacterClass';

type PropsType = {
  value: CharacterClass,
  onChange: (charClass: string) => void,
}

const CharClass: React.FC<PropsType> = ({
  value,
  onChange,
}) => (
  <SelectClass value={value.name} onChange={onChange} />
)

export default CharClass;
