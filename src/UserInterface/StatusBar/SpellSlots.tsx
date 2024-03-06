import React from 'react';
import { CharacterInterface, SpellFactory } from '../../types';
import styles from './StatusBar.module.scss';
import SpellLevelSlots from './SpellLevelSlots';

type PropsType = {
  character: CharacterInterface,
}

const SpellSlots: React.FC<PropsType> = ({ character }) => {
  const actionSpellLevel = (character.actor?.getAction() as SpellFactory)?.level

  const levels: React.ReactNode[] = []
  const maxSpellLevel = character.getMaxSpellLevel()

  for (let level = 0; level < maxSpellLevel; level += 1) {
    const available = character.spellSlots[level]
    const maxSlots = character.getMaxSpellSlots(level + 1)

    levels.push(
      <SpellLevelSlots level={actionSpellLevel} maxSpellSlots={maxSlots} available={available} />
    )
  }

  return (
    <div className={styles.slotsWrapper}>
      {
        levels
      }
    </div>
  )
}

export default SpellSlots;