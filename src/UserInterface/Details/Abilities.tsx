import React from 'react';
import styles from './Abilities.module.scss';
import { CharacterInterface } from '../../types';

type PropsType = {
  character: CharacterInterface,
}

const Abilities: React.FC<PropsType> = ({
  character,
}) => (
  <div className={styles.abilities}>
    <div>
      <div>Strength</div>
      <div>{character?.abilityScores.strength}</div>
    </div>
    <div>
      <div>Constitution</div>
      <div>{character?.abilityScores.constitution}</div>
    </div>
    <div>
      <div>Dexterity</div>
      <div>{character?.abilityScores.dexterity}</div>
    </div>
    <div>
      <div>Intelligence</div>
      <div>{character?.abilityScores.intelligence}</div>
    </div>
    <div>
      <div>Wisdom</div>
      <div>{character?.abilityScores.wisdom}</div>
    </div>
    <div>
      <div>Charisma</div>
      <div>{character?.abilityScores.charisma}</div>
    </div>
  </div>
)

export default Abilities;
