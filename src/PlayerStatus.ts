import { IReactionDisposer, autorun } from "mobx"
import ElementNode from "./Renderer/Drawables/SceneNodes/ElementNode"
import { CreatureActorInterface } from "./types"
import SceneGraph2D from "./Renderer/SceneGraph2d"
import FlexBox from "./Renderer/Drawables/SceneNodes/FlexBox"
import TextBox from "./Renderer/Drawables/SceneNodes/TextBox"

const getStatus = (actor: CreatureActorInterface) => {
  const flexBox = new FlexBox({
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    bottom: 0,
    padding: { left: 16, bottom: 16 },
  })
  
  const influencingActions = actor.character.influencingActions.map((c) => (
    new TextBox(`${c.name} (${c.duration / 6})`)
  ))

  flexBox.nodes.push(...influencingActions)

  const conditions = actor.character.conditions.map((c) => (
    new TextBox(c)
  ))

  flexBox.nodes.push(...conditions)

  if (actor.character.concentration) {
      const concentration = new TextBox(`Concetrating: ${actor.character.concentration.name} (${actor.character.concentration.duration / 6})`)
      flexBox.nodes.push(concentration)
  }

  const player = new ElementNode({ flexDirection: 'column' });
  player.nodes.push(new TextBox(actor.character.name));
  player.nodes.push(new TextBox(
    `${actor.character.hitPoints}/${actor.character.maxHitPoints} ${actor.character.temporaryHitPoints ? ` + ${actor.character.temporaryHitPoints}` : ''}`
  ));

  flexBox.nodes.push(player)

  return flexBox
}

let playerStatus: ElementNode | null = null
let disposer: IReactionDisposer | null = null

export const addPlayerStatus = async (actor: CreatureActorInterface, scene2d: SceneGraph2D) => {
  const createActionBar = () => {
    const status = getStatus(actor)

    scene2d.replaceNode(playerStatus, status)
    playerStatus = status
  }

  if (disposer !== null) {
    disposer()
    disposer = null
  }

  disposer = autorun(createActionBar)
}
