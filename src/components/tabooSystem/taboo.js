import {ScoreSystem} from './score';
export const TabooSystem = (firebase, authUser, tabooSaid) => {
  let { tabooWords, score } = authUser;
  if (!tabooWords || tabooWords.length < 1) {
    tabooWords = tabooSaid;
    score -= tabooSaid.length;
  } else {
    for (let word of tabooSaid) {
      if (tabooWords.indexOf(word) === -1) {
        tabooWords.push(word);
        score -= 1;
      } else {
        score -= 5;
      }
    }
  }
  ScoreSystem(firebase, authUser, score, tabooWords);
};
