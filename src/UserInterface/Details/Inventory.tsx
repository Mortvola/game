import React from 'react';
import Character from '../../Character/Character';
import styles from './Inventory.module.scss';

type PropsType = {
  character: Character,
}

const Inventory: React.FC<PropsType> = ({
  character,
}) => (
  <div>
    <div className={styles.section}>
      <div className={styles.title}>Weapons</div>
      <div>
      {
        character.weapons.map((w) => (
          <div className={styles.weapon}>
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
            <div className={styles.armor}>
              <div>{a.name}</div>
              <div>{a.armorClass}</div>
            </div>
          ))
        }
      </div>
    </div>
  </div>
)

export default Inventory;
