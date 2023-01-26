const containsName = (word, name) => {
  return word.toLowerCase().includes(name);
};

const successMsg = (name) =>
  "🎟️🔜 Yay! Tickets for '" + name + "' is available & its Coming Soon!";

const movieLinkMsg = (id) =>  `✅ Here is the Link: https://www.qfxcinemas.com/show?eventId=${id}`