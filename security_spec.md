# Firebase Security Specification - MoneyTracker

## 1. Data Invariants
- A User profile must belong to the authenticated user (`uid` matches `request.auth.uid`).
- Transactions and Accounts must be stored as subcollections of the user's profile.
- All amounts must be numeric.
- `createdAt` timestamps must be immutable once set.
- Sensitive fields like `email` in the user profile must be protected.

## 2. The "Dirty Dozen" Payloads (Red Team Audit)

### User Profile Attacks
1. **Identity Spoofing**: Attempt to create a user profile for a different UID.
2. **PII Leak**: Attempt to read another user's email or profile.
3. **Privilege Escalation**: Attempt to add an `isAdmin` field to the user profile (though not currently used by app logic).
4. **Shadow Update**: Attempt to update a user's `uid` or `email`.

### Transaction Attacks
5. **Orphaned Write**: Attempt to create a transaction for another user.
6. **Negative Value Poisoning**: Attempt to set a transaction amount to a negative number (if logic forbids it).
7. **Size Attack**: Attempt to write a 1MB string into the transaction `description`.
8. **ID Poisoning**: Attempt to use `../` or malicious characters in the transaction ID.
9. **State Shortcut**: Attempt to change a transaction's `type` from 'expense' to 'income' after creation.

### Account Attacks
10. **Balance Manipulation**: Attempt to set a bank account balance via a direct Firestore write bypassing app logic.
11. **Type Injection**: Attempt to set an account type to an invalid value (e.g., 'super_admin_account').
12. **Metadata Tampering**: Attempt to modify `updatedAt` to a past timestamp.

## 3. Test Runner Strategy
We will use `@firebase/rules-unit-testing` or similar patterns to verify these rules.
The rules must explicitly:
- Reject any write that doesn't pass `isValid[Entity]()`.
- Reject any update that changes immutable fields.
- Reject any read/write from unauthenticated users.
