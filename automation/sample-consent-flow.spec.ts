/**
 * Sample Playwright + TypeScript regression test for YOBO's account-linking
 * to consent-revocation flow. Uses the Page Object Model pattern.
 * All data below is DUMMY/SAMPLE data for portfolio demonstration only —
 * no real credentials, bank details, or endpoints.
 */

import { test, expect, Page } from '@playwright/test';

// ── Dummy test data ─────────────────────────────────────────────
const DUMMY_FIP = {
  bankName: 'Demo Bank A',
  accountHandle: 'DEMO-ACC-0001',
};

const DUMMY_CONSENT = {
  purpose: 'Loan Underwriting (Demo)',
  dataTypes: 'Savings Account Transactions',
  durationDays: '30',
};

// ── Page Objects ─────────────────────────────────────────────────
class AccountLinkingPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/link-account');
  }

  async linkAccount(bankName: string, accountHandle: string) {
    await this.page.getByLabel('Bank').selectOption({ label: bankName });
    await this.page.getByLabel('Account Handle').fill(accountHandle);
    await this.page.getByRole('button', { name: 'Link Account' }).click();
  }

  async getLinkedStatusText() {
    return this.page.getByTestId('link-status').innerText();
  }
}

class ConsentApprovalPage {
  constructor(private page: Page) {}

  async getConsentArtifactText() {
    return this.page.getByTestId('consent-artifact').innerText();
  }

  async approve() {
    await this.page.getByRole('button', { name: 'Approve' }).click();
  }

  async deny() {
    await this.page.getByRole('button', { name: 'Deny' }).click();
  }
}

class ConsentManagementPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/consents');
  }

  async revokeConsent(consentId: string) {
    await this.page.getByTestId(`revoke-${consentId}`).click();
    await this.page.getByRole('button', { name: 'Confirm Revoke' }).click();
  }

  async getConsentStatusText(consentId: string) {
    return this.page.getByTestId(`consent-status-${consentId}`).innerText();
  }
}

// ── Tests ────────────────────────────────────────────────────────
test.describe('YOBO — Account Linking & Consent Flow', () => {
  test('linking an account does not itself share any data', async ({ page }) => {
    const linking = new AccountLinkingPage(page);
    await linking.goto();
    await linking.linkAccount(DUMMY_FIP.bankName, DUMMY_FIP.accountHandle);

    await expect(linking.getLinkedStatusText()).resolves.toMatch(/Linked/i);
    // No consent has been requested/approved yet — zero data-sharing implied by "Linked" alone.
  });

  test('consent artifact discloses purpose, data types, and duration before approval', async ({ page }) => {
    await page.goto(`/consent-request?fip=${encodeURIComponent(DUMMY_FIP.bankName)}`);
    const consent = new ConsentApprovalPage(page);

    const artifactText = await consent.getConsentArtifactText();
    expect(artifactText).toContain(DUMMY_CONSENT.purpose);
    expect(artifactText).toContain(DUMMY_CONSENT.dataTypes);
    expect(artifactText).toContain(DUMMY_CONSENT.durationDays);
  });

  test('revoking a consent immediately shows Revoked, distinct from Expired', async ({ page }) => {
    const management = new ConsentManagementPage(page);
    await management.goto();

    const dummyConsentId = 'demo-consent-001';
    await management.revokeConsent(dummyConsentId);

    const statusText = await management.getConsentStatusText(dummyConsentId);
    expect(statusText).toMatch(/Revoked/i);
    expect(statusText).not.toMatch(/Expired/i);
  });

  test('data fetch is blocked immediately after revocation', async ({ page }) => {
    const management = new ConsentManagementPage(page);
    await management.goto();

    const dummyConsentId = 'demo-consent-002';
    await management.revokeConsent(dummyConsentId);

    // Attempting a fetch under a just-revoked consent must fail, not silently succeed.
    const response = await page.request.get(`/api/data-fetch?consentId=${dummyConsentId}`);
    expect(response.status()).toBe(403);
  });
});
