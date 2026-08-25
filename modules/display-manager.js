import { NUMBERS, UNARY_OPERATORS, BINARY_OPERATORS, MANIPULATORS } from '../types/types.js'

export class DisplayManager {
  keyboardComponent;
  calculatorComponent;
  alertComponent;
  calculusComponent;
  resultComponent;

  constructor(KEYBOARD_CONFIG, ALERT_MESSAGES, calculatorController) {
    this.keyboardKeysConfig = KEYBOARD_CONFIG;
    this.ALERT_MESSAGES = ALERT_MESSAGES;
    this.calculatorController = calculatorController;
    this.calculatorComponent = document.getElementById('calculator');
    this.KeyboardBuilder();
  } 
 
  KeyboardBuilder() {
    // calculator display component creation
    this.calculatorDisplay = document.createElement('div');
    this.calculatorDisplay.id = 'calculator-display';
    this.calculatorDisplay.classList.add('calculator-display');
    this.alertComponent = document.createElement('div');
    this.alertComponent.id = 'display-alert';
    this.alertComponent.classList.add('alert');
    this.calculusComponent = document.createElement('div');
    this.calculusComponent.id = 'display-calculus';
    this.calculusComponent.classList.add('calculus');
    this.resultComponent = document.createElement('div');
    this.resultComponent.id = 'display-result';
    this.resultComponent.classList.add('result-baseResult');
    this.calculatorDisplay.appendChild(this.alertComponent);
    this.calculatorDisplay.appendChild(this.calculusComponent);
    this.calculatorDisplay.appendChild(this.resultComponent);
    
    // calculator keyboard component creation
    this.keyboardComponent = document.createElement('div');
    this.keyboardComponent.id = 'calculator-keyboard';
    this.keyboardComponent.classList.add('keyboard');

    // calculator component creation
    this.calculatorComponent.appendChild(this.calculatorDisplay);
    this.calculatorComponent.appendChild(this.keyboardComponent);

    // calculator display component initialisation
    this.calculusComponent.innerHTML = '';
    this.resultComponent.innerHTML = '0';
    this.alertComponent.innerHTML = this.ALERT_MESSAGES.start;

    // calculator keyboard component keys creation
    this.keyboardKeysConfig.forEach(keyConfig => {
      const key = this.initKey(keyConfig);
      this.keyboardComponent.appendChild(key);
    });
  }

  initKey(keyConfig) {
    const key = document.createElement('div');
    key.setAttribute('id', keyConfig.id);
    
    if (keyConfig.displayContent != undefined) key.setAttribute('data-display', keyConfig.displayContent);
    
    // Numbers
    if (NUMBERS.includes(key.id)) {
      key.classList.add('key', 'key-number');
      if (key.id === '000') key.classList.add('triplezero');
    
    // Operators
    } else if (UNARY_OPERATORS.includes(key.id) || BINARY_OPERATORS.includes(key.id)) {
      key.classList.add('key', 'key-operator');
      key.setAttribute('data-display', keyConfig.displayContent);
      key.innerHTML = '<i class="fa-solid fa-' + keyConfig.key_icon + '"></i>';
    
    // Manipulators
    } else if (MANIPULATORS.includes(key.id)) {
      key.classList.add('key', 'key-manipulator');
    }
    
    if (keyConfig.key_disabled == true) key.classList.add('key-disabled');
    if (keyConfig.key_icon != undefined)
      key.innerHTML = '<i class="fa-solid fa-' + keyConfig.key_icon + '"></i>';
    else {
      if (keyConfig.displayContent != undefined) {
        key.innerHTML = keyConfig.displayContent;
      } else key.innerHTML = key.id;
    }
    if (keyConfig.key_disabled != true) {
      const key_pressed = {
        key_pressed_value: keyConfig.id,
        key_pressed_type: keyConfig.className.replace('key-', '')}
      if (key_pressed.key_pressed_type === 'operator') {
        key_pressed.key_pressed_type = UNARY_OPERATORS.includes(keyConfig.className) ? 'unaryOperator' : 'binaryOperator';
      }
      // Listener
      key.addEventListener('click', () => { 
        this.calculatorController.onKeyPress(
          key_pressed, 
          this.alertComponent, 
          this.calculusComponent, 
          this.resultComponent); 
      });
    }
    return key;
  }

}