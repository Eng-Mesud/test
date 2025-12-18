import type { VoterFilters, VoterFormValues } from "@/schemas/voter";
import api from "../api/apiClient";
import { normalize } from "@/lib/normalize"; // Import your tool

export const voterService = {
  getVoters: async (params: VoterFilters) => {
    const res = await api.get("/voters", { params });
    // Ensures response.items is ALWAYS an array for the DataTable
    return normalize.paginated(res.data);
  },

  getVoter: async (id: number) => {
    const res = await api.get(`/voters/${id}`);
    // Safe default for edit forms
    return normalize.item(res.data, { fullName: "", referenceNumber: "", regionId: "" });
  },

  // Dropdowns - This is where your crash happened!
  // Even if the API returns the object with "items" you showed earlier, 
  // lookup() will correctly extract just the array.
  getRegions: async () => {
    const res = await api.get("/regions");
    return normalize.lookup(res.data);
  },

  getDistricts: async (regionId: string) => {
    const res = await api.get(`/districts?regionId=${regionId}`);
    return normalize.lookup(res.data);
  },

  getVoteCenters: async (districtId: string) => {
    const res = await api.get("/VoteCenters", {
      params: { districtId }
    });
    return normalize.lookup(res.data);
  },

  createVoter: async (data: VoterFormValues) => (await api.post("/voters", data)).data,
  updateVoter: async (id: number, data: VoterFormValues) => (await api.put(`/voters/${id}`, data)).data,
  deleteVoter: async (id: number) => { await api.delete(`/voters/${id}`); },
};