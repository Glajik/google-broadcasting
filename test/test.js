import { expect } from 'chai';
import * as sinon from 'sinon';

// import function
import { createBroadcast, composeKey } from '../src/Broadcasting';

describe('Test broadcasting', () => {
  /**
   * Перечисление стандартных ключей
   */
  const msgEnum = {
    CREATE: 'CREATE',
    ON_CREATE: 'ON_CREATE',
    VALID: 'VALID',
    THROW: 'THROW',
  };

  const doCreate = sinon.stub();
  const onCreateHandle = sinon.stub();

  /**
   * Перечисление получателей сообщений (обработчиков)
   * Ключ и данные пересылаются всем обработчикам. Их задача решать обработать сообщение
   * или ингорировать.
   */
  const subscribers = [
    (key, data) => doCreate(key, data),
    (key, data) => onCreateHandle(key, data),
  ];

  const broadcast = createBroadcast(subscribers, msgEnum);

  beforeEach(() => {
    doCreate.resetHistory();
    onCreateHandle.resetHistory();
  });

  it('Should work', () => {
    doCreate.returns(false);
    doCreate.withArgs('CREATE').returns('Created');

    onCreateHandle.returns(false);
    onCreateHandle.withArgs('ON_CREATE').returns('onCreateHandle called');

    broadcast('CREATE', 'Any message');

    // eslint-disable-next-line no-unused-expressions
    expect(doCreate.returned('Created')).is.true;
    // eslint-disable-next-line no-unused-expressions
    expect(onCreateHandle.returned(false)).is.true;
    // eslint-disable-next-line no-unused-expressions
    expect(onCreateHandle.calledAfter(doCreate)).is.true;

    broadcast('ON_CREATE', 'Any message');

    // eslint-disable-next-line no-unused-expressions
    expect(doCreate.returned(false)).is.true;
    // eslint-disable-next-line no-unused-expressions
    expect(onCreateHandle.returned('onCreateHandle called')).is.true;
    // eslint-disable-next-line no-unused-expressions
    expect(onCreateHandle.calledAfter(doCreate)).is.true;
  });

  it('Should work with composeKey', () => {
    const myKey = composeKey('ON_CREATE', 'MyKey');

    doCreate.withArgs('ON_CREATE:MyKey').returns(false);
    doCreate.returns('Other cases');

    onCreateHandle.withArgs('ON_CREATE:MyKey').returns('onCreateHandle called');
    onCreateHandle.returns(false);

    broadcast(myKey, 'Any message');

    // eslint-disable-next-line no-unused-expressions
    expect(onCreateHandle.calledAfter(doCreate)).is.true;
    // eslint-disable-next-line no-unused-expressions
    expect(doCreate.returned(false)).is.true;
    // eslint-disable-next-line no-unused-expressions
    expect(onCreateHandle.returned('onCreateHandle called')).is.true;
  });

  it('Should throw', () => {
    doCreate.returns(false);
    onCreateHandle.returns(undefined);

    expect(() => broadcast('UNKNOW', 'Any message')).throw('Не найдено сообщение "UNKNOW" в списке ключей');
    // eslint-disable-next-line no-unused-expressions
    expect(doCreate.notCalled).is.true;
    // eslint-disable-next-line no-unused-expressions
    expect(onCreateHandle.notCalled).is.true;


    expect(() => broadcast('VALID', 'Any message')).throw('Ни один обработчик не обработал сообщение "VALID"');
    // eslint-disable-next-line no-unused-expressions
    expect(doCreate.calledOnce).is.true;
    // eslint-disable-next-line no-unused-expressions
    expect(onCreateHandle.calledOnce).is.true;


    doCreate.withArgs('THROW').throws('Error');

    expect(() => broadcast('THROW', 'Error')).not.throw(/'Произошла ошибка "Error" по сообщению "THROW" в обработчике:'/);
    // eslint-disable-next-line no-unused-expressions
    expect(doCreate.calledTwice).is.true;
    // eslint-disable-next-line no-unused-expressions
    expect(onCreateHandle.calledOnce).is.true;
  });
});
