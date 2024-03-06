import { Reaction } from "mobx";
import ElementNode, { Style } from "../Renderer/Drawables/SceneNodes/ElementNode"
import TextBox from "../Renderer/Drawables/SceneNodes/TextBox"
import SceneGraph2D from "../Renderer/SceneGraph2d";

namespace UI {
  // type Props = Record<string, unknown> & {
  //   style?: Style,
  //   onClick?: () => void,
  //   children?: (string | UIElement | UIElement[])[],
  // }
  
  type Constructor<P = any> = (props: P) => UIElement;

  export type UIElement<P = any, T extends string | Constructor<any> = string | Constructor<any> > = {
    type: T | string,
    props: P,
  }

  export type UINode = (string | UIElement | UIElement[] | null)

  interface FunctionComponent<P = {}> {
    (props: P): UIElement;
  }

  export type FC<P = {}> = FunctionComponent<P>;
  
  export function createElement<P extends {}>(
    type: string | FunctionComponent<P>,
    props: P,
    ...children: UINode[]
  ): UIElement<P> {
    const element: UIElement<P> = {
      type,
      props: {
        ...props,
        children: children.filter((c) => c) as UINode[],
      },
    }

    return element;
  }

  export const render = (element: UIElement, scene2d: SceneGraph2D) => {
    let stack: { parent: ElementNode | null, element: (string | UIElement | UIElement[]) }[] = [{
      parent: null,
      element,
    }]

    let root: ElementNode | null = null;

    while(stack.length > 0) {
      const entry = stack[0];
      stack = stack.slice(1);

      if (Array.isArray(entry.element)) {
        stack = [
          ...entry.element.map((e) => ({
            parent: entry.parent,
            element: e,
          })),
          ...stack.slice()
        ]
      }
      else if (typeof entry.element === 'string') {
        const element = new TextBox(entry.element)

        if (entry.parent) {
          entry.parent.nodes.push(element)
        }
      }
      else {
        let parent = entry.parent;
        if (typeof entry.element.type === 'function') {
          const name = entry.element.type.name
          const type = entry.element.type
          const props = entry.element.props

          const reaction = new Reaction(
            entry.element.type.name,
            () => { console.log(`Change! ${name}, ${props.actor.character.name}`); scene2d.needsUpdate = true },
          )

          let element: UIElement | null = null

          reaction.track(() => { const e = type(props); element = e })

          if (element !== null) {
            stack.push({ parent, element })
          }
        }
        else {
          parent = new ElementNode(entry.element.props.style) // (props as { style?: Style}).style)

          if (entry.parent === null) {
            root = parent
          }
          else {
            entry.parent.nodes.push(parent)
          }
          
          parent.onClick = entry.element.props.onClick

          const children = entry.element.props.children

          if (children) {
            stack.push(...children.map((e: UINode) => ({
              parent,
              element: e,
            })))
          }  
        }
      }
    }

    return root;
  }
}

export default UI
