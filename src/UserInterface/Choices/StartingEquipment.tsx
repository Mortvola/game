import React from 'react';
import { StartingEquipment as StartingEquipomentTable } from '../../Character/Classes/CharacterClass';
import EquipmentChoice from './EquipmentChoice';
import WeaponSelection from './WeaponSelection';
import styles from './StartingEquipment.module.scss';

type PropsType = {
  startingEquipment: StartingEquipomentTable,
}

const StartingEquipment: React.FC<PropsType> = ({
  startingEquipment,
}) => (
  <div>
    {
      startingEquipment.equipmentChoices.map((e) => (
        <EquipmentChoice equipment={e} />
      ))
    }
    {
      startingEquipment.other.label !== ''
        ? (
          <div className={styles.other}>
            <div>Plus...</div>
            { startingEquipment.other.label }
            <div>
              {
                startingEquipment.other.selections.map((s, index) => (
                  <WeaponSelection
                    weaponTypes={s}
                    weapons={startingEquipment.other.weapons}
                    index={index}
                  />  
                ))
              }
            </div>
          </div>
        )
        : null
    }
  </div>
)

export default StartingEquipment;
