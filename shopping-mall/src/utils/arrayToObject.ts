const arrayToObject = (arr: any[]) =>
  arr.reduce((result, [key, value]) => {
    result = {
      ...result,
      [key]: value,
    };
    return result;
  }, {});

export default arrayToObject;
