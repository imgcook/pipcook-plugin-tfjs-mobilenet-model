import { LabelEncoder, OneHotEncoder } from './tabular/encoder';
import { Image } from './image/image-proc';


export * as Generic from './generic';
export { Image };
export * as Rand from './rand';

export const Encoder = {
  LabelEncoder,
  OneHotEncoder
};
