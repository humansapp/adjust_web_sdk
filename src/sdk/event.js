import {extend, isEmpty, convertToMap} from './utilities'
import Config from './config'
import Queue from './queue'
import Logger from './logger'
import {getTimestamp} from './time'
import {get} from './global-params'

/**
 * Get revenue value if positive and limit to 5 decimal places
 *
 * @param {number} revenue
 * @param {string} currency
 * @returns {Object}
 * @private
 */
function _getRevenue (revenue, currency) {

  revenue = parseFloat(revenue)

  if (revenue < 0 || !currency) {
    return {}
  }

  return {
    revenue: revenue.toFixed(5),
    currency
  }
}

/**
 * Prepare parameters for the event tracking
 *
 * @param {Object} params
 * @param {string} params.eventToken
 * @param {number=} params.revenue
 * @param {string=} params.currency
 * @param {Array=} params.callbackParams
 * @param {Array=} params.partnerParams
 * @param {Array=} [globalCallbackParams=[]]
 * @param {Array} [globalPartnerParams=[]]
 * @returns {Object}
 * @private
 */
function _prepareParams (params, globalCallbackParams = [], globalPartnerParams = []) {

  const baseParams = extend({
    createdAt: getTimestamp()
  }, Config.baseParams, {
    eventToken: params.eventToken,
  }, _getRevenue(params.revenue, params.currency))

  const callbackParams = extend(
    convertToMap(globalCallbackParams),
    convertToMap(params.callbackParams)
  )
  const partnerParams = extend(
    convertToMap(globalPartnerParams),
    convertToMap(params.partnerParams)
  )

  return extend(baseParams, {
    callbackParams: callbackParams,
    partnerParams: partnerParams,
  })
}

/**
 * Track event by sending the request to the server
 *
 * @param {Object} params
 */
export default function event (params = {}) {

  if (isEmpty(params) || !params.eventToken) {
    Logger.error('You must provide event token in order to track event')
    return
  }

  return get()
    .then(({callbackParams, partnerParams}) => {
      Queue.push({
        url: '/event',
        method: 'POST',
        params: _prepareParams(params, callbackParams, partnerParams)
      })
    })
}

