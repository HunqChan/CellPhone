import axiosInstance from './axiosInstance'

export const locationApi = {
  getProvinces: () => axiosInstance.get('/locations/provinces'),
  getWardsByProvince: (provinceId) =>
    axiosInstance.get(`/locations/provinces/${provinceId}/wards`),
}
