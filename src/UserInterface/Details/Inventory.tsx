import React from 'react';
import Character from '../../Character/Character';
import styles from './Inventory.module.scss';
import KnownSpellComponent, { KnownSpell } from './KnownSpell';

type PropsType = {
  character: Character,
}

const Inventory: React.FC<PropsType> = ({
  character,
}) => {
  const [numPrepared, setNumPrepared] = React.useState<number>(character.spells.length);

  const handleChange = (spell: KnownSpell) => {
    if (spell.prepared) {
      if (!character.spells.some((s) => s.name === spell.spell.name)) {
        character.spells.push(spell.spell)
      }  
    }
    else {
      const index = character.spells.findIndex((s) => s.name === spell.spell.name);

      if (index !== -1) {
        character.spells = [
          ...character.spells.slice(0, index),
          ...character.spells.slice(index + 1),
        ]
      }
    }

    setNumPrepared(character.spells.length)
  }

  return (
    <div>
      <div className={styles.section}>
        <div className={styles.title}>Weapons</div>
        <div>
        {
          character.weapons.map((w) => (
            <div key={w.name} className={styles.weapon}>
              <div>{w.name}</div>
              <div>{`${w.die[0].numDice}d${w.die[0].die}`}</div>
            </div>
          ))
        }
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.title}>Armor</div>
        <div>
          {
            character.armor.map((a) => (
              <div key={a.name} className={styles.armor}>
                <div>{a.name}</div>
                <div>{a.armorClass}</div>
              </div>
            ))
          }
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.title}>Prepared Spells</div>
        <div className={styles.knownSpells}>
          {
            character.getKnownSpells().map((s) => (
              <KnownSpellComponent
                key={`${character.name} ${s.spell.name}`}
                spell={{ prepared: s.prepared, spell: s.spell }}
                disable={character.getMaxPreparedSpells() === numPrepared}
                onChange={handleChange}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Inventory;
