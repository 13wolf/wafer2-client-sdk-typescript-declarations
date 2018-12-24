declare module "wafer2-client-sdk" {
  /**
   * @method
   * 进行服务器登录，以获得登录会话
   * 受限于微信的限制，本函数需要在 <button open-type="getUserInfo" bindgetuserinfo="bindGetUserInfo"></button> 的回调函数中调用
   * 需要先使用 <button> 弹窗，让用户接受授权，然后再安全调用 wx.getUserInfo 获取用户信息
   *
   * @param {Object}   opts           登录配置
   * @param {string}   opts.loginUrl  登录使用的 URL，服务器应该在这个 URL 上处理登录请求，建议配合服务端 SDK 使用
   * @param {string}   [opts.method]  可选。请求使用的 HTTP 方法，默认为 GET
   * @param {Function} [opts.success] 可选。登录成功后的回调函数，参数 userInfo 微信用户信息
   * @param {Function} [opts.fail]    可选。登录失败后的回调函数，参数 error 错误信息
   */
  function login(opts?: ILoginOptions): void;
  /**
   * @method
   * 只通过 wx.login 的 code 进行登录
   * 已经登录过的用户，只需要用 code 换取 openid，从数据库中查询出来即可
   * 无需每次都使用 wx.getUserInfo 去获取用户信息
   * 后端 Wafer SDK 需配合 1.4.x 及以上版本
   *
   * @param {Object}   opts           登录配置
   * @param {string}   opts.loginUrl  登录使用的 URL，服务器应该在这个 URL 上处理登录请求，建议配合服务端 SDK 使用
   * @param {string}   [opts.method]  可选。请求使用的 HTTP 方法，默认为 GET
   * @param {Function} [opts.success] 可选。登录成功后的回调函数，参数 userInfo 微信用户信息
   * @param {Function} [opts.fail]    可选。登录失败后的回调函数，参数 error 错误信息
   */
  function loginWithCode(opts?: ILoginOptions): void;
  /** 设置登录使用的 URL，服务器应该在这个 URL 上处理登录请求，建议配合服务端 SDK 使用*/
  function setLoginUrl(loginUrl: string): void;

  /** Session 对象管理器 */
  const Session: ISession;
  /** 清除Session内容的方法，从Session对象管理器中直接引用的 */
  function clearSession(): ISession["clear"];

  /** 进行带会话的请求。 */
  function request(requestOptions?: IRequestOptions): () => void;

  /** 密码错误 */
  const ERR_INVALID_PARAMS: "ERR_INVALID_PARAMS";

  /** 微信登录失败 */
  const ERR_WX_LOGIN_FAILED: "ERR_WX_LOGIN_FAILED";
  /** 获取用户信息失败 */
  const ERR_WX_GET_USER_INFO: "ERR_WX_GET_USER_INFO";
  /** 登录时间超时 */
  const ERR_LOGIN_TIMEOUT: "ERR_LOGIN_TIMEOUT";
  /** 登录失败 */
  const ERR_LOGIN_FAILED: "ERR_LOGIN_FAILED";
  /** 没有收到登录Session */
  const ERR_LOGIN_SESSION_NOT_RECEIVED: "ERR_LOGIN_MISSING_SESSION";

  /** Session非法 */
  const ERR_SESSION_INVALID: "ERR_SESSION_INVALID";
  /** 检查登录信息失败 */
  const ERR_CHECK_LOGIN_FAILED: "ERR_CHECK_LOGIN_FAILED";

  /** 登录配置 */
  interface ILoginOptions {
    /** 登录使用的 URL，服务器应该在这个 URL 上处理登录请求，建议配合服务端 SDK 使用 */
    loginUrl?: string;
    /** 可选。请求使用的 HTTP 方法，默认为 GET */
    method?: string;
    /** 可选。登录成功后的回调函数，参数 userInfo 微信用户信息 */
    success?: (userInfo: any) => void;
    /** 可选。登录失败后的回调函数，参数 error 错误信息 */
    fail?: (error: any) => void;
  }
  /** Session 管理器 */
  interface ISession {
    /** 用同步的方式获取本地缓存中指定的SessionKey的信息 */
    get: () => any;
    /** 用同步的方式设置Session到本地缓存 */
    set: (session: ISession) => void;
    /** 用同步的方式从本地缓存中移除Session */
    clear: () => void;
  }
  /** 带会话的请求的参数 */
  interface IRequestOptions {
    /** 必填，要请求的地址 */
    url: string;
    /** 是否自动登录以获取会话，默认为 false */
    login?: boolean;
    /** 请求头设置，不允许设置 Referer */
    header?: object;
    /** 请求的方法，默认为 GET */
    method?: string;
    /**登录成功的回调。
     * response.statusCode：请求返回的状态码
     * response.data：请求返回的数据
     */
    success?: (response: IResponse) => void;
    /** 登录完成后回调，无论成功还是失败 */
    complete?: () => void;
    /** 登录失败的回调 */
    fail?: (error: RequestError) => void;
  }
  /** 请求成功返回的对象 */
  interface IResponse {
    /** 请求返回的状态码 */
    statusCode: string;
    /** 请求返回的数据 */
    data: object;
  }
  /**
   * 表示请求过程中发生的异常,继承自Error
   * @param {string} type      错误的类型
   * @param {string} message   错误的消息
   */
  class RequestError {
    constructor(type?: any, message?: any);
  }
  /** 表示一个信道。由于小程序的限制，同一时间只能有一个打开的信道。
   * @param {string} tunnelUrl   信道服务的访问地址
   */
  class Tunnel {
    /** 缺省 断线重连最多尝试 5 次 */
    public readonly DEFAULT_MAX_RECONNECT_TRY_TIMES = 5;
    /** 缺省 每次重连前，等待时间的增量值 */
    public readonly DEFAULT_RECONNECT_TIME_INCREASE = 1000;
    /** @param {string} tunnelUrl   信道服务的访问地址 */
    constructor(tunnelUrl: string);

    /**
     * 连接信道服务器，获取 WebSocket 连接地址，获取地址成功后，开始进行 WebSocket 连接
     */
    public open(): void;
    /**
     * 注册消息处理函数
     * @param {string} messageType   支持内置消息类型
     *  （"connect"|"close"|"reconnecting"|"reconnect"|"error"）以及业务消息类型
     * @param {Object} message       对应事件处理函数传入的事件实体
     */
    public on(messageType: string, listener: (message?: any) => void): void;
    /**
     * 向信道推送消息。
     *
     * @param {string} messageType   支持内置消息类型
     *  （"connect"|"close"|"reconnecting"|"reconnect"|"error"）以及业务消息类型
     * @param {Object} content       要推送的消息的内容
     */
    public emit(messageType: string, content: any): void;
    /** 关闭信道 */
    public close(): void;
    /** 判定信道状态：已关闭 */
    public isClosed(): boolean;
    /** 判定信道状态：首次连接 */
    public isConnecting(): boolean;
    /** 判定信道状态：当前信道已经在工作 */
    public isActive(): boolean;
    /** 判定信道状态：断线重连中 */
    public isReconnecting(): boolean;
  }

  /** 信道状态枚举 */
  enum TunnelStatus {
    /** 已关闭 */
    STATUS_CLOSED = "CLOSED",
    /** 首次连接 */
    STATUS_CONNECTING = "CONNECTING",
    /** 当前信道已经在工作 */
    STATUS_ACTIVE = "ACTIVE",
    /** 断线重连中 */
    STATUS_RECONNECTING = "RECONNECTING",
  }

  /** 错误类型枚举 */
  enum TunnelErr {
    /** 连接服务错误 */
    ERR_CONNECT_SERVICE = 1001,
    /** 连接Socket错误 */
    ERR_CONNECT_SOCKET = 1002,
    /** 重新连接错误 */
    ERR_RECONNECT = 2001,
    /** Socket 错误 */
    ERR_SOCKET_ERROR = 3001,
  }

  /** 包类型枚举 */
  enum TunnelPacketType {
    /** 消息类型 */
    PACKET_TYPE_MESSAGE = "message",
    /** Ping 类型 */
    PACKET_TYPE_PING = "ping",
    /** Pong 类型 */
    PACKET_TYPE_PONG = "pong",
    /** 超时类型 */
    PACKET_TYPE_TIMEOUT = "timeout",
    /** 关闭类型 */
    PACKET_TYPE_CLOSE = "close",
  }
}
