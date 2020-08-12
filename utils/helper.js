
const handlePageError = (res, e) => res.status(500).send({ message: e.message || 'Something went wrong' });

const handleRequestError = (res, message) => res.status(400).send({ message });

const checkPostParams = (req, res, params) => {
  let _invalidParams = params.reduce((invalidParams, param) => !req.body.hasOwnProperty(param) ? [...invalidParams, param] : invalidParams, [])

  if (_invalidParams.length > 0) {
    handleRequestError(res, {
      message: `${_invalidParams} isn't provided!`
    })
  }

  console.log(req.body, _invalidParams);

  return _invalidParams.length === 0;
}

const parseFieldStringToArray = field => {
  try {
    if (!field) return [];

    let _field = JSON.parse(field);

    return Array.isArray(_field) ? _field : [];

  } catch (err) {
    console.log(`Parse faild '${field}' ${err.message || err}`)

    return err.message.indexOf('in JSON at position') === -1 || !field ? [] : field.split(',')
  }
}

module.exports = {
  handlePageError,
  handleRequestError,
  checkPostParams,
  parseFieldStringToArray
}
