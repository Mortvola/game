import MeleeAttack from "./Character/Actions/MeleeAttack"
import RangeAttack from "./Character/Actions/RangeAttack"
import ElementNode, { Style } from "./Renderer/Drawables/SceneNodes/ElementNode"
import FlexBox from "./Renderer/Drawables/SceneNodes/FlexBox"
import TextBox from "./Renderer/Drawables/SceneNodes/TextBox"
import SceneGraph2D from "./Renderer/SceneGraph2d"
import { CreatureActorInterface } from "./types"

const spellSlots = (actor: CreatureActorInterface) => {
  const slots = new FlexBox()

  const available = actor.character.spellSlots[0]

  for (let i = 0; i < actor.character.getMaxSpellSlots(1)!; i += 1) {
    slots.nodes.push(new ElementNode({
      width: 16,
      height: 32,
      margin: { left: 0.5, right: 0.5 },
      backgroundColor: [0.75, 0.75, 0, 1],
    }))

    // slots.push(<div key={i} className={i < available ? '' : styles.unavailable}></div>)
  }

  return slots;
}

const statusBar = (actor: CreatureActorInterface) => {
  const flex = new FlexBox({ columnGap: 8 })

  const actionStyle = {
    width: 32,
    height: 32,
    backgroundColor: [0, 0.5, 0, 1],
    border: { color: [1, 1, 1, 1], width: 1 },
  }

  const bonusStyle = {
    ...actionStyle,
    backgroundColor: [1, 0.65, 0, 1],
  }

  const action = new ElementNode(actionStyle);
  const bonus  = new ElementNode(bonusStyle);

  flex.nodes.push(action, bonus, spellSlots(actor))

  return flex;
}

const actionItems = (actor: CreatureActorInterface) => {
  const flex = new FlexBox({
    backgroundColor: [0.25, 0, 0, 1],
    columnGap: 8,
    margin: { left: 4, right: 4, top: 4, bottom : 4 },
    border: { color: [1, 1, 1, 1], width: 1 },
    padding: { left: 8, right: 8, top: 8, bottom: 8 },
  })

  const actionStyle: Style = {
    width: 48,
    height: 48,
    backgroundColor: [0, 0.5, 0, 1],
    border: { color: [1, 1, 1, 1], width: 1 },
  }

  const bonusStyle: Style = {
    ...actionStyle,
    color: [0, 0, 0, 1],
    backgroundColor: [1, 0.65, 0, 1],
  }

  if (actor.character.equipped.meleeWeapon) {
    const action = new ElementNode(actionStyle)
    action.nodes.push(new TextBox('Melee'));
    action.onClick = () => {
      actor.setAction(new MeleeAttack(actor));
    }

    flex.nodes.push(action)
  }

  if (actor.character.equipped.rangeWeapon) {
    const action = new ElementNode(actionStyle)
    action.nodes.push(new TextBox('Range'));
    action.onClick = () => {
      actor.setAction(new RangeAttack(actor));
    }

    flex.nodes.push(action)
  }

  // Actions for spells
  for (const spell of actor.character.spells) {
    let style = actionStyle
    if (spell.time === 'Bonus') {
      style = bonusStyle
    }

    const action = new ElementNode(style)
    action.nodes.push(new TextBox(spell.name));
    action.onClick = () => {
      actor.setAction(new spell.spell(actor));
    }

    flex.nodes.push(action)
  }

  // Actions for cantrips
  for (const spell of actor.character.cantrips) {
    let style = actionStyle
    if (spell.time === 'Bonus') {
      style = bonusStyle
    }
    
    const action = new ElementNode(style)
    action.nodes.push(new TextBox(spell.name));
    action.onClick = () => {
      actor.setAction(new spell.spell(actor));
    }

    flex.nodes.push(action)
  }

  // Actions for class actions
  for (const classAction of actor.character.charClass.actions) {
    let style = actionStyle
    if (classAction.time === 'Bonus') {
      style = bonusStyle
    }
    
    const action = new ElementNode(style)
    action.nodes.push(new TextBox(action.name));
    action.onClick = () => {
      actor.setAction(new classAction.action(actor));
    }

    flex.nodes.push(action)
  }
  
  return flex;
}

let actionBar: ElementNode | null = null

export const addActionBar = async (actor: CreatureActorInterface, scene2d: SceneGraph2D) => {
  const status = statusBar(actor)
  const actions = actionItems(actor)

  const newActionBar = new FlexBox({ flexDirection: 'column', position: 'absolute', bottom: 0 })

  newActionBar.nodes.push(status, actions)

  scene2d.replaceNode(actionBar, newActionBar)

  actionBar = newActionBar
}
