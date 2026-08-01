async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Class By Script',
        code: 'TEST-101',
        teacherId: 'teacher_1'
      })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch(e) {
    console.error(e);
  }
}
test();
