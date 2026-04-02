//might need to add another page.js for results specifically, page would push to "/results" or something like that (dynamic routing? probs don't need to worry about that atp)

import SiteHeader from "../components/SiteHeader";

export default function Page() {
  return (
    <main>
      <header>
        <SiteHeader />
      </header>
      Aurora page
    </main>
  );
}
