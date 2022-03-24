import axios, { AxiosResponse } from 'axios';
import * as types from './types';
import { USER_AGENT } from './identity';

export class TextVerifiedApi {
  readonly httpClient = axios.create({
    baseURL: 'https://www.textverified.com/api/',
    headers: {
      'User-Agent': USER_AGENT,
      // Authorization: null!,
    },
  });

  private bearerToken?: string;
  private _isAuth = false;

  constructor(private options: types.ApiOptions = {}) {
    if (options.bearerToken) {
      // TODO: check JWT bearerToken exp out
      this.bearerToken = options.bearerToken;
      this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${this.bearerToken}`;
    }

    this.httpClient.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          this._isAuth = false;
        }
        await Promise.reject(err);
      },
    );
    // throw new Error('API Key must be a string');
  }

  public get isAuth() {
    return this._isAuth;
  }

  public loadCache() {
    // TODO: MAKEIT
    this.options = {
      ...this.options,
      // bearerToken: ...
    };
    return this;
  }

  /**
   * @see {@link https://www.textverified.com/Api/Reference#tag/Authentication/paths/~1Api~1SimpleAuthentication/post}
   */
  public async simpleAuth(simpleToken: string = this.options.simpleToken!, forceAuth = false, throwable = false) {
    if (typeof simpleToken !== 'string' || !simpleToken.startsWith('1_')) {
      throw new Error('simpleToken must be a string and starts with 1_');
    }

    if (!forceAuth && this.isAuth) {
      return this;
    }

    try {
      const response = await this.httpClient.post<any, AxiosResponse<types.ISimpleAuthentication>>(
        'SimpleAuthentication',
        null,
        {
          headers: {
            // Authorization: null!,
            'X-SIMPLE-API-ACCESS-TOKEN': simpleToken,
          },
        },
      );

      // TODO: save to cache
      this.bearerToken = response.data.bearer_token;
      this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.bearer_token}`;
      this._isAuth = true;
    } catch (err) {
      // console.log('[simpleAuth] Err', err);
      if (throwable) {
        throw err;
      }
    }

    return this;
  }

  /**
   * @see {@link https://www.textverified.com/Api/Reference#tag/Authentication/paths/~1Api~1Authentication/post}
   */
  public async clientAuth(
    clientKey: string = this.options.clientKey!,
    clientSecret: string = this.options.clientSecret!,
    forceAuth = false,
    throwable = false,
  ) {
    if (typeof clientKey !== 'string' || typeof clientSecret !== 'string') {
      throw new Error('clientKey and clientSecret must be a string');
    }

    if (!forceAuth && this.isAuth) {
      return this;
    }

    try {
      const token64 = Buffer.from(`${clientKey}:${clientSecret}`, 'base64');
      const response = await this.httpClient.post<any, AxiosResponse<types.IClientAuthentication>>(
        'Authentication',
        null,
        {
          headers: {
            Authorization: `Basic ${token64}`,
          },
        },
      );

      // TODO: save to cache
      this.bearerToken = response.data.bearer_token;
      this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.bearer_token}`;
      this._isAuth = true;
    } catch (err) {
      // console.log('[clientAuth] Err', err);
      if (throwable) {
        throw err;
      }
    }

    return this;
  }

  /**
   * Returns the list of accepted area code filters you can select from.
   *
   * @see {@link https://www.textverified.com/Api/Reference#tag/Preferences/paths/~1api~1Preferences/get}
   */
  public async getPreferences() {
    const { data } = await this.httpClient.get<any, AxiosResponse<types.IResponseGetPreferences>>('preferences');
    this._isAuth = true;
    return data;
  }

  /**
   * @see {@link https://www.textverified.com/Api/Reference#tag/Preferences/paths/~1api~1preferences~1area-codes/get}
   */
  public async getAreaCodeFilters() {
    const { data } = await this.httpClient.get<any, AxiosResponse<types.IResponseGetPreferencesAreaCodes>>(
      'preferences/area-codes',
    );
    this._isAuth = true;
    return data;
  }

  /**
   * Updates your account's verification preferences. All fields must be provided for the 'preferences' object.
   * The /api/preferences/area-codes endpoint provides the accepted area code filters.
   *
   * @see {@link https://www.textverified.com/Api/Reference#tag/Preferences/paths/~1api~1preferences/post}
   */
  public async updatePreferences(data: types.IResponseGetPreferences) {
    const response = await this.httpClient.post<any, AxiosResponse<types.IResponseGetPreferences>>('preferences', data);
    this._isAuth = true;
    return response.data;
  }

  /**
   * @see {@link https://www.textverified.com/Api/Reference#operation/GetAllTargets}
   */
  public async getTargets() {
    const { data } = await this.httpClient.get<any, AxiosResponse<types.IResponseGetTarget[]>>('targets');
    this._isAuth = true;
    return data;
  }

  /**
   * @see {@link https://www.textverified.com/Api/Reference#tag/Targets/paths/~1api~1Targets~1{id}/get}
   */
  public async getTarget(id: number) {
    const { data } = await this.httpClient.get<any, AxiosResponse<types.IResponseGetTarget>>(`target/${id}`);
    this._isAuth = true;
    return data;
  }

  /**
   * @see {@link https://www.textverified.com/Api/Reference#tag/Users/paths/~1api~1Users/get}
   */
  public async getUser() {
    const { data } = await this.httpClient.get<any, AxiosResponse<types.IResponseGetUser>>('users');
    this._isAuth = true;
    return data;
  }

  /**
   * @see {@link https://www.textverified.com/Api/Reference#operation/GetVerificationDetails}
   * @param uuid Unique identifier for the verification.
   */
  public async getVerification(uuid: string) {
    const { data } = await this.httpClient.get<any, AxiosResponse<types.IResponseGetVerifications>>(
      `verifications/${uuid}`,
    );
    this._isAuth = true;
    return data;
  }

  /**
   * @see {@link https://www.textverified.com/Api/Reference#tag/Verifications/paths/~1api~1Verifications~1Pending/get}
   */
  public async getVerificationPending() {
    const { data } = await this.httpClient.get<any, AxiosResponse<types.IResponseGetVerificationsPending>>(
      `verifications/pending`,
    );
    this._isAuth = true;
    return data;
  }

  /**
   * @see {@link https://www.textverified.com/Api/Reference#tag/Verifications/paths/~1api~1Verifications/post}
   * @param id The unique identifier for the target. Obtained from the {@link TextVerifiedApi.getTargets} or {@link TextVerifiedApi.getTarget} endpoint when querying for target availability.
   */
  public async createVerification(id?: number) {
    const { data } = await this.httpClient.post<any, AxiosResponse<types.IResponseGetVerifications>>(`verifications`, {
      id,
    });
    this._isAuth = true;
    return data;
  }

  /**
   * @see {@link https://www.textverified.com/Api/Reference#tag/Verifications/paths/~1api~1Verifications~1{id}~1Cancel/put}
   * @param uuid Unique identifier for the verification.
   */
  public async cancelVerification(uuid: string) {
    const { data } = await this.httpClient.put(
      /* <any, AxiosResponse<IResponseGetVerifications>> */ `verifications/${uuid}/cancel`,
    );
    this._isAuth = true;
    return data;
  }

  /**
   * @see {@link https://www.textverified.com/Api/Reference#tag/Verifications/paths/~1api~1Verifications~1{id}~1Report/put}
   * @param uuid Unique identifier for the verification.
   */
  public async reportVerification(uuid: string) {
    const { data } = await this.httpClient.put(
      /* <any, AxiosResponse<IResponseGetVerifications>> */ `verifications/${uuid}/report`,
    );
    this._isAuth = true;
    return data;
  }

  /**
   * @see {@link https://www.textverified.com/Api/Reference#tag/Verifications/paths/~1api~1Verifications~1{id}~1Reuse/put}
   * @param uuid Unique identifier for the verification.
   */
  public async reuseVerification(uuid: string) {
    const { data } = await this.httpClient.put<any, AxiosResponse<types.IResponseGetVerifications>>(
      `verifications/${uuid}/reuse`,
    );
    this._isAuth = true;
    return data;
  }

  /**
   * @see {@link https://www.textverified.com/Api/Reference#tag/Verifications/paths/~1api~1Verifications~1{id}~1Resurrect/put}
   * @param uuid Unique identifier for the verification.
   */
  public async resurrectVerification(uuid: string) {
    const { data } = await this.httpClient.put<any, AxiosResponse<types.IResponseGetVerifications>>(
      `verifications/${uuid}/resurrect`,
    );
    this._isAuth = true;
    return data;
  }
}
