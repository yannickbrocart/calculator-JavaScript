import { Parser } from './parser.js'

export class MathematicalExpressionBuilder {
  tokens = []

  // Add key
  addKeyInMathematicalExpression(tokenValue, tokenType) {
    // cache of the last token
    const lastToken = this.tokens[this.tokens.length - 1]
    // concatenate multiple numbers
    if (lastToken && lastToken.tokenType === 'number' && tokenType === 'number') {
      lastToken.tokenValue += tokenValue
    }
    // concatenate decimal and numbers
    else if (lastToken && lastToken.tokenType === 'number' && tokenValue === 'decimal') {
      lastToken.tokenValue += '.'
    }
    // handle backspace
    else if (lastToken && tokenValue === 'backspace') {
      if (lastToken.tokenValue.length > 1) lastToken.tokenValue.slice(0, -1)
      else {
        lastToken.tokenValue = this.tokens[this.tokens.length - 2].tokenValue
        this.tokens.slice(0, -1)
      }
    }
    // add new token
    else {
      this.tokens.push({ tokenValue, tokenType })
    }
  }

  // Remove last key
  removeLastKeyInMathematicalExpression() {
    if (this.tokens.length === 0) return;
    const lastToken = this.tokens[this.tokens.length - 1];
    // if the last token is a composite number remove last element
    if (lastToken.tokenType === 'number' && lastToken.tokenValue.length > 1) {
      lastToken.tokenValue = lastToken.tokenValue.slice(0, -1);
    // remove the last tocken
    } else {
      this.tokens.pop();
    }
  }

  // Getter
  getTokens() {
    return this.tokens
  }

  getLastToken() {
    return this.tokens[this.tokens.length - 1]
  }

  // Clear mathematical expression
  clearMathematicalExpression() {
    this.tokens = []
  }

  // Build AST tree from mathematical expression
  buildAstTree() {    
    if (this.tokens.length === 0) {
      return null
    }
    return this.parseTokensToAstTree(this.tokens)
  }

  // Parse token to AST tree
  parseTokensToAstTree(tokens) {
    const parser = new Parser(tokens)
    const treeNode = parser.parseToken()
    if (!treeNode) {
      throw new Error("Build mathematical tree node isn't possible !")
    }    
    return treeNode
  }
}