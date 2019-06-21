/* eslint-disable */
import * as State from '../state'
import * as QuickStorage from '../quick-storage'
import * as PubSub from '../pub-sub'

describe('activity state functionality', () => {

  beforeAll(() => {
    jest.spyOn(PubSub, 'publish')
  })

  afterEach(() => {
    State.default.disabled = null
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('gets disabled state', () => {

    expect(State.default.disabled).toBeNull()

    State.default.disabled = 'gdpr'

    expect(State.default.disabled).toEqual('gdpr')

  })

  it('reloads in-memory variables when storage got changed outside of current tab', () => {

    QuickStorage.default.disabled = 'general'

    expect(State.default.disabled).toEqual('general')

    QuickStorage.default.disabled = 'gdpr'

    expect(State.default.disabled).toEqual('general')

    State.default.reload()

    expect(PubSub.publish).not.toHaveBeenCalled()

    State.default.disabled = null

    QuickStorage.default.disabled = 'gdpr'

    State.default.reload()

    expect(PubSub.publish).toHaveBeenCalledWith('sdk:shutdown', true)
    expect(State.default.disabled).toEqual('gdpr')

  })

  it('recover storage from memory', () => {

    State.default.disabled = 'gdpr'

    expect(QuickStorage.default.disabled).toEqual('gdpr')

    localStorage.clear()

    expect(State.default.disabled).toEqual('gdpr')
    expect(QuickStorage.default.disabled).toBeNull()

    State.default.recover()

    expect(State.default.disabled).toEqual('gdpr')
    expect(QuickStorage.default.disabled).toEqual('gdpr')

  })

})
