const response =  {
    wrapper_success : (res, code, message, data, token) => {
      let respon = {
        'code': code,
        'success': 'true',
        'message': message,
        'data': data,
        'token': token
      }
      return res.send(respon);
    },
  
    wrapper_error : (res, code, message) => {
      let respon = {
        'code': code,
        'success': 'false',
        'message': message
      }
      return res.send(respon);
    },

    redirect : (res, code, link) => {
      return res.redirect(link);
    }
  }
  
  module.exports = response;