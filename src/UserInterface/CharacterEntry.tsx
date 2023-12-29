import React from 'react';
import Character from '../Character/Character';

type PropsType = {
  className?: string,
  character: Character,
  onClick: (character: Character) => void,
  onDelete: (character: Character) => void,
}

const CharacterEntry: React.FC<PropsType> = ({
  className,
  character,
  onClick,
  onDelete,
}) => {
  const handleClick = () => {
    onClick(character)
  }

  const handleDeleteClick = () => {
    onDelete(character)
  }

  return (
    <div className={className}>
      <div onClick={handleClick}>
        <div>{character.name}</div>
        <div>{`Level ${character.charClass.level} ${character.race.name} ${character.charClass.name}`}</div>
      </div>
      <div onClick={handleDeleteClick}>X</div>
    </div>
  )
}

export default CharacterEntry;
