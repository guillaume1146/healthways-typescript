import fs from 'fs';

const BASE = process.argv[2] || 'https://h-wyz.com';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let passed = 0;
let failed = 0;
function ok(label) { passed++; console.log('     \u2705 ' + label); }
function fail(label) { failed++; console.log('     \u274c ' + label); }

async function test() {
  console.log('\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
  console.log('  PRODUCTION E2E: Register + Login + VLM Verification');
  console.log('  Target: ' + BASE);
  console.log('\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
  console.log('');

  // ═══════════════════════════════════════════════════════════
  // PART 1: Registration for all 11 roles
  // ═══════════════════════════════════════════════════════════
  console.log('--- PART 1: Register all 11 user types ---');
  console.log('');

  const roles = [
    { type: 'patient', extra: {} },
    { type: 'doctor', extra: { licenseNumber: 'DOC-E2E-' + Date.now(), specialization: 'GP' } },
    { type: 'nurse', extra: { licenseNumber: 'NRS-E2E-' + Date.now() } },
    { type: 'nanny', extra: {} },
    { type: 'pharmacist', extra: { licenseNumber: 'PHR-E2E-' + Date.now(), institution: 'E2EPharm' } },
    { type: 'lab', extra: { licenseNumber: 'LAB-E2E-' + Date.now(), institution: 'E2ELab' } },
    { type: 'emergency', extra: {} },
    { type: 'insurance', extra: { companyName: 'E2EInsure' } },
    { type: 'corporate', extra: { companyName: 'E2ECorp', companyRegistrationNumber: 'BRN-E2E-' + Date.now() } },
    { type: 'referral-partner', extra: { businessType: 'Individual' } },
    { type: 'regional-admin', extra: { targetCountry: 'MU', targetRegion: 'East', countryCode: 'MU' } },
  ];

  for (const role of roles) {
    const ts = Date.now();
    const res = await fetch(BASE + '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'E2E ' + role.type, email: 'e2e-' + role.type + '-' + ts + '@test.com',
        password: 'Secure123!', confirmPassword: 'Secure123!',
        phone: '+230 5' + String(ts).slice(-7), dateOfBirth: '1990-01-15', gender: 'Male',
        address: 'Test City', agreeToTerms: true, agreeToPrivacy: true, agreeToDisclaimer: true,
        userType: role.type, documentVerifications: [], skippedDocuments: [],
        ...role.extra
      })
    });
    const data = await res.json();
    const expected = role.type === 'regional-admin' ? 'pending' : 'active';
    if (res.status === 201 && data.accountStatus === expected) {
      ok(role.type.padEnd(18) + ' -> 201 | ' + data.accountStatus);
    } else {
      fail(role.type.padEnd(18) + ' -> ' + res.status + ' | ' + (data.accountStatus || data.message));
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PART 2: Register with skipped docs (should still be active)
  // ═══════════════════════════════════════════════════════════
  console.log('');
  console.log('--- PART 2: Skipped documents -> still active ---');
  console.log('');

  let res = await fetch(BASE + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Skipped Doc Patient', email: 'e2e-skip-' + Date.now() + '@test.com',
      password: 'Secure123!', confirmPassword: 'Secure123!',
      phone: '+230 5789 7771', dateOfBirth: '1990-01-15', gender: 'Male',
      address: 'Port Louis', agreeToTerms: true, agreeToPrivacy: true, agreeToDisclaimer: true,
      userType: 'patient', documentVerifications: [], skippedDocuments: ['national-id']
    })
  });
  let data = await res.json();
  if (res.status === 201 && data.accountStatus === 'active' && data.hasSkippedDocuments) {
    ok('Patient with skipped docs -> active, hasSkippedDocuments=true');
  } else {
    fail('Patient with skipped docs -> ' + res.status + ' | ' + data.accountStatus);
  }

  res = await fetch(BASE + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Skipped Doc Doctor', email: 'e2e-skip-doc-' + Date.now() + '@test.com',
      password: 'Secure123!', confirmPassword: 'Secure123!',
      phone: '+230 5789 7772', dateOfBirth: '1985-03-10', gender: 'Female',
      address: 'Curepipe', agreeToTerms: true, agreeToPrivacy: true, agreeToDisclaimer: true,
      userType: 'doctor', licenseNumber: 'DOC-SKIP-' + Date.now(), specialization: 'Neurology',
      documentVerifications: [], skippedDocuments: ['medical-degree', 'professional-license']
    })
  });
  data = await res.json();
  if (res.status === 201 && data.accountStatus === 'active' && data.hasSkippedDocuments) {
    ok('Doctor with skipped docs -> active, hasSkippedDocuments=true');
  } else {
    fail('Doctor with skipped docs -> ' + res.status + ' | ' + data.accountStatus);
  }

  // ═══════════════════════════════════════════════════════════
  // PART 3: Register + Login E2E
  // ═══════════════════════════════════════════════════════════
  console.log('');
  console.log('--- PART 3: Register then Login ---');
  console.log('');

  const loginEmail = 'e2e-login-' + Date.now() + '@test.com';
  res = await fetch(BASE + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Marie Claire Dupont', email: loginEmail,
      password: 'Secure123!', confirmPassword: 'Secure123!',
      phone: '+230 5789 8881', dateOfBirth: '1992-04-20', gender: 'Female',
      address: 'Rose Hill', agreeToTerms: true, agreeToPrivacy: true, agreeToDisclaimer: true,
      userType: 'patient', documentVerifications: [], skippedDocuments: []
    })
  });
  data = await res.json();
  if (res.status === 201 && data.accountStatus === 'active') {
    ok('Registered Marie Claire Dupont -> active');
  } else {
    fail('Register failed: ' + res.status + ' | ' + data.message);
  }

  res = await fetch(BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: loginEmail, password: 'Secure123!' })
  });
  const cookies = res.headers.getSetCookie?.() || [];
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');
  data = await res.json();
  if (data.success && data.user) {
    ok('Login successful -> ' + data.user.firstName + ' ' + data.user.lastName + ' (' + data.user.userType + ')');
  } else {
    fail('Login failed: ' + res.status + ' | ' + data.message);
  }

  // ═══════════════════════════════════════════════════════════
  // PART 4: VLM Document Verification — matching name
  // ═══════════════════════════════════════════════════════════
  console.log('');
  console.log('--- PART 4: VLM Document Verification ---');
  console.log('');

  if (!cookieHeader) {
    console.log('     (skipping VLM tests — no auth cookies from login)');
  } else {
    // 4a: Send an icon (no name content) — VLM should say name NOT found
    console.log('  4a) Image with NO name content (app icon)...');
    const imgBuffer = fs.readFileSync('public/icons/icon-128x128.png');
    let blob = new Blob([imgBuffer], { type: 'image/png' });
    let formData = new FormData();
    formData.append('file', blob, 'app-icon.png');
    formData.append('fullName', 'Marie Claire Dupont');
    formData.append('documentType', 'National ID');

    res = await fetch(BASE + '/api/documents/verify', {
      method: 'POST',
      headers: { 'Cookie': cookieHeader },
      body: formData
    });
    data = await res.json();
    console.log('      method:', data.method, '| verified:', data.verified, '| confidence:', data.confidence, '| nameFound:', data.nameFound);
    if (data.method === 'vlm' && data.verified === false) {
      ok('VLM correctly rejected icon image (no name found, not verified)');
    } else if (data.method === 'vlm' && data.verified === true) {
      fail('VLM incorrectly verified an icon image!');
    } else {
      fail('Unexpected method: ' + data.method);
    }

    // 4b: Send with a WRONG name — should also be rejected
    console.log('');
    console.log('  4b) Image with WRONG name (checking "Jean Pierre Rakoto" against icon)...');
    formData = new FormData();
    formData.append('file', blob, 'wrong-name-doc.png');
    formData.append('fullName', 'Jean Pierre Rakoto');
    formData.append('documentType', 'Passport');

    res = await fetch(BASE + '/api/documents/verify', {
      method: 'POST',
      headers: { 'Cookie': cookieHeader },
      body: formData
    });
    data = await res.json();
    console.log('      method:', data.method, '| verified:', data.verified, '| confidence:', data.confidence, '| nameFound:', data.nameFound);
    if (data.method === 'vlm' && data.verified === false && data.nameFound === false) {
      ok('VLM correctly rejected — wrong name not found in document');
    } else {
      fail('VLM should have rejected: verified=' + data.verified + ', nameFound=' + data.nameFound);
    }

    // 4c: Unsupported file type — should be rejected at API level
    console.log('');
    console.log('  4c) Unsupported file type (text/plain)...');
    const textBlob = new Blob(['This is not a document image'], { type: 'text/plain' });
    formData = new FormData();
    formData.append('file', textBlob, 'readme.txt');
    formData.append('fullName', 'Marie Claire Dupont');
    formData.append('documentType', 'National ID');

    res = await fetch(BASE + '/api/documents/verify', {
      method: 'POST',
      headers: { 'Cookie': cookieHeader },
      body: formData
    });
    data = await res.json();
    console.log('      Status:', res.status, '| message:', data.message);
    if (res.status === 400 && data.success === false) {
      ok('Unsupported file type correctly rejected (400)');
    } else {
      fail('Should have been rejected: status=' + res.status);
    }

    // 4d: File too large simulation — send oversized claim
    console.log('');
    console.log('  4d) Missing required fields (no fullName)...');
    formData = new FormData();
    formData.append('file', blob, 'no-name.png');
    // intentionally omit fullName

    res = await fetch(BASE + '/api/documents/verify', {
      method: 'POST',
      headers: { 'Cookie': cookieHeader },
      body: formData
    });
    data = await res.json();
    console.log('      Status:', res.status, '| message:', data.message);
    if (res.status === 400 && data.success === false) {
      ok('Missing fullName correctly rejected (400)');
    } else {
      fail('Should have been rejected: status=' + res.status);
    }

    // 4e: Unauthenticated request — no cookies
    console.log('');
    console.log('  4e) Unauthenticated request (no cookies)...');
    formData = new FormData();
    formData.append('file', blob, 'no-auth.png');
    formData.append('fullName', 'Test User');
    formData.append('documentType', 'National ID');

    res = await fetch(BASE + '/api/documents/verify', {
      method: 'POST',
      // no Cookie header
      body: formData
    });
    data = await res.json();
    console.log('      Status:', res.status, '| message:', data.message);
    if (res.status === 401) {
      ok('Unauthenticated request correctly rejected (401)');
    } else {
      fail('Should have been 401: status=' + res.status);
    }

    // 4f: Verify with a different name — "Completely Fake Person"
    console.log('');
    console.log('  4f) Completely fake person name against icon image...');
    formData = new FormData();
    formData.append('file', blob, 'fake-person.png');
    formData.append('fullName', 'Zxyqwerty Nonexistent Fakeperson');
    formData.append('documentType', 'Driver License');

    res = await fetch(BASE + '/api/documents/verify', {
      method: 'POST',
      headers: { 'Cookie': cookieHeader },
      body: formData
    });
    data = await res.json();
    console.log('      method:', data.method, '| verified:', data.verified, '| confidence:', data.confidence, '| nameFound:', data.nameFound);
    console.log('      matchDetails:', JSON.stringify(data.matchDetails));
    if (data.method === 'vlm' && data.verified === false && data.nameFound === false) {
      ok('VLM correctly rejected fake person — name not found');
    } else {
      fail('VLM should have rejected: verified=' + data.verified);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PART 5: Input validation on register
  // ═══════════════════════════════════════════════════════════
  console.log('');
  console.log('--- PART 5: Registration input validation ---');
  console.log('');

  // 5a: Empty body
  res = await fetch(BASE + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  if (res.status === 400) ok('Empty body -> 400');
  else fail('Empty body -> ' + res.status);

  // 5b: Invalid email
  res = await fetch(BASE + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test', email: 'not-an-email', password: 'Secure123!', confirmPassword: 'Secure123!',
      phone: '+230 5789 0000', dateOfBirth: '1990-01-15', gender: 'Male', address: 'Test',
      agreeToTerms: true, agreeToPrivacy: true, agreeToDisclaimer: true, userType: 'patient',
      documentVerifications: [], skippedDocuments: []
    })
  });
  if (res.status === 400) ok('Invalid email -> 400');
  else fail('Invalid email -> ' + res.status);

  // 5c: Password mismatch
  res = await fetch(BASE + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test', email: 'e2e-mismatch-' + Date.now() + '@test.com',
      password: 'Secure123!', confirmPassword: 'Wrong456!',
      phone: '+230 5789 0000', dateOfBirth: '1990-01-15', gender: 'Male', address: 'Test',
      agreeToTerms: true, agreeToPrivacy: true, agreeToDisclaimer: true, userType: 'patient',
      documentVerifications: [], skippedDocuments: []
    })
  });
  if (res.status === 400) ok('Password mismatch -> 400');
  else fail('Password mismatch -> ' + res.status);

  // 5d: Terms not agreed
  res = await fetch(BASE + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test', email: 'e2e-terms-' + Date.now() + '@test.com',
      password: 'Secure123!', confirmPassword: 'Secure123!',
      phone: '+230 5789 0000', dateOfBirth: '1990-01-15', gender: 'Male', address: 'Test',
      agreeToTerms: false, agreeToPrivacy: true, agreeToDisclaimer: true, userType: 'patient',
      documentVerifications: [], skippedDocuments: []
    })
  });
  if (res.status === 400) ok('Terms not agreed -> 400');
  else fail('Terms not agreed -> ' + res.status);

  // 5e: Unsupported user type
  res = await fetch(BASE + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test', email: 'e2e-badtype-' + Date.now() + '@test.com',
      password: 'Secure123!', confirmPassword: 'Secure123!',
      phone: '+230 5789 0000', dateOfBirth: '1990-01-15', gender: 'Male', address: 'Test',
      agreeToTerms: true, agreeToPrivacy: true, agreeToDisclaimer: true, userType: 'superhero',
      documentVerifications: [], skippedDocuments: []
    })
  });
  if (res.status === 400) ok('Unsupported user type -> 400');
  else fail('Unsupported user type -> ' + res.status);

  // 5f: Duplicate email
  const dupEmail = 'e2e-dup-' + Date.now() + '@test.com';
  await fetch(BASE + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'First User', email: dupEmail, password: 'Secure123!', confirmPassword: 'Secure123!',
      phone: '+230 5789 0000', dateOfBirth: '1990-01-15', gender: 'Male', address: 'Test',
      agreeToTerms: true, agreeToPrivacy: true, agreeToDisclaimer: true, userType: 'patient',
      documentVerifications: [], skippedDocuments: []
    })
  });
  res = await fetch(BASE + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Duplicate User', email: dupEmail, password: 'Secure123!', confirmPassword: 'Secure123!',
      phone: '+230 5789 0001', dateOfBirth: '1990-01-15', gender: 'Male', address: 'Test',
      agreeToTerms: true, agreeToPrivacy: true, agreeToDisclaimer: true, userType: 'patient',
      documentVerifications: [], skippedDocuments: []
    })
  });
  data = await res.json();
  if (res.status === 409) ok('Duplicate email -> 409');
  else fail('Duplicate email -> ' + res.status + ' | ' + data.message);

  // ═══════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════
  console.log('');
  console.log('\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
  console.log('  RESULTS: ' + passed + ' passed, ' + failed + ' failed');
  console.log('\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');

  if (failed > 0) process.exit(1);
}

test().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
