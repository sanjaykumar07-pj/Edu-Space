async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Quiz',
        classId: 'class-1',
        createdBy: 'teacher_1',
        questions: [{ questionText: 'Q1', options: ['A', 'B'], correctOptionIndex: 0 }]
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
