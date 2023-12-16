import React from 'react';
import Character from '../../Character/Character';
import styles from './Abilities.module.scss';

type PropsType = {
  character: Character,
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
