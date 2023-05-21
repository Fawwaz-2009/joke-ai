import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
interface UserConfigs {
  openAiAPIKey: null | string;
  setUserSecrets: (secrets: { openAiAPIKey: string }) => void;
}

const useUserConfigsStore = create<UserConfigs>()(
  devtools(
    persist(
      (set) => ({
        openAiAPIKey: null,
        setUserSecrets: (secrets) => set((state) => secrets),
      }),
      {
        name: "user-configs",
      }
    )
  )
);

export default useUserConfigsStore;
