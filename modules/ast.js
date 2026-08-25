// Number node class
export class LiteralNode {
  constructor(value) {
    this.nodeValue = value;
    this.nodeType = "LiteralNode";
  }

  evaluate() {
    return this.nodeValue;
  }
}

// Unary Operator node class
export class UnaryOperatorlNode {
  constructor(
    operator,
    argument,
  ) {
    this.nodeType = "UnaryExpressionNode";
    this.nodeOperator = operator;
    this.nodeArgument = argument;
  }

  evaluate() {
    if (this.nodeOperator === "reverse") {
      return -this.nodeArgument.evaluate();
    }
    return this.nodeArgument.evaluate();
  }
}

// Binary operator node class
export class BinaryOperatorNode {
  constructor(
    operator,
    left,
    right,
  ) {
    this.nodeType = "BinaryExpressionNode";
    this.nodeOperator = operator;
    this.leftNode = left;
    this.rightNode = right;
  }

  evaluate() {
    // recursive evaluation
    const leftNodeValue = this.leftNode.evaluate();
    const rightNodeValue = this.rightNode.evaluate();

    // operator evaluation
    switch (this.nodeOperator) {
      case "add":
        return leftNodeValue + rightNodeValue;
      case "minus":
        return leftNodeValue - rightNodeValue;
      case "multiply":
        return leftNodeValue * rightNodeValue;
      case "divide":
        return leftNodeValue / rightNodeValue;
      default:
        return 0;
    }
  }
}