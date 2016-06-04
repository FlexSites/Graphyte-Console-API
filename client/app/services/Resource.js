import axios from 'axios'

const _errMessage = Symbol('ErrMessage')
const _request = Symbol('Request')

const MIN_REQUEST_TIME = 0;

export default class Resource {
  constructor(resource, host) {
    this.resource = resource
    this.host = host

    this.baseUrl = `${this.host}/${this.resource}`
  }

  get(id) {
    return this[_request](`${this.baseUrl}/${id}`, 'GET')
  }

  list() {
    return this[_request](this.baseUrl, 'GET')
  }

  create(obj) {
    if (typeof obj !== 'object') {
      throw new TypeError(this[_errMessage]('Expected type Object for argument[0]'))
    }
    return [_request](this.baseUrl, 'POST', obj)
  }

  update(obj) {
    let path = this.baseUrl
    if (obj.id) {
      path += `/${obj.id}`
    }
    return this[_request](path, 'PUT', obj)
  }

  delete(id) {
    return this[_request](`${this.baseUrl}/${id}`, 'GET')
  }

  [_errMessage](msg) {
    return `[Resource.${this.resource}] ${msg}`
  }

  [_request](url, method, data) {
    let start = Date.now();
    let params = {
      method,
      url,
      data,
    }

    let token = localStorage.getItem('userToken');

    if (!token) return Promise.reject('Unauthorized');

    if (token) params.headers = {
      Authorization: `Bearer ${token}`,
      // TODO: Support multi-platform editing
      'Graphyte-Platform': 'flexsites',
    }
    return axios(params)
        .then(res => {
          const delay = Date.now() - start
          if (delay > MIN_REQUEST_TIME) return res
          return new Promise((resolve, reject) => {
            setTimeout(() => resolve(res), MIN_REQUEST_TIME - delay)
          })
        })
        .then(({ data }) => data)
        .catch(ex => {
          console.error('ERR', ex)
          // if (ex.status === 401) localStorage.removeItem('userToken');
        })
  }

}
