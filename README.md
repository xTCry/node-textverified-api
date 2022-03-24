# NodeJS [TextVerified](https://www.textverified.com/Api/Reference) API (v1)

[![license](https://img.shields.io/npm/l/textverified?style=flat-square)](https://github.com/xTCry/node-textverified-api/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/textverified?style=flat-square)](https://npmjs.com/package/textverified)
[![downloads](https://img.shields.io/npm/dm/textverified?style=flat-square)](https://npmjs.com/package/textverified)
[![GitHub](https://img.shields.io/github/stars/xTCry/node-textverified-api?style=flat-square)](https://github.com/xTCry/node-textverified-api)
[![last commit](https://img.shields.io/github/last-commit/xTCry/node-textverified-api?style=flat-square)](https://github.com/xTCry/node-textverified-api)

## 📦 Installing
Using yarn:
```shell
yarn add textverified
```

Using npm:
```shell
npm install textverified
```

## 🛠️ [Example](example/index.ts)
```typescript
import 'dotenv/config';
import { TextVerifiedApi } from 'textverified';

const tvApi = new TextVerifiedApi();

export async function checkAuth(simpleTokenOrclientKey: string, clientSecret?: string) {
  tvApi.loadCache();
  if (clientSecret) {
    await tvApi.clientAuth(simpleTokenOrclientKey, clientSecret);
  } else {
    await tvApi.simpleAuth(simpleTokenOrclientKey);
  }
  if (!tvApi.isAuth) {
    throw new Error('TextVerified: unauthorized');
  }
}

export async function checkTargetGmail() {
  try {
    const targets = await tvApi.getTargets();
    return targets.find((target) => target.normalizedName === 'gmail');
  } catch (err: any) {
    console.log('[TextVerified] targets err', err.message);
  }
  return null;
}

export async function checkBalance() {
  try {
    const user = await tvApi.getUser();
    console.log('[TextVerified] users', user);
    return user.credit_balance;
  } catch (err: any) {
    console.log('[TextVerified] users err', err.message);
  }
  return null;
}

const main = async () => {
  const failTarget = await checkTargetGmail();
  console.log('[TextVerified] failTarget Gmail', failTarget);

  const simpleTokenOrclientKey = process.env.TV_SIMPLE_TOKEN || process.env.TV_CLIENT_KEY;
  const clientSecret = process.env.TV_CLIENT_SECRET;
  await checkAuth(simpleTokenOrclientKey!, clientSecret);

  const target = await checkTargetGmail();
  console.log('[TextVerified] target Gmail', target);

  // ...
  const balance = await checkBalance();
  console.log('[TextVerified] balance', balance);
};
main().then();
```
