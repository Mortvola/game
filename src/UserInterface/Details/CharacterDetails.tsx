import React from 'react';
import styles from './CharacterDetails.module.scss';
import Abilities from './Abilities';
import Inventory from './Inventory';
import Equipped from './Equipped';
import { CharacterInterface } from '../../types';

type PropsType = {
  character: CharacterInterface | null,
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
      <div className={styles.left}>
        <Equipped character={character} />
        <Inventory character={character} />
      </div>

      <div>
        <div>
          <Abilities character={character} />
          <div className={styles.section}>
            <div>
              <div>Hit Points</div>
              <div>{character?.maxHitPoints}</div>
            </div>
            <div>
              <div>Armor Class</div>
              <div>{character?.armorClass}</div>
            </div>
          </div>
          <div className={styles.section}>
            <div>
              <div>Level</div>
              <div>{character?.charClass.level}</div>
            </div>
            <div>
              <div>Exp Points</div>
              <div>{character?.experiencePoints}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CharacterDetails;
