import React from 'react';
import Character from './Character/Character';

type PropsType = {
  className?: string,
  character: Character,
  onClick: (character: Character) => void,
}

const CharacterEntry: React.FC<PropsType> = ({
  className,
  character,
  onClick,
}) => {
  const handleClick = () => {
    onClick(character)
  }

  return (
    <div className={className} onClick={handleClick}>
      <div>{character.name}</div>
      <div>{`Level ${character.charClass.level} ${character.race.name} ${character.charClass.name}`}</div>
    </div>
  )
}

export default CharacterEntry;
