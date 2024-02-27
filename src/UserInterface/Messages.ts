import { IReactionDisposer, autorun } from "mobx"
import ElementNode from "../Renderer/Drawables/SceneNodes/ElementNode"
import SceneGraph2D from "../Renderer/SceneGraph2d"
import FlexBox from "../Renderer/Drawables/SceneNodes/FlexBox"
import TextBox from "../Renderer/Drawables/SceneNodes/TextBox"

const getMessages = (messages: { id: number, message: string }[]) => {
  const flexBox = new FlexBox({
    flexDirection: 'column',
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: { bottom: 16, right: 16 },
  })
  
  flexBox.nodes.push(...messages.map((m) => (
    new TextBox(m.message)
  )))

  return flexBox
}

let messageLog: ElementNode | null = null
let disposer: IReactionDisposer | null = null

export const addMessages = async (messages: { id: number, message: string }[], scene2d: SceneGraph2D) => {
  const createMessages = () => {
    let log: ElementNode | null = null

    log = getMessages(messages)

    scene2d.replaceNode(messageLog, log)
    messageLog = log
  }

  if (disposer !== null) {
    disposer()
    disposer = null
  }

  disposer = autorun(createMessages)
}

