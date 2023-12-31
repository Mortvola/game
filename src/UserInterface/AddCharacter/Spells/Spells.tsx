import React from 'react';
import { AbilityScores } from '../../../Character/Races/AbilityScores';
import { abilityModifier } from '../../../Dice';
import styles from '../AddCharacter.module.scss';
import KnownSpells from './KnownSpells';
import AvailableSpells from './AvailableSpells';
import Spell from '../../../Character/Actions/Spells/Spell';
import { KnownSpell } from './KnownSpell';
import { R } from '../../../Character/Actions/Spells/Spells';

type PropsType = {
  level: number,
  abilityScores: AbilityScores,
  knownSpells: KnownSpell[],
  availableSpells: R<Spell>[] | null,
  maxPreparedSpells: number,
  onKnownSpellsChange: (knownSpell: KnownSpell[]) => void,
  onAvailableSpellChange: (spell: R<Spell>[]) => void,
}

const Spells: React.FC<PropsType> = ({
  level,
  abilityScores,
  knownSpells,
  availableSpells,
  maxPreparedSpells,
  onKnownSpellsChange,
  onAvailableSpellChange,
}) => {
  const maxKnownSpells = 6;

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
      {
        availableSpells
          ? <AvailableSpells spells={availableSpells} onChange={onAvailableSpellChange} />
          : <div />
      }
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
