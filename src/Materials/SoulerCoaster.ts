import { MaterialDescriptor } from "./MaterialDescriptor";

export const soulerCoasterMaterial: MaterialDescriptor = {
  type: 'Lit',

  cullMode: "none",

  texture: {
    url: './textures/stars.png',

    scale: [1, 5],

    offset: [0, 0.1],
  }
}
