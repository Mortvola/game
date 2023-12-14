import React from 'react';
import Character from './Character/Character';
import styles from './CharacterDetails.module.scss';

type PropsType = {
  character: Character | null,
}

const CharacterDetails: React.FC<PropsType> = ({
  character,
}) => {
  
  if (character === null) {
    return (
      <div>Select a character to view their details.</div>
    )
  }
  
  return (
    <div className={styles.wrapper}>
      <div>
      <div className={styles.labeledValue}>
        <div>Strength</div>
        <div>{character?.abilityScores.strength}</div>
      </div>
      <div className={styles.labeledValue}>
        <div>Constitution</div>
        <div>{character?.abilityScores.constitution}</div>
      </div>
      <div className={styles.labeledValue}>
        <div>Dexterity</div>
        <div>{character?.abilityScores.dexterity}</div>
      </div>
      <div className={styles.labeledValue}>
        <div>Intelligence</div>
        <div>{character?.abilityScores.intelligence}</div>
      </div>
      <div className={styles.labeledValue}>
        <div>Wisdom</div>
        <div>{character?.abilityScores.wisdom}</div>
      </div>
      <div className={styles.labeledValue}>
        <div>Charisma</div>
        <div>{character?.abilityScores.charisma}</div>
      </div>
      </div>
      <div className={styles.labeledValue}>
        <div>Hit Points</div>
        <div>{character?.hitPoints}</div>
      </div>
      <div className={styles.labeledValue}>
        <div>Armor Class</div>
        <div>{character?.armorClass}</div>
      </div>
    </div>
  )
}

export default CharacterDetails;
