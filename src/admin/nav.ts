// Dashboard screens live in the URL hash (#/, #/new, #/edit/<slug>)
export const goTo = (hash: string) => {
  window.location.hash = hash;
};
