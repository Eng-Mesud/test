// src/services/voterService.ts
import api from "@/api/apiClient";
import type { VoterFormValues, VoterFilters, PaginatedResponse } from "@/schemas";

export const voterService = {
  getVoters: async (params: VoterFilters): Promise<PaginatedResponse<any>> => {
    const res = await api.get<PaginatedResponse<any>>("/voters", { params });
    return res.data;
  },

  createVoter: async (data: VoterFormValues) => {
    const res = await api.post("/voters", data);
    return res.data;
  },

  updateVoter: async (id: number, data: Partial<VoterFormValues>) => {
    const res = await api.put(`/voters/${id}`, data);
    return res.data;
  },

  deleteVoter: async (id: number) => {
    await api.delete(`/voters/${id}`);
  }
};