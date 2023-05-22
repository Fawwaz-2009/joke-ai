import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
interface Comedians {
  comedians: string[];
  selectedComedian: string | null;
  setSelectedComedian: (comedian: string) => void;
}

const useComediansStore = create<Comedians>()(
  devtools(
    persist(
      (set) => ({
        comedians: [
          "Dave Chappelle",
          "George Carlin",
          "Bill Burr",
          "Louis C.K.",
          "Chris Rock",
          "Richard Pryor",
          "Jerry Seinfeld",
          "Eddie Murphy",
          "Patrice O'Neal",
          "Jim Jefferies",
          "Bill Hicks",
          "Anthony Jeselnik",
          "Mitch Hedberg",
          "Bo Burnham",
          "John Mulaney",
          "Hannibal Buress",
          "Iliza Shlesinger",
          "Jim Gaffigan",
          "Mike Birbiglia",
          "Dave Attell",
          "Maria Bamford",
          "Brian Regan",
          "Aziz Ansari",
          "Demetri Martin",
          "Daniel Tosh",
          "Kevin Hart",
          "Ricky Gervais",
          "Steven Wright",
          "Norm Macdonald",
          "Russell Peters",
          "Sarah Silverman",
          "Jim Norton",
          "Bill Maher",
        ],
        selectedComedian: "George Carlin",
        setSelectedComedian: (comedian) => set((state) => ({ selectedComedian: comedian })),
      }),
      {
        name: "comedians-store",
      }
    )
  )
);

export default useComediansStore;
