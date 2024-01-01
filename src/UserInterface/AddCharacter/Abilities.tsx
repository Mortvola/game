import React from 'react';
import styles from './AddCharacter.module.scss'
import { Race } from '../../Character/Races/Race';
import { AbilityScores } from '../../Character/Races/AbilityScores';

type PropsType = {
  scores: AbilityScores | null,
  race: Race | null,
}

const Abilities: React.FC<PropsType> = ({
  scores,
  race,
}) => (
  <div>
    <div className={styles.ability}>
      <div>
        Strength
      </div>
      <div>
        {scores?.strength}
      </div>
      <div>
        {race?.abilityIncrease.strength === 0 ? '' : `+${race?.abilityIncrease.strength }`}
      </div>
      <div>
        {(scores?.strength ?? 0) + (race?.abilityIncrease.strength ?? 0)}
      </div>
    </div>
    <div className={styles.ability}>
      <div>
        Constitution
      </div>
      <div>
        {scores?.constitution}
      </div>
      <div>
        {race?.abilityIncrease.constitution === 0 ? '' : `+${race?.abilityIncrease.constitution }`}
      </div>
      <div>
        {(scores?.constitution ?? 0) + (race?.abilityIncrease.constitution ?? 0)}
      </div>
    </div>
    <div className={styles.ability}>
      <div>
        Dexterity
      </div>
      <div>
        {scores?.dexterity}
      </div>
      <div>
        {race?.abilityIncrease.dexterity === 0 ? '' : `+${race?.abilityIncrease.dexterity }`}
      </div>
      <div>
        {(scores?.dexterity ?? 0) + (race?.abilityIncrease.dexterity ?? 0)}
      </div>
    </div>
    <div className={styles.ability}>
      <div>
        Intelligence
      </div>
      <div>
        {scores?.intelligence}
      </div>
      <div>
        {race?.abilityIncrease.intelligence === 0 ? '' : `+${race?.abilityIncrease.intelligence }`}
      </div>
      <div>
        {(scores?.intelligence ?? 0) + (race?.abilityIncrease.intelligence ?? 0)}
      </div>
    </div>
    <div className={styles.ability}>
      <div>
        Wisdom
      </div>
      <div>
        {scores?.wisdom}
      </div>
      <div>
        {race?.abilityIncrease.wisdom === 0 ? '' : `+${race?.abilityIncrease.wisdom }`}
      </div>
      <div>
        {(scores?.wisdom ?? 0) + (race?.abilityIncrease.wisdom ?? 0)}
      </div>
    </div>
    <div className={styles.ability}>
      <div>
        Charisma
      </div>
      <div>
        {scores?.charisma}
      </div>
      <div>
        {race?.abilityIncrease.charisma === 0 ? '' : `+${race?.abilityIncrease.charisma }`}
      </div>
      <div>
        {(scores?.charisma ?? 0) + (race?.abilityIncrease.charisma ?? 0)}
      </div>
    </div>
  </div>
)

export default Abilities;
