import 'dotenv/config';
import { TextVerifiedApi } from '../src';

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
    // console.log('[TextVerified] targets', targets);
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
