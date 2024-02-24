import { IReactionDisposer, autorun } from "mobx"
import { meleeAttack } from "./Character/Actions/MeleeAttack"
import { rangeAttack } from "./Character/Actions/RangeAttack"
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
      border: { color: [0.75, 0.75, 0, 1], width: 1 },
      backgroundColor: i < available ? [0.75, 0.75, 0, 1] : [0, 0, 0, 1],
    }))
  }

  return slots;
}

const statusBar = (actor: CreatureActorInterface) => {
  const flex = new FlexBox({ columnGap: 8 })

  const actionStyle = {
    width: 32,
    height: 32,
    backgroundColor: actor.character.actionsLeft > 0 ? [0, 0.5, 0, 1] : [0, 0, 0, 1],
    border: { color: [1, 1, 1, 1], width: 1 },
  }

  const bonusStyle = {
    ...actionStyle,
    backgroundColor: actor.character.bonusActionsLeft > 0 ? [1, 0.65, 0, 1] : [0, 0, 0, 1],
  }

  const action = new ElementNode(actionStyle);
  const bonus  = new ElementNode(bonusStyle);

  flex.nodes.push(action, bonus, spellSlots(actor))

  return flex;
}

const actionItems = (actor: CreatureActorInterface) => {
  const flex = new FlexBox({
    backgroundColor: [0.25, 0, 0, 1],
    columnGap: 4,
    margin: { left: 4, right: 4, top: 4, bottom : 4 },
    border: { color: [1, 1, 1, 1], width: 1 },
    padding: { left: 4, right: 4, top: 4, bottom: 4 },
  })

  const actionStyle: Style = {
    width: 48,
    height: 48,
    backgroundColor: [0, 0.5, 0, 1],
    border: { color: [1, 1, 1, 1], width: 1 },
    margin: { top: 2, left: 2, bottom: 2, right: 2 },
  }

  const bonusStyle: Style = {
    ...actionStyle,
    color: [0, 0, 0, 1],
    backgroundColor: [1, 0.65, 0, 1],
  }

  const currentAction = actor.getAction()

  if (actor.character.equipped.meleeWeapon) {
    const action = new ElementNode({
      ...actionStyle,
      border: currentAction === meleeAttack ? { color: [1, 1, 0, 1], width: 3 } : { color: [1, 1, 1, 1], width: 1 },
      margin: currentAction === meleeAttack ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
    })
    action.nodes.push(new TextBox('Melee'));
    action.onClick = () => {
      actor.setAction(meleeAttack);
    }

    flex.nodes.push(action)
  }

  if (actor.character.equipped.rangeWeapon) {
    const action = new ElementNode({
      ...actionStyle,
      border: currentAction === rangeAttack ? { color: [1, 1, 0, 1], width: 3 } : { color: [1, 1, 1, 1], width: 1 },
      margin: currentAction === rangeAttack ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
    })
    action.nodes.push(new TextBox('Range'));
    action.onClick = () => {
      actor.setAction(rangeAttack);
    }

    flex.nodes.push(action)
  }

  // Actions for spells
  for (const spell of actor.character.spells) {
    let style = actionStyle
    if (spell.time === 'Bonus') {
      style = bonusStyle
    }

    const action = new ElementNode({
      ...style,
      border: currentAction === spell ? { color: [1, 1, 0, 1], width: 3 } : { color: [1, 1, 1, 1], width: 1 },
      margin: currentAction === spell ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
    })
    
    action.nodes.push(new TextBox(spell.name));
    action.onClick = () => {
      actor.setAction(spell);
    }

    flex.nodes.push(action)
  }

  // Actions for cantrips
  for (const spell of actor.character.cantrips) {
    let style = actionStyle
    if (spell.time === 'Bonus') {
      style = bonusStyle
    }
    
    const action = new ElementNode({
      ...style,
      border: currentAction === spell ? { color: [1, 1, 0, 1], width: 3 } : { color: [1, 1, 1, 1], width: 1 },
      margin: currentAction === spell ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
    })
    
    action.nodes.push(new TextBox(spell.name));
    action.onClick = () => {
      actor.setAction(spell);
    }

    flex.nodes.push(action)
  }

  // Actions for class actions
  for (const classAction of actor.character.charClass.actions) {
    let style = actionStyle
    if (classAction.time === 'Bonus') {
      style = bonusStyle
    }
    
    const action = new ElementNode({
      ...style,
      border: currentAction === classAction ? { color: [1, 1, 0, 1], width: 3 } : { color: [1, 1, 1, 1], width: 1 },
      margin: currentAction === classAction ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
    })
    
    action.nodes.push(new TextBox(action.name));
    action.onClick = () => {
      actor.setAction(classAction);
    }

    flex.nodes.push(action)
  }
  
  return flex;
}

let actionBar: ElementNode | null = null
let disposer: IReactionDisposer | null = null

export const addActionBar = async (actor: CreatureActorInterface, scene2d: SceneGraph2D) => {
  const createActionBar = () => {
    const status = statusBar(actor)
    const actions = actionItems(actor)

    const newActionBar = new FlexBox({ flexDirection: 'column' })
    newActionBar.nodes.push(status, actions)

    const wrapper = new FlexBox({
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
    })

    wrapper.nodes.push(newActionBar)

    scene2d.replaceNode(actionBar, wrapper)

    actionBar = wrapper
  }

  if (disposer !== null) {
    disposer()
    disposer = null
  }

  disposer = autorun(createActionBar)
}
