import UI from "./CreateElement"

type PropsType = {
  label: string,
}

export const Button: UI.FC<PropsType> = ({ label }) => {
  return UI.createElement('', {}, label)
}