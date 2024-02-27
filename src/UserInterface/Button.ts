import { createElement } from "./CreateElement"

type PropsType = {
  label: string,
}

export const Button = ({ label }: PropsType) => {
  return createElement('', {}, label)
}