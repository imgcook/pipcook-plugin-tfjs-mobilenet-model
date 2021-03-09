import { readFileSync } from 'fs';
const trainDataURI = 'train-images.idx3-ubyte';
const trainLabelURI = 'train-labels.idx1-ubyte';
const testDataURI = 't10k-images.idx3-ubyte';
const testLabelURI = 't10k-labels.idx1-ubyte';

const DATA_MAGIC = 2051;
const LABEL_MAGIC = 2049;

interface MNIST {
    label: number,
    data: Array<number>
}

function process(rawData: Buffer, rawLabel: Buffer): Array<MNIST> {
    const dataMagic = rawData.readInt32BE(0);
    if (dataMagic !== DATA_MAGIC) {
        throw new Error();
    }
    const labelMagic = rawLabel.readInt32BE(0);
    if (labelMagic !== LABEL_MAGIC) {
        throw new Error();
    }

    const samples = rawData.readInt32BE(4);
    if (samples !== rawLabel.readInt32BE(4)) {
        throw new Error();
    }

    const rowNum = rawData.readInt32BE(8);
    const columnNum = rawData.readInt32BE(12);
    const totalPixels = rowNum * columnNum;

    const ret: Array<MNIST> = new Array(samples);

    for (let i = 0; i < samples; i++) {
        const label = rawLabel[i+8];
        const pixels = new Array(totalPixels);
        for (let y = 0; y < columnNum; y++) {
            for (let x = 0; x < rowNum; x++) {
                pixels[x+y*columnNum] = rawData[16+i*totalPixels+(x+y*columnNum)];
            }
        }
        ret[i] = {
            label,
            data: pixels
        }
    }

    return ret;
}

function getMNIST() {
    const trainData = readFileSync(trainDataURI);
    const trainLabel = readFileSync(trainLabelURI);
    const testData = readFileSync(testDataURI);
    const testLabel = readFileSync(testLabelURI)
    const train = process(trainData, trainLabel);
    const test = process(testData, testLabel);

    return { train, test };
}

const { train, test } = getMNIST();
let trainCursor = 0;
let testCursor = 0;

const nextTrain = async () => {
  return trainCursor > train.length ? null : train[trainCursor++];
}

const nextTest = () => {
  return testCursor > test.length ? null : test[testCursor++];
}

const nextBatchTrain = async (num: number) => {
  const ret: Array<MNIST> = [];

  while (num > 0 && trainCursor < train.length) {
    ret.push(train[trainCursor]);
    trainCursor ++;
    num --;
  }

  return ret;
}

const nextBatchTest = async (num: number) => {
  const ret: Array<MNIST> = [];

  while (num > 0 && testCursor < test.length) {
    ret.push(test[testCursor]);
    testCursor ++;
    num --;
  }

  return ret;
}

const seekTrain = async (offset: number) => {
  train[offset];
}

const seekTest = async (offset: number) => {
  test[offset];
}

const getDatasourceMetaData = () => {
  return {
    dimension: [28, 28],
    size: {
      train: train.length,
      test: test.length
    }
  }
}

export {
  nextTrain,
  nextTest,
  nextBatchTrain,
  nextBatchTest,
  seekTest,
  seekTrain,
  getDatasourceMetaData
}
