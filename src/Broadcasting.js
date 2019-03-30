/**
 * Занимается роутингом сообщений внутри приложения.
 * (TODO: Другие классы могут подписываться и отписываться на события по
 * ключам).
 */

/**
 * Отправляет сообщение с данными всем обработчикам, перечисленным в subscribers
 * @param {*} subscribers функции с обработчиками, принимающими параметры key, и message
 * @param {*} msgEnum перечисление с зарегистрированными ключами
 * @param { String } key Ключ, по которому будут вызваны обработчики
 * @param { Object } data Список ключ-значение, структура для каждого ключа
 * @return { Array } [{ handler, result }, ...] , где:
 * - handler это тело обработчика в текстовом виде, для отладки
 * - result содержит true если успешно (обработчик должен вернуть или true
 * или объект ошибки или throw exception)
 */
export const createBroadcast = (subscribers, keysEnum) => (key, data) => {
  // Проверяем наличие ключа
  const prefix = key.split(':')[0];
  const isValidKey = prefix ? keysEnum[prefix] : keysEnum[key];
  if (!isValidKey) {
    throw new Error(`Не найдено сообщение "${key}" в списке ключей`);
  }

  // вызываем обработчики с телом сообщения, возвращаем результаты
  const results = subscribers.map((handler) => {
    try {
      const result = handler(key, data);
      return { handler: handler.toString(), result };
    } catch (e) {
      throw new Error(`Произошла ошибка "${e}" по сообщению "${key}" в обработчике:\n${handler.toString()}`);
    }
  });

  const handled = results.some(({ result }) => result && true);

  // console.log('handled: %s', handled);

  if (!handled) {
    throw new Error(`Ни один обработчик не обработал сообщение "${key}"`);
  }

  return results;
};

export const composeKey = (...args) => args.join(':');
