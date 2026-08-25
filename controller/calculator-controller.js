import { MathematicalExpressionBuilder } from '../modules/mathematical-expression-builder.js';
import { NUMBERS, BINARY_OPERATORS, MANIPULATORS } from '../types/types.js'

export class CalculatorController {
  constructor(ALERT_MESSAGES, calculatorController) {
    this.mathematical_expression_builder = new MathematicalExpressionBuilder();
    this.ALERT_MESSAGES = ALERT_MESSAGES;
    this.display_controller = calculatorController;
    this.message = ALERT_MESSAGES.start;
    this.calculus = '';
    this.result = { baseResult: '0', exponentResult: '' };
    this.previous_key_type = '';
    this.previous_key = '';
    this.tmp_key_pressed = undefined;
  }

  clearCalculator() {
    this.mathematical_expression_builder.clearMathematicalExpression()
    this.calculus = ''
    this.result.baseResult = '0'
    this.result.exponentResult = ''
    this.message = this.ALERT_MESSAGES.start
  }

   newCalculus () {
    this.mathematical_expression_builder.clearMathematicalExpression()
    this.message = this.ALERT_MESSAGES.start
    this.previous_key = 'equals'
  }

  onKeyPress(
    key_pressed, 
    alertComponent, 
    calculusComponent, 
    resultComponent) {

    if (!key_pressed) return;
    this.tmp_key_pressed = undefined

    // Handle first key pressed
    if (this.previous_key === 'equals') {
      this.result.exponentResult = ''
      calculusComponent.innerHTML = this.calculus = '';
      resultComponent.innerHTML = this.result.baseResult = '0';
    }
    
    // Handle key value with validation and build calculus string
    this.calculusBuilder(key_pressed)
   
    // Reset starting message on key pressed
    if (
      this.calculus !== '' && 
      this.previous_key !== 'equals' && 
      !(key_pressed.key_pressed_value === '0' && this.message === this.ALERT_MESSAGES.zerosAtStart) &&
      !(key_pressed.key_pressed_value === '000' && this.message === this.ALERT_MESSAGES.zerosAtStart) &&
      !(key_pressed.key_pressed_value === 'decimal' && this.message === this.ALERT_MESSAGES.oneDecimal)
    ) {
      this.message = ''
    }   

    // Handle expression builder
    if (key_pressed.key_pressed_value === 'backspace') {
      this.mathematical_expression_builder.removeLastKeyInMathematicalExpression() 
    } else if (
      key_pressed.key_pressed_value !== 'equals' &&
      key_pressed.key_pressed_value !== 'clear' &&
      this.calculus.length !== 0 &&
      this.message !== this.ALERT_MESSAGES.oneOperator &&
      this.message !== this.ALERT_MESSAGES.zerosAtStart &&
      this.message !== this.ALERT_MESSAGES.oneDecimal
      ) {
      this.mathematical_expression_builder.addKeyInMathematicalExpression(
        (this.tmp_key_pressed !== undefined ? this.tmp_key_pressed.key_pressed_value : key_pressed.key_pressed_value),
        (this.tmp_key_pressed !== undefined ? this.tmp_key_pressed.key_pressed_type : key_pressed.key_pressed_type)
      )
    }

    // Update display
    this.updateDisplay(calculusComponent, resultComponent, alertComponent)
  }
  
  updateDisplay(calculusComponent, resultComponent, alertComponent) {
    // alert message
    if (alertComponent) alertComponent.innerHTML = this.message;
    // calculus
    calculusComponent.innerHTML = '';
    if (this.calculus !== '') for(let character of this.calculus) {
       calculusComponent.innerHTML += '<span class="' + ((NUMBERS.includes(character) || character === '.') ? 'number' : 'operator') + '">' + character + '</span>';
    } else { calculusComponent.innerHTML += '<span class="number"></span>'; };
    // result
    if (this.result.baseResult !== '' || this.result.exponentResult !== '') {
      if (this.result.exponentResult) {
        resultComponent.innerHTML = 
          '<span class="result-exponentResult">' 
          + this.result.exponentResult.slice(0, this.result.exponentResult.indexOf('e')) + '</span>'
          + '<span class="result-exponentResult exponent">' + this.result.exponentResult.slice(this.result.exponentResult.indexOf('e')) + '</span>';
      } else {
        resultComponent.innerHTML = this.result.baseResult;
        resultComponent.classList.remove('result-exponentResult');
      }
    } else { 
      resultComponent.innerHTML = '0';
      resultComponent.classList.remove('result-exponentResult');
     }
  }

  calculate() {
    try {
      // Try to build AST tree and evaluate it
      const AstTree = this.mathematical_expression_builder.buildAstTree();
      if (AstTree) {
        this.result.baseResult = String(AstTree.evaluate());
        this.message = ''
      }
    } catch {
      this.message = this.ALERT_MESSAGES.error;
    }
  }

  calculusBuilder (key_pressed) {
    // Hanlde number
    if (key_pressed.key_pressed_type.includes('number')) {
      // console.log('--- number')
      // No triple zero at start (000)
      if (
        key_pressed.key_pressed_value === '000' &&
        (this.calculus.length === 0 ||
          this.previous_key_type === 'binaryOperator' ||
          this.previous_key === '0')
      ) {
        this.message = this.ALERT_MESSAGES.zerosAtStart
      }
      // No double zero
      else if (
        key_pressed.key_pressed_value === '0' &&
        this.previous_key === '0') {
        this.message = this.ALERT_MESSAGES.zerosAtStart
      }
      // No zero before number
      else if (
        key_pressed.key_pressed_value !== '0' &&
        key_pressed.key_pressed_value !== '000' &&
        key_pressed.key_pressed_value !== 'decimal' &&
        this.previous_key === '0'
      ) {
        this.calculus = this.calculus.slice(0, -1)
        this.calculus += key_pressed.key_pressed_value
        this.previous_key_type = 'number'
        this.previous_key = key_pressed.key_pressed_value
      } else {
        this.calculus += this.previous_key = key_pressed.key_pressed_value
        this.previous_key_type = 'number'
      }
    }

    // Handle operator
    else if (key_pressed.key_pressed_type === 'binaryOperator') {

      if (this.previous_key_type !== 'number') {
        // Can't start with operator
        if (this.previous_key !== 'equals' || this.calculus === '') {
          this.message = this.ALERT_MESSAGES.operatorAtStart
        // No operator folowing operator
        } else {
          this.message = this.ALERT_MESSAGES.oneOperator
        }
      } else {
        if (key_pressed.key_pressed_value === 'add') {
          this.calculus += this.previous_key = '+'
        } else if (key_pressed.key_pressed_value === 'minus') {
          this.calculus += this.previous_key = '-'
        } else if (key_pressed.key_pressed_value === 'multiply') {
          this.calculus += this.previous_key = '*'
        } else if (key_pressed.key_pressed_value === 'divide') {
          this.calculus += this.previous_key = '/'
        }
        this.previous_key_type = 'binaryOperator'
      }
    }

    // Handle manipulator
    else if (key_pressed.key_pressed_type === 'manipulator') {
      // Decimal handling
      if (key_pressed.key_pressed_value === 'decimal') {
        // No multiple decimals
        if (this.previous_key === 'decimal') {
          this.message = this.ALERT_MESSAGES.oneDecimal
        }
        // Add zero before decimal at start
        else if (this.calculus.length === 0) {
          this.calculus += '0.'
          this.tmp_key_pressed = {
            key_pressed_value: '0.',
            key_pressed_type: 'number'
          }
          this.previous_key = 'decimal'
          this.previous_key_type = 'manipulator'
        }
        // Add zero before decimal after operator
        else if (this.calculus.length !== 0 && this.previous_key_type === 'binaryOperator') {
          this.calculus += '0.'
          this.tmp_key_pressed = {
            key_pressed_value: '0.',
            key_pressed_type: 'number'
          }
          this.previous_key = 'decimal'
          this.previous_key_type = 'manipulator'
        }
        // No decimal ending the calculus
        else if (this.calculus.slice(-1) === '.') {
          this.message = this.ALERT_MESSAGES.endDecimal
          // Add number
          this.calculus += this.previous_key = key_pressed.key_pressed_value
          this.previous_key_type = 'number'
        }
        // Only one decimal
        else if (this.mathematical_expression_builder.getLastToken().tokenValue.includes('.')) {
          this.message = this.ALERT_MESSAGES.oneDecimal
        } else {
          this.calculus += '.'
          this.previous_key = 'decimal'
          this.previous_key_type = 'manipulator'
        }
      }

      // Backspace handling
      else if (key_pressed.key_pressed_value === 'backspace') {
        if (this.calculus.length > 0) {
          // Back to the previous key pressed in the calculus
          this.calculus = this.calculus.slice(0, -1)
          // Back to the previous key pressed in the previous_key
          this.previous_key = this.calculus.slice(0, -1)
          if (NUMBERS.includes(this.previous_key)) this.previous_key_type = 'number'
          else if (BINARY_OPERATORS.includes(this.previous_key))
            this.previous_key_type = 'binaryoperator'
          else if (MANIPULATORS.includes(this.previous_key))
            this.previous_key_type = 'manipulator'
          if (this.calculus === '') this.message = this.ALERT_MESSAGES.start
        }
      }

      // Equals handling
      else if (key_pressed.key_pressed_value === 'equals') {
        this.previous_key_type = 'manipulator'
        this.previous_key = 'equals'

        // Calculate result
        this.calculate()

        // Convert result in scientific notation if it exceeds 7 digits
        if (this.result.baseResult.length > 7) {
          this.convertResultInscientificNotation()
        } else this.result.exponentResult = ''
        this.newCalculus()
      }

      // Clear handling
      else if (key_pressed.key_pressed_value === 'clear') {
        this.clearCalculator()
      }
    }
  }

  convertResultInscientificNotation = () => {
    let decimal = this.result.baseResult.length
    while (Number(this.result.baseResult).toExponential(decimal).length > 8) {
      this.result.exponentResult = Number(this.result.baseResult).toExponential(decimal)
      decimal--
    }
  }

}