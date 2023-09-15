const itterateObject = (obj: Record<string, any>, key: string) => {
  let variables = '';
  const keysObj: any = {};
  const keys = Object.keys(obj || {});
  keys.map((k, i) => {
    if (typeof obj[k] === 'string') {
      variables += `--${key}-${k}: ${obj[k]}; `;
      keysObj[`--${key}-${k}`] = ` ${obj[k]}; `;
    } else {
      variables += createVariables(obj[k], `${key}-${k}`).variables;
      keysObj[`--${key}-${k}-${i}`] = createVariables(
        obj[k],
        `${key}-${k}`,
      ).keysObj;
    }
  });
  return { variables, keysObj };
};
const itterateArrays = (arr: any[], key: string) => {
  let variables = '';
  const keysObj: any = {};
  arr.map((k, i) => {
    if (typeof arr[i] === 'string') {
      variables += `--${key}-${i}: ${arr[i]}; `;
      keysObj[`--${key}-${i}`] = ` ${arr[i]}; `;
    } else {
      variables += createVariables(arr[i], `${key}-${i}-${k}`).variables;
      keysObj[`--${key}-${i}`] = createVariables(
        arr[i],
        `${key}-${i}-${k}`,
      ).keysObj;
    }
  });
  return { variables, keysObj };
};
const createVariables = (keys: any, key: string) => {
  let variables = '';
  const keysObj: any = {};
  if (typeof keys === 'string') {
    variables = `--${key}: ${keys}; `;
    keysObj[`--${key}`] = ` ${keys}; `;
    return { variables, keysObj };
  }
  if (keys instanceof Array) {
    variables = itterateArrays(keys, key).variables;
    keysObj[`--${key}`] = itterateArrays(keys, key).keysObj;
  }

  if (keys instanceof Object) {
    variables = itterateObject(keys, key).variables;
    keysObj[`--${key}`] = itterateObject(keys, key).keysObj;
  }
  return { variables, keysObj };
};
export const createTheme = (theme: IAppTheme) => {
  let variablesObject = '';
  const variablesObjectt: any = {};
  const objectKeys: any = Object.keys(theme || {});
  if (objectKeys?.length) {
    for (let index = 0; index < objectKeys.length; index++) {
      const key = objectKeys[index] as keyof IAppTheme;
      const element = theme[key];
      variablesObject += createVariables(element, key).variables;
      variablesObjectt[key] += createVariables(element, key).keysObj;
    }
  }
  console.log({ variablesObjectt });
};
