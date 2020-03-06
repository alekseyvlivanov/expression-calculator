function eval() {
  // Do not use eval!!!
  return;
}

function expressionCalculator(expr) {
  // this part is from another task - https://github.com/alekseyvlivanov/brackets
  // with a bit of refactoring => use single pair of brackets '()'
  let aString = expr.replace(/[^\(\)]/g, '');
  let aLength;

  do {
    aLength = aString.length;
    aString = aString.replace('()', '');
  } while (aLength !== aString.length);

  if (aString.length !== 0) {
    throw new Error('ExpressionError: Brackets must be paired');
  }

  const operationRange = {
    '(': 0,
    ')': 0,
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };

  const doOperation = {
    '+': function(x, y) {
      return x + y;
    },
    '-': function(x, y) {
      return x - y;
    },
    '*': function(x, y) {
      return x * y;
    },
    '/': function(x, y) {
      if (y === 0) {
        throw new Error('TypeError: Division by zero.');
      }
      return x / y;
    },
  };

  const isNumber = e => /\d+/.test(e);

  // strip spaces & divide on groups
  const exprArray = expr
    .replace(/\s+/g, '')
    .split(/(?<=[()+\-*/])|(?=[()+\-*/])/g);

  const stackNumber = [];
  const stackOperaion = [];
  let lastOperation;
  let prevNumber1;
  let prevNumber2;

  // it's pretty UGLY draft version, but it works
  // TODO: refactor => DRY
  for (const token of exprArray) {
    if (isNumber(token)) {
      stackNumber.push(parseInt(token));
    } else if (token === '(') {
      stackOperaion.push(token);
    } else if (token === ')') {
      lastOperation = stackOperaion.pop();
      while (lastOperation !== '(') {
        prevNumber1 = stackNumber.pop();
        prevNumber2 = stackNumber.pop();

        stackNumber.push(doOperation[lastOperation](prevNumber2, prevNumber1));
        lastOperation = stackOperaion.pop();
      }
    } else {
      if (stackOperaion.length === 0) {
        stackOperaion.push(token);
      } else {
        let flag = true;
        do {
          if (stackOperaion.length === 0) {
            stackOperaion.push(token);
            flag = false;
          } else {
            lastOperation = stackOperaion.slice(-1)[0];
            if (operationRange[token] > operationRange[lastOperation]) {
              stackOperaion.push(token);
              flag = false;
            } else {
              const prevNumber1 = stackNumber.pop();
              const prevNumber2 = stackNumber.pop();

              stackNumber.push(
                doOperation[lastOperation](prevNumber2, prevNumber1),
              );
              stackOperaion.pop();
            }
          }
        } while (flag);
      }
    }
  }

  lastOperation = stackOperaion.pop();
  while (lastOperation) {
    prevNumber1 = stackNumber.pop();
    prevNumber2 = stackNumber.pop();

    stackNumber.push(doOperation[lastOperation](prevNumber2, prevNumber1));
    lastOperation = stackOperaion.pop();
  }

  return stackNumber[0];
}

module.exports = {
  expressionCalculator,
};
