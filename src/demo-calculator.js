/**
 * A tutorial application that shows how to build a calculator application
 * in JavaScript.
 */
export class CalculatorApp {
  static get PLUS_SYMBOL() {
    return '+';
  }

  static get MINUS_SYMBOL() {
    return '-';
  }

  static get MULTIPLY_SYMBOL() {
    return 'x';
  }

  static get DIVIDE_SYMBOL() {
    return '÷';
  }

  static get DOT_SYMBOL() {
    return '.';
  }
  /**
   * @return {Element} Reference to the formula parts dispay node.
   */
  get partsResult() {
    if (!this.__partsResult) {
      this.__partsResult = document.getElementById('partsResult');
    }
    return this.__partsResult;
  }
  /**
   * @return {Element} Reference to the result dispay node.
   */
  get opResult() {
    if (!this.__opResult) {
      this.__opResult = document.getElementById('opResult');
    }
    return this.__opResult;
  }

  constructor() {
    // Because scope in event listeners changes to the originating HTML element
    // we bind current scope to the handler function.
    this._actionHandler = this._actionHandler.bind(this);
    this._mouseUpHandler = this._mouseUpHandler.bind(this);
    this._keyDownHandler = this._keyDownHandler.bind(this);
    // This is where the list of operations is kept.
    this.queue = [];
  }
  /**
   * Initializes the calculator app by attaching event listener to each button.
   * This could be optymized by adding single event listener on a parent of all
   * buttons but this is out of scope of this tutorial.
   */
  init() {
    const nodes = document.querySelectorAll('button.action');
    for (let i = 0, len = nodes.length; i < len; i++) {
      nodes[i].addEventListener('click', this._actionHandler);
      nodes[i].addEventListener('mouseup', this._mouseUpHandler);
    }
    document.body.addEventListener('keydown', this._keyDownHandler);
  }
  /**
   * Click event handler for all action buttons. It calls corresponding function
   * depending on user selection. It looks for the `data-value` attribute for
   * button's value which can be a numeric value if an operation.
   * @param {ClickEvent} e
   */
  _actionHandler(e) {
    // e.target is the button being clicked on
    // target.dataset is a list of `data-*` attributes
    // dataset.value is the `data-value=...` attribute's value.
    const operation = e.target.dataset.value;
    switch (operation) {
      case 'add': this.add(); break;
      case 'sub': this.subtract(); break;
      case 'mul': this.multiply(); break;
      case 'div': this.divide(); break;
      case 'dot': this.dot(); break;
      case 'sum': this.calculate(); break;
      default:
        this.processNumber(operation);
    }
  }
  /**
   * A handler for mouse up event dispatched from an action button.
   * When clicking and releasing this removes focus from a button so it won't
   * be styled like keyboard focus via `:focus` selector.
   * @param {MouseEvent} e
   */
  _mouseUpHandler(e) {
    e.target.blur();
  }
  /**
   * Adds the add symbol to the queue.
   * This operation is ignored when there's no previus element.
   */
  add() {
    this._pushSumbol(CalculatorApp.PLUS_SYMBOL);
  }
  /**
   * Adds the minus symbol to the queue.
   * When unlike other sumbol adding functions this will always add
   * the symbol to the queue as minus is a negation of a value before it (even
   * if the value is another minus).
   */
  subtract() {
    const last = this.queue[this.queue.length - 1];
    if (last === undefined || isNaN(last)) {
      this.queue[this.queue.length] = CalculatorApp.MINUS_SYMBOL;
      this.render();
    } else {
      this._pushSumbol(CalculatorApp.MINUS_SYMBOL);
    }
  }
  /**
   * Adds the multiply symbol to the queue.
   * This operation is ignored when there's no previus element.
   */
  multiply() {
    this._pushSumbol(CalculatorApp.MULTIPLY_SYMBOL);
  }
  /**
   * Adds the divide symbol to the queue.
   * This operation is ignored when there's no previus element.
   */
  divide() {
    this._pushSumbol(CalculatorApp.DIVIDE_SYMBOL);
  }
  /**
   * Adds "dot" (decimal symbol) to the queue.
   * It performs the following sanity check beforehand:
   * - If there's no previous element or previous element is not a number then it
   * adds "0" before adding the dot symbol
   * - If the previous element is already a decimal then the operation is cancelled.
   */
  dot() {
    // If the last element in queue is not a number then push 0 value in front
    // as this will be fraction of 1.
    const last = this.queue[this.queue.length - 1];
    if (last === undefined || isNaN(last)) {
      this.queue[this.queue.length] = 0;
    } else if (typeof last === 'string') {
      // This is already a decimal value which in this app is represented as
      // string.
      return;
    }
    this._pushSumbol(CalculatorApp.DOT_SYMBOL);
  }
  /**
   * Cancels previous user input.
   */
  backspace() {
    const last = this.queue[this.queue.length - 1];
    if (last === undefined) {
      return;
    }
    // If it's a symbol then
    if (isNaN(last)) {
      this.queue.pop();
    } else {
      const int = Number.isInteger(last);
      let tmp = String(last);
      if (!tmp || tmp.length === 1) {
        this.queue.pop();
      } else {
        tmp = tmp.substr(0, tmp.length - 1);
        this.queue[this.queue.length - 1] = int ? Number(tmp) : tmp;
      }
    }
    this.render();
  }
  /**
   * Adds new symbot to the queue and performs some checks beforehand.
   * If last element in the queue is a symbol then the symbol is replaced by current value.
   * Otherwise it is being added to the end of the queue.
   *
   * Also if the last element is undefined (no previous element) the adding symbol operation
   * is ignored as there's no point of adding it.
   * In this case there's no need to inform the user about the error.
   * @param {String} symbol An operation symbol to append.
   */
  _pushSumbol(symbol) {
    const last = this.queue[this.queue.length - 1];
    if (last === undefined) {
      return;
    }
    if (isNaN(last)) {
      this.queue[this.queue.length - 1] = symbol;
    } else {
      this.queue[this.queue.length] = symbol;
    }
    this.render();
  }
  /**
   * Calculates the value for current queue of arguments and prints the
   * result in the display.
   */
  calculate() {
    // Make a copy of the array so we can manipulate it's values.
    const queue = Array.from(this.queue);
    if (queue.length === 0) {
      this.opResult.innerText = 0;
      return;
    }
    // Removes any symbol that is at the end of the queue
    if (isNaN(queue[queue.length - 1])) {
      queue.pop();
    }
    // Again just to be sure
    if (queue.length === 0) {
      this.opResult.innerText = 0;
      return;
    }
    // First we are going to get rid of all "-" signs and set number value of the
    // next item in the queue to negative number value.
    // This way we don't have to carry about negative numbers later on.
    //
    // Note, this adds additional layer of complexity to the function as
    // this is another iteration over the array. It is called the big O or order of function.
    // With this 3 loops the complexity is O(3n) meaning for n number of elements
    // in the array each array may iterate over all initial items (3 times together).
    // The same could have been done in other 2 loops (reducing it to O(2)) by giving more conditions
    // but for code readibility I decided to split it into 3 loops.
    for (let i = queue.length - 1; i >= 0; i--) {
      const current = queue[i];
      if (current !== CalculatorApp.MINUS_SYMBOL) {
        continue;
      }
      const previous = queue[i - 1];
      const next = queue[i + 1];
      queue[i + 1] = -Number(next);
      if (!isNaN(previous)) {
        queue[i] = CalculatorApp.PLUS_SYMBOL;
      } else {
        queue.splice(i, 1);
      }
    }

    // Now, multiply and divide values as this operations have priority.
    // The function looks for multiply and divide symbols in the queue and
    // performs the operations between number before an after the symbol.
    // The result replaces all 3 items in the queue.
    // Because array length may change during the oprtation we begin to iterate
    // from the end of the array.
    for (let i = queue.length - 1; i >= 0; i--) {
      const current = queue[i];
      if (current !== CalculatorApp.MULTIPLY_SYMBOL && current !== CalculatorApp.DIVIDE_SYMBOL) {
        // not interested for now.
        continue;
      }
      let next = queue[i + 1];
      if (!next && current === CalculatorApp.DIVIDE_SYMBOL) {
        // Next item can be 0 or can be empty. Anyway, it's an error
        this._divideByZeroError();
        return;
      }
      const previous = Number(queue[i - 1]);
      next = Number(next);

      const result = current === CalculatorApp.DIVIDE_SYMBOL ? previous / next : previous * next;
      queue.splice(i - 1, 3, result);
    }
    // At this point the queue contains only sum and minus symbols.
    // We are iterating over the array again from the end of the array performing +/-
    // operations until we are left with a single item which is the result
    for (let i = queue.length - 1; i >= 0; i--) {
      const current = queue[i];
      if (current !== CalculatorApp.PLUS_SYMBOL && current !== CalculatorApp.MINUS_SYMBOL) {
        // it must be a number and we are looking for operators.
        continue;
      }
      const next = Number(queue[i + 1]);
      const previous = Number(queue[i - 1]);
      const result = current === CalculatorApp.PLUS_SYMBOL ? previous + next : previous - next;
      queue.splice(i - 1, 3, result);
    }
    // At this point there's only one element in the queue. This is the result
    // of computation of the value.
    this.opResult.innerText = queue[0];
    // Override current queue so the next operation will begin with result of this operation.
    this.queue = isNaN(queue[0]) ? [] : queue;
  }
  /**
   * Prints an error when the user requested illigal operation of division by zero.
   * Note, in JavaScript division by 0 results with `Infinity` number.
   * From the mathematical pov it is incorrect as this operation is just impossible
   * and cannot return a value. Therefore division by 0 is tested here manually
   * and the error is then printed.
   */
  _divideByZeroError() {
    this.opResult.innerText = 'Division by zero!';
  }

  /**
   * Processses numeric value input.
   * @param {String|Number} value Numeric value to process
   */
  processNumber(value) {
    // cast to a number just to be sure.
    value = Number(value);
    if (value !== value) {
      console.warn('Passed value is not a number.');
      return;
    }
    // In first step we check if there's a previous element in the queue.
    // If not, just add the value to the queue.
    if (!this.queue.length) {
      this.queue.push(value);
    } else {
      // Otherwise we have to deal with previous user input.
      // In general principle if a previous item is a number then the calculator
      // needs to concatenate to numbers together (not add!).
      // It is getting more complicated if the number is a float value. Additional
      // operations has to be performed (described below).
      // When the last operation was a "." then the calculator also has to deal with fractions.
      // Finally when the last element in the queue is some other symbol then
      // current value can be safely added to the queue.
      let last = this.queue[this.queue.length - 1];
      if (last === CalculatorApp.DOT_SYMBOL) {
        // Fractions are a bit of a mess. See description for `_addFraction()`
        // function for more information.
        last = this._addFraction(this.queue[this.queue.length - 2], value);
        // removes the dot from the queue. It is already in the number
        this.queue.pop();
        this.queue[this.queue.length - 1] = last;
      } else if (!isNaN(last)) {
        if (typeof last === 'string') {
          // This must be a fraction already.
          last = this._addFraction(last, value);
        } else {
          // Easy, in this case the calculator has to multiply last value by 10
          // and add current value.
          // Note, last value cannot be fraction here as fractions were detected earlier.
          last = last * 10 + value;
        }
        this.queue[this.queue.length - 1] = last;
      } else {
        // last element is an operator so this is new number.
        this.queue.push(value);
      }
    }
    // Now it is the time to reflect current state in the UI.
    this.render();
  }
  /**
   * Managing fractions is a bit tricky in JavaScript.
   * When the user input "0", then "." and then "0" again, the result in Number
   * is still single "0". Because of that this function converts the number to
   * a string, appends decimal value to the end of it and returns value as a
   * string.
   *
   * The `sum()` function has to take this into account when processing
   * the queue.
   *
   * @param {String|Number} num Number to add fraction to
   * @param {String|Number} value Fraction value to add
   * @return {String}
   */
  _addFraction(num, value) {
    let tmp = String(num);
    if (tmp.indexOf('.') === -1) {
      tmp += '.';
    }
    tmp += value;
    return tmp;
  }
  /**
   * Renders current state of values entered by the user in the upper line of
   * the result display.
   */
  render() {
    let list = '';
    for (let i = 0, len = this.queue.length; i < len; i++) {
      const current = this.queue[i];
      const next = this.queue[i + 1];
      if (list) {
        list += ' ';
      }
      if (next === CalculatorApp.DOT_SYMBOL) {
        i++;
        list += `${current}.${next}`;
      } else {
        list += current;
      }
    }
    if (list) {
      this.partsResult.innerText = list;
    } else {
      this.partsResult.innerHTML = '&nbsp;';
    }
  }
  /**
   * Handles keyboard down event.
   * Depending on the originating key it performs aoperation on the calculator
   * usfing defined functions like `add()`, `subtract()` etc.
   * @param {KeyboardEvent} e
   */
  _keyDownHandler(e) {
    switch (e.key) {
      case 'Escape':
        this.clear();
        break;
      case '+':
        this.add();
        break;
      case '-':
        this.subtract();
        break;
      case '*':
        this.multiply();
        break;
      case '/':
        this.divide();
        break;
      case '=':
        this.calculate();
        break;
      case '.':
      case ',':
        this.dot();
        break;
      case 'Backspace':
        this.backspace();
        break;
      default:
        // Numpad equals sign is the same button as enter. It can be checked using
        // KeyboardEvent.code property.
        if (e.code === 'NumpadEnter') {
          this.calculate();
          return;
        }
        // Numeric kays have number value on KeyboardEvent.key
        if (!isNaN(e.key)) {
          this.processNumber(e.key);
        }
    }
  }
  /**
   * Clears current result and the queue.
   */
  clear() {
    this.opResult.innerText = '0';
    this.partsResult.innerHTML = '&nbsp;';
    this.queue = [];
  }
}
const app = new CalculatorApp();
app.init();
