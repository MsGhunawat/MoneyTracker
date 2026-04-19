import { Platform, PermissionsAndroid } from 'react-native';
import { parseTransactionWithAI } from './aiService';
import { Transaction } from '../types';

// Standard native module import with safety fallback
let SmsAndroid: any = null;
if (Platform.OS === 'android') {
  try {
    SmsAndroid = require('react-native-get-sms-android');
  } catch (e) {
    console.warn("SmsAndroid module not loaded: ", e);
  }
}

export interface SMSMessage {
  _id: string;
  address: string;
  body: string;
  date: number;
  type: number;
}

export async function requestSMSPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;

  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
    ]);

    return (
      granted['android.permission.READ_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.RECEIVE_SMS'] === PermissionsAndroid.RESULTS.GRANTED
    );
  } catch (err) {
    console.warn(err);
    return false;
  }
}

export type SyncRange = 'today' | 'week' | 'month' | 'all';

export async function syncRecentSMS(range: SyncRange = 'today'): Promise<Partial<Transaction>[]> {
  if (Platform.OS !== 'android' || !SmsAndroid) {
    console.log("SMS syncing is only available on Android native builds.");
    return [];
  }

  const now = new Date();
  let minDate = 0;

  if (range === 'today') {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    minDate = today.getTime();
  } else if (range === 'week') {
    minDate = now.getTime() - (7 * 24 * 60 * 60 * 1000);
  } else if (range === 'month') {
    minDate = now.getTime() - (30 * 24 * 60 * 60 * 1000);
  } else if (range === 'all') {
    minDate = 0;
  }

  return new Promise((resolve) => {
    const filter = {
      box: 'inbox',
      minDate: minDate,
      maxCount: range === 'all' ? 500 : 50, // Limit for better performance
    };

    SmsAndroid.list(
      JSON.stringify(filter),
      (fail: any) => {
        console.error("Failed to list SMS:", fail);
        resolve([]);
      },
      async (count: number, smsList: string) => {
        const messages: SMSMessage[] = JSON.parse(smsList);
        
        // Filter for potential financial messages (more strict to reduce AI costs)
        const financialKeywords = [
          'debited', 'spent', 'transaction', 'paid', 'credit', 'bank', 
          'received', 'sent to', 'payment', 'vpa', 'imps', 'neft', 'rtgs'
        ];
        const ignoreKeywords = ['otp', 'verification', 'login', 'password'];
        
        const potentialSMS = messages.filter(msg => {
          const body = msg.body.toLowerCase();
          return financialKeywords.some(kw => body.includes(kw)) && 
                 !ignoreKeywords.some(kw => body.includes(kw));
        });

        console.log(`Found ${potentialSMS.length} potential financial SMS messages.`);

        const extractedTransactions: Partial<Transaction>[] = [];

        // Process sequentially to avoid AI rate limits
        for (const msg of potentialSMS) {
          try {
            const parsed = await parseTransactionWithAI(msg.body);
            if (parsed && parsed.amount) {
              extractedTransactions.push({
                ...parsed,
                date: new Date(msg.date).toISOString(),
              });
            }
          } catch (e) {
            console.error("AI extraction failed for message:", e);
          }
        }

        resolve(extractedTransactions);
      }
    );
  });
}
