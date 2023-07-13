/* eslint-disable prefer-destructuring */
import { assert, fixture } from '@open-wc/testing';
import sinon from 'sinon';
import { CalculatorApp } from '../src/demo-calculator.js';

/**
 * @param {EventTarget} element
 * @param {string} code
 * @param {KeyboardEventInit=} opts
 * @returns {void}
 */
function keyDownOn(element, code, opts = {}) {
  const defaults = /** @type KeyboardEventInit */ ({
    bubbles: true,
    cancelable: true,
    composed: true,
  });
  const options = { ...defaults, ...opts, ...{ code } };
  const down = new KeyboardEvent('keydown', options);
  element.dispatchEvent(down);
}

describe('CalculatorApp', () => {
  let partsResult;
  let opResult;

  beforeEach(async () => {
    partsResult = await fixture('<span id="partsResult" class="display-parts">&nbsp;</span>');
    opResult = await fixture('<span id="opResult">&nbsp;</span>');
  });

  describe('constructor()', () => {
    /** @type CalculatorApp */
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
    });

    it('Creates empty queue', async () => {
      assert.typeOf(instance.queue, 'array');
      assert.lengthOf(instance.queue, 0);
    });
  });

  describe('partsResult', () => {
    /** @type CalculatorApp */
    let instance;
    beforeEach(async () => {
      await fixture('<span id="partsResult" class="display-parts">&nbsp;</span>');
      instance = new CalculatorApp();
    });

    it('Returns reference to the element', () => {
      assert.ok(instance.partsResult);
    });
  });

  describe('opResult', () => {
    /** @type CalculatorApp */
    let instance;
    beforeEach(async () => {
      await fixture('<span id="opResult">&nbsp;</span>');
      instance = new CalculatorApp();
    });

    it('Returns reference to the element', () => {
      assert.ok(instance.opResult);
    });
  });

  describe('add()', () => {
    /** @type CalculatorApp */
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
      instance.queue = [1];
    });

    it('Calls _pushSymbol() with argument', () => {
      const spy = sinon.spy(instance, '_pushSymbol');
      instance.add();
      assert.equal(spy.args[0][0], CalculatorApp.PLUS_SYMBOL);
    });

    it('Symbol is in the queue', () => {
      instance.add();
      assert.deepEqual(instance.queue, [1, CalculatorApp.PLUS_SYMBOL]);
    });
  });

  describe('multiply()', () => {
    /** @type CalculatorApp */
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
      instance.queue = [1];
    });

    it('Calls _pushSymbol() with argument', () => {
      const spy = sinon.spy(instance, '_pushSymbol');
      instance.multiply();
      assert.equal(spy.args[0][0], CalculatorApp.MULTIPLY_SYMBOL);
    });

    it('Symbol is in the queue', () => {
      instance.multiply();
      assert.deepEqual(instance.queue, [1, CalculatorApp.MULTIPLY_SYMBOL]);
    });
  });

  describe('divide()', () => {
    /** @type CalculatorApp */
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
      instance.queue = [1];
    });

    it('Calls _pushSymbol() with argument', () => {
      const spy = sinon.spy(instance, '_pushSymbol');
      instance.divide();
      assert.equal(spy.args[0][0], CalculatorApp.DIVIDE_SYMBOL);
    });

    it('Symbol is in the queue', () => {
      instance.divide();
      assert.deepEqual(instance.queue, [1, CalculatorApp.DIVIDE_SYMBOL]);
    });
  });

  describe('subtract()', () => {
    /** @type CalculatorApp */
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
      instance.queue = [1];
    });

    it('Calls _pushSymbol() with argument', () => {
      const spy = sinon.spy(instance, '_pushSymbol');
      instance.subtract();
      assert.equal(spy.args[0][0], CalculatorApp.MINUS_SYMBOL);
    });

    it('Symbol is in the queue', () => {
      instance.subtract();
      assert.deepEqual(instance.queue, [1, CalculatorApp.MINUS_SYMBOL]);
    });

    it('Adds symbol when no queue', () => {
      instance.queue = [];
      instance.subtract();
      assert.deepEqual(instance.queue, [CalculatorApp.MINUS_SYMBOL]);
    });

    it('adds another symbol when has previous symbol', () => {
      instance.queue = [CalculatorApp.MINUS_SYMBOL];
      instance.subtract();
      assert.deepEqual(instance.queue, [CalculatorApp.MINUS_SYMBOL, CalculatorApp.MINUS_SYMBOL]);
    });
  });

  describe('dot()', () => {
    /** @type CalculatorApp */
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
      instance.queue = [1];
    });

    it('Calls _pushSymbol() with argument', () => {
      const spy = sinon.spy(instance, '_pushSymbol');
      instance.dot();
      assert.equal(spy.args[0][0], CalculatorApp.DOT_SYMBOL);
    });

    it('Symbol is in the queue', () => {
      instance.dot();
      assert.deepEqual(instance.queue, [1, CalculatorApp.DOT_SYMBOL]);
    });

    it('Adds 0 when no queue', () => {
      instance.queue = [];
      instance.dot();
      assert.deepEqual(instance.queue, [0, CalculatorApp.DOT_SYMBOL]);
    });

    it('Ignores when float value is already in the queue', () => {
      instance.queue = ['1.23'];
      instance.dot();
      assert.deepEqual(instance.queue, ['1.23']);
    });
  });

  describe('backspace()', () => {
    /** @type CalculatorApp */
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
    });

    it('Ignores the call when no elements', () => {
      const spy = sinon.spy(instance, 'render');
      instance.backspace();
      assert.isFalse(spy.called);
    });

    it('Removes last symbol', () => {
      instance.queue = [1, CalculatorApp.DOT_SYMBOL];
      instance.backspace();
      assert.deepEqual(instance.queue, [1]);
    });

    it('Removes single digit number', () => {
      instance.queue = [1];
      instance.backspace();
      assert.deepEqual(instance.queue, []);
    });

    it('Removes last digit from a number', () => {
      instance.queue = [123];
      instance.backspace();
      assert.deepEqual(instance.queue, [12]);
    });

    it('Removes fraction', () => {
      instance.queue = ['123.456'];
      instance.backspace();
      assert.deepEqual(instance.queue, ['123.45']);
    });

    it('Calls render function', () => {
      const spy = sinon.spy(instance, 'render');
      instance.queue = ['123.456'];
      instance.backspace();
      assert.isTrue(spy.called);
    });
  });

  describe('_pushSymbol()', () => {
    /** @type CalculatorApp */
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
    });

    it('Ignores the call when no items in the queue', () => {
      instance._pushSymbol('+');
      assert.deepEqual(instance.queue, []);
    });

    it('Adds new symbol to the queue', () => {
      instance.queue = [1];
      instance._pushSymbol('+');
      assert.deepEqual(instance.queue, [1, '+']);
    });

    it('Replaces previous symbol', () => {
      instance.queue = [1, '+'];
      instance._pushSymbol('-');
      assert.deepEqual(instance.queue, [1, '-']);
    });

    it('Calls render function', () => {
      const spy = sinon.spy(instance, 'render');
      instance.queue = [1, '+'];
      instance._pushSymbol('-');
      assert.isTrue(spy.called);
    });
  });

  describe('calculate()', () => {
    /** @type CalculatorApp */
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
    });

    [
      [[1, CalculatorApp.PLUS_SYMBOL, 1], 2],
      [[2, CalculatorApp.PLUS_SYMBOL, CalculatorApp.MINUS_SYMBOL, 1], 1],
      [[2, CalculatorApp.PLUS_SYMBOL, CalculatorApp.MINUS_SYMBOL, CalculatorApp.MINUS_SYMBOL, 1], 3],
      [[2, CalculatorApp.MINUS_SYMBOL, 1], 1],
      [[2, CalculatorApp.MULTIPLY_SYMBOL, 3], 6],
      [[6, CalculatorApp.DIVIDE_SYMBOL, 3], 2],
      [[1, CalculatorApp.PLUS_SYMBOL, 2, CalculatorApp.MULTIPLY_SYMBOL, 3], 7],
      [[1, CalculatorApp.PLUS_SYMBOL, 2, CalculatorApp.MULTIPLY_SYMBOL, CalculatorApp.MINUS_SYMBOL, 3], -5],
      [[], 0],
      [[6, CalculatorApp.DIVIDE_SYMBOL, 0], 'Division by zero!'],
      [[CalculatorApp.MINUS_SYMBOL, 2, CalculatorApp.PLUS_SYMBOL, 1], -1],
      [[CalculatorApp.MINUS_SYMBOL, 2, CalculatorApp.MULTIPLY_SYMBOL, 2], -4],
      [[CalculatorApp.MINUS_SYMBOL, 2, CalculatorApp.MULTIPLY_SYMBOL, 2, CalculatorApp.MULTIPLY_SYMBOL], -4],
      [[CalculatorApp.MULTIPLY_SYMBOL], 0],
      [[CalculatorApp.MINUS_SYMBOL, 1, CalculatorApp.PLUS_SYMBOL, 2], 1],
      [[1, CalculatorApp.MINUS_SYMBOL, 2, CalculatorApp.MINUS_SYMBOL, 3], -4],
      [[1, CalculatorApp.PLUS_SYMBOL, 2, CalculatorApp.PLUS_SYMBOL, 3], 6]
    ].forEach((item) => {
      it(`Calculates ${item[0]}`, () => {
        instance.queue = /** @type number[] */ (item[0]);
        instance.calculate();
        assert.equal(opResult.innerText.trim(), item[1]);
      });
    });

    it('Updates the queue', () => {
      instance.queue = [1, CalculatorApp.PLUS_SYMBOL, 1];
      instance.calculate();
      assert.deepEqual(instance.queue, [2]);
    });
  });

  describe('Buttons click', () => {
    /** @type CalculatorApp */
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
    });

    afterEach(() => {
      instance.release();
    });

    [
      [0, [0]],
      [1, [1]],
      [2, [2]],
      [3, [3]],
      [4, [4]],
      [5, [5]],
      [6, [6]],
      [7, [7]],
      [8, [8]],
      [9, [9]],
      ['dot', [1, CalculatorApp.DOT_SYMBOL], [1]],
      ['div', [1, CalculatorApp.DIVIDE_SYMBOL], [1]],
      ['mul', [1, CalculatorApp.MULTIPLY_SYMBOL], [1]],
      ['sub', [1, CalculatorApp.MINUS_SYMBOL], [1]],
      ['add', [1, CalculatorApp.PLUS_SYMBOL], [1]]
    ].forEach((item) => {
      it(`Handles button click for ${item[0]}`, async () => {
        if (item[2]) {
          instance.queue = /** @type number[] */ (item[2]);
        }
        const value = item[0];
        const button = /** @type HTMLButtonElement */ (await fixture(`<button class="action" data-value="${value}">${value}</button>`));
        instance.init();
        button.click();
        assert.deepEqual(instance.queue, /** @type number[] */ (item[1]));
      });
    });

    it('Handles sum key', async () => {
      instance.queue = [1, CalculatorApp.PLUS_SYMBOL, 1];
      const button = /** @type HTMLButtonElement */ (await fixture(`<button class="action" data-value="sum">=</button>`));
      instance.init();
      button.click();
      assert.equal(opResult.innerText.trim(), '2');
    });

    it('Removes focus from the button', async () => {
      const button = /** @type HTMLButtonElement */ (await fixture(`<button class="action" data-value="1">1<button>`));
      instance.init();
      button.focus();
      const spy = sinon.spy(button, 'blur');
      button.dispatchEvent(new CustomEvent('mouseup'));
      assert.isTrue(spy.called);
    });
  });

  describe('processNumber()', () => {
    /** @type CalculatorApp */
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
    });

    it('Does nothing when no valid number', () => {
      instance.processNumber('test');
      assert.deepEqual(instance.queue, []);
    });

    it('Adds number item to empty queue', () => {
      instance.processNumber(2);
      assert.deepEqual(instance.queue, [2]);
    });

    it('Adds number as string item to empty queue', () => {
      instance.processNumber('3');
      assert.deepEqual(instance.queue, [3]);
    });

    it('Appends number to previous number', () => {
      instance.queue = [1];
      instance.processNumber('3');
      assert.deepEqual(instance.queue, [13]);
    });

    it('Appends number to a float number', () => {
      instance.queue = ['1.01'];
      instance.processNumber('3');
      assert.deepEqual(instance.queue, ['1.013']);
    });

    it('Appends number after a symbol', () => {
      instance.queue = [1, CalculatorApp.PLUS_SYMBOL];
      instance.processNumber('3');
      assert.deepEqual(instance.queue, [1, CalculatorApp.PLUS_SYMBOL, 3]);
    });

    it('Appends number after a dot symbol', () => {
      instance.queue = [1, CalculatorApp.DOT_SYMBOL];
      instance.processNumber('3');
      assert.deepEqual(instance.queue, ['1.3']);
    });
  });

  describe('clear()', () => {
    /** @type CalculatorApp */
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
    });

    it('Sets operation result field to 0', () => {
      opResult.innerText = 'TEST';
      instance.clear();
      assert.equal(opResult.innerText.trim(), '0');
    });

    it('Sets operation parts result field to empty space', () => {
      opResult.partsResult = 'TEST';
      instance.clear();
      assert.equal(partsResult.innerHTML.trim(), '&nbsp;');
    });

    it('Clears the queue', () => {
      instance.queue = [1];
      instance.clear();
      assert.deepEqual(instance.queue, []);
    });
  });

  describe('Keyboard control', () => {
    /** @type CalculatorApp */
    let instance;

    beforeEach(() => {
      instance = new CalculatorApp();
      instance.init();
    });

    afterEach(() => {
      instance.release();
    });

    it('calls clear() for the "Escape" keys', () => {
      const spy = sinon.spy(instance, 'clear');
      keyDownOn(document.body, 'Escape', { keyCode: 27 });
      assert.isTrue(spy.called);
    });

    it('calls add() for the NumpadAdd keys', () => {
      const spy = sinon.spy(instance, 'add');
      keyDownOn(document.body, 'NumpadAdd');
      assert.isTrue(spy.called);
    });

    it('calls add() for the shift and Equal keys', () => {
      const spy = sinon.spy(instance, 'add');
      keyDownOn(document.body, 'Equal', { shiftKey: true });
      assert.isTrue(spy.called);
    });

    it('calls subtract() for the Minus key', () => {
      const spy = sinon.spy(instance, 'subtract');
      keyDownOn(document.body, 'Minus');
      assert.isTrue(spy.called);
    });

    it('calls subtract() for the NumpadSubtract key', () => {
      const spy = sinon.spy(instance, 'subtract');
      keyDownOn(document.body, 'NumpadSubtract');
      assert.isTrue(spy.called);
    });

    it('calls multiply() for the NumpadMultiply key', () => {
      const spy = sinon.spy(instance, 'multiply');
      keyDownOn(document.body, 'NumpadMultiply');
      assert.isTrue(spy.called);
    });

    it('calls add() for the shift and Digit8 keys', () => {
      const spy = sinon.spy(instance, 'multiply');
      keyDownOn(document.body, 'Digit8', { shiftKey: true, key: '8' });
      assert.isTrue(spy.called);
    });

    it('calls divide() for the Slash key', () => {
      const spy = sinon.spy(instance, 'divide');
      keyDownOn(document.body, 'Slash');
      assert.isTrue(spy.called);
    });

    it('calls divide() for the NumpadDivide key', () => {
      const spy = sinon.spy(instance, 'divide');
      keyDownOn(document.body, 'NumpadDivide');
      assert.isTrue(spy.called);
    });

    it('calls calculate() for the Enter key', () => {
      const spy = sinon.spy(instance, 'calculate');
      keyDownOn(document.body, 'Enter');
      assert.isTrue(spy.called);
    });

    it('calls calculate() for the NumpadEnter key', () => {
      const spy = sinon.spy(instance, 'calculate');
      keyDownOn(document.body, 'NumpadEnter');
      assert.isTrue(spy.called);
    });

    it('calls calculate() for the Equal key', () => {
      const spy = sinon.spy(instance, 'calculate');
      keyDownOn(document.body, 'Equal');
      assert.isTrue(spy.called);
    });

    it('calls dot() for . keys', () => {
      const spy = sinon.spy(instance, 'dot');
      keyDownOn(document.body, '.');
      assert.isTrue(spy.called);
    });

    it('calls dot() for , keys', () => {
      const spy = sinon.spy(instance, 'dot');
      keyDownOn(document.body, ',');
      assert.isTrue(spy.called);
    });

    it('calls backspace() for , keys', () => {
      const spy = sinon.spy(instance, 'backspace');
      keyDownOn(document.body, 'Backspace');
      assert.isTrue(spy.called);
    });

    it('calls processNumber() for numeric keys', () => {
      const spy = sinon.spy(instance, 'processNumber');
      keyDownOn(document.body, 'Digit1', { key: '1' });
      assert.isTrue(spy.called);
    });

    it('calls clear() for the Escape key', () => {
      const spy = sinon.spy(instance, 'clear');
      keyDownOn(document.body, 'Escape');
      assert.isTrue(spy.called);
    });

    it('ignores other keys', () => {
      keyDownOn(document.body, ';');
      assert.deepEqual(instance.queue, []);
    });
  });
});
