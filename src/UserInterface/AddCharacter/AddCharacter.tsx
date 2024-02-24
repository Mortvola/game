import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'
import styles from './AddCharacter.module.scss';
import Fighter from '../../Character/Classes/Fighter';
import CharacterClass, { StartingEquipment as StartingEquipmentTable } from '../../Character/Classes/CharacterClass';
import { Armor } from '../../Character/Equipment/Armor';
import Barbarian from '../../Character/Classes/Barbarian';
import Bard from '../../Character/Classes/Bard';
import Cleric from '../../Character/Classes/Cleric';
import Druid from '../../Character/Classes/Druid';
import Monk from '../../Character/Classes/Monk';
import Paladin from '../../Character/Classes/Paladin';
import Ranger from '../../Character/Classes/Ranger';
import Rogue from '../../Character/Classes/Rogue';
import Sorcerer from '../../Character/Classes/Sorcerer';
import Warlock from '../../Character/Classes/Warlock';
import Wizard from '../../Character/Classes/Wizard';
import StartingEquipment from '../Choices/StartingEquipment';
import Tab from './Tab';
import RaceTab from './Race';
import Human from '../../Character/Races/Human';
import HighElf from '../../Character/Races/HighElf';
import WoodElf from '../../Character/Races/WoodElf';
import HillDwarf from '../../Character/Races/HillDwarf';
import MountainDwarf from '../../Character/Races/MountainDwarf';
import StoutHalfling from '../../Character/Races/StoutHalfling';
import LightfootHalfling from '../../Character/Races/LightfootHalfling';
import Character from '../../Character/Character';
import { abilityModifier, abilityRolls, addAbilityIncreases, assignAbilityScores } from '../../Dice';
import Spells from './Spells/Spells';
import { KnownSpell } from './Spells/KnownSpell';
import { clericSpells, druidSpells, wizardSpells } from '../../Character/Actions/Spells/Spells';
import Spell from '../../Character/Actions/Spells/Spell';
import Creature from '../../Character/Creature';
import Cantrips from './Spells/Cantrips';
import { clericSpellSlots, druidSpellSlots, wizardSpellSlots } from '../../Tables';
import { AbilityScores, SpellFactory, RaceInterface } from '../../types';
import { Weapon } from '../../Character/Equipment/Types';

type PropsType = {
  show: boolean,
  onHide: () => void,
  onSave: (character: Creature) => void,
}

const AddCharacter: React.FC<PropsType> = ({
  show,
  onHide,
  onSave,
}) => {
  const [charClass, setCharClass] = React.useState<CharacterClass>(new Barbarian())
  const [equipment, setEquipment] = React.useState<StartingEquipmentTable>(Barbarian.startingEquipment());
  const [race, setRace] = React.useState<RaceInterface>(new Human());
  // const [character, setCharacter] = React.useState<Character | null>(null);
  const [rolls] = React.useState<number[]>(abilityRolls());
  const [baseAbilityScores, setBaseAbilityScores] = React.useState<AbilityScores>(assignAbilityScores(rolls, charClass))
  const [abilityScores, setAbilityScores] = React.useState<AbilityScores>(addAbilityIncreases(baseAbilityScores, race))
  const [knownSpells, setKnownSpells] = React.useState<KnownSpell[]>([]);
  const [cantrips, setCantrips] = React.useState<KnownSpell[]>([]);
  const [availableSpells, setAvailableSpells] = React.useState<SpellFactory<Spell>[] | null>(null)
  const [maxPreparedSpells, setMaxPreparedSpells] = React.useState<number>(0)
  const [numCantrips, setNumCantrips] = React.useState<number>(0);

  // React.useEffect(() => {
  //   if (abilityScores) {
  //     setCharacter(new Character(abilityScores, race, charClass, [], []))
  //   }
  // }, [abilityScores, charClass, race])

  const handleSaveClick = () => {
    if (race && charClass && abilityScores) {
      let weapons: Weapon[] = [];
      let armor: Armor[] = [];

      for (const choice of equipment.equipmentChoices) {
        weapons = weapons.concat(choice.choices[choice.selection].weapons);
        armor = armor.concat(choice.choices[choice.selection].armor);
      }

      weapons = weapons.concat(equipment.other.weapons);
      armor = armor.concat(equipment.other.armor);  

      const character = new Character(abilityScores, race, charClass, weapons, armor);

      character.cantrips = cantrips.filter((s) => s.prepared).map((s) => s.spell);
      character.spells = knownSpells.filter((s) => s.prepared).map((s) => s.spell);

      character.knownSpells = null;

      if (character.charClass.name === 'Wizard') {
        character.knownSpells = knownSpells.map((s) => s.spell)
      }

      onSave(character)
    }
  }

  const handleCancelClick = () => {
    onHide()
  }

  const handleRaceChange = (race: string) => {
    switch (race) {
      case 'Human':
        setRace(new Human());
        break;
      case 'High Elf':
        setRace(new HighElf());
        break;
      case 'Wood Elf':
        setRace(new WoodElf());
        break;
      case 'Hill Dwarf':
        setRace(new HillDwarf());
        break;
      case 'Mountain Dwarf':
        setRace(new MountainDwarf());
        break;
      case 'Stout Halfling':
        setRace(new StoutHalfling());
        break;
      case 'Lightfoot Halfling':
        setRace(new LightfootHalfling());
        break;
    }
  }

  const handleSelectClass = (charClass: string) => {
    switch(charClass) {
      case "Barbarian": {
        const cc = new Barbarian();
        const scores = assignAbilityScores(rolls, cc);
        setBaseAbilityScores(scores);
        setAbilityScores(addAbilityIncreases(scores, race))
        setCharClass(cc)
        setKnownSpells([])
        setCantrips([])
        setEquipment(Barbarian.startingEquipment())
        break;
      }

      case "Bard": {
        const cc = new Bard();
        const scores = assignAbilityScores(rolls, cc);
        setBaseAbilityScores(scores);
        setAbilityScores(addAbilityIncreases(scores, race))
        setCharClass(cc)
        setKnownSpells([])
        setCantrips([])
        setEquipment(Bard.startingEquipment())
        break;
      }

      case "Cleric": {
        const cc = new Cleric();
        const scores = assignAbilityScores(rolls, cc);
        setBaseAbilityScores(scores);
        const adjustedScores = addAbilityIncreases(scores, race);
        setAbilityScores(adjustedScores)
        setCharClass(cc)
        setAvailableSpells(null)
        setKnownSpells(clericSpells[1].map((s) => ({ spell: s, prepared: false })))
        setCantrips(clericSpells[0].map((s) => ({ spell: s, prepared: false })))
        setMaxPreparedSpells(1 + abilityModifier(adjustedScores.wisdom))
        setNumCantrips(clericSpellSlots[0].cantrips)
        setEquipment(Cleric.startingEquipment())
        break;
      }

      case "Druid": {
        const cc = new Druid();
        const scores = assignAbilityScores(rolls, cc);
        setBaseAbilityScores(scores);
        setAbilityScores(addAbilityIncreases(scores, race))
        setCharClass(cc)
        setKnownSpells(druidSpells[1].map((s) => ({ spell: s, prepared: false })))
        setCantrips(druidSpells[0].map((s) => ({ spell: s, prepared: false })))
        setNumCantrips(druidSpellSlots[0].cantrips)
        setEquipment(Druid.startingEquipment())
        break;
      }

      case "Fighter": {
        const cc = new Fighter();
        const scores = assignAbilityScores(rolls, cc);
        setBaseAbilityScores(scores);
        setAbilityScores(addAbilityIncreases(scores, race))
        setCharClass(cc)
        setKnownSpells([])
        setCantrips([])
        setEquipment(Fighter.startingEquipment())
        break;
      }

      case "Monk": {
        const cc = new Monk();
        const scores = assignAbilityScores(rolls, cc);
        setBaseAbilityScores(scores);
        setAbilityScores(addAbilityIncreases(scores, race))
        setCharClass(cc)
        setKnownSpells([])
        setCantrips([])
        setEquipment(Monk.startingEquipment())
        break;
      }

      case "Paladin": {
        const cc = new Paladin();
        const scores = assignAbilityScores(rolls, cc);
        setBaseAbilityScores(scores);
        setAbilityScores(addAbilityIncreases(scores, race))
        setCharClass(cc)
        setKnownSpells([])
        setCantrips([])
        setEquipment(Paladin.startingEquipment())
        break;
      }

      case "Ranger": {
        const cc = new Ranger();
        const scores = assignAbilityScores(rolls, cc);
        setBaseAbilityScores(scores);
        setAbilityScores(addAbilityIncreases(scores, race))
        setCharClass(cc)
        setKnownSpells([])
        setCantrips([])
        setEquipment(Ranger.startingEquipment())
        break;
      }

      case "Rogue": {
        const cc = new Rogue();
        const scores = assignAbilityScores(rolls, cc);
        setBaseAbilityScores(scores);
        setAbilityScores(addAbilityIncreases(scores, race))
        setCharClass(cc)
        setKnownSpells([])
        setCantrips([])
        setEquipment(Rogue.startingEquipment())
        break;
      }

      case "Sorcerer": {
        const cc = new Sorcerer();
        const scores = assignAbilityScores(rolls, cc);
        setBaseAbilityScores(scores);
        setAbilityScores(addAbilityIncreases(scores, race))
        setCharClass(cc)
        setKnownSpells([])
        setCantrips([])
        setEquipment(Sorcerer.startingEquipment())
        break;
      }

      case "Warlock": {
        const cc = new Warlock();
        const scores = assignAbilityScores(rolls, cc);
        setBaseAbilityScores(scores);
        setAbilityScores(addAbilityIncreases(scores, race))
        setCharClass(cc)
        setKnownSpells([])
        setCantrips([])
        setEquipment(Warlock.startingEquipment())
        break;
      }

      case "Wizard": {
        const cc = new Wizard();
        const scores = assignAbilityScores(rolls, cc);
        setBaseAbilityScores(scores);
        setAbilityScores(addAbilityIncreases(scores, race))
        setCharClass(cc)
        setAvailableSpells(wizardSpells[1].filter((s) => s))
        setKnownSpells([])
        setCantrips(wizardSpells[0].map((s) => ({ spell: s, prepared: false })))
        setMaxPreparedSpells(1 + abilityModifier(abilityScores.intelligence))
        setNumCantrips(wizardSpellSlots[0].cantrips)
        setEquipment(Wizard.startingEquipment())
        break;
      }

      default:
        break;
    }
  }

  const [tab, setTab] = React.useState<string>('Race');

  const handleSelect = (tabKey: string) => {
    setTab(tabKey);
  }

  const handleKnownSpellsChange = (spells: KnownSpell[]) => {
    setKnownSpells(spells);
    if (charClass.name === 'Wizard') {
      setAvailableSpells(wizardSpells[1].filter((s) => !spells.some((ks) => (ks.spell.name === s.name))))
    }
    else {
      setAvailableSpells(clericSpells[1].filter((s) => !spells.some((ks) => (ks.spell.name === s.name))))
    }
  }

  const handleAvailableSpellsChange = (spells: SpellFactory<Spell>[]) => {
    setAvailableSpells(spells);
    setKnownSpells((prev) => (prev.filter((ks) => !spells.some((s) => ks.spell.name === s.name))))
  }

  if (show) {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className={styles.dialog}>
          <div className={styles.body}>
            <div className={styles.tabs}>
              <Tab title="Race/Class" tabKey="Race" selected={tab} onSelect={handleSelect} />
              <Tab title="Cantrips" tabKey="Cantrips" selected={tab} onSelect={handleSelect} />
              {
                charClass.name === 'Wizard' || charClass.name === 'Cleric'
                  ? (
                    <Tab title="Spells" tabKey="Spells" selected={tab} onSelect={handleSelect} />
                  )
                  : null
              }
              <Tab title="Equipment" tabKey="Equipment" selected={tab} onSelect={handleSelect} />
            </div>
            <div hidden={tab !== 'Race'}>
              <RaceTab
                onRaceChange={handleRaceChange}
                race={race}
                charClass={charClass}
                scores={baseAbilityScores}
                onClassChange={handleSelectClass}
              />
            </div>
            <div hidden={tab !== 'Cantrips'}>
              <Cantrips
                knownSpells={cantrips}
                maxPreparedSpells={numCantrips}
              />
            </div>
            <div hidden={tab !== 'Spells'}>
              <Spells
                level={1}
                abilityScores={abilityScores}
                knownSpells={knownSpells}
                availableSpells={availableSpells}
                maxPreparedSpells={maxPreparedSpells}
                onKnownSpellsChange={handleKnownSpellsChange}
                onAvailableSpellChange={handleAvailableSpellsChange}
              />
            </div>
            <div hidden={tab !== 'Equipment'}>
              <StartingEquipment startingEquipment={equipment} />
            </div>
          </div>
          <div className={styles.footer}>
            <button type="button" onClick={handleCancelClick}>Cancel</button>
            <button type="button" onClick={handleSaveClick}>Save</button>
          </div>
        </div>
      </DndProvider>
    )  
  }

  return null;
}

export default AddCharacter;
