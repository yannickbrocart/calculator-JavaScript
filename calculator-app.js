import { CalculatorController } from './controller/calculator-controller.js';
import { KEYBOARD_KEYS_CONFIG } from './configs/keyboard-config.js';
import { ALERT_MESSAGES } from './types/types.js';
import { DisplayManager } from './modules/display-manager.js';

document.addEventListener('DOMContentLoaded', () => {
  const calculatorController = new CalculatorController(ALERT_MESSAGES);
  new DisplayManager(
    KEYBOARD_KEYS_CONFIG, 
    ALERT_MESSAGES, 
    calculatorController);
});