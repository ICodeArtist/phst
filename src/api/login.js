import api from './index'
import { axios } from '@/utils/request'
import qs from 'qs'
/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return axios({
    url: api.Login,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(parameter)
  })
}

export function getSmsCaptcha (parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(parameter)
  })
}
export function toRegPhar (parameter) {
  return axios({
    url: api.RegPhar,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(parameter)
  })
}
export function toRecover (parameter) {
  return axios({
    url: api.Recover,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(parameter)
  })
}

export function getCurrentUserNav (token) {
  return axios({
    url: '/user/nav',
    method: 'get'
  })
}

export function logout () {
  return axios({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return axios({
    url: api.twoStepCode,
    method: 'post',
    data: parameter
  })
}

export function getVerify (parameter) {
  return axios({
    url: '/phst/getVerify',
    method: 'get',
    params: parameter
  })
}

export function getInfo (parameter) {
  return axios({
    url: '/phst/getAdminInfo',
    method: 'get',
    params: parameter
  })
}

export function saveStep1 (parameter) {
  return axios({
    url: '/phst/saveStep1',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(parameter)
  })
}

export function getStep1 (parameter) {
  return axios({
    url: '/phst/getStep1',
    method: 'get',
    params: parameter
  })
}

export function saveStep2 (parameter) {
  return axios({
    url: '/phst/saveStep2',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(parameter)
  })
}

export function getStep2 (parameter) {
  return axios({
    url: '/phst/getStep2',
    method: 'get',
    params: parameter
  })
}

export function getStep3 (parameter) {
  return axios({
    url: '/phst/getStep3',
    method: 'get',
    params: parameter
  })
}
