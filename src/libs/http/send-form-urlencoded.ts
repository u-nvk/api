/**
 * Отправка данных с content type application/x-www-form-urlencoded
 * @param {string} url - адрес запроса
 * @param {Record<string, string | number>} dataObj - объект, который трансформируем и передаем в body
 * @return {Promise<Response>}
 * @throws {Error}
 */
export const sendFormUrlencoded = async <Response>(url: string, dataObj: Record<string, string | number>): Promise<Response> => {
  const formBody: string[] = [];

  Object.entries(dataObj).forEach(([key, value]) => {
    const encKey = encodeURIComponent(key);
    const encBody = encodeURIComponent(value);
    formBody.push(encKey + '=' + encBody);
  });

  const body = formBody.join('&');

  let response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
  } catch (e) {
    throw new Error('Something went wrong when make request. sendFormUrlencoded', { cause: e });
  }

  try {
    return await response.json() as Response;
  } catch (e) {
    throw new Error('Error when try parse response as json. sendFormUrlencoded', { cause: e });
  }
}
