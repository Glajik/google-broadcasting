## Using in GAS
```
   /**
   * Перечисление стандартных ключей
   */
  const msgEnum = {
    CREATE: 'CREATE',
    ON_CREATE: 'ON_CREATE',
    VALID: 'VALID',
    THROW: 'THROW',
  };

  function doCreate(key, data) {
    if (key !== 'CREATE:Test') return false;
    Logger.log('key: "%s", data: "%s"', key, data);
    return true; // if success
  };
  
  function onCreateHandle(key, data) {
    if (key !== 'ON_CREATE:Test') return;
    Logger.log('key: "%s", data: "%s"', key, data);
    return true; // if success
  };

  /**
   * Перечисление получателей сообщений (обработчиков)
   * Ключ и данные пересылаются всем обработчикам. Их задача решать обработать сообщение
   * или ингорировать.
   */
  const subscribers = [
    doCreate,
    onCreateHandle,
  ];
  
  const composeKey = Broadcasting.composeMsg;
  const broadcast = Broadcasting.createBroadcast(subscribers, msgEnum);
  
  const myKey = composeKey('CREATE','Test');

  broadcast(myKey, 'some data')
  ```