import React from 'react';
import styles from '../AddCharacter.module.scss';
import KnownSpellComponent, { KnownSpell } from './KnownSpell';

type PropsType = {
  knownSpells: KnownSpell[],
  maxPreparedSpells: number,
}

const Cantrips: React.FC<PropsType> = ({
  knownSpells,
  maxPreparedSpells,
}) => {
  const countPreparedSpells = (): number => (
    knownSpells.reduce((sum, spell) => (sum + (spell.prepared ? 1 : 0)), 0)
  )

  const [numPrepared, setNumPrepared] = React.useState<number>(countPreparedSpells());

  const handleChange = () => {
    setNumPrepared(countPreparedSpells())
  }

  return (
    <div>
      <div className={styles.spellsKnown}>
        {
          knownSpells.map((spell) => (
            <KnownSpellComponent spell={spell} onChange={handleChange} disable={numPrepared === maxPreparedSpells} />
          ))
        }
      </div>
    </div>
  )
}

export default Cantrips;
