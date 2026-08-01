"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import EmptyState from '@/components/EmptyState';

export default function CreateQuiz() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [questions, setQuestions] = useState([{ questionText: '', options: ['', ''], correctOptionIndex: 0 }]);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [viewQuiz, setViewQuiz] = useState(null);

  const loadData = async () => {
    try {
      const [clsRes, quizRes] = await Promise.all([
        fetch(`/api/teacher/classes?teacherId=${user.id}`),
        fetch(`/api/quizzes?teacherId=${user.id}`)
      ]);
      const clsData = await clsRes.json();
      const quizData = await quizRes.json();
      setClasses(clsData);
      setQuizzes(quizData);
      if (clsData.length > 0 && !selectedClassId) setSelectedClassId(clsData[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && user.id) loadData();
  }, [user]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', ''], correctOptionIndex: 0 }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleAddOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    if (!title || !selectedClassId || questions.length === 0) {
      alert("Please fill in all fields and add at least one question.");
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          classId: selectedClassId,
          createdBy: user.id,
          questions
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create quiz');

      await loadData();
      setShowModal(false);
      setTitle('');
      setQuestions([{ questionText: '', options: ['', ''], correctOptionIndex: 0 }]);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuiz = async (e, id) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this quiz?')) {
      setDeletingId(id);
      try {
        const res = await fetch(`/api/quizzes?id=${id}`, { method: 'DELETE' });
        if (!res.ok) {
           const errData = await res.json();
           throw new Error(errData.error || 'Failed to delete');
        }
        await loadData();
      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getClassName = (cid) => {
    const c = classes.find(c => c.id === cid);
    return c ? c.name : 'Unknown Class';
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">Quizzes</h2>
          <p className="text-on-surface-variant mt-1">Create and manage quizzes for your classes.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-on-primary px-6 py-2 rounded-xl font-label-md hover:bg-primary-container transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add_box</span>
          Create Quiz
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map(q => (
          <div 
            key={q.id} 
            onClick={() => setViewQuiz(q)}
            className="cursor-pointer bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high relative group hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline-sm text-on-surface mb-2 pr-4">{q.title}</h3>
                <span className="bg-surface-container text-on-surface text-xs font-bold px-2 py-0.5 rounded mt-1 inline-block">{getClassName(q.classId)}</span>
              </div>
              <button 
                onClick={(e) => handleDeleteQuiz(e, q.id)}
                disabled={deletingId === q.id}
                className="text-error hover:bg-error-container p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center disabled:opacity-50"
                title="Delete Quiz"
              >
                {deletingId === q.id ? (
                   <div className="w-5 h-5 border-2 border-error border-t-transparent rounded-full animate-spin"></div>
                ) : (
                   <span className="material-symbols-outlined text-[20px]">delete</span>
                )}
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-surface-container-high">
              <span className="text-on-surface-variant text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
                {q.questions.length} Questions
              </span>
            </div>
          </div>
        ))}
        {quizzes.length === 0 && (
          <div className="col-span-full">
            <EmptyState icon="quiz" title="No Quizzes Yet" description="Create a quiz to test your students' knowledge." />
          </div>
        )}
      </div>

      {/* Create Quiz Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline-sm text-on-surface mb-4">Create New Quiz</h3>
            <form onSubmit={handleSaveQuiz} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">Quiz Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface"
                    placeholder="e.g. Midterm Assessment"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">Assign to Class</label>
                  <select 
                    value={selectedClassId}
                    onChange={e => setSelectedClassId(e.target.value)}
                    className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface"
                    required
                  >
                    <option value="" disabled>Select a class...</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-title-md text-on-surface border-b border-surface-container-high pb-2">Questions</h4>
                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-surface-container-low p-4 rounded-xl space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Question {qIndex + 1}</label>
                      <input 
                        type="text" 
                        value={q.questionText}
                        onChange={e => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                        className="w-full bg-surface border border-surface-container-high rounded-lg px-3 py-2 text-on-surface text-sm"
                        placeholder="Enter your question"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Options</label>
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex gap-2 items-center">
                          <input 
                            type="radio" 
                            name={`correct-${qIndex}`} 
                            checked={q.correctOptionIndex === oIndex}
                            onChange={() => handleQuestionChange(qIndex, 'correctOptionIndex', oIndex)}
                            className="w-4 h-4 accent-primary"
                          />
                          <input 
                            type="text" 
                            value={opt}
                            onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)}
                            className="flex-1 bg-surface border border-surface-container-high rounded-lg px-3 py-1.5 text-on-surface text-sm"
                            placeholder={`Option ${oIndex + 1}`}
                            required
                          />
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={() => handleAddOption(qIndex)}
                        className="text-primary text-xs font-bold uppercase hover:underline mt-2"
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                ))}
                
                <button 
                  type="button"
                  onClick={handleAddQuestion}
                  className="w-full py-3 border-2 border-dashed border-primary/50 text-primary font-label-md rounded-xl hover:bg-primary-fixed/10 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add Another Question
                </button>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-surface-container-high">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-xl font-label-md text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={saving || classes.length === 0}
                  className="px-6 py-2 rounded-xl font-label-md bg-primary text-on-primary hover:bg-primary-container disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  Save Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Quiz Modal */}
      {viewQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" onClick={() => setViewQuiz(null)}>
          <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6 border-b border-surface-container-high pb-4">
              <div>
                <h3 className="font-headline-md text-on-surface">{viewQuiz.title}</h3>
                <span className="text-sm font-semibold text-primary">{getClassName(viewQuiz.classId)}</span>
              </div>
              <button onClick={() => setViewQuiz(null)} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-6">
              {viewQuiz.questions.map((q, i) => (
                <div key={i} className="bg-surface-container-low p-5 rounded-xl border border-surface-container">
                  <h4 className="font-title-md text-on-surface mb-4">
                    <span className="text-primary font-bold mr-2">Q{i + 1}.</span> 
                    {q.questionText}
                  </h4>
                  <div className="space-y-2">
                    {q.options.map((opt, j) => (
                      <div key={j} className={`p-3 rounded-lg flex items-center gap-3 border ${q.correctOptionIndex === j ? 'bg-primary-container/30 border-primary text-on-surface font-semibold' : 'bg-surface border-surface-container-high text-on-surface-variant'}`}>
                        {q.correctOptionIndex === j ? (
                           <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                        ) : (
                           <span className="material-symbols-outlined text-surface-variant text-[18px]">radio_button_unchecked</span>
                        )}
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
