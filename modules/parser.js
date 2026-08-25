import { LiteralNode, UnaryOperatorlNode, BinaryOperatorNode } from './ast.js'

export class Parser {
  tokenPosition = 0
  tokens = []

  constructor(tokens) {
    this.tokens = tokens
  }

  // Get the last token or null
  peekToken() {
    return this.tokenPosition < this.tokens.length
      ? (this.tokens[this.tokenPosition])
      : null
  }

  // Read the token and move forward the position
  consumeToken() {
    return this.tokens[this.tokenPosition++]
  }

  // Entry point of the parsing
  parseToken() {
    if (this.tokens.length === 0) return null
    return this.parseExpression()
  }

  // Level 1: addition and substraction
  parseExpression() {
    // search at first multiply and divide
    let leftNode = this.parseTerm()

    // search addition and substraction
    let currentToken = this.peekToken()
    while (
      currentToken &&
      (currentToken.tokenValue === 'add' || currentToken.tokenValue === 'minus')
    ) {
      const operatorToken = this.consumeToken()
      const rightNode = this.parseTerm()
      leftNode = new BinaryOperatorNode(
        operatorToken.tokenValue,
        leftNode,
        rightNode,
      )
      currentToken = this.peekToken()
    }
    return leftNode
  }

  // Level 2: multiply and divide
  parseTerm() {
    // search number
    let leftNode = this.parseFactor()

    // search multiply and divide
    let currentToken = this.peekToken()
    while (
      currentToken &&
      (currentToken.tokenValue === 'multiply' || currentToken.tokenValue === 'divide')
    ) {
      const operatorToken = this.consumeToken()
      const rightNode = this.parseFactor()
      leftNode = new BinaryOperatorNode(
        operatorToken.tokenValue,
        leftNode,
        rightNode,
      )
      currentToken = this.peekToken()
    }
    return leftNode
  }

  // Level 3: number
  parseFactor() {
    
    const token = this.consumeToken()
    
    if (!token) {
      throw new Error('Imcomplete expression')
    }
    if (token.tokenType === 'number') {
      return new LiteralNode(parseFloat(token.tokenValue))
    }
    throw new Error('Unexpected element')
  }
}
