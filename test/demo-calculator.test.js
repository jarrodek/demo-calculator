import { assert, fixture } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import { keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import { CalculatorApp } from '../src/demo-calculator.js';

describe('CalculatorApp', () => {
  let partsResult;
  let opResult;

  beforeEach(async () => {
    partsResult = await fixture('<span id="partsResult" class="display-parts">&nbsp;</span>');
    opResult = await fixture('<span id="opResult">&nbsp;</span>');
  });

  describe('constructor()', () => {
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
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
      instance.queue = [1];
    });

    it('Calls _pushSumbol() with argument', () => {
      const spy = sinon.spy(instance, '_pushSumbol');
      instance.add();
      assert.equal(spy.args[0][0], CalculatorApp.PLUS_SYMBOL);
    });

    it('Symbol is in the queue', () => {
      instance.add();
      assert.deepEqual(instance.queue, [1, CalculatorApp.PLUS_SYMBOL]);
    });
  });

  describe('multiply()', () => {
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
      instance.queue = [1];
    });

    it('Calls _pushSumbol() with argument', () => {
      const spy = sinon.spy(instance, '_pushSumbol');
      instance.multiply();
      assert.equal(spy.args[0][0], CalculatorApp.MULTIPLY_SYMBOL);
    });

    it('Symbol is in the queue', () => {
      instance.multiply();
      assert.deepEqual(instance.queue, [1, CalculatorApp.MULTIPLY_SYMBOL]);
    });
  });

  describe('divide()', () => {
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
      instance.queue = [1];
    });

    it('Calls _pushSumbol() with argument', () => {
      const spy = sinon.spy(instance, '_pushSumbol');
      instance.divide();
      assert.equal(spy.args[0][0], CalculatorApp.DIVIDE_SYMBOL);
    });

    it('Symbol is in the queue', () => {
      instance.divide();
      assert.deepEqual(instance.queue, [1, CalculatorApp.DIVIDE_SYMBOL]);
    });
  });

  describe('subtract()', () => {
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
      instance.queue = [1];
    });

    it('Calls _pushSumbol() with argument', () => {
      const spy = sinon.spy(instance, '_pushSumbol');
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

    it('Adds symbol when previous symbol', () => {
      instance.queue = [CalculatorApp.MINUS_SYMBOL];
      instance.subtract();
      assert.deepEqual(instance.queue, [CalculatorApp.MINUS_SYMBOL, CalculatorApp.MINUS_SYMBOL]);
    });
  });

  describe('dot()', () => {
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
      instance.queue = [1];
    });

    it('Calls _pushSumbol() with argument', () => {
      const spy = sinon.spy(instance, '_pushSumbol');
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
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
    });

    it('Ignores the call when no items in the queue', () => {
      instance._pushSumbol('+');
      assert.deepEqual(instance.queue, []);
    });

    it('Adds new symbol to the queue', () => {
      instance.queue = [1];
      instance._pushSumbol('+');
      assert.deepEqual(instance.queue, [1, '+']);
    });

    it('Replaces previous symbol', () => {
      instance.queue = [1, '+'];
      instance._pushSumbol('-');
      assert.deepEqual(instance.queue, [1, '-']);
    });

    it('Calls render function', () => {
      const spy = sinon.spy(instance, 'render');
      instance.queue = [1, '+'];
      instance._pushSumbol('-');
      assert.isTrue(spy.called);
    });
  });

  describe('calculate()', () => {
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
      it('Calculates ' + item[0], () => {
        instance.queue = item[0];
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
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
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
      it('Handles button click for ' + item[0], async () => {
        if (item[2]) {
          instance.queue = item[2];
        }
        const value = item[0];
        const button = await fixture(`<button class="action" data-value="${value}">${value}</button>`);
        instance.init();
        button.click();
        assert.deepEqual(instance.queue, item[1]);
      });
    });

    it('Handles sum key', async () => {
      instance.queue = [1, CalculatorApp.PLUS_SYMBOL, 1];
      const button = await fixture(`<button class="action" data-value="sum">=</button>`);
      instance.init();
      button.click();
      assert.equal(opResult.innerText.trim(), '2');
    });

    it('Removes focus from the button', async () => {
      const button = await fixture(`<button class="action" data-value="1">1<button>`);
      instance.init();
      button.focus();
      const spy = sinon.spy(button, 'blur');
      button.dispatchEvent(new CustomEvent('mouseup'));
      assert.isTrue(spy.called);
    });
  });

  describe('processNumber()', () => {
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
    let instance;
    beforeEach(() => {
      instance = new CalculatorApp();
      instance.init();
    });

    it('Calls clear() for Escape button', () => {
      const spy = sinon.spy(instance, 'clear');
      keyDownOn(document.body, 27, '', 'Escape');
      assert.isTrue(spy.called);
    });

    it('Calls add() for + button', () => {
      const spy = sinon.spy(instance, 'add');
      keyDownOn(document.body, 0, '', '+');
      assert.isTrue(spy.called);
    });

    it('Calls subtract() for - button', () => {
      const spy = sinon.spy(instance, 'subtract');
      keyDownOn(document.body, 0, '', '-');
      assert.isTrue(spy.called);
    });

    it('Calls multiply() for * button', () => {
      const spy = sinon.spy(instance, 'multiply');
      keyDownOn(document.body, 0, '', '*');
      assert.isTrue(spy.called);
    });

    it('Calls divide() for / button', () => {
      const spy = sinon.spy(instance, 'divide');
      keyDownOn(document.body, 0, '', '/');
      assert.isTrue(spy.called);
    });

    it('Calls calculate() for = button', () => {
      const spy = sinon.spy(instance, 'calculate');
      keyDownOn(document.body, 0, '', '=');
      assert.isTrue(spy.called);
    });

    it('Calls dot() for . button', () => {
      const spy = sinon.spy(instance, 'dot');
      keyDownOn(document.body, 0, '', '.');
      assert.isTrue(spy.called);
    });

    it('Calls dot() for , button', () => {
      const spy = sinon.spy(instance, 'dot');
      keyDownOn(document.body, 0, '', ',');
      assert.isTrue(spy.called);
    });

    it('Calls backspace() for , button', () => {
      const spy = sinon.spy(instance, 'backspace');
      keyDownOn(document.body, 0, '', 'Backspace');
      assert.isTrue(spy.called);
    });

    it('Calls calculate() for NumpadEnter button', () => {
      const spy = sinon.spy(instance, 'calculate');
      const e = new CustomEvent('keydown', {
        detail: 0,
        bubbles: true,
        cancelable: true
      });
      e.keyCode = 13;
      e.key = 'Enter';
      e.code = 'NumpadEnter';
      document.body.dispatchEvent(e);
      keyDownOn(document.body, 0, '', 'NumpadEnter');
      assert.isTrue(spy.called);
    });

    it('Calls processNumber() for numeric button', () => {
      const spy = sinon.spy(instance, 'processNumber');
      keyDownOn(document.body, 0, '', 1);
      assert.isTrue(spy.called);
    });

    it('Ignores other keys', () => {
      keyDownOn(document.body, 0, '', ';');
      assert.deepEqual(instance.queue, []);
    });
  });
});
