declare module "wafer2-client-sdk" {
  function login(opts?: ILoginOptions): void;
  function loginWithCode(opts?: ILoginOptions): void;
  function setLoginUrl(loginUrl: string): void;

  function clearSession(): ISession["clear"];
  function request(requestOptions?: IRequestOptions): () => void;

  const ERR_INVALID_PARAMS: "ERR_INVALID_PARAMS";

  const ERR_WX_LOGIN_FAILED: "ERR_WX_LOGIN_FAILED";
  const ERR_WX_GET_USER_INFO: "ERR_WX_GET_USER_INFO";
  const ERR_LOGIN_TIMEOUT: "ERR_LOGIN_TIMEOUT";
  const ERR_LOGIN_FAILED: "ERR_LOGIN_FAILED";
  const ERR_LOGIN_SESSION_NOT_RECEIVED: "ERR_LOGIN_MISSING_SESSION";

  const ERR_SESSION_INVALID: "ERR_SESSION_INVALID";
  const ERR_CHECK_LOGIN_FAILED: "ERR_CHECK_LOGIN_FAILED";
  interface ILoginOptions {
    loginUrl: string;
    method?: string;
    success?: () => void;
    fail?: (error: any) => void;
  }
  interface ISession {
    get: () => any;
    set: (session: ISession) => void;
    clear: () => void;
  }
  interface IRequestOptions {
    url: string;
    login?: boolean;
    header?: object;
    method?: string;
    success?: (response: IResponse) => void;
    complete?: () => void;
    fail?: (error: RequestError) => void;
  }
  interface IResponse {
    statusCode: string;
    data: object;
  }
  class RequestError {
    constructor(type?: any, message?: any);
  }
  class Tunnel {
    // 断线重连最多尝试 5 次
    public readonly DEFAULT_MAX_RECONNECT_TRY_TIMES = 5;

    // 每次重连前，等待时间的增量值
    public readonly DEFAULT_RECONNECT_TIME_INCREASE = 1000;

    constructor(tunnelUrl: string);

    public open(): void;
    public on(type: string, listener: (message?: any) => void): void;
    public emit(type: string, content: any): void;
    public close(): void;

    public isClosed(): boolean;
    public isConnecting(): boolean;
    public isActive(): boolean;
    public isReconnecting(): boolean;
  }

  /**
   * 信道状态枚举
   */
  enum TunnelStatus {
    STATUS_CLOSED = "CLOSED",
    STATUS_CONNECTING = "CONNECTING",
    STATUS_ACTIVE = "ACTIVE",
    STATUS_RECONNECTING = "RECONNECTING",
  }

  /**
   * 错误类型枚举
   */
  enum TunnelErr {
    ERR_CONNECT_SERVICE = 1001,
    ERR_CONNECT_SOCKET = 1002,
    ERR_RECONNECT = 2001,
    ERR_SOCKET_ERROR = 3001,
  }

  /**
   * 包类型枚举
   */
  enum TunnelPacketType {
    PACKET_TYPE_MESSAGE = "message",
    PACKET_TYPE_PING = "ping",
    PACKET_TYPE_PONG = "pong",
    PACKET_TYPE_TIMEOUT = "timeout",
    PACKET_TYPE_CLOSE = "close",
  }
}
