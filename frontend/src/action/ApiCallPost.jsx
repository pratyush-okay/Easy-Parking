/**
 * post sth to backend
 * @param {string} path backend path
 * @param {object} body data
 * @param {string} token for Authorization usage
 * @param {boolean} authed
 * @returns {Promise<object>}
 */
const ApiCallPost = async (path, body, token, authed = false) => {
  const response = await fetch(`http://localhost:8000/${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
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

export default ApiCallPost;
