export const starterQuestions = [
  {text:'Which planet is known as the Red Planet?',options:['Venus','Mars','Jupiter','Mercury'],correct:1,seconds:20},
  {text:'How many hearts does an octopus have?',options:['One','Two','Three','Four'],correct:2,seconds:20},
  {text:'Which country gave the Statue of Liberty to the USA?',options:['France','Italy','Spain','Canada'],correct:0,seconds:20},
  {text:'What is the largest ocean on Earth?',options:['Atlantic','Indian','Arctic','Pacific'],correct:3,seconds:20},
  {text:'In which game would you hear “checkmate”?',options:['Poker','Chess','Scrabble','Monopoly'],correct:1,seconds:20}
];
export const thirdGradeQuestions = [
  {text:'What is 7 × 8?',options:['48','54','56','64'],correct:2,seconds:20},
  {text:'What is 144 ÷ 12?',options:['10','12','14','16'],correct:1,seconds:20},
  {text:'Which fraction is equal to one-half?',options:['2/4','1/4','3/4','2/3'],correct:0,seconds:20},
  {text:'A rectangle is 6 cm long and 4 cm wide. What is its perimeter?',options:['10 cm','24 cm','16 cm','20 cm'],correct:3,seconds:30},
  {text:'What is the value of the digit 5 in the number 3,582?',options:['5','50','500','5,000'],correct:2,seconds:20},
  {text:'Which part of a plant usually absorbs water from the soil?',options:['Flower','Roots','Leaves','Fruit'],correct:1,seconds:20},
  {text:'What do we call water when it is in its solid state?',options:['Ice','Steam','Rain','Mist'],correct:0,seconds:20},
  {text:'Which force pulls objects toward Earth?',options:['Friction','Magnetism','Electricity','Gravity'],correct:3,seconds:20},
  {text:'Which of these animals is a mammal?',options:['Frog','Shark','Dolphin','Crocodile'],correct:2,seconds:20},
  {text:'Earth takes approximately how long to orbit the Sun once?',options:['One day','One year','One month','One week'],correct:1,seconds:20},
  {text:'Which word is the noun in “The rabbit hops quickly”?',options:['Rabbit','Hops','Quickly','The'],correct:0,seconds:20},
  {text:'What is the past tense of “bring”?',options:['Brang','Bringed','Brung','Brought'],correct:3,seconds:20},
  {text:'Which word means the opposite of “ancient”?',options:['Old','Historic','Modern','Early'],correct:2,seconds:20},
  {text:'Which continent is Brazil in?',options:['Europe','South America','Africa','Asia'],correct:1,seconds:20},
  {text:'What are the four main directions on a compass?',options:['North, south, east, west','Up, down, left, right','North, south, hot, cold','East, west, near, far'],correct:0,seconds:20}
].map(q=>({...q,category:'Third-Grade Challenge',type:'text',audioUrl:''}));

export function normalizeQuestion(q) {
  return {...q,category:q.category?.trim()||'General Trivia',type:q.type||'text',audioUrl:q.audioUrl?.trim()||'',mediaId:q.mediaId||'',mediaName:q.mediaName||''};
}
export function validAudioUrl(value) {
  if (!value) return true;
  if (typeof value !== 'string' || value.length > 2000) return false;
  return /^\.\/(audio|video|media)\/[a-zA-Z0-9_./-]+$/.test(value) || /^https:\/\/[^\s]+$/i.test(value);
}
export function validateQuestions(value) {
  if (!Array.isArray(value) || value.length < 1 || value.length > 100) throw Error('Use between 1 and 100 questions.');
  return value.map(q => {
    if (typeof q.text !== 'string' || !q.text.trim() || q.text.length > 300 || !Array.isArray(q.options) || q.options.length !== 4 || q.options.some(o => typeof o !== 'string' || !o.trim() || o.length > 150) || !Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3 || !Number.isInteger(q.seconds) || q.seconds < 5 || q.seconds > 120) throw Error('Each question needs text, four answers, a correct answer (0–3), and a timer (5–120 seconds).');
    if(q.category!==undefined && (typeof q.category!=='string'||q.category.length>60)) throw Error('Category names must be 60 characters or less.');
    if(q.type!==undefined && !['text','audio','video'].includes(q.type)) throw Error('Question type must be text, audio, or video.');
    if(q.audioUrl!==undefined && !validAudioUrl(q.audioUrl)) throw Error('Use an HTTPS audio file URL or a path such as ./audio/clip-01.mp3.');
    if(q.mediaId!==undefined && (typeof q.mediaId!=='string'||!/^[-a-zA-Z0-9]{0,80}$/.test(q.mediaId)))throw Error('Invalid uploaded clip reference.');
    if(q.mediaName!==undefined && (typeof q.mediaName!=='string'||q.mediaName.length>200))throw Error('Clip filename is too long.');
    return normalizeQuestion({text:q.text.trim(),options:q.options.map(o=>o.trim()),correct:q.correct,seconds:q.seconds,category:q.category,type:q.type,audioUrl:q.audioUrl,mediaId:q.mediaId,mediaName:q.mediaName});
  });
}
export function rankingTime(uid,player,correctTimes={}) {
  if(!(player.score>0))return 0;
  const time=correctTimes[uid];
  return Number.isFinite(time)&&time>=0?time:Infinity;
}
export function standings(players = {},correctTimes={}) {
  const sorted=Object.entries(players).map(([uid,p])=>({uid,...p})).sort((a,b)=>(b.score||0)-(a.score||0)||rankingTime(a.uid,a,correctTimes)-rankingTime(b.uid,b,correctTimes)||a.name.localeCompare(b.name));
  let rank=1;
  return sorted.map((p,i)=>{if(i>0){const previous=sorted[i-1];if((p.score||0)!==(previous.score||0)||rankingTime(p.uid,p,correctTimes)!==rankingTime(previous.uid,previous,correctTimes))rank=i+1;}return {...p,rank};});
}
export function publicQuestion(q,index,total,endsAt) {return {text:q.text,options:q.options,index,total,endsAt,category:q.category||'General Trivia',type:q.type||'text'};}
export function roundState(q,index,total,now) {const listening=['audio','video'].includes(q.type);return {phase:listening?'listening':'question',question:{...publicQuestion(q,index,total,listening?0:now+q.seconds*1000),durationMs:q.seconds*1000,startedAt:listening?0:now},correct:null};}
export function scoreRound(players,submissions,correct) {
  return Object.fromEntries(Object.entries(players||{}).map(([uid,p])=>[uid,{...p,score:(p.score||0)+(submissions?.[uid]?.choice===correct?1000:0)}]));
}
export function scoreRoundWithTiming(players,correctTimes,submissions,correct,question) {
  const start=question?.startedAt,end=question?.endsAt;
  if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)throw Error('The answer timer is missing. Start a fresh game to use speed ranking.');
  const nextTimes={...correctTimes};
  for(const [uid] of Object.entries(players||{})){
    const submission=submissions?.[uid];
    if(submission?.choice!==correct)continue;
    const elapsed=Number.isFinite(submission.submittedAt)?Math.max(0,Math.min(end-start,submission.submittedAt-start)):end-start;
    nextTimes[uid]=(Number.isFinite(nextTimes[uid])?nextTimes[uid]:0)+elapsed;
  }
  return {players:scoreRound(players,submissions,correct),correctTimes:nextTimes};
}
export function speedPoints(elapsedMs,durationMs) {
  if(!Number.isFinite(elapsedMs)||!Number.isFinite(durationMs)||durationMs<=0||elapsedMs<0||elapsedMs>durationMs)return 0;
  return elapsedMs<500?1000:Math.round(1000*(1-elapsedMs/durationMs/2));
}
export function scoreRoundWithSpeedPoints(players,correctTimes,correctCounts,submissions,correct,question) {
  const start=question?.startedAt,end=question?.endsAt,duration=question?.durationMs??end-start;
  if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start||!Number.isFinite(duration)||duration<=0)throw Error('The answer timer is missing. Start a fresh game.');
  const nextPlayers={},nextTimes={...correctTimes},nextCounts={...correctCounts},roundPoints={};
  for(const [uid,p] of Object.entries(players||{})){
    const s=submissions?.[uid],elapsed=s?.submittedAt-start;
    const valid=s?.choice===correct&&Number.isFinite(s.submittedAt)&&s.submittedAt>=start&&s.submittedAt<=end;
    const points=valid?speedPoints(Math.min(elapsed,duration),duration):0;
    nextPlayers[uid]={...p,score:(p.score||0)+points};roundPoints[uid]=points;
    if(points>0){nextTimes[uid]=(nextTimes[uid]||0)+elapsed;nextCounts[uid]=(nextCounts[uid]||0)+1;}
  }
  return {players:nextPlayers,correctTimes:nextTimes,correctCounts:nextCounts,roundPoints};
}
