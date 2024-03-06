import React from 'react';
import StatusBar from '../StatusBar/StatusBar';
import Actions from './Actions';
import { CreatureActorInterface } from '../../types';
import styles from './ActionBar.module.scss'

type PropsType = {
  actor: CreatureActorInterface,
}

const ActionBar: React.FC<PropsType> = ({ actor }) => (
  <div className={styles.actionBar}>
    <StatusBar character={actor.character} />
    <Actions actor={actor} />
  </div>
)

export default ActionBar;
