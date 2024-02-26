import { IReactionDisposer, autorun } from "mobx"
import ElementNode from "../Renderer/Drawables/SceneNodes/ElementNode"
import { FocusInfo } from "../types"
import SceneGraph2D from "../Renderer/SceneGraph2d"
import FlexBox from "../Renderer/Drawables/SceneNodes/FlexBox"
import TextBox from "../Renderer/Drawables/SceneNodes/TextBox"
import SceneNode2d from "../Renderer/Drawables/SceneNodes/SceneNode2d"

const getStatus = (focused: FocusInfo) => {
  const flexBox = new FlexBox({
    flexDirection: 'row',
    columnGap: 32,
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translate(-50%, 0)',
  })
  
  flexBox.nodes.push(new TextBox(focused.name));
  flexBox.nodes.push(new TextBox(
    `HP: ${focused.hitpoints}/${focused.maxHitpoints} ${focused.temporaryHitpoints ? ` + ${focused.temporaryHitpoints}` : ''}`
  ));
  flexBox.nodes.push(new TextBox(`AC: ${focused.armorClass}`))

  const conditions = focused.conditions.map((c) => (
    new TextBox(`${c.name} (${c.duration / 6})`)
  ))

  const conditionsWrapper = new ElementNode()
  conditionsWrapper.nodes.push(...conditions)

  flexBox.nodes.push(conditionsWrapper)

  return flexBox
}

let focusedStatus: ElementNode | null = null
let disposer: IReactionDisposer | null = null

export const addFocusedStatus = async (focused: FocusInfo | null, scene2d: SceneGraph2D) => {
  const createActionBar = () => {
    let status: ElementNode | null = null

    if (focused) {
      status = getStatus(focused)
    }

    scene2d.replaceNode(focusedStatus, status)
    focusedStatus = status
  }

  if (disposer !== null) {
    disposer()
    disposer = null
  }

  disposer = autorun(createActionBar)
}

