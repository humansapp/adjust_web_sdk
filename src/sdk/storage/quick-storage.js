import {convertRecord} from './converter'
import {entries} from '../utilities'
import Globals from '../globals'
import SchemeMap from './scheme-map'

const _storageName = Globals.namespace
const _storeNames = SchemeMap.storeNames.left

function _getItem (key) {
  try {
    const storage = window.localStorage
    return storage.getItem(key)
  } catch {
    return null
  }
}

function _setItem (key, value) {
  try {
    const storage = window.localStorage
    storage.setItem(key, value)
  } catch {
    // do nothing
  }
}

function _removeItem (key) {
  try {
    const storage = window.localStorage
    storage.removeItem(key)
  } catch {
    // do nothing
  }
}

/**
 * Get the value for specified key
 *
 * @param {string} key
 * @returns {*}
 * @private
 */
function _get (key) {
  const value = JSON.parse(_getItem(`${_storageName}.${key}`))
  return (value instanceof Array
    ? value
    : convertRecord({
      storeName: _storeNames.preferences.name,
      dir: 'right',
      record: value
    })) || null
}

/**
 * Set the value for specified key
 *
 * @param {string} key
 * @param {*} value
 * @private
 */
function _set (key, value) {
  if (!value) {
    _removeItem(`${_storageName}.${key}`)
  } else {
    _setItem(`${_storageName}.${key}`, JSON.stringify(
      value instanceof Array
        ? value
        : convertRecord({
          storeName: _storeNames.preferences.name,
          dir: 'left',
          record: value
        })
    ))
  }
}

/**
 * Clear all data related to the sdk
 */
function clear () {
  entries(_storeNames)
    .forEach(([, store]) => {
      if (!store.permanent) {
        _removeItem(`${_storageName}.${store.name}`)
      }
    })
}

const QuickStorage = {
  storeNames: _storeNames,
  stores: {},
  clear
}

entries(_storeNames)
  .forEach(([, store]) => {
    Object.defineProperty(QuickStorage.stores, store.name, {
      get () { return _get(store.name) },
      set (value) { return _set(store.name, value) }
    })
  })

Object.freeze(QuickStorage.stores)

export default QuickStorage
