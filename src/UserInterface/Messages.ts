import { IReactionDisposer, autorun } from "mobx"
import ElementNode, { Style } from "../Renderer/Drawables/SceneNodes/ElementNode"
import SceneGraph2D from "../Renderer/SceneGraph2d"
import UI from "./CreateElement"

type PropsType = {
  messages: { id: number, message: string }[],
}

const getMessages: UI.FC<PropsType> = ({ messages }) => {
  const style: Style = {
    flexDirection: 'column',
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: { bottom: 16, right: 16 },
  }

  return UI.createElement(
    '',
    { style },
    ...messages.map((m) => (
      m.message
    ))
  )
}

let messageLog: ElementNode | null = null
let disposer: IReactionDisposer | null = null

export const addMessages = async (messages: { id: number, message: string }[], scene2d: SceneGraph2D) => {
  const createMessages = () => {
    let log: ElementNode | null = null

    log = UI.render(getMessages({ messages }), scene2d)

    scene2d.replaceNode(messageLog, log)
    messageLog = log
  }

  if (disposer !== null) {
    disposer()
    disposer = null
  }

  disposer = autorun(createMessages)
}

