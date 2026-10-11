/**
 * HABEEVATUSSUNNAH ONLINE BUSINESS - SECURE ADMIN AUTHENTICATION & HASHING ENGINE
 * 
 * Uses Web Cryptography API (crypto.subtle) with salted SHA-256 hashing.
 * Passwords are NEVER stored, printed, or transmitted in plain text.
 */

const SECURE_SALT = 'habeevat_sunnah_admin_sec_2026';
const STORAGE_HASH_KEY = 'habeevat_admin_credential_hash';

// Pre-computed salted SHA-256 cryptographic hash digest for authorized administrator
export const INITIAL_ADMIN_HASH = 'c17789a7774e9aa8e079abbf4568f3b8d15a7d5189b10fee200769fa7ee26070';

/**
 * Computes a salted SHA-256 cryptographic digest of a given password
 */
export async function computeHash(password: string, salt: string = SECURE_SALT): Promise<string> {
  const clean = password.trim();
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${clean}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Retrieves the currently active salted hash from persistent storage
 * Defaults to INITIAL_ADMIN_HASH
 */
export function getActiveAdminHash(): string {
  try {
    const stored = localStorage.getItem(STORAGE_HASH_KEY);
    if (stored && stored.length === 64) {
      return stored;
    }
  } catch (err) {
    console.warn('Storage read warning in getActiveAdminHash:', err);
  }
  return INITIAL_ADMIN_HASH;
}

/**
 * Verifies if an entered password matches the stored salted hash
 */
export async function verifyAdminPassword(passwordAttempt: string): Promise<boolean> {
  if (!passwordAttempt || !passwordAttempt.trim()) return false;
  try {
    const attemptHash = await computeHash(passwordAttempt);
    const activeHash = getActiveAdminHash();
    return attemptHash === activeHash;
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

/**
 * Updates the administrator password after validating the current password
 * Returns an object with success status and a user-facing message
 */
export async function updateAdminPassword(
  currentPasswordAttempt: string,
  newPassword: string,
  confirmPassword: string
): Promise<{ success: boolean; message: string }> {
  // 1. Verify current password
  const isCurrentValid = await verifyAdminPassword(currentPasswordAttempt);
  if (!isCurrentValid) {
    return {
      success: false,
      message: 'The current administrator password entered is incorrect.'
    };
  }

  // 2. Validate new password length and structure
  const cleanNew = newPassword.trim();
  if (cleanNew.length < 8) {
    return {
      success: false,
      message: 'New password must be at least 8 characters long.'
    };
  }

  // 3. Confirm match
  if (cleanNew !== confirmPassword.trim()) {
    return {
      success: false,
      message: 'The new password and confirmation password do not match.'
    };
  }

  // 4. Compute new cryptographic hash and persist
  try {
    const newHash = await computeHash(cleanNew);
    localStorage.setItem(STORAGE_HASH_KEY, newHash);
    return {
      success: true,
      message: 'Administrator password successfully updated and securely persisted.'
    };
  } catch (err) {
    return {
      success: false,
      message: 'Failed to update password due to a cryptographic error.'
    };
  }
}

/**
 * Resets the password to the default administrator credential hash
 */
export function resetAdminPasswordToDefault(): void {
  try {
    localStorage.removeItem(STORAGE_HASH_KEY);
  } catch (err) {
    console.warn('Error resetting admin password key:', err);
  }
}
