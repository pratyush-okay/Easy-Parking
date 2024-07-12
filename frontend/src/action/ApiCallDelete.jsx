/**
 * put sth to backend
 * @param {string} path backend path
 * @param {object} body data
 * @param {string} token for Authorization usage
 * @param {boolean} authed
 * @returns {Promise<object>}
 */
const ApiCallDelete = async (path, body, token, authed = false) => {
  const response = await fetch(`http://localhost:8000/${path}`, {
    method: 'DELETE',
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (data.error) {
    alert(data.error);
    return false;
  } else if (data) {
    return data;
  }
};

export default ApiCallDelete;
