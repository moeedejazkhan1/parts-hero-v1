import { useState } from 'react';
import { GraduationCap, Play, CheckCircle, X, Lock, Star, Award, Clock } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

const videoModules = [
  { id: '1', title: 'VIN Decoding Mastery', desc: 'Decode any 17-digit commercial truck VIN for year, make, model, engine specs.', progress: 80, lessons: 8, completed: 6, cert: 'VIN Decoding Specialist', youtubeId: 'qD1pnquNBlk' },
  { id: '2', title: 'Heavy Duty Brake Systems', desc: 'Air brakes, S-cam foundation, ABS, slack adjusters, DOT inspection.', progress: 45, lessons: 10, completed: 4, cert: 'Brake System Specialist', youtubeId: 'pTWf6-8X9KY' },
  { id: '3', title: 'Engine Overhaul — ISX15 & DD15', desc: 'Complete in-frame overhaul from diagnosis to startup.', progress: 20, lessons: 12, completed: 2, cert: 'Engine Overhaul Specialist', youtubeId: 'X_Mx_4D4ZDM' },
  { id: '4', title: 'Eaton Fuller Transmission Rebuild', desc: '10, 13, and 18-speed manual transmission rebuild.', progress: 0, lessons: 10, completed: 0, cert: 'Transmission Rebuild Specialist', youtubeId: 'j8OfSDC33Rk' },
  { id: '5', title: 'Electrical & Diagnostics', desc: 'Alternators, starters, CAN bus, J1939 protocols.', progress: 60, lessons: 8, completed: 5, cert: 'Electrical Systems Specialist', youtubeId: '5_-NKUacQy8' },
  { id: '6', title: 'HVAC & A/C Service', desc: 'Refrigerant handling, compressor replacement, leak detection.', progress: 0, lessons: 6, completed: 0, cert: 'HVAC Service Specialist', youtubeId: 'v6sI4yWdaJk' },
];

const certifications = [
  { name: 'VIN Decoding Specialist', earned: true, date: '2026-03-15', modules: 1 },
  { name: 'Brake System Specialist', earned: false, date: null, modules: 2 },
  { name: 'Engine Overhaul Specialist', earned: false, date: null, modules: 3 },
  { name: 'Transmission Rebuild Specialist', earned: false, date: null, modules: 4 },
  { name: 'Electrical Systems Specialist', earned: false, date: null, modules: 5 },
  { name: 'HVAC Service Specialist', earned: false, date: null, modules: 6 },
  { name: 'Master Parts Hero', earned: false, date: null, modules: 0 },
];

const quizQs = [
  { q: 'What does the 10th VIN character represent?', options: ['Model Year', 'Plant Code', 'Check Digit', 'Engine Type'], correct: 0, explain: 'The 10th character encodes the model year.' },
  { q: 'Max pushrod stroke for Type 30 chamber?', options: ['1.5"', '2.0"', '2.5"', '3.0"'], correct: 1, explain: 'DOT specifies max 2.0" for Type 30 chambers.' },
  { q: 'Min brake lining thickness?', options: ['1/8"', '1/4"', '3/8"', '1/2"'], correct: 1, explain: 'Minimum 1/4" for drive axle per DOT.' },
];

export default function Academy() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [selAns, setSelAns] = useState<number | null>(null);
  const [showRes, setShowRes] = useState(false);
  const { showToast } = useToast();

  const mod = videoModules.find(m => m.id === activeModule);

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><GraduationCap className="w-6 h-6 text-cyan-400" />The Academy</h1>
        <p className="text-gray-500 text-sm mt-1">Professional training with video lessons and certifications.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="text-2xl font-bold text-cyan-400 font-mono">{videoModules.length}</div>
          <div className="text-xs text-gray-500 uppercase">Training Modules</div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="text-2xl font-bold text-emerald-400 font-mono">{videoModules.reduce((a, m) => a + m.completed, 0)}</div>
          <div className="text-xs text-gray-500 uppercase">Lessons Completed</div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="text-2xl font-bold text-amber-400 font-mono">{certifications.filter(c => c.earned).length}</div>
          <div className="text-xs text-gray-500 uppercase">Certifications Earned</div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="text-2xl font-bold text-purple-400 font-mono">{Math.round(videoModules.reduce((a, m) => a + m.progress, 0) / videoModules.length)}%</div>
          <div className="text-xs text-gray-500 uppercase">Overall Progress</div>
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videoModules.map(m => (
          <button key={m.id} onClick={() => setActiveModule(m.id)}
            className="text-left bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all group">
            {/* Thumbnail */}
            <div className="relative h-40 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center">
              <img src={`https://img.youtube.com/vi/${m.youtubeId}/mqdefault.jpg`} alt={m.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div className="relative z-10 w-12 h-12 rounded-full bg-cyan-500/30 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 text-white ml-0.5" />
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" /> {m.lessons} lessons
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white">{m.title}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{m.desc}</p>
              <div className="w-full bg-white/5 rounded-full h-1.5 mt-3">
                <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1.5 rounded-full" style={{ width: `${m.progress}%` }} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-gray-500">{m.completed}/{m.lessons} lessons</span>
                <span className="text-[10px] text-cyan-400">{m.progress}%</span>
              </div>
              {m.progress === 100 && (
                <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-emerald-400">
                  <Award className="w-3 h-3" /> {m.cert}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Module Detail Modal */}
      {mod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModule(null)}>
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${mod.youtubeId}?rel=0`}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                title={mod.title}
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">{mod.title}</h2>
                  <p className="text-sm text-gray-500">{mod.desc}</p>
                </div>
                <button onClick={() => setActiveModule(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className="text-sm text-cyan-400 font-medium">{mod.progress}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full" style={{ width: `${mod.progress}%` }} />
                </div>
              </div>

              {/* Lesson List */}
              <div className="space-y-2 mb-4">
                {Array.from({ length: mod.lessons }).map((_, i) => {
                  const completed = i < mod.completed;
                  return (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${completed ? 'bg-emerald-500/10' : 'bg-white/5'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${completed ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
                        {completed ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Play className="w-3 h-3 text-gray-500" />}
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm ${completed ? 'text-gray-300' : 'text-gray-500'}`}>
                          Lesson {i + 1}: {['Introduction', 'Core Concepts', 'Hands-On Practice', 'Advanced Techniques', 'Real-World Case Study', 'Troubleshooting', 'Best Practices', 'Safety Protocols', 'Industry Standards', 'Final Review', 'Assessment Prep', 'Certification Exam'][i] || `Topic ${i + 1}`}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-600 font-mono">{Math.floor(10 + Math.random() * 30)}:00</span>
                    </div>
                  );
                })}
              </div>

              <button onClick={() => { setShowQuiz(true); setActiveModule(null); }}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2">
                <Star className="w-4 h-4" /> Take Certification Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz */}
      {showQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Knowledge Check</h3>
              <button onClick={() => { setShowQuiz(false); setQIdx(0); setSelAns(null); setShowRes(false); }} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 mb-4">
              <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${((qIdx) / quizQs.length) * 100}%` }} />
            </div>
            <div className="mb-4">
              <span className="text-xs text-gray-500 font-mono">Question {qIdx + 1} of {quizQs.length}</span>
              <h4 className="text-base font-medium text-white mt-2">{quizQs[qIdx].q}</h4>
            </div>
            <div className="space-y-2">
              {quizQs[qIdx].options.map((opt, i) => (
                <button key={i} onClick={() => !showRes && setSelAns(i)} disabled={showRes}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    showRes && i === quizQs[qIdx].correct ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' :
                    showRes && selAns === i && i !== quizQs[qIdx].correct ? 'bg-red-500/15 border-red-500/40 text-red-400' :
                    selAns === i ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400' :
                    'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium">{String.fromCharCode(65 + i)}</span>
                    {opt}
                  </div>
                </button>
              ))}
            </div>
            {showRes && (
              <div className="mt-4">
                <div className={`p-3 rounded-xl ${selAns === quizQs[qIdx].correct ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  <p className="text-xs text-gray-400">{quizQs[qIdx].explain}</p>
                </div>
                <button onClick={() => {
                  if (qIdx < quizQs.length - 1) { setQIdx(qIdx + 1); setSelAns(null); setShowRes(false); }
                  else { setShowQuiz(false); showToast('Quiz complete! Certificate earned!', 'success'); }
                }} className="w-full mt-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold py-2.5 rounded-xl hover:brightness-110 transition-all">
                  {qIdx < quizQs.length - 1 ? 'Next Question' : 'Finish & Get Certified'}
                </button>
              </div>
            )}
            {selAns !== null && !showRes && (
              <button onClick={() => setShowRes(true)} className="w-full mt-3 bg-cyan-500/20 text-cyan-400 py-2.5 rounded-xl hover:bg-cyan-500/30 transition-all">Check Answer</button>
            )}
          </div>
        </div>
      )}

      {/* Certifications */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-amber-400" />Certification Wall</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {certifications.map(cert => (
            <div key={cert.name} className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${
              cert.earned ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/5 opacity-50'
            }`}>
              <Award className={`w-8 h-8 ${cert.earned ? 'text-amber-400' : 'text-gray-600'}`} />
              <span className={`text-xs font-medium text-center ${cert.earned ? 'text-amber-300' : 'text-gray-600'}`}>{cert.name}</span>
              {cert.earned && cert.date && <span className="text-[10px] text-amber-500/70">Earned {cert.date}</span>}
              {!cert.earned && <Lock className="w-3 h-3 text-gray-600" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
