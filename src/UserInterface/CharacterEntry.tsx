import React from 'react';
import Character from '../Character/Character';

type PropsType = {
  className?: string,
  member: { included: boolean, character: Character },
  onClick: (character: Character) => void,
  onDelete: (character: Character) => void,
}

const CharacterEntry: React.FC<PropsType> = ({
  className,
  member,
  onClick,
  onDelete,
}) => {
  const [included, setIncluded] = React.useState<boolean>(member.included);

  const handleClick = () => {
    onClick(member.character)
  }

  const handleDeleteClick = () => {
    onDelete(member.character)
  }

  const handleAutomateChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setIncluded(event.target.checked);
    member.included = event.target.checked;
  }

  return (
    <div className={className}>
      <input type="checkbox" checked={included} onChange={handleAutomateChange} />
      <div onClick={handleClick}>
        <div>{member.character.name}</div>
        <div>{`Level ${member.character.charClass.level} ${member.character.race.name} ${member.character.charClass.name}`}</div>
      </div>
      <div onClick={handleDeleteClick}>X</div>
    </div>
  )
}

export default CharacterEntry;
