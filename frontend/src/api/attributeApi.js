import axiosInstance from './axiosInstance'

export const attributeApi = {
  getAll: () => axiosInstance.get('/attributes'),
  getById: (id) => axiosInstance.get(`/attributes/${id}`),

  // Admin – Attribute CRUD
  create: (data) => axiosInstance.post('/attributes', data),
  update: (id, data) => axiosInstance.put(`/attributes/${id}`, data),
  delete: (id) => axiosInstance.delete(`/attributes/${id}`),

  // Admin – Attribute Value CRUD
  getValues: (attributeId) => axiosInstance.get(`/attributes/${attributeId}/values`),
  addValue: (attributeId, data) =>
    axiosInstance.post(`/attributes/${attributeId}/values`, data),
  updateValue: (valueId, data) =>
    axiosInstance.put(`/attributes/values/${valueId}`, data),             // PUT /attributes/values/{valueId}
  deleteValue: (attributeId, valueId) =>
    axiosInstance.delete(`/attributes/${attributeId}/values/${valueId}`), // DELETE /attributes/{attributeId}/values/{valueId}
}
