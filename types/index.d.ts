declare module '@adjustcom/adjust-web-sdk' {
  export type Environment = 'sandbox' | 'production'
  export type LogLevel = 'none' | 'error' | 'info' | 'verbose'

  export type InitOptions = {
    appToken: string
    environment: Environment
    defaultTracker?: string
    externalDeviceId?: string
    customUrl?: string
    eventDeduplicationListLimit?: number
    attributionCallback?: (internalEventName: string, attribution: any) => any
  }

  export type LogOptions = {
    logLevel?: LogLevel
    logOutput?: string
  }

  export type GlobalParams = {
    key: string
    value: string
  }

  export type EventParams = {
    eventToken: string
    revenue?: number
    currency?: string
    deduplicationId?: string
    callbackParams?: Array<GlobalParams>
    partnerParams?: Array<GlobalParams>
  }

  export const Adjust: {
    initSdk: (options: InitOptions & LogOptions) => void
    trackEvent: (params: EventParams) => void
    addGlobalCallbackParameters: (params: Array<GlobalParams>) => void
    addGlobalPartnerParameters: (params: Array<GlobalParams>) => void
    removeGlobalCallbackParameter: (key: string) => void
    removeGlobalPartnerParameter: (key: string) => void
    clearGlobalCallbackParameters: () => void
    clearGlobalPartnerParameters: () => void
    switchToOfflineMode: () => void
    switchBackToOnlineMode: () => void
    stop: () => void
    restart: () => void
    gdprForgetMe: () => void
    disableThirdPartySharing: () => void
  }
}
