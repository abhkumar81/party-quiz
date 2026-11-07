export const starterQuestions = [
  {text:'Which planet is known as the Red Planet?',options:['Venus','Mars','Jupiter','Mercury'],correct:1,seconds:20},
  {text:'How many hearts does an octopus have?',options:['One','Two','Three','Four'],correct:2,seconds:20},
  {text:'Which country gave the Statue of Liberty to the USA?',options:['France','Italy','Spain','Canada'],correct:0,seconds:20},
  {text:'What is the largest ocean on Earth?',options:['Atlantic','Indian','Arctic','Pacific'],correct:3,seconds:20},
  {text:'In which game would you hear “checkmate”?',options:['Poker','Chess','Scrabble','Monopoly'],correct:1,seconds:20}
];
export function validateQuestions(value) {
  if (!Array.isArray(value) || value.length < 1 || value.length > 100) throw Error('Use between 1 and 100 questions.');
  return value.map(q => {
    if (typeof q.text !== 'string' || !q.text.trim() || q.text.length > 300 || !Array.isArray(q.options) || q.options.length !== 4 || q.options.some(o => typeof o !== 'string' || !o.trim() || o.length > 150) || !Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3 || !Number.isInteger(q.seconds) || q.seconds < 5 || q.seconds > 120) throw Error('Each question needs text, four answers, a correct answer (0–3), and a timer (5–120 seconds).');
    return {text:q.text.trim(),options:q.options.map(o=>o.trim()),correct:q.correct,seconds:q.seconds};
  });
}
export function standings(players = {}) {return Object.entries(players).map(([uid,p])=>({uid,...p})).sort((a,b)=>(b.score||0)-(a.score||0)||a.name.localeCompare(b.name));}
export function publicQuestion(q,index,total,endsAt) {return {text:q.text,options:q.options,index,total,endsAt};}
export function scoreRound(players,submissions,correct) {
  return Object.fromEntries(Object.entries(players||{}).map(([uid,p])=>[uid,{...p,score:(p.score||0)+(submissions?.[uid]?.choice===correct?1000:0)}]));
}
