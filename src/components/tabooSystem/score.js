export const ScoreSystem = (firebase, user, newScore, tabooWords) => {
  let {role} = user;
  if (role === "VIP" && newScore < 25) {
    role = "OU";
  }
  let blocked = 'false';
  if (newScore < 0) {
    blocked = 'init';
  }
  if (blocked==='init')
    firebase
      .user(user.email)
      .update({ tabooWords, score:newScore, role, blocked, blockedDate: new Date() });
  else
    firebase.user(user.email).update({ tabooWords,score: newScore, role, blocked });
}