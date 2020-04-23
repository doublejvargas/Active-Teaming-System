export const TabooSystem = (firebase, authUser, tabooSaid) => {
  let { tabooWords, score, role } = authUser;
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
  if (role === "VIP" && score < 25) {
    role = "OU";
  }
  let blocked = false;
  if (score < 0) {
    blocked = true;
  }
  if (blocked)
    firebase
      .user(authUser.email)
      .update({ tabooWords, score, role, blocked, blockedDate: new Date() });
  else
    firebase.user(authUser.email).update({ tabooWords, score, role, blocked });
};
