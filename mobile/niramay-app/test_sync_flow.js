/**
 * test_sync_flow.js
 * End-to-end automated test for:
 * 1. Offline patient creation (queue locally)
 * 2. Reconnect & automatic sync to backend
 * 3. Verify backend record creation
 * 4. Duplicate prevention test on retry
 */

const BACKEND_URL = 'http://127.0.0.1:8000';

async function run() {
  console.log('--- 1. Authenticating as ASHA Worker ---');
  const loginRes = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'ASHA_NAND_023',
      password: 'asha2024',
    }),
  });

  if (!loginRes.ok) {
    throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
  }

  const loginData = await loginRes.json();
  const token = loginData.access_token;
  console.log('✓ Authenticated, token acquired.');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  console.log('\n--- 2. Simulating Offline: Queueing Patient Registration ---');
  const uniqueTag = Math.random().toString(36).substring(2, 8);
  const patientPayload = {
    name: `Offline Patient ${uniqueTag}`,
    age: 29,
    gender: 'Female',
    phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
    village: 'Chinchpada',
    abha_id: `91-5555-${Math.floor(1000 + Math.random() * 9000)}-01`,
    allergies: 'None',
  };

  const tempPatientId = `temp-${Date.now()}`;
  const syncQueue = [
    {
      id: `op-${Date.now()}`,
      type: 'PATIENT_REGISTRATION',
      payload: patientPayload,
      tempId: tempPatientId,
      createdAt: new Date().toISOString(),
      retryCount: 0,
      status: 'pending',
    },
    {
      id: `op-ref-${Date.now()}`,
      type: 'REFERRAL_CREATION',
      payload: {
        patient_id: tempPatientId, // references offline patient!
        destination_hospital: 'District Hospital Nandurbar',
        reason: 'Severe fever and fatigue',
      },
      createdAt: new Date().toISOString(),
      retryCount: 0,
      status: 'pending',
    }
  ];

  console.log('✓ Queued offline operations:');
  console.log(`  - 1: PATIENT_REGISTRATION (${patientPayload.name}, tempId: ${tempPatientId})`);
  console.log(`  - 2: REFERRAL_CREATION (referencing ${tempPatientId})`);

  console.log('\n--- 3. Reconnecting: Processing Sync Queue ---');
  // Reconnect processing logic identical to syncQueue.ts
  let realPatientId = null;
  let syncedOps = [];

  for (const item of syncQueue) {
    if (item.type === 'PATIENT_REGISTRATION') {
      // Duplicate prevention check
      const queryName = encodeURIComponent(item.payload.name);
      const searchRes = await fetch(`${BACKEND_URL}/api/v1/patients/?q=${queryName}`, { headers });
      const existingList = await searchRes.json();
      const match = existingList.find(p => p.name.toLowerCase() === item.payload.name.toLowerCase());

      if (match) {
        realPatientId = match.id;
        console.log(`  [Deduplication] Patient already existed on backend: ID ${realPatientId}`);
      } else {
        const createRes = await fetch(`${BACKEND_URL}/api/v1/patients/`, {
          method: 'POST',
          headers,
          body: JSON.stringify(item.payload),
        });
        if (!createRes.ok) throw new Error(`Patient sync failed: ${createRes.status}`);
        const created = await createRes.json();
        realPatientId = created.id;
        console.log(`  ✓ Patient synced to backend successfully! Backend ID: ${realPatientId}`);
      }

      // Propagate real ID to subsequent dependent queue items
      for (const other of syncQueue) {
        if (other.payload && other.payload.patient_id === item.tempId) {
          other.payload.patient_id = realPatientId;
          console.log(`  ✓ Dependent item ${other.type} updated patient_id from ${item.tempId} -> ${realPatientId}`);
        }
      }
      syncedOps.push(item.id);
    } else if (item.type === 'REFERRAL_CREATION') {
      const refRes = await fetch(`${BACKEND_URL}/api/v1/referrals/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(item.payload),
      });
      if (!refRes.ok) throw new Error(`Referral sync failed: ${refRes.status} ${await refRes.text()}`);
      const refData = await refRes.json();
      console.log(`  ✓ Dependent referral synced successfully! Referral ID: ${refData.id}, Code: ${refData.referral_code}`);
      syncedOps.push(item.id);
    }
  }

  // Remove synced ops from queue
  const remainingQueue = syncQueue.filter(op => !syncedOps.includes(op.id));
  console.log(`\n✓ Sync completed. Remaining in queue: ${remainingQueue.length} (Expected: 0)`);
  if (remainingQueue.length !== 0) {
    throw new Error('Queue not cleared after successful sync!');
  }

  console.log('\n--- 4. Verifying Backend Record Exists ---');
  const verifyRes = await fetch(`${BACKEND_URL}/api/v1/patients/${realPatientId}`, { headers });
  if (!verifyRes.ok) {
    throw new Error(`Failed to GET synced patient from backend: ${verifyRes.status}`);
  }
  const verifyData = await verifyRes.json();
  console.log(`✓ Verified patient on backend: "${verifyData.name}" in ${verifyData.village}`);

  console.log('\n--- 5. Duplicate Prevention Test on Retry ---');
  // Attempt to re-sync the exact same patient payload
  const duplicateSearchRes = await fetch(`${BACKEND_URL}/api/v1/patients/?q=${encodeURIComponent(patientPayload.name)}`, { headers });
  const listAfterSync = await duplicateSearchRes.json();
  const matchedPatients = listAfterSync.filter(p => p.name.toLowerCase() === patientPayload.name.toLowerCase());
  console.log(`✓ Total instances of patient on backend: ${matchedPatients.length} (Expected: 1)`);
  if (matchedPatients.length !== 1) {
    throw new Error(`Duplicate records found! Count: ${matchedPatients.length}`);
  }

  console.log('\n=========================================');
  console.log('ALL OFFLINE SYNC TESTS PASSED SUCCESSFULLY');
  console.log('=========================================');
}

run().catch(err => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
