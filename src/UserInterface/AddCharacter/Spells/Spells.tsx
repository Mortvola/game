import React from 'react';
import { AbilityScores } from '../../../Character/Races/AbilityScores';
import { abilityModifier } from '../../../Dice';
import styles from '../AddCharacter.module.scss';
import KnownSpells from './KnownSpells';
import AvailableSpells from './AvailableSpells';
import Spell from '../../../Character/Spells/Spell';
import { KnownSpell } from './KnownSpell';

type PropsType = {
  level: number,
  abilityScores: AbilityScores,
  knownSpells: KnownSpell[],
  availableSpells: Spell[],
  onKnownSpellsChange: (knownSpell: KnownSpell[]) => void,
  onAvailableSpellChange: (spell: Spell[]) => void,
}

const Spells: React.FC<PropsType> = ({
  level,
  abilityScores,
  knownSpells,
  availableSpells,
  onKnownSpellsChange,
  onAvailableSpellChange,
}) => {
  const maxKnownSpells = 6;
  const maxPreparedSpells = level + abilityModifier(abilityScores.intelligence);

  return (
    <div className={styles.spellsLayout}>
      {/* {  }
      <div className={styles.spells}>
        {
          availableSpells.map((spell) => (
            <Spell key={spell} spell={spell} type={ItemTypes.SPELL} />
          ))
        }
      </div> */}
      <AvailableSpells spells={availableSpells} onChange={onAvailableSpellChange} />
      <KnownSpells
        knownSpells={knownSpells}
        onChange={onKnownSpellsChange}
        maxKnownSpells={maxKnownSpells}
        maxPreparedSpells={maxPreparedSpells}
      />
    </div>
  )
}

export default Spells;
