import { create } from "zustand";

interface AuthStore {
    user: any;
    init: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    user: null,
}))