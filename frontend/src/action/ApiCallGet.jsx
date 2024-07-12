/**
 * get sth from backend
 * @param {string} path backend path
 * @param {string} token for Authorization usage
 * @param {boolean} authed
 * @returns {Promise<object>}
 */
const ApiCallGet = async (path, params = {}, token, authed = false) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`http://localhost:8000/${path}?${queryString}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: authed ? `Bearer ${token}` : undefined
    },
  });
  const data = await response.json();
  if (data.error) {
    alert(data.error);
    return false;
  } else if (data) {
    return data;
  }
};

export default ApiCallGet;
