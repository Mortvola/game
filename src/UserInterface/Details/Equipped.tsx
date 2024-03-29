import React from 'react';
import styles from './Equipped.module.scss';
import { CharacterInterface } from '../../types';

type PropsType = {
  character: CharacterInterface,
}

const Equipped: React.FC<PropsType> = ({
  character,
}) => (
  <div className={styles.equipped}>
    <div>Equipped</div>
    <div>
      <div>Melee Weapon</div>
      <div>{character.equipped.meleeWeapon?.name ?? 'None'}</div>
    </div>
    <div>
      <div>Range Weapon</div>
      <div>{character.equipped.rangeWeapon?.name ?? 'None'}</div>
    </div>
    <div>
      <div>Armor</div>
      <div>{character.equipped.armor?.name ?? 'None'}</div>
    </div>
    <div>
      <div>Shield</div>
      <div>{character.equipped.shield?.name ?? 'None'}</div>
    </div>
  </div>
)

export default Equipped;
