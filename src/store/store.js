import { create } from "zustand";

export const useLocalStore = create((set) => ({
  addHostedZoneOpen: false,
  setAddHostedZoneOpen: (val) => {
    set({ addHostedZoneOpen: val });
  },
  addRecordBoxOpen: false,
  setAddRecordBoxOpen: (val) => {
    set({ addRecordBoxOpen: val });
  },
  editHostedZoneBox: false,
  setEditHostedZoneBox: (val) => {
    set({ editHostedZoneBox: val });
  },
}));

export const useData = create((set) => ({

  updatedhostedZone: {},
  setUpdatedHostedZone: (val) => {
    set({ updatedhostedZone: val });
  },
}));
