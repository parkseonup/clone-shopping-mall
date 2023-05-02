const arrToObj = (arr: [string, any][]) => {
  return arr.reduce<{ [key: string]: any }>((res, [key, value]) => {
    res[key] = value;
    return res;
  }, {});
};

export default arrToObj;
